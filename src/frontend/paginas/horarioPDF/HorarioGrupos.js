class CrearHorarioGrupos {
    constructor() {
        this.grupos = new Map();
    }
    async GetMaps() {
        try {
            const respuesta = await new FranjaServicio().CargarFranjas();
            // console.log(respuesta);
            //Auxiliares pare ir recogiendo información
            const auxIdsGrupos = new Set();
            const franjasGrupos = new Map();
            const bloquesCrudosGrupos = new Map();
            //Recojo las franjas y ids de cada instructor y grupo de una vez
            respuesta.forEach(franja => {
                if (franja) {
                    const arrayFranjasGrupo = franjasGrupos.get(franja.idGrupo);
                    if (!arrayFranjasGrupo) {
                        franjasGrupos.set(franja.idGrupo, []);
                    }
                    arrayFranjasGrupo?.push(franja);

                    //Se van llenando los id de losgrupos sin repetir
                    auxIdsGrupos.add(franja.idGrupo);
                }
            });

            //Ahora crear Map de instructores y grupos con su respectivo objeto usando de clave su id
            const promesaGrupos = await new GrupoServicio().CargarGrupos([...auxIdsGrupos]);

            promesaGrupos.forEach(grupo => {
                this.grupos.set(grupo.id, grupo);
            });

            //Ahora se Crean los bloques crudos que serán usados para pedir info a BD y armar bloques reales

            ////Grupos


            //Ahora se obtienen los bloques reales que serán convertidos a Horarios

        } catch (error) {
            console.log(error);
            Swal.fire(error)
        }
    }
}
export default CrearHorarioGrupos;