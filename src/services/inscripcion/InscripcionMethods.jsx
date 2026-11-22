import AxiosAPI from '../../utils/axiosConfig';

export async function listarInscripciones() {
  try {
    const response = await AxiosAPI.get('/inscripciones');
    return response.data;
  } catch (error) {
    console.error('Error al listar inscripciones:', error);
    throw error;
  }
}

export async function obtenerInscripcionPorId(id) {
  try {
    const response = await AxiosAPI.get(`/inscripciones/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener inscripción ${id}:`, error);
    throw error;
  }
}

export async function registrarInscripcion(inscripcionData) {
  try {
    const response = await AxiosAPI.post('/inscripciones', inscripcionData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar inscripción:', error);
    throw error;
  }
}

export async function actualizarInscripcion(id, inscripcionData) {
  try {
    const response = await AxiosAPI.put(`/inscripciones/${id}`, inscripcionData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar inscripción ${id}:`, error);
    throw error;
  }
}

export async function eliminarInscripcion(id) {
  try {
    const response = await AxiosAPI.delete(`/inscripciones/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar inscripción ${id}:`, error);
    throw error;
  }
}

export async function aprobarInscripcion(id) {
  try {
    const response = await AxiosAPI.post(`/inscripciones/${id}/aprobar`);
    return response.data;
  } catch (error) {
    console.error(`Error al aprobar inscripción ${id}:`, error);
    throw error;
  }
}

export async function rechazarInscripcion(id) {
  try {
    const response = await AxiosAPI.post(`/inscripciones/${id}/rechazar`);
    return response.data;
  } catch (error) {
    console.error(`Error al rechazar inscripción ${id}:`, error);
    throw error;
  }
}
