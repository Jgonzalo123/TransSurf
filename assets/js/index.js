import { Cliente } from './Cliente.js';
import { Validator } from './Sesion.js';

let fecha_inicio = document.querySelector('#f_inicio');
let fecha_fin = document.querySelector('#f_fin');

Validator();

fecha_inicio.addEventListener('focus',() => {setDateInput(true)});
fecha_fin.addEventListener('focus',() => {setDateInput(false)});


function setDateInput(hoy) {
    var fecha = new Date();
    if (hoy) {
        fecha_inicio.min = fecha.toISOString().split('T')[0];
        fecha_inicio.value = fecha.toISOString().split('T')[0];
    } else {
        fecha = new Date(fecha_inicio.value);
        fecha.setDate(fecha.getDate() + 1);
        fecha_fin.min = fecha.toISOString().split('T')[0];
    }
}

cargarCiudades();

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
        665:{
            items:2
        },
        900:{
            items:3
        },
        1000:{
            items:4
        }
    }
})

async function cargarCiudades() {
    await fetch('http://localhost:8080/api/ciudad', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
    }).then(res => res.json())
    .then(resp => {
        resp.forEach(item => {
            let option = document.createElement("option");
            option.value = item.idCiudad;
            option.text = item.nombre;
            document.querySelector("#sOrigen").add(option);
        });
        resp.forEach(item => {
            let option = document.createElement("option");
            option.value = item.idCiudad;
            option.text = item.nombre;
            document.querySelector("#sDestino").add(option);
        });
    });

}

document.querySelector("#fBusqueda").addEventListener("submit",(e) => {
    e.preventDefault();
    const codOrigen = document.querySelector("#sOrigen").value;
    const codDestino = document.querySelector("#sDestino").value;
    const fechaIda = fecha_inicio.value;
    const fechaVuelta = fecha_fin.value;
    location.href = `./pages/busqueda.html?codOrigen=${codOrigen}&codDestino=${codDestino}&fechaIda=${fechaIda}&fechaVuelta=${fechaVuelta}`;
});