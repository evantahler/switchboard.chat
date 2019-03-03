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

export default FormSerializer
