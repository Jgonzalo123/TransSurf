let cliente;
$(document).ready(function() {
    if(localStorage.token && localStorage.numDocOrEmail) {
        const user = validarSesion();
        if (user) {
            cliente = user;
            document.querySelector(".nav-item-login").classList.add("d-none");
            document.querySelector(".nav-item-cuenta").classList.remove("d-none");
        } else {
            document.querySelector(".nav-item-cuenta").classList.add("d-none");
            document.querySelector(".nav-item-login").classList.remove("d-none");
        }
    } else {
        document.querySelector(".nav-item-cuenta").classList.add("d-none");
        document.querySelector(".nav-item-login").classList.remove("d-none");
    }
    
});

let fecha_inicio = document.getElementById('f_inicio');
let fecha_fin = document.getElementById('f_fin');

function setDateInput(e, hoy) {
    e.type = 'date';
    var fecha = new Date();
    if (hoy) {
        e.min = fecha.toISOString().split('T')[0];
        e.value = fecha.toISOString().split('T')[0];
    } else {
        fecha = new Date(fecha_inicio.value);
        fecha.setDate(fecha.getDate() + 1);
        e.min = fecha.toISOString().split('T')[0];
    }
}

$('.owl-carousel').owlCarousel({
    margin:45,
    nav:false,
    rewind:true,
    autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
    responsive:{
        0:{
            items:1
        },
        450:{
            items:2
        },
        750:{
            items:3
        },
        1000:{
            items:4
        }
    }
})

document.getElementById("tagRegister").addEventListener("click",() => {
    document.getElementById("formLogin").className = "modal-body d-none";
    document.getElementById("formRegister").className = "modal-body";
});

document.getElementById("tagInicio").addEventListener("click", () => {
    document.getElementById("formRegister").className = "modal-body d-none";
    document.getElementById("formLogin").className = "modal-body";
});

class Cliente {idDocumento; numDoc; nombre; apellido; fechaNacimiento; email; password; celular; estado;}
class Login {numDocOrEmail;password}

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

    const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
    if (response.status == 200) {
        alertify.notify("Registrado Correctamente",'success',2, () => {location.reload()});        
    } else {
        let content = await response.text();
        alertify.error(content);
    }
    
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

async function loginCliente() {
    let login = new Login();
    login.numDocOrEmail = document.getElementById("inputEmail").value;
    login.password = document.getElementById("inputPassword").value;

    const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    });
    if (response.status == 200) {
        let content = await response.json();
        localStorage.token = content["tokenAcceso"];
        localStorage.numDocOrEmail = login.numDocOrEmail;
        location.reload();
    } else {
        alertify.error('Credenciales Invalidas.');
    }
}

document.getElementById("btn-login").addEventListener("click",() => {
    loginCliente();
});

async function validarSesion() {
    const response = await fetch('http://localhost:8080/api/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + localStorage.token
        },
        body: localStorage.numDocOrEmail
    });
    if (response.status == 200) {
        let content = await response.json();
        return content;
    } else {
        localStorage.clear();
        return false;
    }
}