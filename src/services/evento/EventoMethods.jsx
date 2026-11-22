import AxiosAPI from '../../utils/axiosConfig';
import { INITIAL_EVENTOS, getLocalStorageList, saveLocalStorageList } from '../../utils/mockData';
import defaultEventoImg from '../../asset/evento-ascensos.jpg';

const STORAGE_KEY = 'eventos_data';

export async function listarEventos() {
  try {
    const response = await AxiosAPI.get('/eventos');
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      saveLocalStorageList(STORAGE_KEY, response.data);
      return response.data;
    }
    return getLocalStorageList(STORAGE_KEY, INITIAL_EVENTOS);
  } catch {
    return getLocalStorageList(STORAGE_KEY, INITIAL_EVENTOS);
  }
}

export async function registrarEvento(eventoData) {
  try {
    const response = await AxiosAPI.post('/eventos', eventoData);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_EVENTOS);
    const nuevo = {
      ...eventoData,
      id: Date.now(),
      imagen: eventoData.imagen || defaultEventoImg,
    };
    list.unshift(nuevo);
    saveLocalStorageList(STORAGE_KEY, list);
    return nuevo;
  }
}

export async function actualizarEvento(id, eventoData) {
  try {
    const response = await AxiosAPI.put(`/eventos/${id}`, eventoData);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_EVENTOS);
    const idx = list.findIndex((e) => String(e.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...eventoData };
      saveLocalStorageList(STORAGE_KEY, list);
      return list[idx];
    }
    return eventoData;
  }
}

export async function eliminarEvento(id) {
  try {
    const response = await AxiosAPI.delete(`/eventos/${id}`);
    return response.data;
  } catch {
    let list = getLocalStorageList(STORAGE_KEY, INITIAL_EVENTOS);
    list = list.filter((e) => String(e.id) !== String(id));
    saveLocalStorageList(STORAGE_KEY, list);
    return { success: true };
  }
}
