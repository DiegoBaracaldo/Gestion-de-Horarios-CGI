
//nombreResponable, jornada y nombrePrograma, en realidad no van, sino que toca ponerlo
//para por la simulación de persistencia con una lista

class Grupo{
    constructor(id, idPrograma, idResponsable, codigoGrupo, idJornada,
        cantidadAprendices, esCadenaFormacion, fechaRegistro, nombrePrograma,
        jornada, nombreResponsable
    ){
        this.id = id;
        this.idPrograma = idPrograma;
        this.idResponsable = idResponsable;
        this.codigoGrupo = codigoGrupo;
        this.idJornada = idJornada;
        this.cantidadAprendices = cantidadAprendices;
        this.esCadenaFormacion = esCadenaFormacion;
        this.fechaRegistro = fechaRegistro;

        this.jornada = jornada;
        this.nombrePrograma = nombrePrograma;
        this.nombreResponsable = nombreResponsable;
    }
}
export default Grupo;