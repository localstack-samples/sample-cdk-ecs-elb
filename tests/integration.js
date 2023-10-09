const axios = require('axios')
const {expect} = require('chai')
const fs = require('fs')

describe('User API', function () {
    it('should hit the ALB and assert the results', async function () {
        // Read and parse the config.json file
        const config = JSON.parse(fs.readFileSync('../iac/awscdk/output.json', 'utf-8'))
        const local = process.env.LOCALSTACK
        let hostname = 'serviceslb'
        if (local == "1") {
            hostname = 'localstack' + hostname
        }

        console.log('config: ', config)
        // Make API call
        const response = await axios.get('http://' + config.RepoStack[hostname])

        // Assert status code
        expect(response.status).to.equal(200)

        // Assert the body
        expect(response.data).to.be.an('object')
        expect(response.data).to.have.property('message', "Hello, Welcome to Localstack!")
        expect(response.data.message).to.be.a('string')
    })
})
