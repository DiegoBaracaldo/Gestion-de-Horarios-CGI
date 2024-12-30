//electron.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ConexionBD = require('./baseDatos/BaseDatos');
const TorreRepo = require('./backend/repository/repositorios/TorreRepo');
const JornadaRepo = require('./backend/repository/repositorios/JornadaRepo');
const ProgramaRepo = require('./backend/repository/repositorios/ProgramaRepo');
const InstructorRepo = require('./backend/repository/repositorios/InstructorRepo');
const GrupoRepo = require('./backend/repository/repositorios/GrupoRepo');
const AmbienteRepo = require('./backend/repository/repositorios/AmbienteRepo');
const CompetenciaRepo = require('./backend/repository/repositorios/CompetenciaRepo');
const isDev = import('electron-is-dev');

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

async function IniciarBaseDatos() {
    conexionBD.VerificarTablas()
    .then(existe => {
        return existe;
    })
    .catch(err => {
        console.log(err);
        return false;
    })
}

function RegistrarIPC() {
    // TORRES
    ipcMain.handle('GetAllTorres', async () => {
        try {
            //aquí se devuelven o las filas encontradas en resolve o el array vacío de reject
            return await torreRepo.GetAll();
        } catch (error) {
            console.log("error en electron ipcMainTorres por: " + error);
            return []; //Devuelve array vacío en caso de error de base de datos
        }
    });

    // Jornadas
    ipcMain.handle('GetAllJornadas', async () => {
        try {
            return await jornadaRepo.GetAll();
        } catch (error) {
            console.log("error en electron ipcMainJornadas por: " + error);
            return [];
        }
    });

    // Programas
    ipcMain.handle('GetAllProgramas', async () => {
        try {
            return await programaRepo.GetAll();
        } catch (error) {
            console.log("error en electron ipcMainProgramas por: " + error);
            return [];
        }
    });

    //Instructores
    ipcMain.handle('GetAllInstructores', async () => {
        try {
            return await instructorRepo.GetAll();
        } catch (error) {
            console.log("Error en electron ipcMain Instructores  por: " + error);
            return [];
        }
    });

    //Grupos
    ipcMain.handle('GetAllGrupos', async () => {
        try {
            return await grupoRepo.GetAll();
        } catch (error) {
            console.log("Error en electron ipcMain Grupos  por: " + error);
            return [];
        }
    });
    
    //Ambientes
    ipcMain.handle('GetAllAmbientes', async () => {
        try {
            return await ambienteRepo.GetAll();
        } catch (error) {
            console.log("Error en electron ipcMain Ambientes  por: " + error);
            return [];
        }
    });
    
    //Competencias
    ipcMain.handle('GetAllCompetencias', async (event, idPrograma) => {
        try {
            return await competenciaRepo.GetAllByIdPrograma(idPrograma);
        } catch (error) {
            console.log("Error en electron ipcMain Competencias  por: " + error);
            return [];
        }
    });
}