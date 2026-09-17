const IconContacts = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" strokeLinecap="round" />
  </svg>
);

const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3" />
    <path
      d="M4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV_ITEMS = [
  { id: "contactos", label: "Contactos", icon: IconContacts, active: true },
  { id: "estadisticas", label: "Estadísticas", icon: IconChart, badge: "Pronto" },
  { id: "ajustes", label: "Ajustes", icon: IconSettings, badge: "Pronto" },
];

function inicialesDe(nombre = "") {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase() ?? "")
    .join("") || "??";
}

/**
 * Barra lateral de navegación. Ahora es un componente independiente
 * (antes vivía embebido dentro de App.jsx) y muestra información de la
 * sesión activa: nombre, rol e identificación visual según el rol
 * ("interfaz muestra u oculta opciones según el rol").
 */
export function Navbar({ usuario, esAdmin, onCerrarSesion }) {
  return (
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
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{inicialesDe(usuario?.nombre)}</div>
          <div className="user-copy">
            <p className="user-name">{usuario?.nombre ?? "SENA"}</p>
            <p className="user-role">
              <span className={`role-pill ${esAdmin ? "role-pill--admin" : "role-pill--usuario"}`}>
                {esAdmin ? "Administrador" : "Usuario"}
              </span>
            </p>
          </div>
        </div>

        {usuario && (
          <button type="button" className="btn-logout" onClick={onCerrarSesion}>
            <IconLogout />
            <span>Cerrar sesión</span>
          </button>
        )}
      </div>
    </aside>
  );
}
