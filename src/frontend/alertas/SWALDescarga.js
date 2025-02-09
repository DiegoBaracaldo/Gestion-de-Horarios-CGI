import Swal from "sweetalert2";

class SWALDescarga {

    constructor() {

    }

    async descargaAlert() {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: 'Archivos descargados, ¿ Abrir carpeta contenedora?',
                showCancelButton: false,
                showDenyButton: true,
                confirmButtonText: "SI",
                denyButtonText: "NO"
            }).then((resultado) => {
                if (resultado.isConfirmed) resolve("si");
                else if(resultado.isDenied) resolve("no");
                else resolve("cancel");
            }).catch(() => {
                reject("cancel");
            }
            );
        });
    }
}
export default SWALDescarga;