const sqlite = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

class ConexionBD {

    constructor() {

        //es buena práctica para almacenar una base de datos local embebida, se toma en cuenta
        //tanto desarrollo como producción
        this.db = new sqlite.Database(path.join(app.getPath('userData'), 'database.db'), (error) => {
            if (error) console.error("Error al conectar con SQLite", error);
            else console.log("Conectado a SQLite");
        });

    }

    VerificarTablas() {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='programas'", (err, fila) => {
                if (err) {
                    console.error("Error al verificar tablas!", err);
                    reject(err);
                } else {
                    if(fila) resolve(true);
                    else resolve(false);
                }
            });
        });
    }

    CrearBaseDatos() {
        console.log("Creando base de datos...")
        this.CrearTablaTorres();
        this.CrearTablaJornadas();
        this.CrearTablaProgramas();
        this.CrearTablaInstructores();
        this.CrearTablaAmbientes();
        this.CrearTablaGrupos();
        this.CrearTablaCompetencias();
        this.InsertarTorresMock();
        this.InsertarJornadasMock();
        this.InsertarProgramasMock();
        this.InsertarInstructoresMock();
        this.InsertarAmbientesMock();
        this.InsertarGruposMock();
        this.InsertarCompetenciasMock();
    }

    CrearTablaTorres() {
        this.db.run(
            `
            CREATE TABLE IF NOT EXISTS torres (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR(100) NOT NULL UNIQUE,
                fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            `
        );
    }

    CrearTablaJornadas() {
        this.db.run(
            `
            CREATE TABLE IF NOT EXISTS jornadas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo VARCHAR(25) NOT NULL UNIQUE,
            franjaDisponibilidad TEXT NOT NULL, 
            fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            `
        );
    }

    CrearTablaProgramas() {
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
            `
        );
    }

    CrearTablaInstructores() {
        this.db.run(
            `
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
            `
        );
    }

    CrearTablaAmbientes() {
        this.db.run(
            `
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

    CrearTablaGrupos() {
        this.db.run(
            `
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
            `
        );
    }

    CrearTablaCompetencias() {
        this.db.run(
            `
            CREATE TABLE IF NOT EXISTS competencias (
            id INTEGER PRIMARY KEY,
            idPrograma INTEGER NOT NULL,
            descripcion VARCHAR(249) NOT NULL,
            horasRequeridas INTEGER NOT NULL,
            fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (idPrograma) REFERENCES programas(id)
            );
            `
        );
    }

    InsertarTorresMock() {
        this.db.exec(
            `
            INSERT INTO torres (nombre) VALUES ('Torre A');
            INSERT INTO torres (nombre) VALUES ('Torre B');
            INSERT INTO torres (nombre) VALUES ('Torre C');
            INSERT INTO torres (nombre) VALUES ('Torre D');
            `
        );
    }

    InsertarAmbientesMock() {
        this.db.exec(`
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 101', 1, 45, '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 102', 1, 35, '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 201', 2, 39, '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 202', 2, 42, '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 301', 3, 28, '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 302', 3, 59, '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 401', 4, 44, '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 402', 4, 36, '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            `);
    }

    InsertarProgramasMock() {
        this.db.exec(
            `
            INSERT INTO programas (id, nombre, tipo, cantidadTrimestres, fechaInicio, fechaFin) VALUES (123456, 'Tecnología de Sistemas', 'tecnologo', 12, '2024-11-01', '2027-11-01');
            INSERT INTO programas (id, nombre, tipo, cantidadTrimestres, fechaInicio, fechaFin) VALUES (234567, 'Técnico en Cocina', 'tecnico', 8, '2024-11-01', '2026-11-01');
            INSERT INTO programas (id, nombre, tipo, cantidadTrimestres, fechaInicio, fechaFin) VALUES (345678, 'Primeros Auxilios', 'cursoCorto', 2, '2024-11-01', '2025-05-01');
            `
        );
    }

    InsertarInstructoresMock() {
        this.db.exec(
            `
            INSERT INTO instructores (id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad) VALUES (123456, 'John Camilo Vásquez', 40, 'john@example.com', '3214445566', 'Matemáticas', '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            INSERT INTO instructores (id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad) VALUES (234567, 'Maria Gomez Castaño', 35, 'maria.gomez@example.com', '3156778890', 'Física', '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            INSERT INTO instructores (id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad) VALUES (345678, 'Carlos Ruiz Muñoz', 30, 'carlos.ruiz@example.com', '3178907744', 'Química', '[1,2,3,4,5,6,7,8,9,10,11,12,13]');
            `
        );
    }

    InsertarJornadasMock() {
        this.db.exec(
            `
            INSERT INTO jornadas (tipo, franjaDisponibilidad) VALUES ('Mañana', '[6,7,8,9,10,11,12]');
            INSERT INTO jornadas (tipo, franjaDisponibilidad) VALUES ('Tarde', '[13,14,15,16,17,18]');
            INSERT INTO jornadas (tipo, franjaDisponibilidad) VALUES ('Noche', '[19,20,21,22]');
            `
        );
    }

    InsertarGruposMock() {
        this.db.exec(
            `
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, cantidadAprendices) VALUES (849387, 123456, 123456, 1, 'G100SSTG', 30);
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, esCadenaFormacion, cantidadAprendices) VALUES (520949, 123456, 123456, 2, 'G229909UURR', true, 25);
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, cantidadAprendices) VALUES (478302, 234567, 234567, 3, 'G300UURRYE', 20);
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, cantidadAprendices) VALUES (674589, 234567, 234567, 1, 'G488FFGRYY', 35);
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, esCadenaFormacion, cantidadAprendices) VALUES (096724, 345678, 345678, 2, 'G577GGFYYR', true, 28);
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, cantidadAprendices) VALUES (263798, 345678, 345678, 3, 'G600IIFFN', 32);
            `
        );
    }

    InsertarCompetenciasMock() {
        this.db.exec(
            `
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (123456, 123456, 'Estructura sistemas de computación cuántico con facilidad', 12);
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (234567, 123456, 'Configura bases de datos con facilidad sin necesidad de ardillas', 10);
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (345678, 234567, 'Prepara un rissotto muy agradable al paladar de los ratones', 20);
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (456789, 234567, 'Estructura pasteles que son arrojados a la basura con facilidad', 6);
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (567891, 345678, 'Implementa la respiración boca a boca sin mal aliento', 15);
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (678912, 345678, 'Llama a emergencias fácilemnte sin poner la canción de daddy yankee', 5);
            `
        );
    }

    CerrarBaseDatos() {
        this.db.close();
    }
}

module.exports = ConexionBD;