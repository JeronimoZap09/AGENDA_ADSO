import { useState } from "react";
import { FormularioContacto } from "./components/FormularioContacto";
import { ContactoCard } from "./components/ContactoCard";
import { Navbar } from "./components/Navbar";
import { LoginForm } from "./components/LoginForm";
import { RegistroForm } from "./components/RegistroForm";
import { useAuth } from "./hooks/useAuth";
import { useContactos } from "./hooks/useContactos";
import "./App.css";

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

/** Pantalla de autenticación: alterna entre Login y Registro. */
function PantallaAutenticacion({ auth }) {
  const [vista, setVista] = useState("login"); // "login" | "registro"

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">AA</div>
          <div className="brand-copy">
            <p className="brand-name">Agenda ADSO</p>
            <p className="brand-tag">Login · Registro · Roles</p>
          </div>
        </div>

        {vista === "login" ? (
          <LoginForm
            onIniciarSesion={auth.iniciarSesion}
            verificando={auth.verificando}
            onIrARegistro={() => setVista("registro")}
          />
        ) : (
          <RegistroForm
            onRegistrar={auth.registrar}
            registrando={auth.registrando}
            onIrALogin={() => setVista("login")}
          />
        )}
      </div>
    </div>
  );
}

/** Dashboard principal (lo que antes vivía directo en App). */
function Dashboard({ auth, contactosState }) {
  const {
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
    contactos,
  } = contactosState;

  return (
    <div className="app-shell">
      <Navbar usuario={auth.usuario} esAdmin={auth.esAdmin} onCerrarSesion={auth.cerrarSesion} />

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
            <FormularioContacto onAgregar={agregarContacto} />
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

                <button type="button" className="btn-orden" onClick={() => setOrdenAsc((prev) => !prev)}>
                  <IconSort />
                  {ordenAsc ? "Ordenar Z-A" : "Ordenar A-Z"}
                </button>
              </div>
            </div>

            {cargando ? (
              <p className="app-estado-lista app-estado-lista--cargando">Cargando contactos...</p>
            ) : contactos.length === 0 ? (
              <p className="app-estado-lista app-estado-lista--vacio">No hay contactos registrados.</p>
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
                      puedeEliminar={auth.esAdmin}
                      onEliminar={() => eliminarContacto(contacto.id)}
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

                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPaginaActual(n)}
                        style={{
                          border: `1px solid ${
                            n === paginaActual ? "var(--brand-600)" : "var(--color-border)"
                          }`,
                          background: n === paginaActual ? "var(--brand-600)" : "var(--color-surface-2)",
                          color: n === paginaActual ? "#fff" : "var(--color-text-muted)",
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
                    ))}

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
                        cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer",
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

/**
 * App.jsx ahora es solo el punto de composición: decide, según el estado
 * de autenticación, si mostrar la pantalla de login/registro o el
 * dashboard. Ya no contiene fetch, filtrado, orden ni paginación — esa
 * lógica de negocio se movió a los hooks useAuth y useContactos.
 */
export function App() {
  const auth = useAuth();
  const contactosState = useContactos();

  if (!auth.estaAutenticado) {
    return <PantallaAutenticacion auth={auth} />;
  }

  return <Dashboard auth={auth} contactosState={contactosState} />;
}

export default App;
