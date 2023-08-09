const TicketControl = require("../models/ticket-control");
const ticketControl = new TicketControl
const socketController = (socket) => {
    console.log('Cliente conectado', socket.id)
    // socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => {
        console.log('cliente desconectado')
    });

    socket.emit('ultimo-ticket', ticketControl.ultimo)
    socket.emit('estado-actual', ticketControl.ultimos4)
    socket.emit('tickets-pendientes', ticketControl.tickets.length)

    socket.on('siguiente-ticket', (payload, callback) => {
        const siguiente = ticketControl.siguiente()
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
        callback(siguiente)
    });

    socket.on('atender-ticket', ({escritorio}, callback) => {
        if(!escritorio){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        }
        const ticket = ticketControl.atenderTicket(escritorio)

        socket.broadcast.emit('estado-actual', ticketControl.ultimos4)
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
        socket.emit('tickets-pendientes', ticketControl.tickets.length)

        if(!ticket){
            return callback({
                ok: false,
                msg: 'Ya no hay tickets'
            })
        }
        return callback({
            ok: true,
            ticket
        })
    });
}

module.exports = {
    socketController
}