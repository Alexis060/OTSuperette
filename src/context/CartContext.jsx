import { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuth, token, logout } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMerging, setIsMerging] = useState(false);

  const prevIsAuthRef = useRef(isAuth);
  const initialLoadAttemptedForThisAuthSessionRef = useRef(false);
  const isLoggingOutRef = useRef(false);

  // DEBUG: useEffect to log cart and loading state changes
  useEffect(() => {
    console.log("[CartContext DEBUG] Cart state changed:", JSON.stringify(cart, null, 2));
  }, [cart]);

  useEffect(() => {
    console.log("[CartContext DEBUG] Loading state changed:", loading);
  }, [loading]);
  // FIN DEBUG

  const handleApiResponse = useCallback((apiResponseData, operationName) => {
    console.log(`[CartContext] handleApiResponse called for (${operationName}). Raw data:`, JSON.stringify(apiResponseData, null, 2));
    if (apiResponseData && apiResponseData.cart && Array.isArray(apiResponseData.cart.products)) {
      const newCartItems = apiResponseData.cart.products.map(({ product: productDetails, quantity, _id: cartItemId }) => {
        if (!productDetails) {
          console.warn(`[CartContext] Producto con cartItemId ${cartItemId} no tiene productDetails populado desde ${operationName}.`);
          return { _id: null, name: 'Producto no disponible', price: 0, image: '/productos/default.jfif', quantity, cartItemId };
        }
        const imagePath = productDetails.image || '/productos/default.jfif';
        // console.log(`[CartContext] Producto (${operationName}): ${productDetails.name}, Raw image from backend: ${productDetails.image}, Derived imagePath: ${imagePath}`); // Log original, bueno mantenerlo
        return { 
          _id: productDetails._id, 
          name: productDetails.name, 
          price: productDetails.price, 
          image: imagePath, 
          quantity,
          cartItemId
        };
      });
      console.log(`[CartContext] Attempting to setCart in handleApiResponse (${operationName}) with:`, JSON.stringify(newCartItems, null, 2));
      setCart(newCartItems);
    } else {
      console.warn(`[CartContext] Respuesta de ${operationName} no tiene la estructura esperada o no hay productos. Setting cart to empty. Data:`, apiResponseData);
      setCart([]);
    }
  }, []);


  useEffect(() => {
    const wasPreviouslyAuth = prevIsAuthRef.current;
    const justLoggedOut = wasPreviouslyAuth && !isAuth;
    isLoggingOutRef.current = justLoggedOut;
    prevIsAuthRef.current = isAuth;

    const manageCartOnAuthChange = async () => {
      console.log(`[CartContext] manageCartOnAuthChange START - isAuth: ${isAuth}, wasPreviouslyAuth: ${wasPreviouslyAuth}, token: ${!!token}, initialLoadAttempted: ${initialLoadAttemptedForThisAuthSessionRef.current}`);
      setLoading(true);

      try {
        if (isAuth && token) {
          if (!wasPreviouslyAuth) {
            console.log("[CartContext] User transitioned to authenticated state.");
            initialLoadAttemptedForThisAuthSessionRef.current = false;
          }

          if (!initialLoadAttemptedForThisAuthSessionRef.current) {
            console.log("[CartContext] Initial load/merge for this auth session attempt.");
            initialLoadAttemptedForThisAuthSessionRef.current = true;

            const localGuestCartString = localStorage.getItem('guestCart');
            let guestCartItems = [];
            if (localGuestCartString) {
              try {
                const parsedItems = JSON.parse(localGuestCartString);
                if (Array.isArray(parsedItems)) guestCartItems = parsedItems;
              } catch (e) { console.error('[CartContext] Error parseando guestCart:', e); localStorage.removeItem('guestCart'); }
            }

            let cartSetFromMerge = false;
            if (guestCartItems.length > 0) {
              const guestCartForMerge = guestCartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity 
              })).filter(item => item.productId && typeof item.quantity === 'number' && item.quantity > 0);

              if (guestCartForMerge.length > 0) {
                setIsMerging(true);
                console.log('[CartContext] Intentando fusionar carrito de invitado:', guestCartForMerge);
                try {
                  const mergeRes = await fetch('http://localhost:5000/api/cart/merge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ guestCart: guestCartForMerge })
                  });

                  if (!mergeRes.ok) {
                    const errorData = await mergeRes.json().catch(() => ({ message: mergeRes.statusText }));
                    console.error('[CartContext] Error fusionando carrito:', errorData.message, errorData.details || '');
                    if (mergeRes.status === 401) { logout(); return; }
                  } else {
                    const data = await mergeRes.json();
                    console.log('[CartContext] Carrito de invitado fusionado exitosamente. Data:', JSON.stringify(data, null, 2));
                    localStorage.removeItem('guestCart');
                    handleApiResponse(data, "/merge");
                    cartSetFromMerge = true;
                  }
                } catch (fetchError) {
                  console.error("[CartContext] Excepción durante fetch a /merge:", fetchError);
                } finally {
                  setIsMerging(false);
                }
              }
            }
            
            if (!cartSetFromMerge) {
              console.log("[CartContext] Cargando carrito desde GET /api/cart (después de intento de merge o sin guest cart).");
              try {
                const res = await fetch('http://localhost:5000/api/cart', { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) {
                    if (res.status === 401) { logout(); return; }
                    const errorData = await res.json().catch(() => ({ message: res.statusText }));
                    console.error('[CartContext] Error en GET /api/cart, respuesta no OK:', errorData.message || res.statusText);
                    throw new Error(errorData.message || 'Error cargando carrito (GET /api/cart)');
                }
                const data = await res.json();
                console.log("[CartContext] Data received from GET /api/cart (antes de handleApiResponse):", JSON.stringify(data, null, 2)); // LOG AÑADIDO
                if (!data || typeof data.cart === 'undefined') { // Chequeo robusto
                  console.error("[CartContext] Invalid data structure from GET /api/cart. 'cart' property missing or data is null.", data);
                  setCart([]);
                  // Considera no seguir si la estructura es incorrecta
                } else {
                  handleApiResponse(data, "GET /api/cart");
                }
              } catch (getCartError) {
                console.error('[CartContext] Catch block: Error en GET /api/cart:', getCartError.message, getCartError.stack);
                setCart([]);
              }
            }
          } else {
             console.log("[CartContext] Carga/fusión inicial ya intentada para esta sesión. No se repite.");
          }
        } else { 
          console.log("[CartContext] Usuario no autenticado. Reseteando flag de carga inicial y cargando guest cart.");
          initialLoadAttemptedForThisAuthSessionRef.current = false;
          const localGuestCartString = localStorage.getItem('guestCart');
          let guestCartItems = [];
          if (localGuestCartString) {
            try {
              const parsedItems = JSON.parse(localGuestCartString);
              if (Array.isArray(parsedItems)) guestCartItems = parsedItems;
            } catch (e) { console.error('[CartContext] Error parseando guestCart para invitado:', e); localStorage.removeItem('guestCart');}
          }
          console.log("[CartContext] Setting guest cart from localStorage:", JSON.stringify(guestCartItems, null, 2));
          setCart(guestCartItems);
        }
      } catch (error) {
        console.error('[CartContext] Error mayor en manageCartOnAuthChange:', error);
        setCart([]);
      } finally {
        console.log("[CartContext] manageCartOnAuthChange FINALLY - Setting loading to false.");
        setLoading(false);
        if (justLoggedOut) isLoggingOutRef.current = false;
      }
    };

    manageCartOnAuthChange();
  }, [isAuth, token, logout, handleApiResponse]);


  useEffect(() => {
    if (loading || isMerging || !Array.isArray(cart) || isLoggingOutRef.current) {
      if(isLoggingOutRef.current) console.log("[CartContext] saveCart: Omitiendo guardado por logout en progreso.");
      return;
    }

    const saveCartOperation = async () => {
      try {
        if (isAuth && token && prevIsAuthRef.current) { 
          console.log('[CartContext] Guardando carrito en backend (efecto saveCart):', cart.map(({ _id, quantity }) => ({ productId: _id, quantity })));
          const updateRes = await fetch('http://localhost:5000/api/cart/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ products: cart.map(({ _id, quantity }) => ({ productId: _id, quantity })) })
          });
          if (!updateRes.ok) {
            const errorData = await updateRes.json().catch(() => ({ message: updateRes.statusText }));
            console.error('[CartContext] Error guardando carrito en backend (update):', errorData.message);
            if (updateRes.status === 401) logout();
          } else {
            console.log("[CartContext] Carrito guardado en backend (update) exitosamente.");
          }
        } else if (!isAuth) {
          const currentLocalGuestCart = localStorage.getItem('guestCart');
          const newGuestCartString = JSON.stringify(cart);
          if (currentLocalGuestCart !== newGuestCartString) {
            console.log('[CartContext] Guardando carrito de invitado en localStorage:', cart);
            localStorage.setItem('guestCart', newGuestCartString);
          }
        }
      } catch (error) {
        console.error('[CartContext] Error en saveCartOperation:', error);
      }
    };

    if (cart.length > 0 || (prevIsAuthRef.current && isAuth)) {
        const debounceSave = setTimeout(saveCartOperation, 500);
        return () => clearTimeout(debounceSave);
    } else if (!isAuth && cart.length === 0) {
        const currentLocalGuestCart = localStorage.getItem('guestCart');
        if (currentLocalGuestCart && currentLocalGuestCart !== "[]") {
             console.log('[CartContext] Limpiando guestCart de localStorage porque el carrito de invitado está vacío.');
             localStorage.setItem('guestCart', "[]");
        }
    }
  }, [cart, isAuth, token, loading, isMerging, logout]);


  const addToCart = async (product) => {
    console.log("[CartContext] addToCart, producto recibido:", product);
    const imagePath = product.image || (product.images && product.images.length > 0 ? product.images[0] : '/productos/default.jfif');
    // console.log(`[CartContext] addToCart, imagePath determinado: ${imagePath}`); // Log original

    if (isAuth && token) {
      try {
        setLoading(true);
        const addRes = await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
          body: JSON.stringify({ productId: product._id, quantity: 1 })
        });
        if (!addRes.ok) {
            const errorData = await addRes.json().catch(() => ({ message: addRes.statusText }));
            console.error("[CartContext] Error añadiendo al carrito (auth):", errorData.message);
            if (addRes.status === 401) logout();
            // setLoading(false) está en finally
            return;
        }
        const data = await addRes.json();
        console.log("[CartContext] Data received from /add (antes de handleApiResponse):", JSON.stringify(data, null, 2));
        handleApiResponse(data, "/add");
      } catch (error) {
        console.error('[CartContext] Excepción en addToCart (auth):', error);
      } finally {
        setLoading(false);
      }
    } else { 
      setCart(prev => {
        const exist = prev.find(item => item._id === product._id);
        if (exist) {
          return prev.map(item =>
            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, {
          _id: product._id, name: product.name, price: product.price,
          image: imagePath, quantity: 1
        }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuth && token) {
      try {
        setLoading(true);
        const removeRes = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!removeRes.ok) {
            const errorData = await removeRes.json().catch(() => ({ message: removeRes.statusText }));
            console.error("[CartContext] Error eliminando del carrito (auth):", errorData.message);
            if (removeRes.status === 401) logout();
            return;
        }
        const data = await removeRes.json();
        console.log("[CartContext] Data received from /remove (antes de handleApiResponse):", JSON.stringify(data, null, 2));
        handleApiResponse(data, "/remove");
      } catch (error) {
        console.error('[CartContext] Excepción en removeFromCart (auth):', error);
      } finally {
        setLoading(false);
      }
    } else { 
      setCart(prev => prev.filter(item => item._id !== productId));
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prevCart => {
      if (newQuantity < 1) {
        return prevCart.filter(item => item._id !== productId);
      }
      return prevCart.map(item =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const clearCart = async () => {
    if (isAuth && token) {
      try {
        setLoading(true);
        const clearRes = await fetch('http://localhost:5000/api/cart/clear', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!clearRes.ok) {
          const errorData = await clearRes.json().catch(() => ({ message: clearRes.statusText }));
          console.error("[CartContext] Error vaciando carrito (auth):", errorData.message);
          if (clearRes.status === 401) logout();
        } else {
          console.log("[CartContext] Carrito vaciado en backend exitosamente.");
    }
      } catch (error) {
        console.error('[CartContext] Excepción en clearCart (auth):', error);
      } finally {
        setLoading(false);
      }
    }
    setCart([]);
    if (!isAuth) {
      localStorage.removeItem('guestCart');
      console.log("[CartContext] Carrito de invitado limpiado de localStorage.");
    }
  };

  const getTotal = () => {
    if (!Array.isArray(cart)) return '0.00';
    return cart.reduce(
      (acc, item) => {
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity, 10);
        if (isNaN(price) || isNaN(quantity) || !item) return acc;
        return acc + price * quantity;
      },0).toFixed(2);
  };

  const cartCount = Array.isArray(cart) ? cart.reduce((sum, item) => {
    if (!item) return sum;
    const quantity = parseInt(item.quantity, 10);
    return sum + (isNaN(quantity) ? 0 : quantity);
  }, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQuantity, clearCart,
        getTotal, cartCount, loading, isMerging
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};
