const fs = require('fs');
const path = require('path');
const { app, shell } = require('electron');

class GeneracionPDF {
    constructor() {
        this.directorioGeneral = path.join(app.getPath('userData'), 'horariosPDF');
        this.directorioInstructores = path.join(app.getPath('userData'), 'horariosPDF', 'instructores');

        if (!fs.existsSync(this.directorioGeneral)) {
            fs.mkdirSync(this.directorioGeneral, { recursive: true })
        }
        if (!fs.existsSync(this.directorioInstructores)) {
            fs.mkdirSync(this.directorioInstructores, { recursive: true })
        }
    }

    async SavePDFsInstructores(arrayPDF) {
        try {
            const archivosGuardados = await Promise.all(
                arrayPDF.map(async ({ nombre, contenido }) => {
                    const filePath = path.join(this.directorioInstructores, nombre);
                    await fs.promises.writeFile(filePath, Buffer.from(contenido));
                    return filePath;
                })
            );
            return archivosGuardados;
        } catch (error) {
            console.error('Error al guardar PDFs:', error);
            throw new Error('No se pudieron guardar los archivos PDF');
        }
    }

    AbrirCarpetaContenedoraPDF() {
        shell.openPath(this.directorioGeneral);
    }
}
module.exports = GeneracionPDF;