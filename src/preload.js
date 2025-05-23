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
    GetAllByIdInstructor: (arrayIds) => ipcRenderer.invoke('GetAllByIdInstructor', arrayIds),
    SaveNewInstructor: (instructor) => ipcRenderer.invoke('SaveNewInstructor', instructor),
    SaveInstructor: (idViejo, instructor) => ipcRenderer.invoke('SaveInstructor', idViejo, instructor),
    RemoveInstructor: (idArray) => ipcRenderer.invoke('RemoveInstructor', idArray),

    AtLeastOneGrupo: () => ipcRenderer.invoke('AtLeastOneGrupo'),
    GetAllGrupos: () => ipcRenderer.invoke('GetAllGrupos'),
    GetAllByIdGrupo: (arrayIds) => ipcRenderer.invoke('GetAllByIdGrupo', arrayIds),
    GetAllGruposByPool: () => ipcRenderer.invoke('GetAllGruposByPool'),
    GetGrupoByID: (id) => ipcRenderer.invoke('GetGrupoByID', id),
    SaveNewGrupo: (grupo) => ipcRenderer.invoke('SaveNewGrupo', grupo),
    SaveGrupo: (idViejo, grupo) => ipcRenderer.invoke('SaveGrupo', idViejo, grupo),
    RemoveGrupo: (idArray) => ipcRenderer.invoke('RemoveGrupo', idArray),

    AtLeastOneAmbiente: () => ipcRenderer.invoke('AtLeastOneAmbiente'),
    GetAllAmbientes: () => ipcRenderer.invoke('GetAllAmbientes'),
    GetAmbienteByID: (id) => ipcRenderer.invoke('GetAmbienteByID', id),
    GetAllByIdAmbiente: (arrayIds) => ipcRenderer.invoke('GetAllByIdAmbiente', arrayIds),
    SaveNewAmbiente: (ambiente) => ipcRenderer.invoke('SaveNewAmbiente', ambiente),
    SaveAmbiente: (idViejo, ambiente) => ipcRenderer.invoke('SaveAmbiente', idViejo, ambiente),
    RemoveAmbiente: (idArray) => ipcRenderer.invoke('RemoveAmbiente', idArray),

    AtLeastOneCompetencia: () => ipcRenderer.invoke('AtLeastOneCompetencia'),
    GetAllCompetencias: (idPrograma) => ipcRenderer.invoke('GetAllCompetencias', idPrograma),
    GetCompetenciaByID: (id) => ipcRenderer.invoke('GetCompetenciaByID', id),
    GetAllByIdCompetencia: (arrayIds) => ipcRenderer.invoke('GetAllByIdCompetencia', arrayIds),
    GetAllByPoolCompetencias: (idGrupo) => ipcRenderer.invoke('GetAllByPoolCompetencias', idGrupo),
    SaveNewCompetencia: (competencia) => ipcRenderer.invoke('SaveNewCompetencia', competencia),
    SaveCompetencia: (idViejo, competencia) => ipcRenderer.invoke('SaveCompetencia', idViejo, competencia),
    RemoveCompetencia: (idArray) => ipcRenderer.invoke('RemoveCompetencia', idArray),

    GuardarPiscinas: (agregados, eliminados) => ipcRenderer.invoke('GuardarPiscinas', agregados, eliminados),
    CargarPiscinas: () => ipcRenderer.invoke('CargarPiscinas'),
    ConfirmarPiscinas: () => ipcRenderer.invoke('ConfirmarPiscinas'),

    GetAllFranjas: () => ipcRenderer.invoke('GetAllFranjas'),
    GetBloquesByCompetenciaFranjas: (idGrupo, idCompetencia) => ipcRenderer.invoke('GetBloquesByCompetenciaFranjas', idGrupo, idCompetencia),
    DeleteAndSaveFranjas: (agregaciones, modificaciones, eliminaciones) => ipcRenderer.invoke('DeleteAndSaveFranjas', agregaciones, modificaciones, eliminaciones),
    GetOcupanciaBloquesGrupo: (idGrupo) => ipcRenderer.invoke('GetOcupanciaBloquesGrupo', idGrupo),
    GetFranjasByCompetenciaAndGrupo: (idGrupo, idCompetencia) => ipcRenderer.invoke('GetFranjasByCompetenciaAndGrupo', idGrupo, idCompetencia),
    ConfirmarHorarioCompleto: () => ipcRenderer.invoke('ConfirmarHorarioCompleto'),

    GetAllFusiones: () => ipcRenderer.invoke('GetAllFusiones'),
    SaveNewFusion: (fusion) => ipcRenderer.invoke('SaveNewFusion', fusion),
    RemoveFusion: (idHuesped, idAnfitrion) => ipcRenderer.invoke('RemoveFusion', idHuesped, idAnfitrion),
    SavePDFsInstructores: (arrayPDFs) => ipcRenderer.invoke('SavePDFsInstructores', arrayPDFs),
    SavePDFsGrupos: (arrayPDFs) => ipcRenderer.invoke('SavePDFsGrupos', arrayPDFs),
    AbrirCarpetaContenedoraPDF: (directorio) => ipcRenderer.invoke('AbrirCarpetaContenedoraPDF', directorio),
    TriggerHorarioFalse: () =>  ipcRenderer.invoke('TriggerHorarioFalse'),
    DescargarPDFGrupos: () => ipcRenderer.invoke('DescargarPDFGrupos'),
    DescargarPDFInstructores: () => ipcRenderer.invoke('DescargarPDFInstructores'),

    GetByClave: (clave) => ipcRenderer.invoke('GetByClave', clave),

    logErrores: (msg) => ipcRenderer.invoke('logErrores', msg)
});