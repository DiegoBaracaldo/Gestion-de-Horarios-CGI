import AmbienteRepo from "../repositorios/AmbienteRepo"

class AmbienteServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new AmbienteRepo();
        if (repo.GetAll()) return repo.GetAll();
        else return null;
    }

    GuardarAmbiente(ambiente){
        const repo = new AmbienteRepo();
        repo.SaveNew(ambiente);
    }

    ActualizarAmbiente(idViejo, ambiente){
        const repo = new AmbienteRepo();
        repo.Save(idViejo, ambiente);
    }
}


export default AmbienteServicio;