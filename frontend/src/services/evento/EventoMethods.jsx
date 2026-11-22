import AxiosAPI from '../../utils/axiosConfig';

export async function listarEventos() {
  try {
    const response = await AxiosAPI.get('/eventos');
    return response.data;
  } catch (error) {
    console.error('Error al listar eventos:', error);
    throw error;
  }
}

export async function obtenerEventoPorId(id) {
  try {
    const response = await AxiosAPI.get(`/eventos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener evento ${id}:`, error);
    throw error;
  }
}

export async function registrarEvento(eventoData) {
  try {
    const response = await AxiosAPI.post('/eventos', eventoData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar evento:', error);
    throw error;
  }
}

export async function actualizarEvento(id, eventoData) {
  try {
    const response = await AxiosAPI.put(`/eventos/${id}`, eventoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar evento ${id}:`, error);
    throw error;
  }
}

export async function eliminarEvento(id) {
  try {
    const response = await AxiosAPI.delete(`/eventos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar evento ${id}:`, error);
    throw error;
  }
}
