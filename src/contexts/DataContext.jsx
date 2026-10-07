import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { getPatients } from "../services/patients";
import { read, save } from "../services/storage";
import {
  APPOINTMENTS_KEY,
  appointmentsReducer,
  validAppointments,
} from "../services/appointments";
const DataContext = createContext(null);
export function DataProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState(false);
  const [appointments, dispatch] = useReducer(
    appointmentsReducer,
    undefined,
    () => validAppointments(read(APPOINTMENTS_KEY, [])),
  );
  useEffect(() => {
    let active = true;
    getPatients()
      .then((data) => {
        if (active) setPatients(data);
      })
      .catch(() => {
        if (active)
          setError(
            "Não foi possível carregar os pacientes. Recarregue a página.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    setStorageError(!save(APPOINTMENTS_KEY, appointments));
  }, [appointments]);
  return (
    <DataContext.Provider
      value={{ patients, loading, error, appointments, dispatch }}
    >
      {storageError && (
        <p role="alert">
          O navegador bloqueou o armazenamento. As alterações durarão apenas
          nesta sessão.
        </p>
      )}
      {children}
    </DataContext.Provider>
  );
}
export const useData = () => useContext(DataContext);
