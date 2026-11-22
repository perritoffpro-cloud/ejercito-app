import AxiosAPI from '../../utils/axiosConfig';
import { INITIAL_CADETES, getLocalStorageList, saveLocalStorageList } from '../../utils/mockData';
import defaultAvatar from '../../asset/cadete-salazar.jpg';

const STORAGE_KEY = 'cadetes_data';

export async function listarCadetes() {
  try {
    const response = await AxiosAPI.get('/cadetes');
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      saveLocalStorageList(STORAGE_KEY, response.data);
      return response.data;
    }
    return getLocalStorageList(STORAGE_KEY, INITIAL_CADETES);
  } catch {
    return getLocalStorageList(STORAGE_KEY, INITIAL_CADETES);
  }
}

export async function obtenerCadetePorId(id) {
  try {
    const response = await AxiosAPI.get(`/cadetes/${id}`);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_CADETES);
    return list.find((c) => String(c.id) === String(id)) || null;
  }
}

export async function registrarCadete(cadeteData) {
  try {
    const response = await AxiosAPI.post('/cadetes', cadeteData);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_CADETES);
    const nuevo = {
      ...cadeteData,
      id: Date.now(),
      fisico: Number(cadeteData.fisico) || 75,
      tactico: Number(cadeteData.tactico) || 70,
      disciplina: Number(cadeteData.disciplina) || 85,
      fecha_ingreso: cadeteData.fecha_ingreso || new Date().toISOString().split('T')[0],
      imagen: cadeteData.imagen || defaultAvatar,
    };
    list.unshift(nuevo);
    saveLocalStorageList(STORAGE_KEY, list);
    return nuevo;
  }
}

export async function actualizarCadete(id, cadeteData) {
  try {
    const response = await AxiosAPI.put(`/cadetes/${id}`, cadeteData);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_CADETES);
    const idx = list.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...cadeteData };
      saveLocalStorageList(STORAGE_KEY, list);
      return list[idx];
    }
    return cadeteData;
  }
}

export async function eliminarCadete(id) {
  try {
    const response = await AxiosAPI.delete(`/cadetes/${id}`);
    return response.data;
  } catch {
    let list = getLocalStorageList(STORAGE_KEY, INITIAL_CADETES);
    list = list.filter((c) => String(c.id) !== String(id));
    saveLocalStorageList(STORAGE_KEY, list);
    return { success: true };
  }
}
