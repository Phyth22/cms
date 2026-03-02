/**
 * auth/AuthContext.tsx
 *
 * Lightweight auth state machine for NAVAS CMS.
 *
 * States:
 *   logged_out    → user hasn't submitted credentials yet
 *   mfa_required  → credentials accepted, OTP step pending
 *   authenticated → fully verified, redirect to app
 *
 * login()      — validates email/password (mock), advances to mfa_required
 * verifyMfa()  — validates OTP (mock), advances to authenticated
 * logout()     — resets to logged_out
 *
 * Replace the mock validation functions with real API calls.
 */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export type AuthStatus = "logged_out" | "mfa_required" | "authenticated";

export interface AuthState {
  status:    AuthStatus;
  tenant:    string;
  role:      string;
  loginHint: { email: string } | null;
  error:     string | null;
}

interface AuthContextValue {
  state:       AuthState;
  login:       (email: string, password: string) => Promise<void>;
  verifyMfa:   (code: string) => Promise<void>;
  logout:      () => void;
}

// ── Initial state ─────────────────────────────────────────────────────────────

const INITIAL_STATE: AuthState = {
  status:    "logged_out",
  tenant:    "3D UG — AEGIS Command Centre",
  role:      "Super-Admin",
  loginHint: { email: "admin@3d-services.africa" },
  error:     null,
};

// ── Reducer ───────────────────────────────────────────────────────────────────

type AuthAction =
  | { type: "MFA_REQUIRED" }
  | { type: "AUTHENTICATED" }
  | { type: "LOGOUT" }
  | { type: "ERROR"; payload: string };

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "MFA_REQUIRED":
      return { ...state, status: "mfa_required", error: null };
    case "AUTHENTICATED":
      return { ...state, status: "authenticated", error: null };
    case "LOGOUT":
      return { ...INITIAL_STATE };
    case "ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  /**
   * login — Submit email + password.
   * Mock: any non-empty credentials advance to MFA step.
   * Replace with: POST /api/auth/login
   */
  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      throw new Error("Email and password are required.");
    }
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));
    // Mock: wrong password guard
    if (password === "wrong") throw new Error("Invalid credentials.");
    dispatch({ type: "MFA_REQUIRED" });
  }, []);

  /**
   * verifyMfa — Submit 6-digit OTP.
   * Mock: any 6-digit code succeeds.
   * Replace with: POST /api/auth/mfa
   */
  const verifyMfa = useCallback(async (code: string) => {
    if (!/^\d{6}$/.test(code)) {
      throw new Error("Enter a valid 6-digit code.");
    }
    await new Promise((r) => setTimeout(r, 600));
    dispatch({ type: "AUTHENTICATED" });
  }, []);

  const logout = useCallback(() => dispatch({ type: "LOGOUT" }), []);

  return (
    <AuthContext.Provider value={{ state, login, verifyMfa, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
