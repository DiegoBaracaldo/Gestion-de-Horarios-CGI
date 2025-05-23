//electron.js
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const ConexionBD = require('./baseDatos/BaseDatos');
const TorreRepo = require('./backend/repository/repositorios/TorreRepo');
const JornadaRepo = require('./backend/repository/repositorios/JornadaRepo');
const ProgramaRepo = require('./backend/repository/repositorios/ProgramaRepo');
const InstructorRepo = require('./backend/repository/repositorios/InstructorRepo');
const GrupoRepo = require('./backend/repository/repositorios/GrupoRepo');
const AmbienteRepo = require('./backend/repository/repositorios/AmbienteRepo');
const CompetenciaRepo = require('./backend/repository/repositorios/CompetenciaRepo');
const ObtenerErrorSQLite = require('./baseDatos/ErroresSQLite');
const PiscinaRepo = require('./backend/repository/repositorios/PiscinaRepo');
const FranjaRepo = require('./backend/repository/repositorios/FranjaRepo');
const FusionesRepo = require('./backend/repository/repositorios/FusionesRepo');
const HorarioPDFRepo = require('./backend/repository/repositorios/HorarioPDFRepo');
const GeneracionPDF = require('./backend/repository/funcionesConSistema/GeneracionPDFRepo');
const isDev = import('electron-is-dev');
const fs = require('fs');
const winston = require('winston');

let mainWindow;

let conexionBD;
let bd;

let torreRepo;
let jornadaRepo;
let programaRepo;
let instructorRepo;
let grupoRepo;
let ambienteRepo;
let competenciaRepo;
let piscinaRepo;
let franjaRepo;
let fusionesRepo;
let horarioPDFRepo;
let generacionPDFRepo;


//Creación de carpeta para registro de errores en producción
const userDocumentsPath = app.getPath('documents');
const carpetaLoggerDocuments = path.join(userDocumentsPath, 'GestorHorarioInfo', 'logger');

if (!fs.existsSync(carpetaLoggerDocuments)) {
    try {
        fs.mkdirSync(carpetaLoggerDocuments, {recursive: true});
    } catch (error) {
        console.error(`Error al crear carpeta de logs: `, error);
        process.exit(1);
    }
}

const rutaFileLogger =  path.join(carpetaLoggerDocuments, 'horarioLog.log');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports
            .Console({ format: winston.format.combine(winston.format.colorize(), winston.format.simple()) }),
        new winston.transports.File({
            filename: rutaFileLogger,
            handleExceptions: true
        })
    ]
});

//Crear ventana
function createWindow() {

    conexionBD = new ConexionBD();
    bd = conexionBD.db;
    torreRepo = new TorreRepo(bd);
    jornadaRepo = new JornadaRepo(bd);
    programaRepo = new ProgramaRepo(bd);
    instructorRepo = new InstructorRepo(bd);
    grupoRepo = new GrupoRepo(bd);
    ambienteRepo = new AmbienteRepo(bd);
    competenciaRepo = new CompetenciaRepo(bd);
    piscinaRepo = new PiscinaRepo(bd);
    franjaRepo = new FranjaRepo(bd);
    fusionesRepo = new FusionesRepo(bd);
    horarioPDFRepo = new HorarioPDFRepo(bd);
    generacionPDFRepo = new GeneracionPDF();

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        resizable: false,
        maximizable: true,
        fullscreen: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    //mainWindow.removeMenu();

    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.on('closed', () => (mainWindow = null));

    IniciarBaseDatos();
    RegistrarIPC();
}

//Manejor de errores 
process.on('uncaughtException', (err) => {
    logger.error(`Error no capturado: ${err.message}`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Promesa no manejada: ${reason}`);
});

//////////////////////////

///// Evitar que se abra más de una instancia del programa //////////////////
if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    // Si no hay otra instancia, continuar con la ejecución
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Si la ventana ya está abierta, solo darle foco
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    app.on('ready', createWindow);

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            conexionBD.CerrarBaseDatos();
            app.quit();
        }
    });

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow();
        }
    });
}
////////////////////////////////////////////////////

async function IniciarBaseDatos() {
     await conexionBD.VerificarTablas()
        .then(existe => {
            return existe;
        })
        .catch(err => {
            logger.error(err);
            return false;
        })
}

function RegistrarIPC() {
    // TORRES
    ipcMain.handle('AtLeastOneTorre', async () => {
        try {
            return await torreRepo.AtLeastOne();
        } catch (error) {
            logger.error("error en electron ipcMainTorres por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllTorres', async () => {
        try {
            //aquí se devuelven o las filas encontradas en resolve o el array vacío de reject
            return await torreRepo.GetAll();
        } catch (error) {
            logger.error("error en electron ipcMainTorres por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetTorreByID', async (event, id) => {
        try {
            return await torreRepo.GetById(id);
        } catch (error) {
            logger.error("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewTorre', async (event, nombre) => {
        try {
            return await torreRepo.SaveNew(nombre);
        } catch (error) {
            logger.error("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveTorre', async (event, idViejo, torre) => {
        try {
            return await torreRepo.Save(idViejo, torre);
        } catch (error) {
            logger.error("Error en ipcMain  SaveTorre por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveTorre', async (event, idArray) => {
        try {
            return await torreRepo.Remove(idArray);
        } catch (error) {
            logger.error("Error en ipcMain  RemoveTorre por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });


    // Jornadas
    ipcMain.handle('AtLeastOneJornada', async () => {
        try {
            return await jornadaRepo.AtLeastOne();
        } catch (error) {
            logger.error("error en electron ipcMainJornadas por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllJornadas', async () => {
        try {
            return await jornadaRepo.GetAll();
        } catch (error) {
            logger.error("error en electron ipcMainJornadas por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetJornadaByID', async (event, id) => {
        try {
            return await jornadaRepo.GetById(id);
        } catch (error) {
            logger.error("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllFranjasJornada', async () => {
        try {
            return await jornadaRepo.GetAllFranjas();
        } catch (error) {
            logger.error("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewJornada', async (event, jornada) => {
        try {
            return await jornadaRepo.SaveNew(jornada);
        } catch (error) {
            logger.error("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveJornada', async (event, idViejo, jornada) => {
        try {
            return await jornadaRepo.Save(idViejo, jornada);
        } catch (error) {
            logger.error("Error en ipcMain  SaveJornada por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveJornada', async (event, idArray) => {
        try {
            return await jornadaRepo.Remove(idArray);
        } catch (error) {
            logger.error("Error en ipcMain  RemoveJornada por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    // Programas
    ipcMain.handle('AtLeastOnePrograma', async () => {
        try {
            return await programaRepo.AtLeastOne();
        } catch (error) {
            logger.error("error en electron ipcMainProgramas por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllProgramas', async () => {
        try {
            return await programaRepo.GetAll();
        } catch (error) {
            logger.error("error en electron ipcMainProgramas por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetProgramaByID', async (event, id) => {
        try {
            return await programaRepo.GetById(id);
        } catch (error) {
            logger.error("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewPrograma', async (event, programa) => {
        try {
            return await programaRepo.SaveNew(programa);
        } catch (error) {
            logger.error("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SavePrograma', async (event, idViejo, programa) => {
        try {
            return await programaRepo.Save(idViejo, programa);
        } catch (error) {
            logger.error("Error en ipcMain  SavePrograma por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemovePrograma', async (event, idArray) => {
        try {
            return await programaRepo.Remove(idArray);
        } catch (error) {
            logger.error("Error en ipcMain  RemovePrograma por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //Instructores
    ipcMain.handle('AtLeastOneInstructor', async () => {
        try {
            return await instructorRepo.AtLeastOne();
        } catch (error) {
            logger.error("error en electron ipcMainInstructores por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllInstructores', async () => {
        try {
            return await instructorRepo.GetAll();
        } catch (error) {
            logger.error("Error en electron ipcMain Instructores  por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetInstructorByID', async (event, id) => {
        try {
            return await instructorRepo.GetById(id);
        } catch (error) {
            logger.error("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllByIdInstructor', async (event, arrayIds) => {
        try {
            return await instructorRepo.GetAllById(arrayIds);
        } catch (error) {
            logger.error("Error en ipcMain instructores  getAllById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewInstructor', async (event, instructor) => {
        try {
            return await instructorRepo.SaveNew(instructor);
        } catch (error) {
            logger.error("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveInstructor', async (event, idViejo, instructor) => {
        try {
            return await instructorRepo.Save(idViejo, instructor);
        } catch (error) {
            logger.error("Error en ipcMain  SaveInstructor por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveInstructor', async (event, idArray) => {
        try {
            return await instructorRepo.Remove(idArray);
        } catch (error) {
            logger.error("Error en ipcMain  RemoveInstructor por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //Grupos
    ipcMain.handle('AtLeastOneGrupo', async () => {
        try {
            return await grupoRepo.AtLeastOne();
        } catch (error) {
            logger.error("error en electron ipcMainGrupos por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllGrupos', async () => {
        try {
            return await grupoRepo.GetAll();
        } catch (error) {
            logger.error("Error en electron ipcMain Grupos  por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllByIdGrupo', async (event, arrayIds) => {
        try {
            return await grupoRepo.GetAllById(arrayIds);
        } catch (error) {
            logger.error("Error en ipcMain grupos  getAllById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllGruposByPool', async () => {
        try {
            return await grupoRepo.GetAllByPool();
        } catch (error) {
            logger.error("Error en electron ipcMain Grupos  por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetGrupoByID', async (event, id) => {
        try {
            return await grupoRepo.GetById(id);
        } catch (error) {
            logger.error("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewGrupo', async (event, grupo) => {
        try {
            return await grupoRepo.SaveNew(grupo);
        } catch (error) {
            logger.error("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveGrupo', async (event, idViejo, grupo) => {
        try {
            return await grupoRepo.Save(idViejo, grupo);
        } catch (error) {
            logger.error("Error en ipcMain  SaveGrupo por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveGrupo', async (event, idArray) => {
        try {
            return await grupoRepo.Remove(idArray);
        } catch (error) {
            logger.error("Error en ipcMain  RemoveGrupo por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //Ambientes
    ipcMain.handle('AtLeastOneAmbiente', async () => {
        try {
            return await ambienteRepo.AtLeastOne();
        } catch (error) {
            logger.error("error en electron ipcMainAmbientes por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllAmbientes', async () => {
        try {
            return await ambienteRepo.GetAll();
        } catch (error) {
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAmbienteByID', async (event, id) => {
        try {
            return await ambienteRepo.GetById(id);
        } catch (error) {
            logger.error("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllByIdAmbiente', async (event, arrayIds) => {
        try {
            return await ambienteRepo.GetAllById(arrayIds);
        } catch (error) {
            logger.error("Error en ipcMain ambientes  getAllById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewAmbiente', async (event, ambiente) => {
        try {
            return await ambienteRepo.SaveNew(ambiente);
        } catch (error) {
            logger.error("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveAmbiente', async (event, idViejo, ambiente) => {
        try {
            return await ambienteRepo.Save(idViejo, ambiente);
        } catch (error) {
            logger.error("Error en ipcMain  SaveAmbiente por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveAmbiente', async (event, idArray) => {
        try {
            return await ambienteRepo.Remove(idArray);
        } catch (error) {
            logger.error("Error en ipcMain  RemoveAmbiente por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //Competencias
    ipcMain.handle('AtLeastOneCompetencia', async () => {
        try {
            return await competenciaRepo.AtLeastOne();
        } catch (error) {
            logger.error("error en electron ipcMainCompetencias por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllCompetencias', async (event, idPrograma) => {
        try {
            return await competenciaRepo.GetAllByIdPrograma(idPrograma);
        } catch (error) {
            logger.error("Error en electron ipcMain Competencias  por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetCompetenciaByID', async (event, id) => {
        try {
            return await competenciaRepo.GetById(id);
        } catch (error) {
            logger.error("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllByIdCompetencia', async (event, arrayIds) => {
        try {
            return await competenciaRepo.GetAllById(arrayIds);
        } catch (error) {
            logger.error("Error en ipcMain competencias  getAllById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllByPoolCompetencias', async (event, idGrupo) => {
        try {
            return await competenciaRepo.GetByPool(idGrupo);
        } catch (error) {
            logger.error("Error en ipcMain  GetAllByPoolCompetencias por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewCompetencia', async (event, competencia) => {
        try {
            return await competenciaRepo.SaveNew(competencia);
        } catch (error) {
            logger.error("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveCompetencia', async (event, idViejo, competencia) => {
        try {
            return await competenciaRepo.Save(idViejo, competencia);
        } catch (error) {
            logger.error("Error en ipcMain  SaveCompetencia por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveCompetencia', async (event, idArray) => {
        try {
            return await competenciaRepo.Remove(idArray);
        } catch (error) {
            logger.error("Error en ipcMain  RemoveCompetencia por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //Piscinas competencias
    ipcMain.handle('GuardarPiscinas', async (event, agregados, eliminados) => {
        try {
            return await piscinaRepo.SavePool(agregados, eliminados);
        } catch (error) {
            logger.error("Error en ipcMain  Guardar Piscinas por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('CargarPiscinas', async () => {
        try {
            return await piscinaRepo.GetAll();
        } catch (error) {
            logger.error("Error en ipcMain  Cargar Piscinas por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('ConfirmarPiscinas', async () => {
        try {
            return await piscinaRepo.ConfirmPool();
        } catch (error) {
            logger.error("Error en ipcMain  al confirmar Piscinas por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //Franjas
    ipcMain.handle('GetAllFranjas', async () => {
        try {
            return await franjaRepo.GetAll();
        } catch (error) {
            logger.error("Error en ipcMain  al obtener franjas por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetBloquesByCompetenciaFranjas', async (event, idGrupo, idCompetencia) => {
        try {
            return await franjaRepo.GetBloquesByCompetencia(idGrupo, idCompetencia);
        } catch (error) {
            logger.error("Error en ipcMain  al obtener bloques en franjas por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('DeleteAndSaveFranjas', async (event, agregaciones, modificaciones, eliminaciones) => {
        try {
            return await franjaRepo.DeleteAndSaveFranjas(agregaciones, modificaciones, eliminaciones);
        } catch (error) {
            logger.error("Error en ipcMain  al guardar franjas en franjas por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetOcupanciaBloquesGrupo', async (event, idGrupo) => {
        try {
            return await franjaRepo.GetOcupanciaFranjasGrupo(idGrupo);
        } catch (error) {
            logger.error("Error en ipcMain  al obtener ocupancia franjas en franjas por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetFranjasByCompetenciaAndGrupo', async (event, idGrupo, idCompetencia) => {
        try {
            return await franjaRepo.GetFranjasByCompetenciaAndGrupo(idGrupo, idCompetencia);
        } catch (error) {
            logger.error("Error en ipcMain  al obtener franjas de competencia por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('ConfirmarHorarioCompleto', async () => {
        try {
            return await franjaRepo.ConfirmarHorarioCompleto();
        } catch (error) {
            logger.error("Error en ipcMain  al confirma horario por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //FUSIONES
    ipcMain.handle('GetAllFusiones', async () => {
        try {
            return await fusionesRepo.GetAll();
        } catch (error) {
            logger.error("Error en ipcMain  al obtener fusiones por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewFusion', async (event, fusion) => {
        try {
            return await fusionesRepo.SaveNew(fusion);
        } catch (error) {
            logger.error("Error en ipcMain  al obtener fusiones por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveFusion', async (event, idHuesped, idAnfitrion) => {
        try {
            return await fusionesRepo.Remove(idHuesped, idAnfitrion);
        } catch (error) {
            logger.error("Error en ipcMain  al obtener fusiones por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //HORARIO PDF
    ipcMain.handle('GetByClave', async (event, clave) => {
        try {
            return await horarioPDFRepo.GetByClave(clave);
        } catch (error) {
            logger.error("Error en ipcMain  al obtener valor por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SavePDFsInstructores', async (evento, arrayPDF) => {
        try {
            return generacionPDFRepo.SavePDFsInstructores(arrayPDF);
        } catch (error) {
            logger.error('Error en ipcMain handler PDF por: ', error);
            throw error;
        }
    });
    ipcMain.handle('SavePDFsGrupos', async (evento, arrayPDF) => {
        try {
            return generacionPDFRepo.SavePDFsGrupos(arrayPDF);
        } catch (error) {
            logger.error('Error en ipcMain handler PDF por: ', error);
            throw error;
        }
    });
    ipcMain.handle('AbrirCarpetaContenedoraPDF', async (event, directorio) => {
        generacionPDFRepo.AbrirCarpetaContenedoraPDF(directorio);
    });
    ipcMain.handle('TriggerHorarioFalse', async () => {
        try {
            return await horarioPDFRepo.TriggerHorarioFalse();
        } catch (error) {
            logger.error('Error en ipcMain handler PDF por: ', error);
            throw error;
        }
    });
    ipcMain.handle('DescargarPDFGrupos', async () => {
        try {
            return await generacionPDFRepo.DescargarPDFGrupos();
        } catch (error) {
            logger.error('Error en ipcMain handler PDF por: ', error);
            throw error;
        }
    });
    ipcMain.handle('DescargarPDFInstructores', async () => {
        try {
            return await generacionPDFRepo.DescargarPDFInstructores();
        } catch (error) {
            logger.error('Error en ipcMain handler PDF por: ', error);
            throw error;
        }
    });

    //Manejo de errores
    ipcMain.handle('logErrores', (event, mensaje) => {
        logger.error(`Error en el render por: ${mensaje}`);
    });
}

module.exports = logger;