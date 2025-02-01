import Swal from "sweetalert2";

class SWALConfirm {

    constructor() {

    }

    async ConfirmAlert(pregunta) {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: pregunta,
                showCancelButton: true,
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
export default SWALConfirm;