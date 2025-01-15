const SQLITE_ERROR = "Error de SQL o base de datos faltante (SQLITE_ERROR, Código SQL 1)";
const SQLITE_INTERNAL = "Error lógico interno en SQLite (SQLITE_INTERNAL, Código SQL 2)";
const SQLITE_PERM = "Acceso denegado para esta operación (SQLITE_PERM, Código SQL 3)";
const SQLITE_ABORT = "Rutina de devolución de llamada solicitó un aborto (SQLITE_ABORT, Código SQL 4)";
const SQLITE_BUSY = "El archivo de la base de datos está bloqueado (SQLITE_BUSY, Código SQL 5)";
const SQLITE_LOCKED = "Una tabla en la base de datos está bloqueada (SQLITE_LOCKED, Código SQL 6)";
const SQLITE_NOMEM = "Fallo en malloc() (SQLITE_NOMEM, Código SQL 7)";
const SQLITE_READONLY = "Esta base de datos es de solo lectura (SQLITE_READONLY, Código SQL 8)";
const SQLITE_INTERRUPT = "Operación terminada por sqlite3_interrupt() (SQLITE_INTERRUPT, Código SQL 9)";
const SQLITE_IOERR = "Ocurrió algún tipo de error de E/S de disco (SQLITE_IOERR, Código SQL 10)";
const SQLITE_CORRUPT = "La imagen del disco de la base de datos está malformada (SQLITE_CORRUPT, Código SQL 11)";
const SQLITE_NOTFOUND = "Código de operación desconocido en sqlite3_file_control() (SQLITE_NOTFOUND, Código SQL 12)";
const SQLITE_FULL = "La base de datos está llena, no se pueden insertar más datos (SQLITE_FULL, Código SQL 13)";
const SQLITE_CANTOPEN = "No se puede abrir el archivo de la base de datos (SQLITE_CANTOPEN, Código SQL 14)";
const SQLITE_PROTOCOL = "Error en el protocolo de bloqueo de la base de datos (SQLITE_PROTOCOL, Código SQL 15)";
const SQLITE_EMPTY = "La base de datos está vacía (SQLITE_EMPTY, Código SQL 16)";
const SQLITE_SCHEMA = "El esquema de la base de datos cambió (SQLITE_SCHEMA, Código SQL 17)";
const SQLITE_TOOBIG = "La cadena o BLOB excede el límite de tamaño (SQLITE_TOOBIG, Código SQL 18)";
const SQLITE_CONSTRAINT = "Restricción  violada, no se puede hacer esto (SQLITE_CONSTRAINT, Código SQL 19)";
const SQLITE_MISMATCH = "Algún dato es incorrecto, arréglalo (SQLITE_MISMATCH, Código SQL 20)";
const SQLITE_MISUSE = "Biblioteca utilizada incorrectamente (SQLITE_MISUSE, Código SQL 21)";
const SQLITE_NOLFS = "Usa características del SO no soportadas en el host (SQLITE_NOLFS, Código SQL 22)";
const SQLITE_AUTH = "Autorización denegada (SQLITE_AUTH, Código SQL 23)";
const SQLITE_FORMAT = "Error en el formato de la base de datos auxiliar (SQLITE_FORMAT, Código SQL 24)";
const SQLITE_RANGE = "El segundo parámetro de sqlite3_bind está fuera de rango (SQLITE_RANGE, Código SQL 25)";
const SQLITE_NOTADB = "Archivo abierto que no es un archivo de base de datos (SQLITE_NOTADB, Código SQL 26)";
const SQLITE_NOTICE = "Notificaciones de sqlite3_log() (SQLITE_NOTICE, Código SQL 27)";
const SQLITE_WARNING = "Advertencias de sqlite3_log() (SQLITE_WARNING, Código SQL 28)";
const SQLITE_ROW = "sqlite3_step() tiene otra fila lista (SQLITE_ROW, Código SQL 100)";
const SQLITE_DONE = "sqlite3_step() ha terminado de ejecutarse (SQLITE_DONE, Código SQL 101)";

const ObtenerErrorSQLite = (codigo) => {
    switch (codigo) {
        case 1:
            return SQLITE_ERROR;
        case 2:
            return SQLITE_INTERNAL;
        case 3:
            return SQLITE_PERM;
        case 4:
            return SQLITE_ABORT;
        case 5:
            return SQLITE_BUSY;
        case 6:
            return SQLITE_LOCKED;
        case 7:
            return SQLITE_NOMEM;
        case 8:
            return SQLITE_READONLY;
        case 9:
            return SQLITE_INTERRUPT;
        case 10:
            return SQLITE_IOERR;
        case 11:
            return SQLITE_CORRUPT;
        case 12:
            return SQLITE_NOTFOUND;
        case 13:
            return SQLITE_FULL;
        case 14:
            return SQLITE_CANTOPEN;
        case 15:
            return SQLITE_PROTOCOL;
        case 16:
            return SQLITE_EMPTY;
        case 17:
            return SQLITE_SCHEMA;
        case 18:
            return SQLITE_TOOBIG;
        case 19:
            return SQLITE_CONSTRAINT;
        case 20:
            return SQLITE_MISMATCH;
        case 21:
            return SQLITE_MISUSE;
        case 22:
            return SQLITE_NOLFS;
        case 23:
            return SQLITE_AUTH;
        case 24:
            return SQLITE_FORMAT;
        case 25:
            return SQLITE_RANGE;
        case 26:
            return SQLITE_NOTADB;
        case 27:
            return SQLITE_NOTICE;
        case 28:
            return SQLITE_WARNING;
        case 100:
            return SQLITE_ROW;
        case 101:
            return SQLITE_DONE;
        default:
            return "Código de error desconocido";
    }
};

module.exports = ObtenerErrorSQLite;