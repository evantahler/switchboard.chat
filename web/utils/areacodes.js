import * as AreaCodeLib from 'areacodes'

class AreaCodes {
  get () {
    return new Promise((resolve, reject) => {
      const areaCodesBuilder = new AreaCodeLib()
      areaCodesBuilder.getAll((error, data) => {
        if (error) { return reject(error) }
        return resolve(Object.keys(data))
      })
    })
  }
}

export default AreaCodes
