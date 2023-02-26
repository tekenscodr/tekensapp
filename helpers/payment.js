const https = require('https')

exports.init = (req, res) => {

}
exports.verify = ()=>{
    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/verify/:reference',
        method: 'GET',
        headers: {
          Authorization: 'Bearer sk_test_d4061fac60668a5522d7eddc0633749888de3b57'
        }
      }
      
      https.request(options, response => {
        let data = ''
      
        response.on('data', (chunk) => {
          data += chunk
        });
      
        response.on('end', () => {
          console.log(JSON.parse(data))
        })
      }).on('error', error => {
        console.error(error)
      })
} 