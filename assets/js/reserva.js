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
                <td><a class="btn btn-success py-0" href="#">Generar</a></td>
                <td>${(programacion.estado == "Activo")? estados[0]: (programacion.estado == "En Curso")? estados[1]: estados[2]}</td>
            </tr>
            `;
        });

        document.querySelector("#listReservas").innerHTML = html;
    });
}