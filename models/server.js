require('dotenv').config()
const express = require("express");
const cors = require("cors")
const {socketController} = require("../sockets/controller");

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT || 8080
        this.server = require('http').createServer(this.app)
        this.io = require('socket.io')(this.server)
        //middlewares
        this.middlewares()
        this.routes()
        this.sockets()
    }
    middlewares() {
        this.app.use(cors())
        this.app.use(express.static('public'))
    }

    sockets(){
        this.io.on('connection',socketController);
    }
    routes() {
        // this.app.use('/api/usuarios', require('../routes/usuarios.router'))
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`app listening at http://localhost:${this.port}`)
        })
    }
}

module.exports = Server;