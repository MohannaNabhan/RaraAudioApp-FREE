// Hook personalizado para cortar texto
// t = texto, s = inicio, l = longitud, suffix = sufijo
export default function cutText({ t, s = 0, l, suffix = '...' }) {
  try {
    return t.substring(s, l) + (t.length > l ? suffix : '')
  } catch (error) {
    return t
  }
}
