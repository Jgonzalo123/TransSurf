import { Validator } from './Sesion.js';

Validator();

busqueda();

function busqueda(){
    const url = new URL(window.location.href);
    const codOrigen = url.searchParams.get("codOrigen");
    const codDestino = url.searchParams.get("codDestino");
    const fechaIda = url.searchParams.get("fechaIda");
    const fechaVuelta = url.searchParams.get("fechaVuelta") || null;
    
    if (fechaVuelta == null) {
        busquedaIda(codOrigen,codDestino,fechaIda);
        rellenarDatosOrigenDestino(codOrigen, codDestino);
    } else {
        // busquedaIdaVuelta(codOrigen,codDestino,fechaIda, fechaVuelta);
    }
}

async function busquedaIda(codOrigen,codDestino,fechaIda) {
    await fetch('http://localhost:8080/api/programacion/'+codOrigen+'/'+codDestino+'/'+fechaIda, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(resp => {
        console.log(resp);
        if (resp.length != 0) {
            mostrarResultados(resp);
        }
    });
}

async function rellenarDatosOrigenDestino(codOrigen, codDestino) {
    const origin = document.querySelector(".col-origen");
    const destiny = document.querySelector(".col-destino");
    await fetch('http://localhost:8080/api/ciudad/'+codOrigen, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(resp => {
        origin.firstElementChild.innerText = resp.nombre;
        origin.children[1].firstElementChild.innerText = resp.nombre;
        origin.children[3].innerText = resp.descripcion;
    });

    await fetch('http://localhost:8080/api/ciudad/'+codDestino, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(resp => {
        destiny.firstElementChild.innerText = resp.nombre;
        destiny.children[1].firstElementChild.innerText = resp.nombre;
        destiny.children[3].innerText = resp.descripcion;
    });
}

function mostrarResultados(programaciones) {
    const results = document.querySelector("#result-search");
    let html = "";
    programaciones.forEach((item) => {
        html += `
        <div class="card container mb-4">
            <div class="card-header bg-white">
                <i class="fa-light fa-bus"></i> BUS ${item.unidad.modelo.nombre} <i class="fa-regular fa-stairs"></i> N° Pisos: ${item.unidad.numPisos}
            </div>
            <div class="card-body p-2">
                <p class="text-muted">${item.unidad.modelo.descripcion}</p>
                <div class="d-flex justify-content-between">
                    <div class="fw-bold fs-5">
                        <i class="fa-light fa-coin"></i>
                        <span>S/${(Math.round(item.costo * 100) / 100).toFixed(2)}</span>
                    </div>
                    <div class="text-center">
                        <i class="fa-solid fa-person-simple"></i>
                        ${item.unidad.numAsientos}
                        <p class="text-muted m-0">Asientos</p>
                    </div>
                </div>
            </div>
            <div class="card-footer bg-white">
                <div class="d-flex justify-content-between">
                    <span class="align-middle">
                        <i class="fa-light fa-calendar-days"></i>
                        ${item.fecha}
                    </span>
                    <span class="align-middle">
                        <i class="fa-light fa-clock"></i>
                        ${item.hora}
                    </span>
                    <div>
                        <button class="btn btn-success btn-showSeats" data-programacion="${item.idProgramacion}"><i class="fa-regular fa-eye"></i> Asientos</button>
                    </div>
                </div>
                <div class="row mt-3 d-none list-seating" id="list-seating-${item.idProgramacion}" data-open="false" data-modelo="${item.unidad.modelo.nombre}" data-programacion="${item.idProgramacion}" data-costo="${item.costo}" data-horario="${item.fecha +" - "+ item.hora}">
                    <div class="col-9 col-sm-6 col-lg-4">
                        <h3 class="fw-bolder text-center">Primer Piso</h3>
                        <div class="card">
                            <div class="row card-body gy-2 first-floor">
                            </div>
                        </div>
                    </div>
                    <div class="col-9 col-sm-6 col-lg-4 order-last order-lg-0">
                        <h3 class="fw-bolder text-center">Segundo Piso</h3>
                        <div class="card">
                            <div class="row card-body gy-2 second-floor">
                            </div>
                        </div>
                    </div>
                    <div class="col-3 col-sm text-sm-end">
                        <h6 class="fw-bold">Estados</h6>
                        <div>
                            <span class="badge bg-black">Disponibles</span>
                            <span class="badge bg-danger">No Disponibles</span>
                            <span class="badge bg-warning text-dark">Seleccionados</span>
                        </div>
                        <p class="text-primary my-2 fw-bold">SELECIONADO</p>
                        <p class="seats-selects fw-bold"></p>
                        <p class="text-primary my-2  fw-bold">TOTAL A PAGAR</p>
                        <p class="seats-total fw-bold"></p>
                        <div>
                            <a class="btn btn-success" href="./payment.html?codOrigen=${item.origen.idOrigen}&codDestino=${item.destino.idDestino}">Procesar</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    results.innerHTML = html;
    const btnsShow = document.querySelectorAll(".btn-showSeats");
    btnsShow.forEach((btn) => {
        btn.addEventListener('click',(e) => {
            const idProgramacion = e.target.dataset.programacion;
            localStorage.removeItem("asientos");
            if (!(document.querySelector("#list-seating-"+idProgramacion).dataset.open == "true")) {
                document.querySelectorAll(".list-seating").forEach((element) => {
                    document.querySelectorAll(".btn-showSeats").forEach(btn => {
                        btn.classList.remove("btn-danger");
                        btn.innerHTML = '<i class="fa-regular fa-eye"></i> Asientos';
                        btn.classList.add("btn-success");
                    })
                    element.classList.add("d-none");
                    element.dataset.open = "false";
                    document.querySelectorAll(".seats-selects").forEach((element) => element.innerText = "");
                    document.querySelectorAll(".seats-total").forEach((element) => element.innerText = "");
                });
                listarAsientos(idProgramacion, document.querySelector("#list-seating-"+idProgramacion));

                e.target.classList.remove("btn-success");
                e.target.innerHTML = '<i class="fa-regular fa-xmark"></i> Cerrar';
                e.target.classList.add("btn-danger");
                document.querySelector("#list-seating-"+idProgramacion).classList.remove("d-none");
                document.querySelector("#list-seating-"+idProgramacion).dataset.open = "true";
            } else {
                e.target.classList.remove("btn-danger");
                e.target.innerHTML = '<i class="fa-regular fa-eye"></i> Asientos';
                e.target.classList.add("btn-success");
                document.querySelector("#list-seating-"+idProgramacion).classList.add("d-none");
                document.querySelector("#list-seating-"+idProgramacion).dataset.open = "false";

                document.querySelectorAll(".seats-selects").forEach((element) => element.innerText = "");
                document.querySelectorAll(".seats-total").forEach((element) => element.innerText = "");
            }
            
        })
    });
}

async function listarAsientos(idProgramacion, divList) {
    await fetch('http://localhost:8080/api/asiento/'+idProgramacion, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(resp => {
        armarAsientos(resp, divList);
    });
}

function armarAsientos(asientos, divList) {
    let html1 = "";
    let html2 = "";
    const idProgramacion = divList.dataset.programacion;
    const costo = divList.dataset.costo;
    const horario = divList.dataset.horario;
    const modelo = divList.dataset.modelo;
    if (modelo == "Premium") {
        asientos.forEach((item, index) => {
            const estado = item.estado;
            if(index < 12) {
                if (index == 2 || index == 5 || index == 8 || index == 11) {
                    html1 += '<div class="col-3"></div>';
                }
                html1 += `
                <div class="col-3">
                    <div class="card text-center ${(estado == "Disponible")? 'border-dark': 'border-danger bg-danger'} seat-card" data-asiento="${item.idAsientoProg}" data-programacion="${idProgramacion}" data-available="${(estado == "Disponible")?"1":""}">
                        <div class="card-header p-0 ${(estado == "Disponible")? 'bg-dark': 'bg-danger'} text-white">${item.asiento.numAsiento}</div>
                        <div class="card-body p-0 fs-1"><i class="fa-regular fa-loveseat ${(estado == "Disponible")? '': 'text-white'}"></i></div>
                    </div>
                </div>
                `;
            } else {
                if (index == 14 || index == 17 || index == 22 || index == 25 || index == 28 || index == 31) {
                    html2 += '<div class="col-3"></div>';
                } else if (index == 20) {
                    html2 += '<div class="col-3"></div><i class="col-3 text-center fa-regular fa-stairs fs-1 my-auto"></i>';
                }
                html2 += `
                <div class="col-3">
                    <div class="card text-center ${(estado == "Disponible")? 'border-dark': 'border-danger bg-danger'} seat-card" data-asiento="${item.idAsientoProg}" data-programacion="${idProgramacion}" data-available="${(estado == "Disponible")?"1":""}">
                        <div class="card-header p-0 ${(estado == "Disponible")? 'bg-dark': 'bg-danger'} text-white">${item.asiento.numAsiento}</div>
                        <div class="card-body p-0 fs-1"><i class="fa-regular fa-loveseat ${(estado == "Disponible")? '': 'text-white'}"></i></div>
                    </div>
                </div>
                `;
            }
        });
    } else {
        asientos.forEach((item, index) => {
            const estado = item.estado;
            if(index < 12) {
                if (index == 2 || index == 5 || index == 8 || index == 11) {
                    html1 += '<div class="col-3"></div>';
                }
                html1 += `
                <div class="col-3">
                    <div class="card text-center ${(estado == "Disponible")? 'border-dark': 'border-danger bg-danger'} seat-card" data-asiento="${item.idAsientoProg}" data-programacion="${idProgramacion}" data-available="${(estado == "Disponible")?"1":""}">
                        <div class="card-header p-0 ${(estado == "Disponible")? 'bg-dark': 'bg-danger'} text-white">${item.asiento.numAsiento}</div>
                        <div class="card-body p-0 fs-1"><i class="fa-regular fa-loveseat ${(estado == "Disponible")? '': 'text-white'}"></i></div>
                    </div>
                </div>
                `;
            } else {
                if (index == 22) {
                    html2 += '<div class="col-3"></div><i class="col-3 text-center fa-regular fa-stairs fs-1 my-auto"></i>';
                }
                html2 += `
                <div class="col-3">
                    <div class="card text-center ${(estado == "Disponible")? 'border-dark': 'border-danger bg-danger'} seat-card" data-asiento="${item.idAsientoProg}" data-programacion="${idProgramacion}" data-available="${(estado == "Disponible")?"1":""}">
                        <div class="card-header p-0 ${(estado == "Disponible")? 'bg-dark': 'bg-danger'} text-white">${item.asiento.numAsiento}</div>
                        <div class="card-body p-0 fs-1"><i class="fa-regular fa-loveseat ${(estado == "Disponible")? '': 'text-white'}"></i></div>
                    </div>
                </div>
                `;
            }
        });
    }
    divList.children[0].children[1].firstElementChild.innerHTML = html1;
    divList.children[1].children[1].firstElementChild.innerHTML = html2;
    document.querySelectorAll(".seat-card").forEach((card) => {
        card.addEventListener('click',() => {
            const asientos = JSON.parse(localStorage.getItem('asientos')) || [];
            const idAsiento = card.dataset.asiento;
            const numAsiento = card.children[0].innerText;
            switch(card.dataset.available){
                case "1":
                    const asiento = {idAsiento,numAsiento,modelo,horario,costo};
                    asientos.push(asiento);
                    localStorage.setItem('asientos', JSON.stringify(asientos));
                    
                    seleccionarAsiento(card);
                    break;
                case "0":
                    const i = asientos.findIndex((item) => item.idAsiento === idAsiento);
                    asientos.splice(i,1);
                    localStorage.setItem('asientos', JSON.stringify(asientos));

                    deseleccionarAsiento(card);
                    break;
            }
            mostrarResumen(card.parentElement.parentElement.parentElement.parentElement.parentElement.children[2]);
        });
    });
}

function mostrarResumen(elemento) {    
    const asientos = JSON.parse(localStorage.getItem('asientos')) || [];
    const montos = asientos.map(i => parseFloat(i.costo));
    const sitios = asientos.map(i => i.numAsiento);
    const total = montos.reduce((i,j) => i+j,0);
    elemento.children[5].innerText = 'S/' + total;
    elemento.children[3].innerText = sitios.join(', ');
}

function seleccionarAsiento(asiento) {
    asiento.classList.remove("border-dark");
    asiento.children[0].classList.remove("bg-dark");
    asiento.children[0].classList.remove("text-white");
    asiento.classList.add("border-warning");
    asiento.classList.add("bg-warning");
    asiento.children[0].classList.add("text-dark");
    asiento.children[0].classList.add("bg-warning");
    asiento.dataset.available = "0";
}

function deseleccionarAsiento(asiento) {
    asiento.classList.remove("border-warning");
    asiento.classList.remove("bg-warning");
    asiento.children[0].classList.remove("text-dark");
    asiento.children[0].classList.remove("bg-warning");
    asiento.classList.add("border-dark");
    asiento.children[0].classList.add("bg-dark");
    asiento.children[0].classList.add("text-white");
    asiento.dataset.available = "1";
}