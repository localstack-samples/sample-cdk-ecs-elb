const http = require('http')

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({message: "Hi LocalStack!"}))
})

const PORT = 3000
const HOST = '0.0.0.0'

server.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}/`)
})
