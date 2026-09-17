/**
 * Utilidades de validación reutilizables.
 *
 * Se centralizan aquí las reglas comunes (obligatorio, formato de correo,
 * longitud mínima/máxima) para que TODOS los formularios del proyecto
 * (login, registro y contactos) usen exactamente la misma lógica y no
 * quede duplicada ni inconsistente entre componentes.
 */

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** true si el valor está vacío después de quitar espacios en blanco. */
export function esVacio(valor) {
  return !valor || !valor.trim();
}

/** true si el correo tiene un formato válido (usuario@dominio.tld). */
export function esCorreoValido(correo) {
  return REGEX_CORREO.test((correo || "").trim());
}

/**
 * Valida longitud mínima y máxima de un texto ya recortado (trim).
 * Devuelve un mensaje de error o cadena vacía si es válido.
 */
export function validarLongitud(valor, { min = 0, max = Infinity, etiqueta = "Este campo" } = {}) {
  const limpio = (valor || "").trim();
  if (limpio.length < min) {
    return `${etiqueta} debe tener al menos ${min} caracteres.`;
  }
  if (limpio.length > max) {
    return `${etiqueta} no puede superar los ${max} caracteres.`;
  }
  return "";
}

/** Reglas compartidas de contraseña (usadas en Login y Registro). */
export const REGLAS_PASSWORD = { min: 6, max: 40, etiqueta: "La contraseña" };

/** Reglas compartidas de nombre (usadas en Registro y en Contactos). */
export const REGLAS_NOMBRE = { min: 3, max: 60, etiqueta: "El nombre" };
