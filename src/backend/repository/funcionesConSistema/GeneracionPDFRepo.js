const fs = require('fs');
const path = require('path');
const { app, shell } = require('electron');

class GeneracionPDF {
    constructor() {
        this.directorioGeneral = path.join(app.getPath('userData'), 'horariosPDF');
        this.directorioInstructores = path.join(app.getPath('userData'), 'horariosPDF', 'instructores');
        this.directorioGrupos = path.join(app.getPath('userData'), 'horariosPDF', 'grupos');

        if (!fs.existsSync(this.directorioGeneral)) {
            fs.mkdirSync(this.directorioGeneral, { recursive: true })
        }
        if (!fs.existsSync(this.directorioInstructores)) {
            fs.mkdirSync(this.directorioInstructores, { recursive: true })
        }
        if(!fs.existsSync(this.directorioGrupos)){
            fs.mkdirSync(this.directorioGrupos, {recursive: true});
        }
    }

    async vaciarCarpeta(carpeta) {
        try {
            await fs.promises.rm(carpeta, { recursive: true, force: true });
            // Volver a crear la carpeta vacía
            await fs.promises.mkdir(carpeta, { recursive: true });
        } catch (error) {
            console.error('Error al vaciar la carpeta:', error);
            throw new Error('No se pudo vaciar la carpeta');
        }
    }

    async SavePDFsInstructores(arrayPDF) {
        try {
            await this.vaciarCarpeta(this.directorioInstructores);
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
            throw new Error('No se pudieron guardar los archivos PDF.', error);
        }
    }

    async SavePDFsGrupos(arrayPDF) {
        try {
            await this.vaciarCarpeta(this.directorioGrupos);
            const archivosGuardados = await Promise.all(
                arrayPDF.map(async ({ nombre, contenido }) => {
                    const filePath = path.join(this.directorioGrupos, nombre);
                    await fs.promises.writeFile(filePath, Buffer.from(contenido));
                    return filePath;
                })
            );
            return archivosGuardados;
        } catch (error) {
            console.error('Error al guardar PDFs:', error);
            throw new Error('No se pudieron guardar los archivos PDF', error);
        }
    }

    AbrirCarpetaContenedoraPDF() {
        shell.openPath(this.directorioGeneral);
    }
}
module.exports = GeneracionPDF;