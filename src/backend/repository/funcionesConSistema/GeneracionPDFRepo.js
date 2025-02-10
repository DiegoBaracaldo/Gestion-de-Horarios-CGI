const fs = require('fs');
const path = require('path');
const { app, shell, dialog } = require('electron');

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
        if (!fs.existsSync(this.directorioGrupos)) {
            fs.mkdirSync(this.directorioGrupos, { recursive: true });
        }
    }

    async vaciarCarpeta(carpeta) {
        try {
            await fs.promises.rm(carpeta, { recursive: true, force: true });
            // Volver a crear la carpeta vacía
            await fs.promises.mkdir(carpeta, { recursive: true });
        } catch (error) {
            throw new Error('No se pudo vaciar la carpeta');
        }
    }

    async SeleccionarCarpetaDestino() {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'], // Permite seleccionar solo una carpeta
        });

        if (result.canceled) {
            console.log('El usuario canceló la selección de carpeta');
            return null;
        }
        return result.filePaths[0]; // Retorna la ruta de la carpeta seleccionada
    }


    async CopiarArchivosPDF(carpetaOrigen, carpetaDestino) {
        try {
            const archivos = await fs.promises.readdir(carpetaOrigen); // Lista los archivos en la carpeta origen

            // Asegúrate de que la carpeta destino exista
            await fs.promises.mkdir(carpetaDestino, { recursive: true });

            // Copia cada archivo al destino
            await Promise.all(
                archivos.map(async (archivo) => {
                    const origen = path.join(carpetaOrigen, archivo);
                    const destino = path.join(carpetaDestino, archivo);
                    await fs.promises.copyFile(origen, destino); // Copia el archivo
                })
            );
            return carpetaDestino;
        } catch (error) {
            throw new Error('No se pudieron descargar los archivos.');
        }
    }

    async DescargarPDFGrupos(){
        try {
            const ruta = await this.SeleccionarCarpetaDestino();
            if(!ruta) return null;
            else return await this.CopiarArchivosPDF(this.directorioGrupos, ruta);
        } catch (error) {
            throw error;
        }
    }

    async DescargarPDFInstructores(){
        try {
            const ruta = await this.SeleccionarCarpetaDestino();
            if(!ruta) return null;
            else return await this.CopiarArchivosPDF(this.directorioInstructores, ruta);
        } catch (error) {
            throw error;
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
            throw new Error('No se pudieron guardar los archivos PDF.', error);
        }
    }

    AbrirCarpetaEspecifica(directorio){
        shell.openPath(directorio);
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
            throw new Error('No se pudieron guardar los archivos PDF', error);
        }
    }

    AbrirCarpetaContenedoraPDF(directorio) {
        shell.openPath(directorio);
    }
}
module.exports = GeneracionPDF;