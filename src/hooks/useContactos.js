import { useEffect, useMemo, useState } from "react";
import { crearContacto, eliminarContactoPorId, listarContactos } from "../api";

const CONTACTOS_POR_PAGINA = 3;

/**
 * Toda la lógica de negocio de la sección "Contactos" (carga desde la API,
 * alta, baja, búsqueda, orden y paginación) vive en este hook. App.jsx solo
 * consume los valores/funciones que expone, sin manejar fetch ni
 * transformaciones de datos directamente.
 */
export function useContactos() {
  const [contactos, setContactos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        setError("");
        const data = await listarContactos();
        setContactos(data);
      } catch (err) {
        console.error("Error al cargar contactos:", err);
        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté encendido e intenta de nuevo."
        );
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, ordenAsc]);

  const agregarContacto = async (nuevoContacto) => {
    setError("");
    try {
      const creado = await crearContacto(nuevoContacto);
      setContactos((prev) => [...prev, creado]);
    } catch (err) {
      console.error("Error al guardar contacto:", err);
      setError(
        "No se pudo guardar el contacto. Verifica que el servidor esté encendido e intenta de nuevo."
      );
      throw err;
    }
  };

  const eliminarContacto = async (id) => {
    setError("");
    try {
      await eliminarContactoPorId(id);
      setContactos((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error al eliminar contacto:", err);
      setError("No se pudo eliminar el contacto. Verifica que el servidor esté encendido.");
    }
  };

  const stats = useMemo(() => {
    const total = contactos.length;
    const conEtiqueta = contactos.filter((c) => c.etiqueta).length;
    return { total, conEtiqueta, sinEtiqueta: total - conEtiqueta };
  }, [contactos]);

  const contactosFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase();
    return contactos.filter((c) => {
      const nombre = c.nombre.toLowerCase();
      const correo = c.correo.toLowerCase();
      const etiqueta = (c.etiqueta || "").toLowerCase();
      return (
        nombre.includes(termino) || correo.includes(termino) || etiqueta.includes(termino)
      );
    });
  }, [contactos, busqueda]);

  const contactosOrdenados = useMemo(() => {
    return [...contactosFiltrados].sort((a, b) => {
      const nombreA = a.nombre.toLowerCase();
      const nombreB = b.nombre.toLowerCase();
      if (nombreA < nombreB) return ordenAsc ? -1 : 1;
      if (nombreA > nombreB) return ordenAsc ? 1 : -1;
      return 0;
    });
  }, [contactosFiltrados, ordenAsc]);

  const totalPaginas = Math.max(1, Math.ceil(contactosOrdenados.length / CONTACTOS_POR_PAGINA));

  useEffect(() => {
    if (paginaActual > totalPaginas) setPaginaActual(totalPaginas);
  }, [totalPaginas, paginaActual]);

  const contactosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * CONTACTOS_POR_PAGINA;
    return contactosOrdenados.slice(inicio, inicio + CONTACTOS_POR_PAGINA);
  }, [contactosOrdenados, paginaActual]);

  return {
    contactos,
    error,
    cargando,
    stats,
    busqueda,
    setBusqueda,
    ordenAsc,
    setOrdenAsc,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    contactosOrdenados,
    contactosPaginados,
    agregarContacto,
    eliminarContacto,
  };
}
