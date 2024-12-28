const sqlite = require('sqlite3').verbose();
const path = require('path');
const {app} = require('electron');

class ConexionBD {

    constructor() {

        //es buena práctica para almacenar una base de datos local embebida, se toma en cuenta
        //tanto desarrollo como producción
        this.db = new sqlite.Database(path.join(app.getPath('userData'), 'database.db'), (error) => {
            if (error) console.error("Error al conectar con SQLite", error);
            else console.log("Conectando a SQLite...");
        });
    }

    VerificarTablas() {
        let bandera = false;
        this.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='programas'", (err, fila) => {
            if (err) {
                console.error("Error al verificar tablas!", err);
            } else {
                if (fila) bandera = true;
            }
        });
        return bandera;
    }

    CrearBaseDatos() {
        console.log("Creando base de datos...")
        this.db.run(
            `
            CREATE TABLE IF NOT EXISTS programas (
                id INTEGER PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL UNIQUE,
                tipo VARCHAR(50) NOT NULL, 
                cantidadTrimestres INTEGER NOT NULL,
                fechaInicio DATE NOT NULL,
                fechaFin DATE NOT NULL,
                fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        
            CREATE TABLE IF NOT EXISTS competencias (
                id INTEGER PRIMARY KEY,
                idPrograma INTEGER NOT NULL,
                descripcion VARCHAR(249) NOT NULL,
                horasRequeridas INTEGER NOT NULL,
                fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (idPrograma) REFERENCES programas(id)
            );
        
            CREATE TABLE IF NOT EXISTS jornadas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo VARCHAR(25) NOT NULL UNIQUE,
                franjaDisponibilidad TEXT NOT NULL, 
                fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        
            CREATE TABLE IF NOT EXISTS instructores (
                id INTEGER PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL UNIQUE,
                topeHoras INTEGER NOT NULL,
                correo VARCHAR(100) NOT NULL UNIQUE,
                telefono VARCHAR(100) NOT NULL UNIQUE,
                especialidad VARCHAR(100) NOT NULL,
                disponibilidad BOOLEAN NOT NULL DEFAULT TRUE,
                esResponsable BOOLEAN NOT NULL DEFAULT FALSE,
                franjaDisponibilidad TEXT NOT NULL,
                fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        
            CREATE TABLE IF NOT EXISTS grupos (
                id INTEGER PRIMARY KEY,
                idPrograma INTEGER NOT NULL,
                idResponsable INTEGER NOT NULL,
                idJornada INTEGER NOT NULL,
                codigoGrupo VARCHAR(100) NOT NULL UNIQUE,
                cantidadAprendices INTEGER NOT NULL,
                esCadenaFormacion BOOLEAN NOT NULL DEFAULT FALSE,
                fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (idPrograma) REFERENCES programas (id),
                FOREIGN KEY (idResponsable) REFERENCES instructores(id),
                FOREIGN KEY (idJornada) REFERENCES jornadas(id)
            );
        
            CREATE TABLE IF NOT EXISTS torres (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR(100) NOT NULL UNIQUE,
                fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        
            CREATE TABLE IF NOT EXISTS ambientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR(100) NOT NULL,
                idTorre INTEGER NOT NULL,
                capacidad INTEGER NOT NULL,
                franjaDisponibilidad TEXT NOT NULL,
                fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (idTorre) REFERENCES torres(id)
            );
        `
        );
    }

    CerrarBaseDatos() {
        this.db.close();
    }
}

module.exports = ConexionBD;