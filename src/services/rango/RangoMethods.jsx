import AxiosAPI from '../../utils/axiosConfig';
import { INITIAL_RANGOS } from '../../utils/mockData';

export async function listarRangos() {
  try {
    const response = await AxiosAPI.get('/rangos');
    return response.data || INITIAL_RANGOS;
  } catch {
    return INITIAL_RANGOS;
  }
}
