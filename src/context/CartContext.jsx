import { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuth, token, logout } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMerging, setIsMerging] = useState(false);

  const prevIsAuthRef = useRef(isAuth);
  const initialLoadAttemptedForThisAuthSessionRef = useRef(false);
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    console.log("[CartContext DEBUG] Cart state changed:", JSON.stringify(cart, null, 2));
  }, [cart]);

  useEffect(() => {
    console.log("[CartContext DEBUG] Loading state changed:", loading);
  }, [loading]);

  const handleApiResponse = useCallback((apiResponseData, operationName) => {
    console.log(`[CartContext] handleApiResponse called for (${operationName}). Raw data:`, JSON.stringify(apiResponseData, null, 2));
    if (apiResponseData && apiResponseData.cart && Array.isArray(apiResponseData.cart.products)) {
      const newCartItems = apiResponseData.cart.products.map(({ product: productDetails, quantity, _id: cartItemId }) => {
        if (!productDetails) {
          console.warn(`[CartContext] Producto con cartItemId ${cartItemId} no tiene productDetails populado desde ${operationName}.`);
          return { _id: null, name: 'Producto no disponible', price: 0, image: '/productos/default.jfif', quantity, cartItemId };
        }
        const imagePath = productDetails.image || '/productos/default.jfif';
        return { 
          _id: productDetails._id, 
          name: productDetails.name, 
          price: productDetails.price,
          isOnSale: productDetails.isOnSale,
          salePrice: productDetails.salePrice,
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
                  const data = await api.post('/api/cart/merge', { guestCart: guestCartForMerge }, token);
                  console.log('[CartContext] Carrito de invitado fusionado exitosamente. Data:', JSON.stringify(data, null, 2));
                  localStorage.removeItem('guestCart');
                  handleApiResponse(data, "/merge");
                  cartSetFromMerge = true;
                } catch (fetchError) {
                  console.error("[CartContext] Excepción durante fetch a /merge:", fetchError);
                  if (fetchError.status === 401) { logout(); return; }
                } finally {
                  setIsMerging(false);
                }
              }
            }
            if (!cartSetFromMerge) {
              console.log("[CartContext] Cargando carrito desde GET /api/cart (después de intento de merge o sin guest cart).");
              try {
                const data = await api.get('/api/cart', token);
                console.log("[CartContext] Data received from GET /api/cart (antes de handleApiResponse):", JSON.stringify(data, null, 2));
                if (!data || typeof data.cart === 'undefined') {
                  console.error("[CartContext] Invalid data structure from GET /api/cart. 'cart' property missing or data is null.", data);
                  setCart([]);
                } else {
                  handleApiResponse(data, "GET /api/cart");
                }
              } catch (getCartError) {
                console.error('[CartContext] Catch block: Error en GET /api/cart:', getCartError.message, getCartError.stack);
                if (getCartError.status === 401) { logout(); return; }
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
          await api.post('/api/cart/update', { products: cart.map(({ _id, quantity }) => ({ productId: _id, quantity })) }, token);
          console.log("[CartContext] Carrito guardado en backend (update) exitosamente.");
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
        if(error.status === 401) logout();
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

  const addToCart = async (product, onError) => { 
    console.log("[CartContext] addToCart, producto recibido:", product);
    const imagePath = product.image || (product.images && product.images.length > 0 ? product.images[0] : '/productos/default.jfif');
    if (isAuth && token) {
      setLoading(true);
      try {
        const data = await api.post('/api/cart/add', { productId: product._id, quantity: 1 }, token);
        handleApiResponse(data, "/add");
        if (onError) onError(null); 
      } catch (error) {
        console.error('[CartContext] Excepción en addToCart (auth):', error);
        if (onError) onError(error.message);
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
          _id: product._id, 
          name: product.name, 
          price: product.price,
          isOnSale: product.isOnSale,
          salePrice: product.salePrice,
          image: imagePath, 
          quantity: 1
        }];
      });
    }
  };

  const removeFromCart = async (productId, onError) => { 
    if (isAuth && token) {
      setLoading(true);
      try {
        const data = await api.delete(`/api/cart/remove/${productId}`, token);
        handleApiResponse(data, "/remove");
        if (onError) onError(null);
      } catch (error) {
        console.error('[CartContext] Excepción en removeFromCart (auth):', error);
        if (onError) onError(error.message);
      } finally {
        setLoading(false);
      }
    } else { 
      setCart(prev => prev.filter(item => item._id !== productId));
    }
  };

  const updateQuantity = async (productId, newQuantity, onError) => {
    if (newQuantity < 1) {
      return removeFromCart(productId, onError);
    }
    if (isAuth && token) {
      try {
        const data = await api.post('/api/cart/set-quantity', { productId, quantity: newQuantity }, token);
        handleApiResponse(data, "/set-quantity");
        if (onError) onError(null);
      } catch (error) {
        console.error('[CartContext] Error en updateQuantity:', error);
        if (onError) onError(error.message);
      }
    } else {
      setCart(prevCart => prevCart.map(item =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const clearCart = async (onError) => { 
    if (isAuth && token) {
      setLoading(true);
      try {
        await api.delete('/api/cart/clear', token);
        if(onError) onError(null);
      } catch (error) {
        console.error('[CartContext] Excepción en clearCart (auth):', error);
        if (onError) onError(error.message);
      } finally {
        setLoading(false);
      }
    }
    setCart([]);
    if (!isAuth) {
      localStorage.removeItem('guestCart');
    }
  };

  const clearCartFrontend = () => {
    console.log("[CartContext] Vaciando el carrito solo en el frontend.");
    setCart([]);
  };

  const getTotal = () => {
    if (!Array.isArray(cart)) return '0.00';
    return cart.reduce(
      (acc, item) => {
        const priceToUse = item.isOnSale && item.salePrice > 0 ? item.salePrice : item.price;
        const price = parseFloat(priceToUse);
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
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        cartCount,
        loading,
        isMerging,
        clearCartFrontend
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