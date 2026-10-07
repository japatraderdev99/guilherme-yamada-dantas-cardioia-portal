import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { validateAppointment } from "../services/appointments";
import { formatDate } from "./Dashboard";
import s from "./Pages.module.css";
const initial = { patientId: "", date: "", time: "", specialty: "Cardiologia" };
export default function Appointments() {
  const { patients, appointments, dispatch, loading, error } = useData();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState("");
  const [confirm, setConfirm] = useState(null);
  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFailure("");
    setMessage("");
  }
  function submit(e) {
    e.preventDefault();
    const invalid = validateAppointment(form, appointments);
    if (invalid) {
      setFailure(invalid);
      return;
    }
    dispatch({ type: "add", payload: { ...form, id: crypto.randomUUID() } });
    setForm(initial);
    setMessage("Consulta agendada com sucesso.");
    setFailure("");
  }
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return (
    <>
      <div className={s.title}>
        <div>
          <h1>Agendamentos</h1>
          <p>Reserve um horário e mantenha a agenda em dia.</p>
        </div>
      </div>
      <div className={s.columns}>
        <section className={s.panel}>
          <h2>Nova consulta</h2>
          {loading ? (
            <p role="status">Carregando pacientes…</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : (
            <form onSubmit={submit}>
              <label>
                Paciente
                <select
                  name="patientId"
                  value={form.patientId}
                  onChange={change}
                  required
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Especialidade
                <select
                  name="specialty"
                  value={form.specialty}
                  onChange={change}
                >
                  <option>Cardiologia</option>
                  <option>Arritmologia</option>
                </select>
              </label>
              <div className={s.formRow}>
                <label>
                  Data
                  <input
                    type="date"
                    name="date"
                    min={minDate}
                    value={form.date}
                    onChange={change}
                    required
                  />
                </label>
                <label>
                  Horário
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={change}
                    required
                  />
                </label>
              </div>
              {failure && (
                <p role="alert" className={s.error}>
                  {failure}
                </p>
              )}
              {message && (
                <p role="status" className={s.success}>
                  {message}
                </p>
              )}
              <button type="submit">Confirmar agendamento</button>
              <p className={s.hint}>
                Uma consulta por especialidade em cada horário. Os dados ficam
                salvos neste navegador.
              </p>
            </form>
          )}
        </section>
        <section className={s.panel}>
          <h2>
            Consultas na agenda{" "}
            <span className={s.count}>{appointments.length}</span>
          </h2>
          {appointments.length ? (
            <ul className={s.agenda}>
              {appointments.map((a) => (
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
                    {confirm === a.id ? (
                      <div className={s.confirm}>
                        <span>Cancelar esta consulta?</span>
                        <button
                          onClick={() => {
                            dispatch({ type: "cancel", id: a.id });
                            setConfirm(null);
                            setMessage("Consulta cancelada.");
                          }}
                        >
                          Sim, cancelar
                        </button>
                        <button onClick={() => setConfirm(null)}>Manter</button>
                      </div>
                    ) : (
                      <button
                        className={s.textButton}
                        onClick={() => setConfirm(a.id)}
                        aria-label={`Cancelar consulta de ${patients.find((p) => p.id === a.patientId)?.name || a.patientId}`}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={s.empty}>
              <h3>Nenhuma consulta agendada.</h3>
              <p>Escolha um paciente e um horário no formulário.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
