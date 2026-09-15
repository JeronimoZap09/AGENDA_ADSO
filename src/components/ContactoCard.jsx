export function ContactoCard({ id, nombre, telefono, correo, etiqueta, onEliminar }) {
  return (
    <div className="contacto-card">
      <div className="contacto-info">
        <h4>{nombre}</h4>
        <p>📞 {telefono}</p>
        <p>✉️ {correo}</p>
        {etiqueta && <span className="etiqueta">{etiqueta}</span>}
      </div>
      {onEliminar && (
        <button className="btn-eliminar" onClick={() => onEliminar(id)}>
          Eliminar
        </button>
      )}
    </div>
  );
}