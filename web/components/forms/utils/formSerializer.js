// for is an HTML dom node
const FormSerializer = (form) => {
  let data = {}
  for (let i in form.elements) {
    let key = form.elements[i].id
    let value = form.elements[i].value
    if (key === undefined || key === null || key === '') { continue }
    data[key] = value
  }

  return data
}

// const inputParsers = {
//   date (input) {
//     const [month, day, year] = input.split('/')
//     return `${year}-${month}-${day}`
//   },
//   number (input) {
//     return parseFloat(input)
//   }
// }

export default FormSerializer
