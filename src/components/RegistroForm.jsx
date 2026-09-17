import { useState } from "react";
import { REGLAS_NOMBRE, REGLAS_PASSWORD, validarLongitud } from "../utils/validaciones";

/**
 * Formulario de registro de nuevo usuario.
 * La verificación de "correo ya registrado" y la creación del usuario
 * viven en useAuth (registrar); aquí solo se validan longitudes locales
 * antes de llamar al hook, para dar feedback inmediato sin esperar a la
 * API.
 */
export function RegistroForm({ onRegistrar, registrando, onIrALogin }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmarPassword: "",
  });
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarLocal = () => {
    const erroresLocales = {};

    const errorNombre = validarLongitud(form.nombre, REGLAS_NOMBRE);
    if (form.nombre.trim() === "") erroresLocales.nombre = "El nombre es obligatorio.";
    else if (errorNombre) erroresLocales.nombre = errorNombre;

    const errorPassword = validarLongitud(form.password, REGLAS_PASSWORD);
    if (form.password.trim() === "") erroresLocales.password = "La contraseña es obligatoria.";
    else if (errorPassword) erroresLocales.password = errorPassword;

    return erroresLocales;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setExito(false);

    const erroresLocales = validarLocal();
    if (Object.keys(erroresLocales).length > 0) {
      setErrores(erroresLocales);
      return;
    }

    const resultado = await onRegistrar(form);
    if (!resultado.ok) {
      setErrores(resultado.errores);
      return;
    }

    setErrores({});
    setExito(true);
    setForm({ nombre: "", correo: "", password: "", confirmarPassword: "" });
  };

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2>Crear cuenta</h2>
      <p className="auth-subtitle">Regístrate para gestionar tus contactos.</p>

      {errores.general && <div className="alert-error-global">{errores.general}</div>}
      {exito && (
        <div className="alert-success-global">
          ¡Cuenta creada con éxito! Ya puedes iniciar sesión.
        </div>
      )}

      <div className="field">
        <label>Nombre completo *</label>
        <input
          className={`demo-input ${errores.nombre ? "err" : ""}`}
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          placeholder="Ej: Camila Pérez"
          autoComplete="name"
        />
        {errores.nombre && <span className="field-err">{errores.nombre}</span>}
      </div>

      <div className="field">
        <label>Correo electrónico *</label>
        <input
          className={`demo-input ${errores.correo ? "err" : ""}`}
          type="email"
          name="correo"
          value={form.correo}
          onChange={onChange}
          placeholder="tucorreo@ejemplo.com"
          autoComplete="email"
        />
        {errores.correo && <span className="field-err">{errores.correo}</span>}
      </div>

      <div className="field">
        <label>Contraseña *</label>
        <input
          className={`demo-input ${errores.password ? "err" : ""}`}
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
        />
        {errores.password && <span className="field-err">{errores.password}</span>}
      </div>

      <div className="field">
        <label>Confirmar contraseña *</label>
        <input
          className={`demo-input ${errores.confirmarPassword ? "err" : ""}`}
          type="password"
          name="confirmarPassword"
          value={form.confirmarPassword}
          onChange={onChange}
          placeholder="Repite la contraseña"
          autoComplete="new-password"
        />
        {errores.confirmarPassword && (
          <span className="field-err">{errores.confirmarPassword}</span>
        )}
      </div>

      <button className="demo-btn" type="submit" disabled={registrando}>
        {registrando ? "Creando cuenta..." : "Registrarme"}
      </button>

      <p className="auth-switch">
        ¿Ya tienes cuenta?{" "}
        <button type="button" className="auth-link" onClick={onIrALogin}>
          Inicia sesión
        </button>
      </p>
    </form>
  );
}
