const BASE_URL = "http://localhost:3000";
const API = `${BASE_URL}/contactos`;
const API_USUARIOS = `${BASE_URL}/usuarios`;

// GET - Listar todos los contactos
export async function listarContactos() {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Error al listar contactos");
  return res.json();
}

// POST - Crear un nuevo contacto
export async function crearContacto(data) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear el contacto");
  return res.json();
}

// DELETE - Eliminar un contacto por su ID
export async function eliminarContactoPorId(id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar el contacto");
  return true;
}

/* ---------------------------------------------------------------------
   USUARIOS (autenticación: login / registro / roles)
   --------------------------------------------------------------------- */

// GET - Busca un usuario por correo exacto (case-insensitive).
// Se usa tanto en el login (verificar credenciales) como en el registro
// (verificar que el correo no esté ya registrado).
export async function buscarUsuarioPorCorreo(correo) {
  const res = await fetch(API_USUARIOS);
  if (!res.ok) throw new Error("No se pudo verificar el usuario");
  const usuarios = await res.json();
  const correoNormalizado = correo.trim().toLowerCase();
  return (
    usuarios.find((u) => u.correo.trim().toLowerCase() === correoNormalizado) ||
    null
  );
}

// POST - Crea un nuevo usuario (registro). Por seguridad, todo usuario que
// se registra por este formulario público queda con rol "usuario"; el rol
// "admin" solo se asigna manualmente en db.json.
export async function registrarUsuario({ nombre, correo, password }) {
  const res = await fetch(API_USUARIOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      password,
      rol: "usuario",
    }),
  });
  if (!res.ok) throw new Error("Error al registrar el usuario");
  return res.json();
}