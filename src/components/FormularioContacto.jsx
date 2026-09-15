import { useState } from "react";

export function FormularioContacto({ onAgregar }) {
  const [form, setForm] = useState({ nombre: "", telefono: "", correo: "", etiqueta: "" });
  const [errores, setErrores] = useState({ nombre: "", telefono: "", correo: "" });
  const [enviando, setEnviando] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validarFormulario = () => {
    const nuevosErrores = { nombre: "", telefono: "", correo: "" };

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!form.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio.";
    if (!form.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!form.correo.includes("@")) {
      nuevosErrores.correo = "El correo debe contener @.";
    }

    setErrores(nuevosErrores);
    return !nuevosErrores.nombre && !nuevosErrores.telefono && !nuevosErrores.correo;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      setEnviando(true);
      await onAgregar(form);
      setForm({ nombre: "", telefono: "", correo: "", etiqueta: "" });
      setErrores({ nombre: "", telefono: "", correo: "" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="formulario-contacto" onSubmit={onSubmit}>
      <h3>Nuevo contacto</h3>
      
      <div className="field">
        <label>Nombre *</label>
        <input
          className={`demo-input ${errores.nombre ? "err" : ""}`}
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          placeholder="Ej: Camila Pérez"
        />
        {errores.nombre && <span className="field-err">{errores.nombre}</span>}
      </div>

      <div className="field">
        <label>Teléfono *</label>
        <input
          className={`demo-input ${errores.telefono ? "err" : ""}`}
          name="telefono"
          value={form.telefono}
          onChange={onChange}
          placeholder="Ej: 300 123 4567"
        />
        {errores.telefono && <span className="field-err">{errores.telefono}</span>}
      </div>

      <div className="field">
        <label>Correo *</label>
        <input
          className={`demo-input ${errores.correo ? "err" : ""}`}
          name="correo"
          value={form.correo}
          onChange={onChange}
          placeholder="Ej: camila@sena.edu.co"
        />
        {errores.correo && <span className="field-err">{errores.correo}</span>}
      </div>

      <div className="field">
        <label>Etiqueta (opcional)</label>
        <input
          className="demo-input"
          name="etiqueta"
          value={form.etiqueta}
          onChange={onChange}
          placeholder="Ej: Trabajo"
        />
      </div>

      <button className="demo-btn" type="submit" disabled={enviando}>
        {enviando ? "Guardando..." : "Agregar contacto"}
      </button>
    </form>
  );
}