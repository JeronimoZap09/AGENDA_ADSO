import { useCallback, useEffect, useState } from "react";
import { buscarUsuarioPorCorreo, registrarUsuario } from "../api";
import { esCorreoValido, esVacio } from "../utils/validaciones";

const CLAVE_SESION = "agenda_adso_sesion";

// Pequeña espera artificial para que el estado "Ingresando..." / "Creando
// cuenta..." sea visible incluso cuando json-server responde casi al
// instante (sensación de verificación real, no un simple parpadeo).
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function guardarSesion(usuario) {
  // No guardamos la contraseña en sessionStorage, solo lo necesario.
  const { password: _password, ...usuarioSeguro } = usuario;
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(usuarioSeguro));
  return usuarioSeguro;
}

function leerSesion() {
  try {
    const crudo = sessionStorage.getItem(CLAVE_SESION);
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

/**
 * Hook central de autenticación.
 * Toda la lógica de negocio (verificar credenciales, registrar, mantener
 * sesión) vive aquí y NO en App.jsx, que solo debe decidir qué pantalla
 * mostrar según el estado que este hook expone.
 */
export function useAuth() {
  const [usuario, setUsuario] = useState(() => leerSesion());
  const [verificando, setVerificando] = useState(false);
  const [registrando, setRegistrando] = useState(false);

  // Si el usuario abre otra pestaña o refresca, la sesión persiste
  // mientras dure la pestaña (sessionStorage), tal como pide el criterio
  // "El rol del usuario queda guardado en la sesión al iniciar sesión".
  useEffect(() => {
    const sesionGuardada = leerSesion();
    if (sesionGuardada) setUsuario(sesionGuardada);
  }, []);

  const iniciarSesion = useCallback(async ({ correo, password }) => {
    const errores = {};
    if (esVacio(correo)) errores.correo = "El correo es obligatorio.";
    else if (!esCorreoValido(correo)) errores.correo = "El formato del correo no es válido.";

    if (esVacio(password)) errores.password = "La contraseña es obligatoria.";

    if (Object.keys(errores).length > 0) {
      return { ok: false, errores };
    }

    setVerificando(true);
    try {
      await esperar(500);
      const encontrado = await buscarUsuarioPorCorreo(correo);

      if (!encontrado || encontrado.password !== password) {
        return {
          ok: false,
          errores: { general: "El correo o la contraseña no coinciden." },
        };
      }

      const usuarioSeguro = guardarSesion(encontrado);
      setUsuario(usuarioSeguro);
      return { ok: true };
    } catch {
      return {
        ok: false,
        errores: { general: "No se pudo verificar la sesión. Intenta de nuevo." },
      };
    } finally {
      setVerificando(false);
    }
  }, []);

  const registrar = useCallback(async ({ nombre, correo, password, confirmarPassword }) => {
    const errores = {};
    if (esVacio(nombre)) errores.nombre = "El nombre es obligatorio.";
    if (esVacio(correo)) errores.correo = "El correo es obligatorio.";
    else if (!esCorreoValido(correo)) errores.correo = "El formato del correo no es válido.";
    if (esVacio(password)) errores.password = "La contraseña es obligatoria.";
    if (esVacio(confirmarPassword)) {
      errores.confirmarPassword = "Debes confirmar la contraseña.";
    } else if (password !== confirmarPassword) {
      errores.confirmarPassword = "Las contraseñas no coinciden.";
    }

    if (Object.keys(errores).length > 0) {
      return { ok: false, errores };
    }

    setRegistrando(true);
    try {
      await esperar(500);
      const existente = await buscarUsuarioPorCorreo(correo);
      if (existente) {
        return {
          ok: false,
          errores: { correo: "Ese correo ya está registrado." },
        };
      }

      await registrarUsuario({ nombre, correo, password });
      return { ok: true };
    } catch {
      return {
        ok: false,
        errores: { general: "No se pudo completar el registro. Intenta de nuevo." },
      };
    } finally {
      setRegistrando(false);
    }
  }, []);

  const cerrarSesion = useCallback(() => {
    sessionStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
  }, []);

  return {
    usuario,
    estaAutenticado: Boolean(usuario),
    esAdmin: usuario?.rol === "admin",
    verificando,
    registrando,
    iniciarSesion,
    registrar,
    cerrarSesion,
  };
}
