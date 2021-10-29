const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    console.log('Servidor: Cliente conectado - ', socket.id);

    socket.on('disconnect', () => {
        console.log('Servidor: Cliente desconectado - ', socket.id);
    });

    // Cuando un cliente (socket) se conecta
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('siguiente-ticket', (payload, callback) => {

        const siguiente = ticketControl.siguiente();
        callback(siguiente);

        // Notificar que hay un nuevo ticket pendiente de asignar
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {

        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        // Notificar a todos el cambio en los ultimos4
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);

        // Notificar cambio en el cliente que emitió la llamada
        socket.emit('tickets-pendientes', ticketControl.tickets.length);

        // Notificar a todos
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        if (!ticket) {
            callback({
                ok: false,
                msg: 'No hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }

    });

}

module.exports = {
    socketController
}