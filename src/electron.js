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
    ipcMain.handle('GetTorreByID', async (event, id) => {
        try {
            return await torreRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            return {};
        }
    });
    ipcMain.handle('SaveNewTorre', async (event, nombre) => {
        try {
            return await torreRepo.SaveNew(nombre);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            return 0;
        }
    });
    ipcMain.handle('SaveTorre', async (event, idViejo, torre) => {
        try {
            return await torreRepo.Save(idViejo, torre);
        } catch (error) {
            console.log("Error en ipcMain  SaveTorre por:   " + error);
            return 0;
        }
    });
    ipcMain.handle('RemoveTorre', async (event, idArray) => {
        try {
            return await torreRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemoveTorre por:   " + error);
            return 0;
        }
    });
    

    // Jornadas
    ipcMain.handle('AtLeastOneJornada', async() => {
        try {
            return await jornadaRepo.AtLeastOne();
        } catch (error) {
            console.log("error en electron ipcMainJornadas por: " + error);
            return 0;
        }
    });
    ipcMain.handle('GetAllJornadas', async () => {
        try {
            return await jornadaRepo.GetAll();
        } catch (error) {
            console.log("error en electron ipcMainJornadas por: " + error);
            return [];
        }
    });
    ipcMain.handle('GetJornadaByID', async (event, id) => {
        try {
            return await jornadaRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            return {};
        }
    });
    ipcMain.handle('SaveNewJornada', async (event, jornada) => {
        try {
            return await jornadaRepo.SaveNew(jornada);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            return 0;
        }
    });
    ipcMain.handle('SaveJornada', async (event, idViejo, jornada) => {
        try {
            return await jornadaRepo.Save(idViejo, jornada);
        } catch (error) {
            console.log("Error en ipcMain  SaveJornada por:   " + error);
            return 0;
        }
    });
    ipcMain.handle('RemoveJornada', async (event, idArray) => {
        try {
            return await jornadaRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemoveJornada por:   " + error);
            return 0;
        }
    });

    // Programas
    ipcMain.handle('AtLeastOnePrograma', async() => {
        try {
            return await programaRepo.AtLeastOne();
        } catch (error) {
            console.log("error en electron ipcMainProgramas por: " + error);
            return 0;
        }
    });
    ipcMain.handle('GetAllProgramas', async () => {
        try {
            return await programaRepo.GetAll();
        } catch (error) {
            console.log("error en electron ipcMainProgramas por: " + error);
            return [];
        }
    });
    ipcMain.handle('GetProgramaByID', async (event, id) => {
        try {
            return await programaRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            return {};
        }
    });
    ipcMain.handle('SaveNewPrograma', async (event, programa) => {
        try {
            return await programaRepo.SaveNew(programa);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            return 0;
        }
    });
    ipcMain.handle('SavePrograma', async (event, idViejo, programa) => {
        try {
            return await programaRepo.Save(idViejo, programa);
        } catch (error) {
            console.log("Error en ipcMain  SavePrograma por:   " + error);
            return 0;
        }
    });
    ipcMain.handle('RemovePrograma', async (event, idArray) => {
        try {
            return await programaRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemovePrograma por:   " + error);
            return 0;
        }
    });

    //Instructores
    ipcMain.handle('AtLeastOneInstructor', async() => {
        try {
            return await instructorRepo.AtLeastOne();
        } catch (error) {
            console.log("error en electron ipcMainInstructores por: " + error);
            return 0;
        }
    });
    ipcMain.handle('GetAllInstructores', async () => {
        try {
            return await instructorRepo.GetAll();
        } catch (error) {
            console.log("Error en electron ipcMain Instructores  por: " + error);
            return [];
        }
    });
    ipcMain.handle('GetInstructorByID', async (event, id) => {
        try {
            return await instructorRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            return {};
        }
    });
    ipcMain.handle('SaveNewInstructor', async (event, instructor) => {
        try {
            return await instructorRepo.SaveNew(instructor);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            return 0;
        }
    });
    ipcMain.handle('SaveInstructor', async (event, idViejo, instructor) => {
        try {
            return await instructorRepo.Save(idViejo, instructor);
        } catch (error) {
            console.log("Error en ipcMain  SaveInstructor por:   " + error);
            return 0;
        }
    });
    ipcMain.handle('RemoveInstructor', async (event, idArray) => {
        try {
            return await instructorRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemoveInstructor por:   " + error);
            return 0;
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
    ipcMain.handle('GetGrupoByID', async (event, id) => {
        try {
            return await grupoRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            return {};
        }
    });
    ipcMain.handle('SaveNewGrupo', async (event, grupo) => {
        try {
            return await grupoRepo.SaveNew(grupo);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            return 0;
        }
    });
    ipcMain.handle('SaveGrupo', async (event, idViejo, grupo) => {
        try {
            return await grupoRepo.Save(idViejo, grupo);
        } catch (error) {
            console.log("Error en ipcMain  SaveGrupo por:   " + error);
            return 0;
        }
    });
    ipcMain.handle('RemoveGrupo', async (event, idArray) => {
        try {
            return await grupoRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemoveGrupo por:   " + error);
            return 0;
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