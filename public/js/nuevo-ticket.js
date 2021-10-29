// Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
    console.log('Cliente: Conectado al servidor');
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    console.log('Cliente: Desconectado del servidor');
    btnCrear.disabled = true;
});

socket.on('ultimo-ticket', (ultimo) => {
    lblNuevoTicket.innerText = 'Ticket ' + ultimo;
});

btnCrear.addEventListener('click', () => {
    socket.emit('siguiente-ticket', null, (ticket) => {
        lblNuevoTicket.innerText = ticket;
        console.log('Cliente: Retroalimentación del servidor - ', ticket); // Retroalimentación desde el servidor, tercer parametro (ticket)
    });
});