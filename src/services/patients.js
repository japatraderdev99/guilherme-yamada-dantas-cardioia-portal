import patients from "../data/patients.json";
export async function getPatients() {
  return patients.map((patient) => ({ ...patient }));
}
