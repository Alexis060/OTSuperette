// src/pages/FaqPage.jsx
import React from 'react';

const FaqPage = () => {
  return (
    <div className="page-container" style={{ textAlign: 'left', maxWidth: '800px' }}>
      <h1>Preguntas Frecuentes (FAQ)</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>¿Cómo puedo crear una cuenta si no estoy registrado?</h3>
        <p>
          ¡Es muy fácil! Simplemente ve a la página de "Iniciar Sesión" y haz clic en el enlace que dice 
          "¿No tienes cuenta? Regístrate". Serás dirigido a un formulario donde podrás ingresar tu nombre, 
          correo electrónico y una contraseña para crear tu cuenta de cliente.
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>¿Qué métodos de pago aceptan?</h3>
        <p>
          Actualmente aceptamos pagos simulados con las principales tarjetas de crédito y débito. 
          El proceso es 100% seguro y simulado, no se realizará ningún cargo real a tu tarjeta.
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>¿Cómo funcionan los productos en oferta?</h3>
        <p>
          Los productos marcados con la etiqueta "OFERTA" tienen un precio especial. Este descuento 
          se verá reflejado tanto en la vista del producto como en tu carrito de compras y al momento 
          de proceder al pago.
        </p>
      </div>
    </div>
  );
};

export default FaqPage;