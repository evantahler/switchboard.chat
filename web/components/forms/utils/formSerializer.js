// for is an HTML dom node
const FormSerializer = (form) => {
  const data = {}
  for (const i in form.elements) {
    const key = form.elements[i].id
    const value = form.elements[i].value
    if (key === undefined || key === null || key === '') { continue }
    data[key] = value
  }

  return data
}

export default FormSerializer
