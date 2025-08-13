import moment from 'moment';

export const formatearFechaES = (fechaGMT) => {
  if (!fechaGMT) return '';

  try {
    // Parseamos como UTC explícitamente
    const fecha = moment.utc(fechaGMT);

    if (!fecha.isValid()) {
      // Si falla, intentamos con el formato de la base de datos
      const fechaAlt = moment.utc(fechaGMT, 'YYYY-MM-DD HH:mm:ss.SSS', true);
      return fechaAlt.isValid() ? fechaAlt.format('DD/MM/YYYY') : fechaGMT;
    }

    return fecha.format('DD/MM/YYYY');
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return fechaGMT;
  }
}

export const formatearNumero = (value, decimales = 0) => {
  if (value === null || value === "") return "";
  const numero = parseFloat(String(value).replace(",", "."));
  if (isNaN(numero) || numero === 0) return ""
  return numero.toFixed(decimales).replace(".", ",");
}