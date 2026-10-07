import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../src/main";
import { AUTH_KEY, createSession, loadSession } from "../src/services/auth";
import {
  APPOINTMENTS_KEY,
  validateAppointment,
} from "../src/services/appointments";
const mount = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
describe("Autenticação e rotas", () => {
  it("protege a lista de pacientes sem sessão", () => {
    mount("/pacientes");
    expect(
      screen.getByRole("heading", { name: "Acesse a demonstração" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Ana Ribeiro")).not.toBeInTheDocument();
  });
  it("recusa credenciais inválidas e expiração", () => {
    expect(() => createSession("errado@exemplo.com", "senha")).toThrow();
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        user: { email: "demo@cardioia.local" },
        token: "a.b.fake",
        expires: 1,
      }),
    );
    expect(loadSession()).toBeNull();
  });
  it("faz login e logout e restaura sessão no recarregamento", async () => {
    const view = mount();
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "CardioIA2026!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar no portal" }));
    expect(
      await screen.findByText("Pacientes cadastrados"),
    ).toBeInTheDocument();
    expect(loadSession().token.split(".")).toHaveLength(3);
    view.unmount();
    mount("/pacientes");
    expect(await screen.findByText("Ana Ribeiro")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Sair da demonstração" }),
    );
    expect(
      screen.getByRole("heading", { name: "Acesse a demonstração" }),
    ).toBeInTheDocument();
    expect(loadSession()).toBeNull();
  });
  it("ignora dados de sessão corrompidos", () => {
    localStorage.setItem(AUTH_KEY, "{quebrado");
    expect(loadSession()).toBeNull();
  });
});
describe("Agenda", () => {
  it("cria, persiste, atualiza painel e cancela com confirmação", async () => {
    createSession("demo@cardioia.local", "CardioIA2026!");
    const view = mount("/agendamentos");
    await screen.findByRole("option", { name: "Ana Ribeiro" });
    fireEvent.change(screen.getByLabelText("Paciente"), {
      target: { value: "P001" },
    });
    fireEvent.change(screen.getByLabelText("Data"), {
      target: { value: "2099-10-08" },
    });
    fireEvent.change(screen.getByLabelText("Horário"), {
      target: { value: "10:00" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar agendamento" }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Consulta agendada",
    );
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem(APPOINTMENTS_KEY))).toHaveLength(
        1,
      ),
    );
    fireEvent.click(screen.getByRole("link", { name: "Painel geral" }));
    expect(await screen.findByText("10:00")).toBeInTheDocument();
    view.unmount();
    mount("/agendamentos");
    expect(await screen.findByText("10:00")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Cancelar consulta de Ana Ribeiro" }),
    );
    expect(JSON.parse(localStorage.getItem(APPOINTMENTS_KEY))).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Sim, cancelar" }));
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem(APPOINTMENTS_KEY))).toHaveLength(
        0,
      ),
    );
    expect(screen.getByText("Nenhuma consulta agendada.")).toBeInTheDocument();
  });
  it("bloqueia datas passadas, incompletos e conflitos de paciente/especialidade", () => {
    const item = {
      patientId: "P001",
      date: "2099-10-08",
      time: "10:00",
      specialty: "Cardiologia",
    };
    expect(validateAppointment({ ...item, date: "2000-01-01" }, [])).toContain(
      "futuros",
    );
    expect(validateAppointment({ ...item, patientId: "" }, [])).toContain(
      "Preencha",
    );
    expect(validateAppointment(item, [item])).toContain("Já existe");
    expect(
      validateAppointment({ ...item, patientId: "P002" }, [item]),
    ).toContain("Já existe");
    expect(
      validateAppointment({ ...item, specialty: "Arritmologia" }, [item]),
    ).toContain("Já existe");
    expect(
      validateAppointment(
        { ...item, patientId: "P002", specialty: "Arritmologia" },
        [item],
      ),
    ).toBe("");
  });
  it("recupera lista corrompida e mostra busca vazia", async () => {
    createSession("demo@cardioia.local", "CardioIA2026!");
    localStorage.setItem(APPOINTMENTS_KEY, "{}");
    mount("/pacientes");
    await screen.findByText("Ana Ribeiro");
    fireEvent.change(screen.getByLabelText("Buscar paciente"), {
      target: { value: "Nome inexistente" },
    });
    expect(screen.getByText(/Nenhum paciente encontrado/)).toBeInTheDocument();
  });
});
