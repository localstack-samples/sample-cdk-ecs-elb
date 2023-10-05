const axios = require('axios');
const { expect } = require('chai');
const fs = require('fs');

describe('User API', function() {
    it('should return user details for ID 1', async function() {
        // Read and parse the config.json file
        const config = JSON.parse(fs.readFileSync('../iac/awscdk/output.json', 'utf-8'));

        // Make API call
        const response = await axios.get('http://' + config.RepoStack.ServicesLB);

        // Assert status code
        expect(response.status).to.equal(200);

        // Assert the body
        expect(response.data).to.be.an('object');
        expect(response.data).to.have.property('message', "Hello, World!");
        expect(response.data.message).to.be.a('string');
    });
});
