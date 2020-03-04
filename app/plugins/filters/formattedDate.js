import Vue from 'vue'

Vue.filter('formattedDate', value => {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]
  const date = new Date(value)

  return `${date.getDate()} de ${
    months[date.getMonth()]
  } de ${date.getFullYear()}`
})
