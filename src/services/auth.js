import { read, save, remove } from "./storage";
export const AUTH_KEY = "cardioia.session.v1";
export const DEMO_EMAIL = "demo@cardioia.local";
const encode = (value) =>
  btoa(JSON.stringify(value))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
export function createSession(email, password) {
  if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== "CardioIA2026!")
    throw new Error(
      "Use o e-mail e a senha de demonstração informados abaixo.",
    );
  const user = { name: "Guilherme", email: DEMO_EMAIL };
  const expires = Date.now() + 8 * 60 * 60 * 1000;
  const token = `${encode({ alg: "none", typ: "JWT" })}.${encode({ sub: email, exp: Math.floor(expires / 1000), demo: true })}.fake`;
  const session = { user, token, expires };
  save(AUTH_KEY, session);
  return session;
}
export function loadSession() {
  const s = read(AUTH_KEY, null);
  return s?.user?.email === DEMO_EMAIL &&
    typeof s.token === "string" &&
    s.token.split(".").length === 3 &&
    s.expires > Date.now()
    ? s
    : null;
}
export function clearSession() {
  remove(AUTH_KEY);
}
