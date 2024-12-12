class Instructor{
    constructor(id, nombre, topeHoras, correo, telefono, especialidad, 
        disponible, esResponsable, franjaDisponibilidad, fechaRegistro){
            this.id = id,
            this.nombre = nombre;
            this.topeHoras = topeHoras;
            this.correo = correo;
            this.telefono = telefono;
            this.especialidad = especialidad;
            this.disponible = disponible;
            this.esResponsable = esResponsable;
            this.franjaDisponibilidad = franjaDisponibilidad;
            this.fechaRegistro = fechaRegistro;
    }
}
export default Instructor;