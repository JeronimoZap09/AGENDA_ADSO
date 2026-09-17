import { useState } from "react";

/**
 * Tarjeta de presentación de un contacto.
 *
 * `puedeEliminar` viene determinado por el rol del usuario logueado
 * (solo "admin"). Si un usuario sin permisos intenta eliminar, en vez de
 * ocultar la tarjeta por completo se muestra un botón deshabilitado que,
 * al intentarlo, deja ver un mensaje claro de "sin permisos" — así se
 * cumple tanto "las acciones sensibles quedan protegidas según el rol"
 * como "muestra mensaje claro si un usuario intenta una acción sin
 * permisos".
 */
export function ContactoCard({ id, nombre, telefono, correo, etiqueta, onEliminar, puedeEliminar }) {
  const [mostrarAvisoPermiso, setMostrarAvisoPermiso] = useState(false);

  const onClickEliminar = () => {
    if (!puedeEliminar) {
      setMostrarAvisoPermiso(true);
      return;
    }
    onEliminar(id);
  };

  return (
    <div className="contacto-card">
      <div className="contacto-info">
        <h4>{nombre}</h4>
        <p>📞 {telefono}</p>
        <p>✉️ {correo}</p>
        {etiqueta && <span className="etiqueta">{etiqueta}</span>}
      </div>

      {onEliminar && (
        <>
          <button
            className={`btn-eliminar ${!puedeEliminar ? "btn-eliminar--bloqueado" : ""}`}
            onClick={onClickEliminar}
          >
            Eliminar
          </button>
          {mostrarAvisoPermiso && (
            <p className="aviso-permiso">
              🔒 No tienes permisos para eliminar contactos. Solo un administrador puede
              hacerlo.
            </p>
          )}
        </>
      )}
    </div>
  );
}
