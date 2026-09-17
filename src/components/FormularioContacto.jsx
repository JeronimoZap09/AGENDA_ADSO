import { useState } from "react";
import { esCorreoValido, esVacio, validarLongitud } from "../utils/validaciones";

const REGLAS_TELEFONO = { min: 7, max: 15, etiqueta: "El teléfono" };
const REGLAS_NOMBRE_CONTACTO = { min: 3, max: 60, etiqueta: "El nombre" };

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

    if (esVacio(form.nombre)) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else {
      nuevosErrores.nombre = validarLongitud(form.nombre, REGLAS_NOMBRE_CONTACTO);
    }

    if (esVacio(form.telefono)) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else {
      nuevosErrores.telefono = validarLongitud(form.telefono, REGLAS_TELEFONO);
    }

    if (esVacio(form.correo)) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!esCorreoValido(form.correo)) {
      nuevosErrores.correo = "El correo debe tener un formato válido (ej: nombre@dominio.com).";
    }

    setErrores(nuevosErrores);
    return !nuevosErrores.nombre && !nuevosErrores.telefono && !nuevosErrores.correo;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      setEnviando(true);
      await onAgregar({
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        correo: form.correo.trim(),
        etiqueta: form.etiqueta.trim(),
      });
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
