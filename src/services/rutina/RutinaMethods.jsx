import AxiosAPI from '../../utils/axiosConfig';
import { INITIAL_RUTINAS, getLocalStorageList, saveLocalStorageList } from '../../utils/mockData';

const STORAGE_KEY = 'rutinas_data';

export async function listarRutinas() {
  try {
    const response = await AxiosAPI.get('/rutinas');
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      saveLocalStorageList(STORAGE_KEY, response.data);
      return response.data;
    }
    return getLocalStorageList(STORAGE_KEY, INITIAL_RUTINAS);
  } catch {
    return getLocalStorageList(STORAGE_KEY, INITIAL_RUTINAS);
  }
}

export async function registrarRutina(rutinaData) {
  try {
    const response = await AxiosAPI.post('/rutinas', rutinaData);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_RUTINAS);
    const nuevo = {
      ...rutinaData,
      id: Date.now(),
      duracion_min: Number(rutinaData.duracion_min) || 60,
      imagen: rutinaData.imagen || '/assets/rutina-diana.jpg',
    };
    list.unshift(nuevo);
    saveLocalStorageList(STORAGE_KEY, list);
    return nuevo;
  }
}

export async function actualizarRutina(id, rutinaData) {
  try {
    const response = await AxiosAPI.put(`/rutinas/${id}`, rutinaData);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_RUTINAS);
    const idx = list.findIndex((r) => String(r.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...rutinaData };
      saveLocalStorageList(STORAGE_KEY, list);
      return list[idx];
    }
    return rutinaData;
  }
}

export async function eliminarRutina(id) {
  try {
    const response = await AxiosAPI.delete(`/rutinas/${id}`);
    return response.data;
  } catch {
    let list = getLocalStorageList(STORAGE_KEY, INITIAL_RUTINAS);
    list = list.filter((r) => String(r.id) !== String(id));
    saveLocalStorageList(STORAGE_KEY, list);
    return { success: true };
  }
}
