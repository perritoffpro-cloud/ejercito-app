import AxiosAPI from '../../utils/axiosConfig';

export async function loginUsuario(credenciales) {
  // Simulación o petición real
  return {
    id: 1,
    nombre: credenciales.email === 'oficial@ejercito.mil.pe' ? 'Oficial de Instrucción' : 'Comandante Gral. E.P.',
    rango: 'General de Brigada',
    rol: 'admin',
    unidad: 'Batallón de Infantería Blindada N.° 15',
  };
}

export async function subirImagen(base64Data) {
  const response = await AxiosAPI.post('/uploads', { data: base64Data });
  return response.data;
}
