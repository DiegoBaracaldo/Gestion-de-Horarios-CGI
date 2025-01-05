const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electron', {
    AtLeastOneTorre: () => ipcRenderer.invoke('AtLeastOneTorre'),
    GetAllTorres: () => ipcRenderer.invoke('GetAllTorres'),
    GetTorreByID: (id) => ipcRenderer.invoke('GetTorreByID', id),
    SaveNewTorre: (nombre) => ipcRenderer.invoke('SaveNewTorre', nombre),
    SaveTorre: (idViejo, torre) => ipcRenderer.invoke('SaveTorre', idViejo, torre),
    RemoveTorre: (idArray) => ipcRenderer.invoke('RemoveTorre', idArray),

    AtLeastOneJornada: () => ipcRenderer.invoke('AtLeastOneJornada'),
    GetAllJornadas: () => ipcRenderer.invoke('GetAllJornadas'),
    GetJornadaByID: (id) => ipcRenderer.invoke('GetJornadaByID', id),
    GetAllFranjasJornada: () => ipcRenderer.invoke('GetAllFranjasJornada'),
    SaveNewJornada: (jornada) => ipcRenderer.invoke('SaveNewJornada', jornada),
    SaveJornada: (idViejo, jornada) => ipcRenderer.invoke('SaveJornada', idViejo, jornada),
    RemoveJornada: (idArray) => ipcRenderer.invoke('RemoveJornada', idArray),

    AtLeastOnePrograma: () => ipcRenderer.invoke('AtLeastOnePrograma'),
    GetAllProgramas: () => ipcRenderer.invoke('GetAllProgramas'),
    GetProgramaByID: (id) => ipcRenderer.invoke('GetProgramaByID', id),
    SaveNewPrograma: (programa) => ipcRenderer.invoke('SaveNewPrograma', programa),
    SavePrograma: (idViejo, programa) => ipcRenderer.invoke('SavePrograma', idViejo, programa),
    RemovePrograma: (idArray) => ipcRenderer.invoke('RemovePrograma', idArray),

    AtLeastOneInstructor: () => ipcRenderer.invoke('AtLeastOneInstructor'),
    GetAllInstructores: () => ipcRenderer.invoke('GetAllInstructores'),
    GetInstructorByID: (id) => ipcRenderer.invoke('GetInstructorByID', id),
    SaveNewInstructor: (instructor) => ipcRenderer.invoke('SaveNewInstructor', instructor),
    SaveInstructor: (idViejo, instructor) => ipcRenderer.invoke('SaveInstructor', idViejo, instructor),
    RemoveInstructor: (idArray) => ipcRenderer.invoke('RemoveInstructor', idArray),

    GetAllGrupos: () => ipcRenderer.invoke('GetAllGrupos'),
    GetGrupoByID: (id) => ipcRenderer.invoke('GetGrupoByID', id),
    SaveNewGrupo: (grupo) => ipcRenderer.invoke('SaveNewGrupo', grupo),
    SaveGrupo: (idViejo, grupo) => ipcRenderer.invoke('SaveGrupo', idViejo, grupo),
    RemoveGrupo: (idArray) => ipcRenderer.invoke('RemoveGrupo', idArray),

    GetAllAmbientes: () => ipcRenderer.invoke('GetAllAmbientes'),
    GetAmbienteByID: (id) => ipcRenderer.invoke('GetAmbienteByID', id),
    SaveNewAmbiente: (ambiente) => ipcRenderer.invoke('SaveNewAmbiente', ambiente),
    SaveAmbiente: (idViejo, ambiente) => ipcRenderer.invoke('SaveAmbiente', idViejo, ambiente),
    RemoveAmbiente: (idArray) => ipcRenderer.invoke('RemoveAmbiente', idArray),

    GetAllCompetencias: (idPrograma) => ipcRenderer.invoke('GetAllCompetencias', idPrograma),
    GetCompetenciaByID: (id) => ipcRenderer.invoke('GetCompetenciaByID', id),
    SaveNewCompetencia: (competencia) => ipcRenderer.invoke('SaveNewCompetencia', competencia),
    SaveCompetencia: (idViejo, competencia) => ipcRenderer.invoke('SaveCompetencia', idViejo, competencia),
    RemoveCompetencia: (idArray) => ipcRenderer.invoke('RemoveCompetencia', idArray),
});