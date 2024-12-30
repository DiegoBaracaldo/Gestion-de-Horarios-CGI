const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electron', {
    GetAllTorres: () => ipcRenderer.invoke('GetAllTorres'),
    GetAllJornadas: () => ipcRenderer.invoke('GetAllJornadas'),
    GetAllProgramas: () => ipcRenderer.invoke('GetAllProgramas'),
    GetAllInstructores: () => ipcRenderer.invoke('GetAllInstructores'),
    GetAllGrupos: () => ipcRenderer.invoke('GetAllGrupos'),
    GetAllAmbientes: () => ipcRenderer.invoke('GetAllAmbientes'),
    GetAllCompetencias: (idPrograma) => ipcRenderer.invoke('GetAllCompetencias', idPrograma)
});