import { useState } from "react";
import { iniciarSesion } from "../auth";

export function LoginPage({ onLoginExitoso }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!usuario.trim() || !password.trim()) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    try {
      setCargando(true);
      const sesion = await iniciarSesion(usuario.trim(), password);
      onLoginExitoso(sesion);
    } catch (err) {
      setError(
        err.message === "Usuario o contraseña incorrectos."
          ? err.message
          : "No se pudo conectar con el servidor. Verifica que json-server esté encendido."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="login-brand">
          <div className="brand-mark">AA</div>
          <div>
            <p className="brand-name">Agenda ADSO</p>
            <p className="brand-tag">Inicia sesión para continuar</p>
          </div>
        </div>

        {error && <div className="alert-error-global">{error}</div>}

        <div className="field">
          <label>Usuario</label>
          <input
            className="demo-input"
            name="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ej: camila"
            autoFocus
          />
        </div>

        <div className="field">
          <label>Contraseña</label>
          <input
            className="demo-input"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button className="demo-btn" type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="login-hint">
          Usuarios de prueba: <strong>camila</strong>, <strong>juan</strong> o{" "}
          <strong>admin</strong> (contraseña: <strong>sena123</strong> /{" "}
          <strong>admin123</strong> para admin)
        </p>
      </form>
    </div>
  );
}
