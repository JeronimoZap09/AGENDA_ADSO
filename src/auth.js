// Autenticación simulada con json-server.
// No es un login real (no hay hash de contraseñas ni tokens), es una
// simulación para efectos académicos usando db.json como "base de datos".

const USUARIOS_URL = "http://localhost:3000/usuarios";
const SESION_KEY = "agenda_adso_sesion";

// Busca en db.json un usuario que coincida con usuario + password.
export async function iniciarSesion(usuario, password) {
  const res = await fetch(
    `${USUARIOS_URL}?usuario=${encodeURIComponent(usuario)}&password=${encodeURIComponent(
      password
    )}`
  );

  if (!res.ok) throw new Error("Error al validar las credenciales");

  const encontrados = await res.json();

  if (encontrados.length === 0) {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  const sesion = encontrados[0];
  localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
  return sesion;
}

export function cerrarSesion() {
  localStorage.removeItem(SESION_KEY);
}

export function obtenerSesionGuardada() {
  const guardada = localStorage.getItem(SESION_KEY);
  if (!guardada) return null;

  try {
    return JSON.parse(guardada);
  } catch {
    return null;
  }
}
