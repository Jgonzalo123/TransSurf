import {Cliente} from "./Cliente.js";

document.getElementById("tagRegister").addEventListener("click",() => {
    document.getElementById("formLogin").className = "modal-body d-none";
    document.getElementById("formRegister").className = "modal-body";
});

document.getElementById("tagInicio").addEventListener("click", () => {
    document.getElementById("formRegister").className = "modal-body d-none";
    document.getElementById("formLogin").className = "modal-body";
});

async function registrarCliente() {
    let cliente = new Cliente();
    cliente.nombre = document.getElementById("inputNombre").value;
    cliente.apellido = document.getElementById("inputApellidos").value;
    cliente.idDocumento = document.getElementById("selectDocumento").value;
    cliente.numDoc = document.getElementById("inputNumDoc").value;
    cliente.email = document.getElementById("inputRegEmail").value;
    cliente.password = document.getElementById("inputRegPassword").value;
    cliente.celular = document.getElementById("inputCelular").value;
    cliente.estado = "Activo";

    let nacimientoDate = new Date(document.getElementById("inputFechaNac").value);

    cliente.fechaNacimiento = nacimientoDate.setDate(nacimientoDate.getDate() + 1);

    fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    }).then(res => {
        if (res.status == 200) {
            alertify.notify("Registrado Correctamente",'success',2, () => {location.reload()});
        } else {
            let response = res.text();
            alertify.error(response);
        }
    })
    .catch(error => console.log("Error: ",error));
}

async function loginCliente() {
    const numDocOrEmail = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputPassword").value;

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({numDocOrEmail, password})
    }).then(res => res.json())
    .then(resp => {
        if (!resp?.mensaje) {
            localStorage.token = resp["tokenAcceso"];
            localStorage.numDocOrEmail = numDocOrEmail;
            location.reload();
        } else {
            alertify.error('Credenciales Invalidas.');
        }
    })
    .catch(error => console.log("Error: ",error));
}

document.getElementById("btn-register").addEventListener("click",() => {
    let pass1 = document.getElementById("inputRegPassword").value;
    let pass2 = document.getElementById("inputRegRePassword").value;

    if(pass1 == pass2) {
        registrarCliente();
    } else {
        alertify.error('Contraseñas no coinciden.');
    }
});

document.getElementById("btn-login").addEventListener("click",() => {
    loginCliente();
});

document.querySelector('#btnLogout').addEventListener('click',() => {
    localStorage.removeItem("token");
    localStorage.removeItem("numDocOrEmail");
    location.reload();
});