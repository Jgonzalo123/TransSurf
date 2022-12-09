let estados = ['<span class="badge bg-info text-dark">Disponible</span>',
                    '<span class="badge bg-success text-white">En Curso</span>',
                    '<span class="badge bg-warning text-dark">Finalizado</span>'];

export async function listarReservas(idUsuario) {
    await fetch('http://localhost:8080/api/reserva/'+idUsuario, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
    }).then(res => res.json())
    .then(resp => {
        let html = "";
        resp.forEach((item) => {
            const asientoProgramacion = item.asientoProgramacion;
            const programacion = asientoProgramacion.programacion;
            const origen = programacion.origen;
            const destino = programacion.destino;
            html += `
            <tr>
                <th scope="row">${programacion.fecha}</th>
                <td>${programacion.hora}</td>
                <td>${origen.ciudad.nombre} - ${destino.ciudad.nombre}</td>
                <td>${asientoProgramacion.asiento.numAsiento}</td>
                <td>S/${programacion.costo}</td>
                <td><a class="btn btn-success py-0 btn-genPDF" href="#" data-reserva="${item.idReserva}">Generar</a></td>
                <td>${(programacion.estado == "Activo")? estados[0]: (programacion.estado == "En Curso")? estados[1]: estados[2]}</td>
            </tr>
            `;
        });

        document.querySelector("#listReservas").innerHTML = html;
    });

    document.querySelectorAll(".btn-genPDF").forEach((btn) => {
        btn.addEventListener('click',(e) => {
            const idReserva = e.target.dataset.reserva;

            getReserva(idReserva);
        });
    });
}

async function getReserva(idReserva) {
    await fetch('http://localhost:8080/api/reserva/getReserve?idReserva='+idReserva, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
    }).then(res => res.json())
    .then(resp => openModal(resp));
}

export async function getReservaByAsiento(idAsientoProg) {
    await fetch('http://localhost:8080/api/reserva/getReserveByAsientoProg?idAsientoProg='+idAsientoProg, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
    }).then(res => res.json())
    .then(resp => openModal(resp));
}

function openModal(reserve) {
    const asientoProgramacion = reserve.asientoProgramacion;
    const usuario = reserve.usuario;
    const programacion = asientoProgramacion.programacion;
    const origen = programacion.origen;
    const destino = programacion.destino;

    const html = `
    <div class="modal fade" id="modalReserve" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content p-3">
                <div class="text-center mb-4">
                    <img src="../assets/img/log.png" />
                </div>
                <div>
                    <p class="fw-bold">¡Buen Dia estimado pasajero!</p>
                    <p class="mb-5">Su compra online ha sido exitosa, dirijase a nuestras terminales, con su DNI</p>
                    <div class="row px-2">
                        <div class="col">
                            <div>
                                <p class="m-0">Ter. Origen</p>
                                <p class="fw-bold">${origen.ciudad.nombre}</p>
                            </div>
                            <div>
                                <p class="m-0">Ter. Destino</p>
                                <p class="fw-bold">${destino.ciudad.nombre}</p>
                            </div>
                        </div>
                        <div class="col">
                            <div>
                                <p class="m-0">N° Asiento</p>
                                <p class="fw-bold fs-2">${asientoProgramacion.asiento.numAsiento}</p>
                            </div>
                            <div>
                                <p class="m-0">Total: <span class="fw-bold">S/${(programacion.costo).toFixed(2)}</span></p>
                            </div>
                        </div>
                    </div>
                    <p class="mb-1">Pasajero(a)</p>
                    <h5 class="text-uppercase fw-bold mb-5">${usuario.nombre + ", " + usuario.apellido}</h5>
                    <div class="mb-5">
                        <table class="w-100">
                            <tbody>
                                <tr>
                                    <td>Fecha salida</td>
                                    <td>Hora salida</td>
                                    <td>N° Asiento</td>
                                </tr>
                                <tr class="fw-bold">
                                    <td>${programacion.fecha}</td>
                                    <td>${programacion.hora}</td>
                                    <td>${asientoProgramacion.asiento.numAsiento}</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>Fecha OP</td>
                                    <td>Hora OP</td>
                                </tr>
                                <tr class="fw-bold">
                                    <td>S/${(programacion.costo).toFixed(2)}</td>
                                    <td>${reserve.fecha}</td>
                                    <td>${reserve.hora}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button class="btn btn-success w-100 download">Descargar Comprobante</button>
                </div>
            </div>
        </div>
    </div>
    `;
    document.getElementById("modal-fact").innerHTML = html;
    const modal = new bootstrap.Modal('#modalReserve', {keyboard: false});
    modal.show();

    document.querySelector(".download").addEventListener("click",() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p','pt','dl');
        const margin = 5;
        const scale = (doc.internal.pageSize.width - margin * 2)/document.querySelector(".modal-content").scrollWidth;
        doc.html(document.querySelector(".modal-content"), {
            x: margin,
            y: margin,
            html2canvas: {
                scale: scale,
            },
            callback: function(doc){
                doc.output('dataurlnewwindow', {filename: 'Comprobante'+reserve.idReserva+'.pdf'});
            }
        });
    });
}

