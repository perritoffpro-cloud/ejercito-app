import AxiosAPI from '../../utils/axiosConfig';

export async function listarRutinas() {
  try {
    const response = await AxiosAPI.get('/rutinas');
    return response.data;
  } catch (error) {
    console.error('Error al listar rutinas:', error);
    throw error;
  }
}

export async function obtenerRutinaPorId(id) {
  try {
    const response = await AxiosAPI.get(`/rutinas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener rutina ${id}:`, error);
    throw error;
  }
}

export async function registrarRutina(rutinaData) {
  try {
    const response = await AxiosAPI.post('/rutinas', rutinaData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar rutina:', error);
    throw error;
  }
}

export async function actualizarRutina(id, rutinaData) {
  try {
    const response = await AxiosAPI.put(`/rutinas/${id}`, rutinaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar rutina ${id}:`, error);
    throw error;
  }
}

export async function eliminarRutina(id) {
  try {
    const response = await AxiosAPI.delete(`/rutinas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar rutina ${id}:`, error);
    throw error;
  }
}
