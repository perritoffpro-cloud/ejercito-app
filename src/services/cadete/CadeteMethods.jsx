import AxiosAPI from '../../utils/axiosConfig';

export async function listarCadetes() {
  try {
    const response = await AxiosAPI.get('/cadetes');
    return response.data;
  } catch (error) {
    console.error('Error al listar cadetes:', error);
    throw error;
  }
}

export async function obtenerCadetePorId(id) {
  try {
    const response = await AxiosAPI.get(`/cadetes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener cadete ${id}:`, error);
    throw error;
  }
}

export async function registrarCadete(cadeteData) {
  try {
    const response = await AxiosAPI.post('/cadetes', cadeteData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar cadete:', error);
    throw error;
  }
}

export async function actualizarCadete(id, cadeteData) {
  try {
    const response = await AxiosAPI.put(`/cadetes/${id}`, cadeteData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar cadete ${id}:`, error);
    throw error;
  }
}

export async function eliminarCadete(id) {
  try {
    const response = await AxiosAPI.delete(`/cadetes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar cadete ${id}:`, error);
    throw error;
  }
}
