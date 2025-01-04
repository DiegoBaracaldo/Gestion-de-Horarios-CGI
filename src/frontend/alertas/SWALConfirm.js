import Swal from "sweetalert2";

class SWALConfirm {

    constructor() {

    }

    async ConfirmAlert(pregunta) {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: pregunta,
                showCancelButton: true,
                confirmButtonText: "SI",
            }).then((resultado) => {
                if (resultado.isConfirmed) resolve(true);
                else resolve(false);
            }).catch(() => {
                reject(false);
            }
            );
        });
    }
}
export default SWALConfirm;