import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import s from "./Pages.module.css";
export const formatDate = (value) =>
  new Date(value + "T12:00:00").toLocaleDateString("pt-BR");
export default function Dashboard() {
  const { patients, appointments, loading, error } = useData();
  const future = appointments.filter(
    (a) => new Date(a.date + "T" + a.time) > new Date(),
  );
  if (loading) return <p role="status">Carregando painel…</p>;
  if (error) return <p role="alert">{error}</p>;
  return (
    <>
      <div className={s.title}>
        <div>
          <h1>O cuidado começa com organização.</h1>
          <p>
            Acompanhe sua base de pacientes e prepare os próximos atendimentos.
          </p>
        </div>
        <Link className={s.button} to="/agendamentos">
          Agendar consulta
        </Link>
      </div>
      <div className={s.metrics}>
        <section>
          <span>Pacientes cadastrados</span>
          <strong>{patients.length.toString().padStart(2, "0")}</strong>
          <small>Base demonstrativa local</small>
        </section>
        <section>
          <span>Consultas futuras</span>
          <strong>{future.length.toString().padStart(2, "0")}</strong>
          <small>Agendamentos ativos</small>
        </section>
        <section>
          <span>Especialidades</span>
          <strong>02</strong>
          <small>Cardiologia e Arritmologia</small>
        </section>
      </div>
      <section className={s.panel}>
        <div className={s.sectionTitle}>
          <h2>Próximos atendimentos</h2>
          <Link to="/agendamentos">Ver agenda</Link>
        </div>
        {future.length ? (
          <ul className={s.agenda}>
            {future.slice(0, 5).map((a) => (
              <li key={a.id}>
                <time>
                  {formatDate(a.date)}
                  <strong>{a.time}</strong>
                </time>
                <div>
                  <strong>
                    {patients.find((p) => p.id === a.patientId)?.name ||
                      a.patientId}
                  </strong>
                  <p>{a.specialty}</p>
                </div>
                <span className={s.badge}>Agendada</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className={s.empty}>
            <h3>Sua agenda está livre.</h3>
            <p>
              Crie a primeira consulta para acompanhar os próximos atendimentos.
            </p>
            <Link to="/agendamentos">Criar agendamento</Link>
          </div>
        )}
      </section>
      <div className={s.notice}>
        <strong>Uma simulação para aprender.</strong>
        <p>
          Este portal organiza informações fictícias. Não realiza triagem,
          diagnóstico ou recomendação de tratamento.
        </p>
      </div>
    </>
  );
}
