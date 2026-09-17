import { useState } from "react";

/**
 * Formulario de inicio de sesión.
 * Toda la verificación de credenciales vive en useAuth (iniciarSesion);
 * este componente solo maneja el estado local de los inputs y muestra
 * los errores/estado que el hook le devuelve.
 */
export function LoginForm({ onIniciarSesion, verificando, onIrARegistro }) {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [errores, setErrores] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const resultado = await onIniciarSesion(form);
    if (!resultado.ok) {
      setErrores(resultado.errores);
    } else {
      setErrores({});
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2>Iniciar sesión</h2>
      <p className="auth-subtitle">Ingresa con tu correo y contraseña para continuar.</p>

      {errores.general && <div className="alert-error-global">{errores.general}</div>}

      <div className="field">
        <label>Correo electrónico *</label>
        <input
          className={`demo-input ${errores.correo ? "err" : ""}`}
          type="email"
          name="correo"
          value={form.correo}
          onChange={onChange}
          placeholder="tucorreo@ejemplo.com"
          autoComplete="username"
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
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errores.password && <span className="field-err">{errores.password}</span>}
      </div>

      <button className="demo-btn" type="submit" disabled={verificando}>
        {verificando ? "Ingresando..." : "Ingresar"}
      </button>

      <p className="auth-switch">
        ¿No tienes cuenta?{" "}
        <button type="button" className="auth-link" onClick={onIrARegistro}>
          Regístrate aquí
        </button>
      </p>

      <p className="auth-hint">
        Prueba con <strong>admin@sena.edu.co</strong> / <strong>admin123</strong> (administrador) o{" "}
        <strong>usuario@sena.edu.co</strong> / <strong>usuario123</strong> (usuario estándar).
      </p>
    </form>
  );
}
