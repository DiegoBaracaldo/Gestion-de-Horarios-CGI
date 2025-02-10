const sqlite = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

class ConexionBD {

    constructor() {

        //es buena práctica para almacenar una base de datos local embebida, se toma en cuenta
        //tanto desarrollo como producción
        this.db = new sqlite.Database(path.join(app.getPath('userData'), 'database.db'), (error) => {
            if (error) window.electron.logErrores().error(`Error al conectar con SQLite: ${error}`);
            else console.log("Conectado a SQLite");
        });

    }

    async VerificarTablas() {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='programas'", (err, fila) => {
                if (err) {
                    reject(err);
                } else {
                    if (fila) {
                        resolve(true);
                    }
                    else {
                        this.CrearBaseDatos();
                        resolve(false);
                    }
                }
            });
        });
    }

    CrearBaseDatos() {
        console.log("Creando base de datos...")
        this.db.serialize(() => {
            this.db.run("BEGIN TRANSACTION;");
            this.db.run("PRAGMA foreign_keys = ON;"); //Permitir restricciones de delete en llave foránea
            this.CrearTablaTorres();
            this.CrearTablaJornadas();
            this.CrearTablaProgramas();
            this.CrearTablaInstructores();
            this.CrearTablaAmbientes();
            this.CrearTablaGrupos();
            this.CrearTablaCompetencias();
            this.CrearTablaPiscinaCompetencias();
            this.CrearTablaFranjas();
            this.CrearTablaFusiones();
            this.CrearTablaDatosExtra();
            this.InsertarDatosIniciales();
            this.CrearTriggerHorarioCambiadoInsert();
            this.CrearTriggerHorarioCambiadoUpdate();
            this.CrearTriggerHorarioCambiadoDelete();
    
            this.InsertarTorresMock();
            this.InsertarJornadasMock();
            this.InsertarProgramasMock();
            this.InsertarInstructoresMock();
            this.InsertarAmbientesMock();
            this.InsertarGruposMock();
            this.InsertarCompetenciasMock();
            this.InsertarPiscinasMock();

            this.db.run("COMMIT;");
            // this.InsertarFranjasMock();
        });
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
            FOREIGN KEY (idTorre) REFERENCES torres(id) ON DELETE CASCADE ON UPDATE CASCADE,
            UNIQUE(nombre, idTorre) 
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
            trimestreLectivo INTEGER NOT NULL,
            fechaInicioTrimestre DATE NOT NULL,
            fechaFinTrimestre DATE NOT NULL,
            fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (idPrograma) REFERENCES programas (id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (idResponsable) REFERENCES instructores(id) ON DELETE NO ACTION ON UPDATE CASCADE,
            FOREIGN KEY (idJornada) REFERENCES jornadas(id) ON DELETE NO ACTION ON UPDATE CASCADE
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
            FOREIGN KEY (idPrograma) REFERENCES programas(id) ON DELETE CASCADE ON UPDATE CASCADE,
            UNIQUE(idprograma, descripcion)
            );
            `
        );
    }

    CrearTablaFranjas() {
        this.db.run(
            `
            CREATE TABLE IF NOT EXISTS franjas (
            franja INTEGER,
            idGrupo INTEGER NOT NULL,
            idInstructor INTEGER NULL,
            idAmbiente INTEGER NULL,
            idCompetencia INTEGER NOT NULL,
            numBloque INTEGER NOT NULL,
            fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (franja, idGrupo),
            FOREIGN KEY (idGrupo) REFERENCES grupos(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (idInstructor) REFERENCES instructores(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (idAmbiente) REFERENCES ambientes(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (idCompetencia) REFERENCES competencias(id) ON DELETE CASCADE ON UPDATE CASCADE,
            UNIQUE(franja, idInstructor),
            UNIQUE(franja, idAmbiente)
            )
            `
        );
    }

    CrearTablaPiscinaCompetencias() {
        this.db.run(
            `
            CREATE TABLE IF NOT EXISTS piscinaCompetencias (
            idGrupo INTEGER,
            idCompetencia INTEGER,
            fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (idGrupo) REFERENCES grupos(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (idCompetencia) REFERENCES competencias(id) ON DELETE CASCADE ON UPDATE CASCADE,
            PRIMARY KEY (idGrupo, idCompetencia)
            )
            `
        );
    }

    CrearTablaFusiones() {
        this.db.run(
            `
            CREATE TABLE IF NOT EXISTS fusiones (
                idAnfitrion INTEGER,
                idHuesped INTEGER,
                idPrograma NOT NULL,
                fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (idAnfitrion, idHuesped),
                FOREIGN KEY (idAnfitrion) REFERENCES grupos(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (idHuesped) REFERENCES grupos(id) ON DELETE CASCADE ON UPDATE CASCADE
            );
            `
        );
    }

    CrearTablaDatosExtra(){
        this.db.run(`
            CREATE TABLE IF NOT EXISTS datos (
                clave VARCHAR(20) PRIMARY KEY,
                valor VARCHAR(20) NOT NULL
            )
            `);
    }

    InsertarDatosIniciales(){
        this.db.exec(`
            INSERT INTO datos (clave, valor) VALUES ('horarioCambiado', 'false');
            `);
    }

    CrearTriggerHorarioCambiadoInsert(){
        this.db.run(`
            CREATE TRIGGER horario_modificado_insert
            AFTER INSERT ON franjas
            BEGIN
                UPDATE datos SET valor = 'true' WHERE clave = 'horarioCambiado';
            END;
            `);
    }

    CrearTriggerHorarioCambiadoUpdate(){
        this.db.run(`
            CREATE TRIGGER horario_modificado_update
            AFTER UPDATE ON franjas
            BEGIN
                UPDATE datos SET valor = 'true' WHERE clave = 'horarioCambiado';
            END;
            `);
    }

    CrearTriggerHorarioCambiadoDelete(){
        this.db.run(`
            CREATE TRIGGER horario_modificado_delete
            AFTER DELETE ON franjas
            BEGIN
                UPDATE datos SET valor = 'true' WHERE clave = 'horarioCambiado';
            END;
            `);
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
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 101', 1, 45, '[85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 102', 1, 35, '[169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 201', 2, 39, '[253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 202', 2, 42, '[85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 301', 3, 28, '[169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252]');
            INSERT INTO ambientes (nombre, idTorre, capacidad, franjaDisponibilidad) VALUES ('Aula 302', 3, 59, '[253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336]');
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
            INSERT INTO instructores (id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad) VALUES (123456, 'John Camilo Vásquez', 40, 'john@example.com', '3214445566', 'Matemáticas', '[85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168]');
            INSERT INTO instructores (id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad) VALUES (234567, 'Maria Gomez Castaño', 35, 'maria.gomez@example.com', '3156778890', 'Física', '[169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252]');
            INSERT INTO instructores (id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad) VALUES (345678, 'Carlos Ruiz Muñoz', 30, 'carlos.ruiz@example.com', '3178907744', 'Química', '[253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336]');
            `
        );
    }

    InsertarJornadasMock() {
        this.db.exec(
            `
            INSERT INTO jornadas (tipo, franjaDisponibilidad) VALUES ('Mañana', '[85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168]');
            INSERT INTO jornadas (tipo, franjaDisponibilidad) VALUES ('Tarde', '[169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252]');
            INSERT INTO jornadas (tipo, franjaDisponibilidad) VALUES ('Noche', '[253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336]');
            `
        );
    }

    InsertarGruposMock() {
        this.db.exec(
            `
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, cantidadAprendices, trimestreLectivo, fechaInicioTrimestre, fechaFinTrimestre) VALUES (849387, 123456, 123456, 1, 'G100SSTG', 30, 3, '2025-01-19', '2025-03-19');
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, esCadenaFormacion, cantidadAprendices, trimestreLectivo, fechaInicioTrimestre, fechaFinTrimestre) VALUES (520949, 123456, 123456, 2, 'G229909UURR', true, 25, 4, '2025-02-15', '2025-04-15');
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, cantidadAprendices, trimestreLectivo, fechaInicioTrimestre, fechaFinTrimestre) VALUES (478302, 234567, 234567, 3, 'G300UURRYE', 20, 1, '2025-01-24', '2025-03-24');
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, cantidadAprendices, trimestreLectivo, fechaInicioTrimestre, fechaFinTrimestre) VALUES (674589, 234567, 234567, 1, 'G488FFGRYY', 35, 2, '2025-01-07', '2025-03-07');
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, esCadenaFormacion, cantidadAprendices, trimestreLectivo, fechaInicioTrimestre, fechaFinTrimestre) VALUES (096724, 345678, 345678, 2, 'G577GGFYYR', true, 28, 6, '2025-01-15', '2025-03-15');
            INSERT INTO grupos (id, idPrograma, idResponsable, idJornada, codigoGrupo, cantidadAprendices, trimestreLectivo, fechaInicioTrimestre, fechaFinTrimestre) VALUES (263798, 345678, 345678, 3, 'G600IIFFN', 32, 5, '2025-01-15', '2025-03-15');
            `
        );
    }

    InsertarCompetenciasMock() {
        this.db.exec(
            `
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (123456, 123456, 'Estructura sistemas de computación en la nube con linux', 12);
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (234567, 123456, 'Configura bases de datos que trabajan con sql y mongo db', 10);
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (345678, 234567, 'Preparación adecuada del lugar del trabajo', 20);
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (456789, 234567, 'Conoce los principios fundamentales de la cocina integral', 6);
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (567891, 345678, 'Implementa la respiración boca a boca de forma correcta', 15);
            INSERT INTO competencias (id, idPrograma, descripcion, horasRequeridas) VALUES (678912, 345678, 'Conoce el protocolo de emergencia ante parada cardiaca', 5);
            `
        );
    }

    InsertarPiscinasMock() {
        this.db.exec(
            `
            INSERT INTO piscinaCompetencias (idGrupo, idCompetencia) VALUES (849387, 123456);
            INSERT INTO piscinaCompetencias (idGrupo, idCompetencia) VALUES (520949, 234567);
            INSERT INTO piscinaCompetencias (idGrupo, idCompetencia) VALUES (263798, 678912);
            INSERT INTO piscinaCompetencias (idGrupo, idCompetencia) VALUES (096724, 567891);
            INSERT INTO piscinaCompetencias (idGrupo, idCompetencia) VALUES (674589, 345678);
            INSERT INTO piscinaCompetencias (idGrupo, idCompetencia) VALUES (478302, 456789);
            `
        );
    }

    InsertarFranjasMock() {
        this.db.exec(
            `
            INSERT INTO franjas (franja, idGrupo, idInstructor, idAmbiente, idCompetencia) 
            VALUES  (1, 849387, 123456, 1, 123456);
            INSERT INTO franjas (franja, idGrupo, idInstructor, idAmbiente, idCompetencia) 
            VALUES  (3, 849387, 123456, 1, 123456);
            INSERT INTO franjas (franja, idGrupo, idInstructor, idAmbiente, idCompetencia) 
            VALUES  (5, 849387, 123456, 1, 123456);
            INSERT INTO franjas (franja, idGrupo, idInstructor, idAmbiente, idCompetencia) 
            VALUES  (8, 520949, 234567, 2, 234567);
            INSERT INTO franjas (franja, idGrupo, idInstructor, idAmbiente, idCompetencia) 
            VALUES  (21, 478302, 345678, 3, 456789);
            `
        );
    }

    CerrarBaseDatos() {
        this.db.close();
    }
}

module.exports = ConexionBD;