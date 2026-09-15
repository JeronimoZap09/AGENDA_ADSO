import { useState, useEffect, useMemo } from "react";
import { FormularioContacto } from "./components/FormularioContacto";
import { ContactoCard } from "./components/ContactoCard";
import { LoginPage } from "./components/LoginPage";
import { cerrarSesion, obtenerSesionGuardada } from "./auth";
import "./App.css";

/* -------------------------------------------------------------------------
   Iconos (SVG inline, sin dependencias externas)
   ------------------------------------------------------------------------- */

const IconContacts = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" strokeLinecap="round" />
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="9" cy="8" r="3" />
    <path d="M2 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" strokeLinecap="round" />
    <path d="M16 4.2c1.7.4 3 1.9 3 3.8s-1.3 3.4-3 3.8M22 20c0-2.8-2.2-4.8-5-5.3" strokeLinecap="round" />
  </svg>
);

const IconTag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12.6 3H5a2 2 0 0 0-2 2v7.6a2 2 0 0 0 .6 1.4l9 9a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8l-9-9a2 2 0 0 0-1.4-.6Z" />
    <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

const IconPulse = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 12h4l2 7 4-14 2 7h6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4-4" strokeLinecap="round" />
  </svg>
);

const IconSort = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV_ITEMS = [
  { id: "contactos", label: "Contactos", icon: IconContacts, active: true },
];

export function App() {
  // Sesión del usuario logueado (null = no ha iniciado sesión).
  const [usuarioActual, setUsuarioActual] = useState(() => obtenerSesionGuardada());

  const [contactos, setContactos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Término de búsqueda digitado por el usuario
  const [busqueda, setBusqueda] = useState("");
  // Orden de los contactos: true = A-Z, false = Z-A
  const [ordenAsc, setOrdenAsc] = useState(true);

  // Página que se está mostrando ahora mismo (empieza en 1)
  const [paginaActual, setPaginaActual] = useState(1);
  // Cuántos contactos se muestran por página
  const [contactosPorPagina] = useState(3);

  const API_URL = "http://localhost:3000/contactos";

  useEffect(() => {
    // Si todavía no hay sesión (pantalla de login), no hay nada que cargar.
    if (!usuarioActual) return;

    const cargarContactos = async () => {
      try {
        setCargando(true);
        setError("");
        // Solo se piden los contactos que pertenecen al usuario logueado.
        const res = await fetch(`${API_URL}?usuarioId=${usuarioActual.id}`);
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        const data = await res.json();
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

    cargarContactos();
  }, [usuarioActual]);

  // Cada vez que cambia la búsqueda o el orden, la página actual puede dejar
  // de tener sentido (por ejemplo, estar en la página 4 cuando ya solo hay 1)
  // así que volvemos siempre a la página 1.
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, ordenAsc]);

  const onAgregarContacto = async (nuevoContacto) => {
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Se guarda a qué usuario pertenece este contacto.
        body: JSON.stringify({ ...nuevoContacto, usuarioId: usuarioActual.id }),
      });

      if (!res.ok) throw new Error("Error al guardar el contacto");

      const creado = await res.json();
      setContactos((prev) => [...prev, creado]);
    } catch (err) {
      console.error("Error al guardar contacto:", err);
      setError(
        "No se pudo guardar el contacto. Verifica que el servidor esté encendido e intenta de nuevo."
      );
      throw err;
    }
  };

  const onEliminarContacto = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar el contacto");

      setContactos((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error al eliminar contacto:", err);
      setError(
        "No se pudo eliminar el contacto. Verifica que el servidor esté encendido."
      );
    }
  };

  const stats = useMemo(() => {
    const total = contactos.length;
    const conEtiqueta = contactos.filter((c) => c.etiqueta).length;
    return { total, conEtiqueta, sinEtiqueta: total - conEtiqueta };
  }, [contactos]);

  // 1ra transformación: filtrado por término de búsqueda (nombre, correo o etiqueta)
  const contactosFiltrados = contactos.filter((c) => {
    const termino = busqueda.toLowerCase();
    const nombre = c.nombre.toLowerCase();
    const correo = c.correo.toLowerCase();
    const etiqueta = (c.etiqueta || "").toLowerCase();

    return (
      nombre.includes(termino) ||
      correo.includes(termino) ||
      etiqueta.includes(termino)
    );
  });

  // 2da transformación: ordenamiento alfabético por nombre (copia, no muta contactosFiltrados)
  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const nombreA = a.nombre.toLowerCase();
    const nombreB = b.nombre.toLowerCase();

    if (nombreA < nombreB) return ordenAsc ? -1 : 1;
    if (nombreA > nombreB) return ordenAsc ? 1 : -1;
    return 0;
  });

  // 3ra transformación: paginación — de la lista ya filtrada y ordenada,
  // solo tomamos el pedazo que corresponde a la página actual.
  const totalPaginas = Math.max(
    1,
    Math.ceil(contactosOrdenados.length / contactosPorPagina)
  );

  useEffect(() => {
    if (paginaActual > totalPaginas) setPaginaActual(totalPaginas);
  }, [totalPaginas, paginaActual]);

  const indiceInicio = (paginaActual - 1) * contactosPorPagina;
  const indiceFin = indiceInicio + contactosPorPagina;
  const contactosPaginados = contactosOrdenados.slice(indiceInicio, indiceFin);

  const onCerrarSesion = () => {
    cerrarSesion();
    setUsuarioActual(null);
  };

  if (!usuarioActual) {
    return <LoginPage onLoginExitoso={setUsuarioActual} />;
  }

  return (
    <div className="app-shell">
      {/* ------------------------------ SIDEBAR ------------------------------ */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">AA</div>
          <div className="brand-copy">
            <p className="brand-name">Agenda ADSO</p>
            <p className="brand-tag">v6 · Contactos</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon, active, badge }) => (
            <button
              key={id}
              type="button"
              className={`nav-item ${active ? "nav-item--active" : ""}`}
              disabled={!active}
            >
              <Icon />
              <span>{label}</span>
              {badge && <span className="nav-badge">{badge}</span>}
            </button>
          ))}

          <button type="button" className="nav-item" onClick={onCerrarSesion}>
            <IconLogout />
            <span>Cerrar sesión</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {usuarioActual.nombre
                .split(" ")
                .map((palabra) => palabra[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="user-copy">
              <p className="user-name">{usuarioActual.nombre}</p>
              <p className="user-role">Programa ADSO</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ----------------------------- MAIN AREA ----------------------------- */}
      <main className="main-area">
        <header className="topbar">
          <div>
            <h1 className="app-title">Contactos</h1>
            <p className="app-subtitle">
              Gestión de contactos con validaciones y control de errores.
            </p>
          </div>
        </header>

        {error && <div className="alert-error-global">{error}</div>}

        <section className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">
              <IconUsers />
            </span>
            <div>
              <p className="stat-value">{stats.total}</p>
              <p className="stat-label">Contactos totales</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              <IconTag />
            </span>
            <div>
              <p className="stat-value">{stats.conEtiqueta}</p>
              <p className="stat-label">Con etiqueta</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              <IconPulse />
            </span>
            <div>
              <p className="stat-value">{cargando ? "…" : "Al día"}</p>
              <p className="stat-label">Estado de sincronización</p>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="form-panel">
            <FormularioContacto onAgregar={onAgregarContacto} />
          </div>

          <div className="list-panel">
            <div className="list-panel-header">
              <div className="list-panel-heading">
                <h2>Todos los contactos</h2>
                <span className="list-count">{contactosOrdenados.length}</span>
                {contactosOrdenados.length > 0 && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--color-text-faint)",
                    }}
                  >
                    página {paginaActual} de {totalPaginas}
                  </span>
                )}
              </div>

              <div className="search-row">
                <div className="search-input-wrap">
                  <IconSearch />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar por nombre, correo o etiqueta..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn-orden"
                  onClick={() => setOrdenAsc((prev) => !prev)}
                >
                  <IconSort />
                  {ordenAsc ? "Ordenar Z-A" : "Ordenar A-Z"}
                </button>
              </div>
            </div>

            {cargando ? (
              <p className="app-estado-lista app-estado-lista--cargando">
                Cargando contactos...
              </p>
            ) : contactos.length === 0 ? (
              <p className="app-estado-lista app-estado-lista--vacio">
                No hay contactos registrados.
              </p>
            ) : contactosOrdenados.length === 0 ? (
              <p className="app-estado-lista app-estado-lista--vacio">
                No se encontraron contactos que coincidan con la búsqueda.
              </p>
            ) : (
              <>
                <div className="contactos-lista">
                  {contactosPaginados.map((contacto) => (
                    <ContactoCard
                      key={contacto.id}
                      {...contacto}
                      onEliminar={() => onEliminarContacto(contacto.id)}
                    />
                  ))}
                </div>

                {totalPaginas > 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                      marginTop: "1.1rem",
                    }}
                  >
                    <button
                      type="button"
                      disabled={paginaActual === 1}
                      onClick={() => setPaginaActual((p) => p - 1)}
                      style={{
                        border: "1px solid var(--color-border)",
                        background: "var(--color-surface-2)",
                        color: "var(--color-text-muted)",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.45rem 0.8rem",
                        fontSize: "0.8rem",
                        fontFamily: "inherit",
                        cursor: paginaActual === 1 ? "not-allowed" : "pointer",
                        opacity: paginaActual === 1 ? 0.4 : 1,
                      }}
                    >
                      ← Anterior
                    </button>

                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                      (n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setPaginaActual(n)}
                          style={{
                            border: `1px solid ${
                              n === paginaActual
                                ? "var(--brand-600)"
                                : "var(--color-border)"
                            }`,
                            background:
                              n === paginaActual
                                ? "var(--brand-600)"
                                : "var(--color-surface-2)",
                            color:
                              n === paginaActual
                                ? "#fff"
                                : "var(--color-text-muted)",
                            borderRadius: "var(--radius-sm)",
                            padding: "0.45rem 0.75rem",
                            fontSize: "0.8rem",
                            fontFamily: "inherit",
                            fontWeight: n === paginaActual ? 700 : 500,
                            cursor: "pointer",
                          }}
                        >
                          {n}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      disabled={paginaActual === totalPaginas}
                      onClick={() => setPaginaActual((p) => p + 1)}
                      style={{
                        border: "1px solid var(--color-border)",
                        background: "var(--color-surface-2)",
                        color: "var(--color-text-muted)",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.45rem 0.8rem",
                        fontSize: "0.8rem",
                        fontFamily: "inherit",
                        cursor:
                          paginaActual === totalPaginas
                            ? "not-allowed"
                            : "pointer",
                        opacity: paginaActual === totalPaginas ? 0.4 : 1,
                      }}
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
