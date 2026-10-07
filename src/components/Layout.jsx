import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import s from "./Layout.module.css";
export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className={s.shell}>
      <aside className={s.sidebar}>
        <a className={s.brand} href="#/">
          ♥{" "}
          <span>
            CardioIA<small>Portal de cuidado</small>
          </span>
        </a>
        <nav aria-label="Navegação principal">
          <NavLink to="/" end>
            Painel geral
          </NavLink>
          <NavLink to="/pacientes">Pacientes</NavLink>
          <NavLink to="/agendamentos">Agendamentos</NavLink>
        </nav>
        <div className={s.demo}>
          <strong>Ambiente acadêmico</strong>
          <p>Pacientes fictícios. Nenhuma decisão clínica é realizada aqui.</p>
        </div>
        <button className={s.logout} onClick={logout}>
          Sair da demonstração
        </button>
      </aside>
      <div className={s.body}>
        <header className={s.header}>
          <span>Organização do cuidado</span>
          <span className={s.user}>
            <b>GY</b>
            {user.name}
          </span>
        </header>
        <main id="conteudo">
          <Outlet />
        </main>
        <footer>
          Guilherme Yamada Dantas · RM 568506 <span>FIAP · Fase 2</span>
        </footer>
      </div>
    </div>
  );
}
