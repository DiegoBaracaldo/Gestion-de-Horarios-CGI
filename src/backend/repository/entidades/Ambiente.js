class Ambiente{
    constructor(id, nombre, idTorre, capacidad, franjaDisponibilidad, fechaRegistro,
        nombreTorre
    ){
        this.id = id;
        this.nombre = nombre;
        this.idTorre = idTorre;
        this.capacidad = capacidad;
        this.franjaDisponibilidad = franjaDisponibilidad;
        this.fechaRegistro = fechaRegistro;
        //variables necesarias que no están en BD
        this.nombreTorre = nombreTorre;
    }
}
export default Ambiente;