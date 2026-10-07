export const APPOINTMENTS_KEY = "cardioia.appointments.v1";
export function validateAppointment(item, items, now = new Date()) {
  if (!item.patientId || !item.date || !item.time || !item.specialty)
    return "Preencha todos os campos.";
  const start = new Date(`${item.date}T${item.time}`);
  if (Number.isNaN(start.getTime()) || start <= now)
    return "Escolha uma data e um horário futuros.";
  if (
    items.some(
      (a) =>
        a.date === item.date &&
        a.time === item.time &&
        (a.patientId === item.patientId || a.specialty === item.specialty),
    )
  )
    return "Já existe uma consulta para este paciente ou especialidade nesse horário.";
  return "";
}
export function appointmentsReducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, action.payload].sort((a, b) =>
        (a.date + a.time).localeCompare(b.date + b.time),
      );
    case "cancel":
      return state.filter((a) => a.id !== action.id);
    default:
      return state;
  }
}
export function validAppointments(value) {
  return Array.isArray(value)
    ? value.filter(
        (a) =>
          a &&
          typeof a.id === "string" &&
          typeof a.patientId === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(a.date) &&
          /^\d{2}:\d{2}$/.test(a.time) &&
          typeof a.specialty === "string",
      )
    : [];
}
