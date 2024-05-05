const path = require('path')
const multer = require('multer')
const  S3Client = require('@aws-sdk/client-s3');
const PutObjectCommand = require('@aws-sdk/client-s3');
const S3 = require('@aws-sdk/client-s3') 

const bucketName = process.env.BUCKET_NAME
const region= process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY



// const s3 = new S3Client({
//     credentials: {
//         accessKey: accessKey,
//         secretAccessKey: secretAccessKey,
//     },
//     region: region
// });
// const params ={
//     Bucket: bucketName,
//     Key: req.file.originalname,
//     Body: req.file.buffer,
//     ContentType: req.file.mimetype,

// }
// const command = new PutObjectCommand (params)
// await s3.send(command)

//  diskStorage({
//         destination: function (req, file, cb) {
//           cb(null, path.resolve(__dirname, `..${path.sep}..${path.sep}`, `${path.sep}uploads`));
//         },
//     filename: function(req, file, cb) {
//         let ext = path.extname(file.originalname)
//         cb(null, Date.now() + ext)
//     },
   
// })

 const storage = multer.memoryStorage()
 
const upload = multer({
    storage : storage,
    fileFilter: function(req, file, callback) {
        if(
            file.mimetype == "image/png" || 
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
            ){
                callback(null,true)
            } else{
                console.log('only jpg, png & jpeg file is supported')
                callback(null, false)
            }
    },
    limits: {
        fileSize: 1024*1024*2
    }
})

module.exports = upload