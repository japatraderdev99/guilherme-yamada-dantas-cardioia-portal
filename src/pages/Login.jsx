import { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import s from "./Pages.module.css";
export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("demo@cardioia.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  if (user) return <Navigate to="/" replace />;
  function submit(e) {
    e.preventDefault();
    try {
      login(email, password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div className={s.login}>
      <section className={s.intro}>
        <div className={s.wordmark}>♥ CardioIA</div>
        <h1>Mais clareza para organizar o cuidado.</h1>
        <p>Pacientes, consultas e uma visão da rotina em um só lugar.</p>
        <svg viewBox="0 0 600 100" aria-hidden="true">
          <path
            d="M0 55 H130 L145 45 L160 60 L178 15 L200 90 L222 40 L240 55 H355 L370 45 L385 60 L405 15 L426 90 L448 40 L465 55 H600"
            fill="none"
            stroke="#81d5df"
            strokeWidth="3"
          />
        </svg>
        <small>Projeto acadêmico · FIAP · Inteligência Artificial</small>
      </section>
      <section className={s.loginForm}>
        <h2>Acesse a demonstração</h2>
        <p>Explore o portal com dados inteiramente fictícios.</p>
        <form onSubmit={submit}>
          <label>
            E-mail
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <p role="alert" className={s.error}>
              {error}
            </p>
          )}
          <button type="submit">Entrar no portal</button>
        </form>
        <div className={s.note}>
          <strong>Conta de demonstração</strong>
          <p>
            demo@cardioia.local
            <br />
            Senha: <code>CardioIA2026!</code>
          </p>
          <small>
            Login simulado, sem segurança real. Não insira dados pessoais ou
            credenciais reais.
          </small>
        </div>
      </section>
    </div>
  );
}
