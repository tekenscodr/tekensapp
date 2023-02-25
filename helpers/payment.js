const https = require('https')

exports.init = (req, res) => {
    const params = JSON.stringify({
        "email": "customer@email.com",
        "amount": "20000"
      })
      
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
          Authorization: 'Bearer sk_test_d4061fac60668a5522d7eddc0633749888de3b57',
          'Content-Type': 'application/json'
        }
      }
      
      const request = https.request(options, response => {
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
      
      request.write(params)
      request.end()
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