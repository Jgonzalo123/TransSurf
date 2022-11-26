import { Validator } from './Sesion.js';

Validator();

busqueda();
generarDataAsientos();
generarFormulario();

function busqueda(){
    const url = new URL(window.location.href);
    const codOrigen = url.searchParams.get("codOrigen");
    const codDestino = url.searchParams.get("codDestino");

    rellenarDatosOrigenDestino(codOrigen, codDestino);
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

function generarDataAsientos() {
    const precioSpan = document.querySelector("#spanCosto"); 
    const asientosSpan = document.querySelector("#spanAsientos"); 
    const modeloSpan = document.querySelector("#spanModelo"); 
    const horarioP = document.querySelector("#pHorario");

    const asientos = JSON.parse(localStorage.getItem('asientos')) || [];
    const montos = asientos.map(i => parseFloat(i.costo));
    const sitios = asientos.map(i => i.numAsiento);
    const total = montos.reduce((i,j) => i+j,0);

    precioSpan.innerText = "S/"+total;
    asientosSpan.innerText = sitios.join(', ');
    modeloSpan.innerText = "BUS "+asientos[0].modelo;
    horarioP.innerText = asientos[0].horario;
}

function generarFormulario() {
    const asientos = JSON.parse(localStorage.getItem('asientos')) || [];
    let html = "";
    asientos.forEach((asiento, index) => {
        html += `
        <p class="text-primary border-bottom m-0 py-2 border-2 border-dark">PASAJERO ${index+1} <span class="badge text-dark bg-warning">Asiento ${asiento.numAsiento}</span></p>
        <form class="my-1 row g-2 pb-2 border-bottom border-2 border-success formsInfo">
            <div class="col-md-6">
                <div class="form-floating">
                    <select class="form-select" name="sTipoDoc" required>
                        <option value="1">DNI</option>
                        <option value="2">CE</option>
                    </select>
                    <label for="sTipoDoc">Tipo de Documento</label> 
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-floating">
                    <input type="tel" class="form-control" name="iNumDoc" placeholder="N° Documento" required>
                    <label for="iNumDoc">N° Documento</label>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-floating">
                    <input type="text" class="form-control" name="iNombre" placeholder="Nombres" readonly required>
                    <label for="iNombre">Nombres</label>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-floating">
                    <input type="text" class="form-control" name="iApellidos" placeholder="Apellidos" readonly required>
                    <label for="iApellidos">Apellidos</label>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-floating">
                    <input type="date" class="form-control" name="iFecha" placeholder="Fecha de Nacimiento" readonly required>
                    <label for="iFecha">Fecha de Nacimiento</label>
                </div>
            </div>
            <div class="col-12">
                <p class="text-primary m-0">DATOS PARA CONTACTO</p>
            </div>
            <div class="col-md-6">
                <div class="form-floating">
                    <input type="tel" class="form-control" name="iCelular" placeholder="N° Celular" readonly required>
                    <label for="iCelular">N° Celular</label>
                </div>
            </div>
            <div class="col-md">
                <div class="form-floating">
                    <input type="email" class="form-control" name="iCorreo" placeholder="Correo Electronico" readonly required>
                    <label for="iCorreo">Correo Electronico</label>
                </div>
            </div>
        </form>
        `;
    });
    document.querySelector("#dForms").innerHTML = html;
}

document.querySelectorAll('input[name="iNumDoc"]').forEach((input) => {
    input.addEventListener('blur', e => {
        const idDocumento = e.target.parentElement.parentElement.parentElement.children[0].children[0].children[0].value;
        const numDoc = e.target.value;
        const form = e.target.parentElement.parentElement.parentElement;
        buscarCliente(idDocumento,numDoc,form);
    });
});

async function buscarCliente(idDocumento,numDoc,form) {
    let status;
    await fetch('http://localhost:8080/api/usuario/'+idDocumento+'/'+numDoc, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        status = res.status;
        return res.json();
    })
    .then(resp => {
        if(status == 200) {
            form.dataset.register = "1";
            form.children[2].children[0].children[0].value = resp.nombre;
            form.children[2].children[0].children[0].readOnly = false;
            form.children[3].children[0].children[0].value = resp.apellido;
            form.children[3].children[0].children[0].readOnly = false;
            form.children[4].children[0].children[0].value = resp.fechaNacimiento;
            form.children[4].children[0].children[0].readOnly = false;
            form.children[6].children[0].children[0].value = resp.celular;
            form.children[6].children[0].children[0].readOnly = false;
            form.children[7].children[0].children[0].value = resp.email;
            form.children[7].children[0].children[0].readOnly = false;
        } else {
            form.dataset.register = "";
            form.children[2].children[0].children[0].value = "";
            form.children[2].children[0].children[0].readOnly = false;
            form.children[3].children[0].children[0].value = "";
            form.children[3].children[0].children[0].readOnly = false;
            form.children[4].children[0].children[0].value = "";
            form.children[4].children[0].children[0].readOnly = false;
            form.children[6].children[0].children[0].value = "";
            form.children[6].children[0].children[0].readOnly = false;
            form.children[7].children[0].children[0].value = "";
            form.children[7].children[0].children[0].readOnly = false;
        }
    });
}

document.querySelector("#paymentForm").addEventListener("submit",(e) => {
    e.preventDefault();
    const asientos = JSON.parse(localStorage.getItem('asientos')) || [];
    document.querySelectorAll(".formsInfo").forEach((form,index) => {
        const register = (form.dataset.register)? true: false;
        const data = new FormData(form);
        const idDocumento = data.get("sTipoDoc");
        const numDoc = data.get("iNumDoc");
        const nombre = data.get("iNombre");
        const apellido = data.get("iApellidos");
        let fechaNacimiento = new Date(data.get("iFecha"));
        fechaNacimiento = fechaNacimiento.setDate(fechaNacimiento.getDate() + 1);
        const email = data.get("iCorreo");
        const celular = data.get("iCelular");

        const cliente = (register)? {numDoc,nombre,apellido,fechaNacimiento,celular}
                                    : {numDoc,nombre,apellido,fechaNacimiento,email,celular};
        generarReserva(idDocumento,cliente, asientos[index].idAsiento,register);
    })
})

async function generarReserva(idDocumento,cliente,idAsientoProg,register){
    let status;
    await fetch('http://localhost:8080/api/reserva/'+idAsientoProg+'/'+register+'/'+idDocumento, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    }).then(res => res.json)
    .then(resp => {
        location.href = "./success.html";
    });
}