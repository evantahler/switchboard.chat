const { api, Initializer } = require('actionhero')
const fs = require('fs')
const AWS = require('aws-sdk')

const unlinkAsync = async (p) => {
  return new Promise((resolve, reject) => {
    fs.unlink(p, (error) => {
      if (error) { return reject(error) }
      return resolve()
    })
  })
}

const readAsync = async (p) => {
  return new Promise((resolve, reject) => {
    fs.readFile(p, (error, data) => {
      if (error) { return reject(error) }
      return resolve(data)
    })
  })
}

const uploadAsync = async (params) => {
  return new Promise((resolve, reject) => {
    api.s3.client.upload(params, (error) => {
      if (error) { return reject(error) }
      return resolve()
    })
  })
}

module.exports = class S3Initializer extends Initializer {
  constructor () {
    super()
    this.name = 's3'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {
    api.s3 = {
      client: new AWS.S3(api.config.aws),

      uploadFile: async (remotePath, localPath, contentType, bucket = api.config.aws.bucket) => {
        const data = await readAsync(localPath)

        const params = {
          Bucket: bucket,
          Key: remotePath,
          ACL: 'public-read',
          Body: data,
          ContentType: contentType
        }

        await uploadAsync(params)
        await unlinkAsync(localPath)
        return `https://s3.amazonaws.com/${bucket}/${remotePath}`
      }
    }
  }
}
