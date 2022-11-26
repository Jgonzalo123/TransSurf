async function validarSesion() {
    return await fetch('http://localhost:8080/api/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + localStorage.token
        },
        body: localStorage.numDocOrEmail
    }).then(res => {
        if (res.status == 200) {
            return res.json();
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("numDocOrEmail");
            return false;
        }
    })
    .catch(error => {
        localStorage.removeItem("token");
        localStorage.removeItem("numDocOrEmail");
    });
}

export async function Validator() {
    if(localStorage.token && localStorage.numDocOrEmail) {
        const user = await validarSesion();
        if (user) {
            document.querySelector(".nav-item-login").classList.add("d-none");
            document.querySelector(".nav-item-cuenta").classList.remove("d-none");
            return user;
        }
    }
    return false;
}