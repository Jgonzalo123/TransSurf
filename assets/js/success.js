import { getReservaByAsiento } from './reserva.js';

generarComprobantes();

function generarComprobantes() {
    const asientos = JSON.parse(localStorage.getItem('asientos')) || [];

    let html = "";
    asientos.forEach((asiento) => {
        html += `
            <div><a class="btn btn-success px-5 btnReserve" data-asiento="${asiento.idAsiento}">Asiento ${asiento.numAsiento}</a></div>
        `;
    });
    localStorage.removeItem("asientos");

    document.querySelector("#dComprobantes").innerHTML = html;

    document.querySelectorAll(".btnReserve").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const idReserva = e.target.dataset.asiento;

            getReservaByAsiento(idReserva);
        });
    });
}