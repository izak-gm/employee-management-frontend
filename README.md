# Employee Management Frontend

A React + TypeScript single-page application for the Employee Management System — provides authentication, role-based dashboards, and profile self-service for Employees, Admins, and Super Admins.

## Tech Stack

- **React 19** + **TypeScript 5.9**
- **Vite 8** — build tool and dev server
- **MUI 9 (Material UI)** — component library and theming (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`)
- **React Router 7** — client-side routing, protected/role-based routes
- **Axios** — HTTP client, with a shared instance handling JWT attachment
- **jwt-decode 4** — decodes JWT payload client-side (role, id, email, expiry)
- **openapi-typescript 7** — generates TypeScript types directly from the backend's OpenAPI spec
- **ESLint 10** + **typescript-eslint** — linting
- **@fontsource/roboto** — self-hosted Roboto font (MUI's default typeface)

## Prerequisites

- Node.js 18+ and npm
- The backend API running (see the backend README) — default expected at `http://localhost:8080/api/v1`

## Getting Started

```bash
npm install
npm run dev
```

The app runs at **`http://localhost:5173`** by default.

## Configuration

The backend base URL is currently set directly in `src/api/axiosInstance.ts`:

```ts
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});
```

> **Note:** this is hardcoded rather than driven by an environment variable. Before deploying to any environment other than local dev, either update this value directly or refactor it to read from a Vite env variable (e.g. `import.meta.env.VITE_API_BASE_URL`) with a `.env` file per environment.

## Generating API Types

TypeScript types are generated from the backend's live OpenAPI spec — never hand-edited:

```bash
npx openapi-typescript http://localhost:8080/v3/api-docs -o src/types/api-schema.ts
```

Run this whenever the backend adds/changes endpoints or DTOs. Requires the backend to be running locally first.

> **Note:** `typescript` is pinned to `^5.9.3` in this project specifically so it satisfies `openapi-typescript`'s peer dependency (`^5.x`). If you ever upgrade to TypeScript 6+, reinstalling `openapi-typescript` may require `--legacy-peer-deps` until it publishes official TS 6 support.

## Authentication Flow

1. User registers (`/auth/register`) or logs in (`/auth/login`) — backend returns a signed JWT.
2. The token is decoded client-side (`jwt-decode`) to extract `id`, `email`, and `role`, and stored in `localStorage`.
3. `AuthContext` exposes `token`, `employeeId`, `email`, `role`, `isAuthenticated`, `login()`, and `logout()` app-wide.
4. Every outgoing request automatically attaches `Authorization: Bearer <token>` via an axios request interceptor.
5. A response interceptor watches for `401` responses and force-logs-out + redirects to `/login` if the token is rejected server-side.
6. Route guards (`ProtectedRoute`, `RoleRoute`) block unauthenticated or under-privileged access before a page even renders.

### Roles & Routing

| Role | Redirected to | Can manage |
|---|---|---|
| `EMPLOYEE` | `/employee` | Own profile only |
| `ADMIN` | `/admin` | Employee accounts |
| `SUPERADMIN` | `/superadmin` | All accounts, including Admins |

All authenticated users can access `/profile`, `/profile/edit`, and `/profile/reset-password` regardless of role.

## Project Structure

```
src/
├── api/
│   ├── axiosInstance.ts      # Axios instance, JWT interceptor, 401 handling
│   ├── authApi.ts            # register, login, registerUserWithRole
│   ├── employeeApi.ts        # getMyProfile, updateMyProfile, getEmployees, getEmployeeById, updateEmployee, deleteEmployee
│   ├── userApi.ts            # ⚠️ legacy — see "Known Gaps" below
│   └── errorUtils.ts         # extractErrorMessage — surfaces real backend error messages in the UI
├── context/
│   └── AuthContext.tsx       # Decodes JWT, exposes auth state app-wide
├── types/
│   ├── api-schema.ts         # Auto-generated from backend OpenAPI spec — do not hand-edit
│   └── auth.type.ts          # Re-exported/aliased types + DecodedToken, Role
├── routes/
│   ├── ProtectedRoute.tsx    # Blocks unauthenticated users
│   └── RoleRoute.tsx         # Blocks users without an allowed role
├── theme.ts                  # MUI theme — corporate navy/gold palette, light mode
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── profile/
│   │   ├── ViewProfilePage.tsx
│   │   ├── EditProfilePage.tsx
│   │   └── ResetPasswordPage.tsx
│   ├── admin/
│   │   └── AdminDashboard.tsx
│   ├── superadmin/
│   │   └── SuperAdminDashboard.tsx
│   └── employee/
│       └── EmployeeDashboard.tsx
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx   # Shared sidebar + topbar shell for all dashboards
│   ├── EmployeeTable.tsx         # Search, list, edit/delete actions (Admin/SuperAdmin)
│   └── UserFormDialog.tsx        # Create-user (2-step) / edit-user modal
├── App.tsx                       # Route definitions, role-based redirect
└── main.tsx                      # Entry point, ThemeProvider, font imports
```

## Key Features

- **Split-screen branded auth pages** (Login/Register) with show/hide password toggles.
- **Role-aware dashboard shell** — persistent sidebar, avatar menu, role chip, active-route highlighting (including nested profile routes).
- **Profile self-service** — view profile, edit profile (with "Fill this field" placeholders for incomplete data and required-field validation), and a dedicated reset-password page with a live password-strength meter.
- **Admin/SuperAdmin user management** — searchable/paginated employee table, create-user dialog (creates account + optionally fills profile in one flow), edit and delete actions.
- **Real backend error messages** — API errors are extracted from the backend's structured `ErrorResponse` (`message` field) and shown directly in the UI instead of generic hardcoded text.
- **Light mode enforced** via MUI `ThemeProvider` + `CssBaseline`, regardless of OS/browser color scheme settings.

## Known Gaps / Follow-ups

- **`src/api/userApi.ts` vs `src/api/employeeApi.ts`** — both files currently exist. `employeeApi.ts` is the one aligned with the generated OpenAPI types (`getMyProfile`, `updateMyProfile`, `getEmployees`, `getEmployeeById`, `updateEmployee`, `deleteEmployee`) and is what all current pages/components import. `userApi.ts` appears to be left over from an earlier draft — check for any remaining imports of it and remove the file (or its unused exports) to avoid two sources of truth for the same API calls.
- `GET /employees` returns a plain array with no total count — pagination in `EmployeeTable` is currently a placeholder and should be revisited if the backend adds paginated response metadata.
- The API base URL is hardcoded (see Configuration above) — should move to environment-based config before any non-local deployment.
- The `updateMyProfile`/`updateEmployee` responses currently return the full backend `Employee` entity (not the sanitized `EmployeeResponse`) — the frontend only reads the fields it needs, but this is worth tightening on the backend.

## Available Scripts

```bash
npm run dev       # Start local dev server
npm run build     # Type-check and build for production
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```