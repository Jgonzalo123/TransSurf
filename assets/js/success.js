document.querySelector("#dComprobantes").innerHTML = generarComprobantes();

function generarComprobantes() {
    const asientos = JSON.parse(localStorage.getItem('asientos')) || [];

    let html = "";
    asientos.forEach((asiento) => {
        html += `
            <div><a class="btn btn-success px-5 ">Asiento ${asiento.numAsiento}</a></div>
        `;
    });
    localStorage.removeItem("asientos");
    return html;
}