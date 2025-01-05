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
const ObtenerErrorSQLite = require('./baseDatos/ErroresSQLite');
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
    ipcMain.handle('AtLeastOneTorre', async () => {
        try {
            return await torreRepo.AtLeastOne();
        } catch (error) {
            console.log("error en electron ipcMainTorres por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllTorres', async () => {
        try {
            //aquí se devuelven o las filas encontradas en resolve o el array vacío de reject
            return await torreRepo.GetAll();
        } catch (error) {
            console.log("error en electron ipcMainTorres por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetTorreByID', async (event, id) => {
        try {
            return await torreRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewTorre', async (event, nombre) => {
        try {
            return await torreRepo.SaveNew(nombre);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveTorre', async (event, idViejo, torre) => {
        try {
            return await torreRepo.Save(idViejo, torre);
        } catch (error) {
            console.log("Error en ipcMain  SaveTorre por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveTorre', async (event, idArray) => {
        try {
            return await torreRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemoveTorre por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });


    // Jornadas
    ipcMain.handle('AtLeastOneJornada', async () => {
        try {
            return await jornadaRepo.AtLeastOne();
        } catch (error) {
            console.log("error en electron ipcMainJornadas por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllJornadas', async () => {
        try {
            return await jornadaRepo.GetAll();
        } catch (error) {
            console.log("error en electron ipcMainJornadas por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetJornadaByID', async (event, id) => {
        try {
            return await jornadaRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllFranjasJornada', async() => {
        try {
            return await jornadaRepo.GetAllFranjas();
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    } );
    ipcMain.handle('SaveNewJornada', async (event, jornada) => {
        try {
            return await jornadaRepo.SaveNew(jornada);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveJornada', async (event, idViejo, jornada) => {
        try {
            return await jornadaRepo.Save(idViejo, jornada);
        } catch (error) {
            console.log("Error en ipcMain  SaveJornada por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveJornada', async (event, idArray) => {
        try {
            return await jornadaRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemoveJornada por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    // Programas
    ipcMain.handle('AtLeastOnePrograma', async () => {
        try {
            return await programaRepo.AtLeastOne();
        } catch (error) {
            console.log("error en electron ipcMainProgramas por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllProgramas', async () => {
        try {
            return await programaRepo.GetAll();
        } catch (error) {
            console.log("error en electron ipcMainProgramas por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetProgramaByID', async (event, id) => {
        try {
            return await programaRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewPrograma', async (event, programa) => {
        try {
            return await programaRepo.SaveNew(programa);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SavePrograma', async (event, idViejo, programa) => {
        try {
            return await programaRepo.Save(idViejo, programa);
        } catch (error) {
            console.log("Error en ipcMain  SavePrograma por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemovePrograma', async (event, idArray) => {
        try {
            return await programaRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemovePrograma por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //Instructores
    ipcMain.handle('AtLeastOneInstructor', async () => {
        try {
            return await instructorRepo.AtLeastOne();
        } catch (error) {
            console.log("error en electron ipcMainInstructores por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetAllInstructores', async () => {
        try {
            return await instructorRepo.GetAll();
        } catch (error) {
            console.log("Error en electron ipcMain Instructores  por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetInstructorByID', async (event, id) => {
        try {
            return await instructorRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewInstructor', async (event, instructor) => {
        try {
            return await instructorRepo.SaveNew(instructor);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveInstructor', async (event, idViejo, instructor) => {
        try {
            return await instructorRepo.Save(idViejo, instructor);
        } catch (error) {
            console.log("Error en ipcMain  SaveInstructor por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveInstructor', async (event, idArray) => {
        try {
            return await instructorRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemoveInstructor por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //Grupos
    ipcMain.handle('GetAllGrupos', async () => {
        try {
            return await grupoRepo.GetAll();
        } catch (error) {
            console.log("Error en electron ipcMain Grupos  por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetGrupoByID', async (event, id) => {
        try {
            return await grupoRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewGrupo', async (event, grupo) => {
        try {
            return await grupoRepo.SaveNew(grupo);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveGrupo', async (event, idViejo, grupo) => {
        try {
            return await grupoRepo.Save(idViejo, grupo);
        } catch (error) {
            console.log("Error en ipcMain  SaveGrupo por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveGrupo', async (event, idArray) => {
        try {
            return await grupoRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemoveGrupo por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //Ambientes
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
            console.log("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewAmbiente', async (event, ambiente) => {
        try {
            return await ambienteRepo.SaveNew(ambiente);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveAmbiente', async (event, idViejo, ambiente) => {
        try {
            return await ambienteRepo.Save(idViejo, ambiente);
        } catch (error) {
            console.log("Error en ipcMain  SaveAmbiente por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveAmbiente', async (event, idArray) => {
        try {
            return await ambienteRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemoveAmbiente por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });

    //Competencias
    ipcMain.handle('GetAllCompetencias', async (event, idPrograma) => {
        try {
            return await competenciaRepo.GetAllByIdPrograma(idPrograma);
        } catch (error) {
            console.log("Error en electron ipcMain Competencias  por: " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('GetCompetenciaByID', async (event, id) => {
        try {
            return await competenciaRepo.GetById(id);
        } catch (error) {
            console.log("Error en ipcMain  getById por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveNewCompetencia', async (event, competencia) => {
        try {
            return await competenciaRepo.SaveNew(competencia);
        } catch (error) {
            console.log("Error en ipcMain  SaveNew por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('SaveCompetencia', async (event, idViejo, competencia) => {
        try {
            return await competenciaRepo.Save(idViejo, competencia);
        } catch (error) {
            console.log("Error en ipcMain  SaveCompetencia por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
    ipcMain.handle('RemoveCompetencia', async (event, idArray) => {
        try {
            return await competenciaRepo.Remove(idArray);
        } catch (error) {
            console.log("Error en ipcMain  RemoveCompetencia por:   " + error);
            throw ObtenerErrorSQLite(error);
        }
    });
}