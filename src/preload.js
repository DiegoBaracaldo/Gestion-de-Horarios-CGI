const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electron', {
    GetAllTorres: () => ipcRenderer.invoke('GetAllTorres'),
    GetTorreByID: (id) => ipcRenderer.invoke('GetTorreByID', id),
    SaveNewTorre: (nombre) => ipcRenderer.invoke('SaveNewTorre', nombre),
    SaveTorre: (idViejo, torre) => ipcRenderer.invoke('SaveTorre', idViejo, torre),
    RemoveTorre: (idArray) => ipcRenderer.invoke('RemoveTorre', idArray),

    GetAllJornadas: () => ipcRenderer.invoke('GetAllJornadas'),
    GetJornadaByID: (id) => ipcRenderer.invoke('GetJornadaByID', id),
    SaveNewJornada: (jornada) => ipcRenderer.invoke('SaveNewJornada', jornada),
    SaveJornada: (idViejo, jornada) => ipcRenderer.invoke('SaveJornada', idViejo, jornada),
    RemoveJornada: (idArray) => ipcRenderer.invoke('RemoveJornada', idArray),

    GetAllProgramas: () => ipcRenderer.invoke('GetAllProgramas'),
    GetProgramaByID: (id) => ipcRenderer.invoke('GetProgramaByID', id),
    SaveNewPrograma: (programa) => ipcRenderer.invoke('SaveNewPrograma', programa),
    SavePrograma: (idViejo, programa) => ipcRenderer.invoke('SavePrograma', idViejo, programa),
    RemovePrograma: (idArray) => ipcRenderer.invoke('RemovePrograma', idArray),

    GetAllInstructores: () => ipcRenderer.invoke('GetAllInstructores'),
    GetAllGrupos: () => ipcRenderer.invoke('GetAllGrupos'),
    GetAllAmbientes: () => ipcRenderer.invoke('GetAllAmbientes'),
    GetAllCompetencias: (idPrograma) => ipcRenderer.invoke('GetAllCompetencias', idPrograma)
});