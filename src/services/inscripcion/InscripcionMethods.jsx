import AxiosAPI from '../../utils/axiosConfig';
import { INITIAL_INSCRIPCIONES, getLocalStorageList, saveLocalStorageList } from '../../utils/mockData';

const STORAGE_KEY = 'inscripciones_data';

export async function listarInscripciones() {
  try {
    const response = await AxiosAPI.get('/inscripciones');
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      saveLocalStorageList(STORAGE_KEY, response.data);
      return response.data;
    }
    return getLocalStorageList(STORAGE_KEY, INITIAL_INSCRIPCIONES);
  } catch {
    return getLocalStorageList(STORAGE_KEY, INITIAL_INSCRIPCIONES);
  }
}

export async function registrarInscripcion(inscripcionData) {
  try {
    const response = await AxiosAPI.post('/inscripciones', inscripcionData);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_INSCRIPCIONES);
    const nuevo = {
      ...inscripcionData,
      id: Date.now(),
      estado: inscripcionData.estado || 'Pendiente',
      eval_medica: inscripcionData.eval_medica || 'Pendiente',
      eval_fisica: Number(inscripcionData.eval_fisica) || 0,
      talla_cm: Number(inscripcionData.talla_cm) || 170,
      peso_kg: Number(inscripcionData.peso_kg) || 70,
      imagen: inscripcionData.imagen || '/assets/postulante-aguirre.jpg',
    };
    list.unshift(nuevo);
    saveLocalStorageList(STORAGE_KEY, list);
    return nuevo;
  }
}

export async function actualizarInscripcion(id, inscripcionData) {
  try {
    const response = await AxiosAPI.put(`/inscripciones/${id}`, inscripcionData);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_INSCRIPCIONES);
    const idx = list.findIndex((i) => String(i.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...inscripcionData };
      saveLocalStorageList(STORAGE_KEY, list);
      return list[idx];
    }
    return inscripcionData;
  }
}

export async function aprobarInscripcion(id) {
  try {
    const response = await AxiosAPI.post(`/inscripciones/${id}/aprobar`);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_INSCRIPCIONES);
    const idx = list.findIndex((i) => String(i.id) === String(id));
    if (idx !== -1) {
      list[idx].estado = 'Aprobado';
      list[idx].eval_medica = 'Apto';
      saveLocalStorageList(STORAGE_KEY, list);
    }
    return { success: true };
  }
}

export async function rechazarInscripcion(id) {
  try {
    const response = await AxiosAPI.post(`/inscripciones/${id}/rechazar`);
    return response.data;
  } catch {
    const list = getLocalStorageList(STORAGE_KEY, INITIAL_INSCRIPCIONES);
    const idx = list.findIndex((i) => String(i.id) === String(id));
    if (idx !== -1) {
      list[idx].estado = 'Rechazado';
      list[idx].eval_medica = 'No apto';
      saveLocalStorageList(STORAGE_KEY, list);
    }
    return { success: true };
  }
}

export async function eliminarInscripcion(id) {
  try {
    const response = await AxiosAPI.delete(`/inscripciones/${id}`);
    return response.data;
  } catch {
    let list = getLocalStorageList(STORAGE_KEY, INITIAL_INSCRIPCIONES);
    list = list.filter((i) => String(i.id) !== String(id));
    saveLocalStorageList(STORAGE_KEY, list);
    return { success: true };
  }
}
