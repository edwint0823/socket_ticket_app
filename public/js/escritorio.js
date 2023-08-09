// referencias html
const lblEscritorio = document.querySelector('h1')
const btnAtender = document.querySelector('button')
const lblTicket = document.querySelector('small')
const divAlerta = document.querySelector('.alert')
const lblPendientes = document.querySelector('#lblPendientes')

const searchParams = new URLSearchParams(window.location.search)

if (!searchParams.has('escritorio')){
    window.location = 'index.html'
    throw new Error('El escritorio es obligatorio')
}
const escritorio = searchParams.get('escritorio')
lblEscritorio.innerText = escritorio

divAlerta.style.display = 'none'

const socket = io();

socket.on('connect', () => {
    console.log('Conectado');
    btnAtender.disabled = false
});

socket.on('disconnect', () => {
    btnAtender.disabled = true
});

socket.on('tickets-pendientes', (cantidad) => {
    lblPendientes.innerText = cantidad
});

btnAtender.addEventListener( 'click', () => {
    socket.emit('atender-ticket', {escritorio}, ({ok, ticket, msg}) => {
        if(!ok){
            lblTicket.innerText = `Nadie.`
            divAlerta.style.display = ''
            return divAlerta.innerText = msg
        }
        lblTicket.innerText = `Ticket ${ticket.numero}`
    })
});

console.log('Escritorio HTML');