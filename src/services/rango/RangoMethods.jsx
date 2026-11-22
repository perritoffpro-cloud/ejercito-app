import AxiosAPI from '../../utils/axiosConfig';

export async function listarRangos() {
  try {
    const response = await AxiosAPI.get('/rangos');
    return response.data;
  } catch (error) {
    console.error('Error al listar rangos:', error);
    throw error;
  }
}
