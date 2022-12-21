const S3 = require('@aws-sdk/client-s3') 

const bucketName = process.env.BUCKET_NAME
const region= process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3({
    region,
    accessKey,
    secretAccessKey
})