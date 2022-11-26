import { Validator } from './Sesion.js';
import { Cliente } from './Cliente.js';
import { listarReservas } from './reserva.js';

const clienteUser = await Validator();

if (!clienteUser) {
    location.href = "../index.html";
}

const opc = document.querySelectorAll(".list-group-item-action");
const docs = [{id:1,documento:"DNI"},{id:2,documento:"CE"}];

opc.forEach((option) => {
    option.addEventListener('click',(e) => {
        opc[0].classList.remove("active");
        opc[1].classList.remove("active");
        e.target.classList.add("active");
        if (e.target.dataset.opc == "reservas") {
            document.querySelector(".col-account").classList.add("d-none");
            document.querySelector(".col-bookings").classList.remove("d-none");
            listarReservas(clienteUser.idUsuario);
        } else {
            document.querySelector(".col-bookings").classList.add("d-none");
            document.querySelector(".col-account").classList.remove("d-none");
        }
    });
});

rellenarDatos(clienteUser);

function rellenarDatos(cliente) {
    document.querySelector("#iNombres").value = cliente.nombre;
    document.querySelector("#iApellidos").value = cliente.apellido;
    const sdoc = document.querySelector("#sDocumento");
    docs.forEach((doc) => {
        let option = document.createElement("option");
        option.value = doc.id;
        option.text = doc.documento;
        if (cliente.documento.idDocumento == doc.id) {
            option.selected = true;
        }
        sdoc.add(option);
    });
    document.querySelector("#iNumDoc").value = cliente.numDoc;
    document.querySelector("#iEmail").value = cliente.email;
    document.querySelector("#iCelular").value = cliente.celular;
    document.querySelector("#iFecha").value = cliente.fechaNacimiento;
    document.querySelector("#spanNombre").innerText = cliente.nombre;
}

document.querySelector("#btnCuenta").addEventListener("click",async() => {
    let cliente = new Cliente();
    cliente.nombre = document.querySelector("#iNombres").value;
    cliente.apellido = document.querySelector("#iApellidos").value;
    cliente.numDoc = document.querySelector("#iNumDoc").value;
    cliente.celular = document.querySelector("#iCelular").value;
    let nacimientoDate = new Date(document.querySelector("#iFecha").value);
    cliente.fechaNacimiento = nacimientoDate.setDate(nacimientoDate.getDate() + 1);

    let idUsuario = clienteUser.idUsuario;
    let doc = document.querySelector("#sDocumento").value;

    await fetch('http://localhost:8080/api/usuario/client/'+doc+"/"+idUsuario, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
            body: JSON.stringify(cliente)
    }).then((res) => {
        if (res.status == 200) {
            location.reload();
        } else {
            alertify.error(res.text());
        }
    })
    .catch(error => console.log("Error: ",error));
});

document.querySelector("#btnPassword").addEventListener("click",async() => {
    let cliente = new Cliente();
    cliente.password = document.querySelector("#iNewPassword").value;

    if (cliente.password !== document.querySelector("#iReNewPassword").value) {
        alertify.error("La contraseñas no coinciden");
        return;
    }

    const idUsuario = clienteUser.idUsuario;
    const actualPassword = document.querySelector("#iPassword").value;
    await fetch('http://localhost:8080/api/usuario/'+actualPassword+"/"+idUsuario, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
            body: JSON.stringify(cliente)
    }).then(res => res.json())
    .then((resp) => {
        if (!resp?.mensaje) {
            location.reload();
        } else {
            alertify.error(resp.mensaje);
        }
    })
    .catch(error => console.log("Error: ",error));
});

document.querySelector('#btnLogout').addEventListener('click',() => {
    localStorage.clear();
    location.reload();
});
