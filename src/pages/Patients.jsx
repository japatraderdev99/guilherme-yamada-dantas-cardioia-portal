import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { formatDate } from "./Dashboard";
import s from "./Pages.module.css";
export default function Patients() {
  const { patients, loading, error } = useData();
  const [search, setSearch] = useState("");
  const filtered = patients.filter((p) =>
    p.name
      .toLocaleLowerCase("pt-BR")
      .includes(search.toLocaleLowerCase("pt-BR")),
  );
  return (
    <>
      <div className={s.title}>
        <div>
          <h1>Pacientes</h1>
          <p>Conheça os perfis fictícios disponíveis para agendamento.</p>
        </div>
      </div>
      <label className={s.search}>
        Buscar paciente
        <input
          type="search"
          placeholder="Digite um nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {loading ? (
        <p role="status">Carregando pacientes…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <section className={s.panel}>
          <div className={s.tableWrap}>
            <table>
              <caption>{filtered.length} pacientes encontrados</caption>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Idade</th>
                  <th>Especialidade</th>
                  <th>Última consulta</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      <small>{p.id}</small>
                    </td>
                    <td>{p.age} anos</td>
                    <td>{p.specialty}</td>
                    <td>{formatDate(p.lastVisit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <p className={s.empty}>
              Nenhum paciente encontrado. Tente outro nome.
            </p>
          )}
        </section>
      )}
    </>
  );
}
