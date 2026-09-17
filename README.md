# Agenda ADSO — Login, Registro, Roles y Contactos

## Cómo ejecutar

1. Instalar dependencias: `npm install`
2. Levantar la API simulada (json-server, puerto 3000): `npm run server`
3. En otra terminal, levantar el frontend: `npm run dev`

## Usuarios de prueba

| Rol            | Correo                | Contraseña   |
|----------------|------------------------|--------------|
| Administrador  | admin@sena.edu.co      | admin123     |
| Usuario        | usuario@sena.edu.co    | usuario123   |

También puedes crear una cuenta nueva desde "Regístrate aquí" en la pantalla de login;
todo registro público queda con rol **usuario** (solo eliminar contactos está reservado
para el rol **admin**).

## Estructura

- `src/hooks/useAuth.js` — lógica de login, registro y sesión (rol incluido).
- `src/hooks/useContactos.js` — lógica de negocio de contactos (antes vivía en `App.jsx`).
- `src/components/LoginForm.jsx`, `RegistroForm.jsx`, `Navbar.jsx`, `FormularioContacto.jsx`,
  `ContactoCard.jsx` — componentes de presentación.
- `src/utils/validaciones.js` — reglas de validación compartidas por todos los formularios.

> Nota: las contraseñas se guardan en texto plano en `db.json` porque json-server no
> soporta hashing; esto es aceptable para un proyecto académico, pero no para producción.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
