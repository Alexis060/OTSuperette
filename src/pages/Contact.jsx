import './Contact.css';
import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    empresa: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contáctanos</h1>
        <p>
          Si necesitas más información sobre nuestros productos o servicios, llena el formulario 
          y uno de nuestros ejecutivos se pondrá en contacto contigo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        {/* Nombre */}
        <div className="form-group">
          <label>Nombre completo</label>
          <div className="name-fields">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apellidos"
              placeholder="Apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </div>
        </div>


        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="tucorreo@empresa.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="tel"
            name="telefono"
            placeholder="+52 55 1234 5678"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mensaje</label>
          <textarea
            name="mensaje"
            placeholder="Describe tu consulta..."
            value={formData.mensaje}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}

export default Contact;