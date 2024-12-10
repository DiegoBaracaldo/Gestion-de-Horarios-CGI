export const grupos = [
    {
      id: "1234567",
      idPrograma: "123456", // Referencia al ID de programas académicos
      idResponsable: "9012345678", // Referencia al ID de instructores
      codigoGrupo: "GRP2024XYZ01",
      idJornada: "001", // Referencia al ID de jornadas
      cantidadAprendices: 45,
      esCadenaFormación: true,
      fechaRegistro: "2024-12-07T14:50:00"
    },
    {
      id: "2345678",
      idPrograma: "234567",
      idResponsable: "8901234567",
      codigoGrupo: "GRP2024XYZ02",
      idJornada: "002",
      cantidadAprendices: 52,
      esCadenaFormación: true,
      fechaRegistro: "2024-12-07T14:55:00"
    },
    {
      id: "3456789",
      idPrograma: "345678",
      idResponsable: "8901234567",
      codigoGrupo: "GRP2024XYZ03",
      idJornada: "003",
      cantidadAprendices: 39,
      esCadenaFormación: true,
      fechaRegistro: "2024-12-07T15:00:00"
    },
    {
      id: "4567890",
      idPrograma: "456789",
      idResponsable: "7890123456",
      codigoGrupo: "GRP2024XYZ04",
      idJornada: "004",
      cantidadAprendices: 41,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:05:00"
    },
    {
      id: "5678901",
      idPrograma: "567890",
      idResponsable: "6789012345",
      codigoGrupo: "GRP2024XYZ05",
      idJornada: "005",
      cantidadAprendices: 49,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:10:00"
    },
    {
      id: "6789012",
      idPrograma: "678901",
      idResponsable: "5678901234",
      codigoGrupo: "GRP2024XYZ06",
      idJornada: "002",
      cantidadAprendices: 35,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:15:00"
    },
    {
      id: "7890123",
      idPrograma: "789012",
      idResponsable: "5678901234",
      codigoGrupo: "GRP2024XYZ07",
      idJornada: "002",
      cantidadAprendices: 47,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:20:00"
    },
    {
      id: "8901234",
      idPrograma: "890123",
      idResponsable: "4567890123",
      codigoGrupo: "GRP2024XYZ08",
      idJornada: "001",
      cantidadAprendices: 53,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:25:00"
    },
    {
      id: "9012345",
      idPrograma: "901234",
      idResponsable: "3456789012",
      codigoGrupo: "GRP2024XYZ09",
      idJornada: "001",
      cantidadAprendices: 48,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:30:00"
    },
    {
      id: "0123456",
      idPrograma: "012345",
      idResponsable: "2345678901",
      codigoGrupo: "GRP2024XYZ10",
      idJornada: "003",
      cantidadAprendices: 50,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:35:00"
    }
  ];
  
  //para conseguirla de nuevo en caso de borrar todos los datos de la original
  const gruposCopia = [
    {
      id: "1234567",
      idPrograma: "123456", // Referencia al ID de programas académicos
      idResponsable: "9012345678", // Referencia al ID de instructores
      codigoGrupo: "GRP2024XYZ01",
      idJornada: "001", // Referencia al ID de jornadas
      cantidadAprendices: 45,
      esCadenaFormación: true,
      fechaRegistro: "2024-12-07T14:50:00"
    },
    {
      id: "2345678",
      idPrograma: "234567",
      idResponsable: "8901234567",
      codigoGrupo: "GRP2024XYZ02",
      idJornada: "002",
      cantidadAprendices: 52,
      esCadenaFormación: true,
      fechaRegistro: "2024-12-07T14:55:00"
    },
    {
      id: "3456789",
      idPrograma: "345678",
      idResponsable: "8901234567",
      codigoGrupo: "GRP2024XYZ03",
      idJornada: "003",
      cantidadAprendices: 39,
      esCadenaFormación: true,
      fechaRegistro: "2024-12-07T15:00:00"
    },
    {
      id: "4567890",
      idPrograma: "456789",
      idResponsable: "7890123456",
      codigoGrupo: "GRP2024XYZ04",
      idJornada: "004",
      cantidadAprendices: 41,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:05:00"
    },
    {
      id: "5678901",
      idPrograma: "567890",
      idResponsable: "6789012345",
      codigoGrupo: "GRP2024XYZ05",
      idJornada: "005",
      cantidadAprendices: 49,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:10:00"
    },
    {
      id: "6789012",
      idPrograma: "678901",
      idResponsable: "5678901234",
      codigoGrupo: "GRP2024XYZ06",
      idJornada: "002",
      cantidadAprendices: 35,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:15:00"
    },
    {
      id: "7890123",
      idPrograma: "789012",
      idResponsable: "5678901234",
      codigoGrupo: "GRP2024XYZ07",
      idJornada: "002",
      cantidadAprendices: 47,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:20:00"
    },
    {
      id: "8901234",
      idPrograma: "890123",
      idResponsable: "4567890123",
      codigoGrupo: "GRP2024XYZ08",
      idJornada: "001",
      cantidadAprendices: 53,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:25:00"
    },
    {
      id: "9012345",
      idPrograma: "901234",
      idResponsable: "3456789012",
      codigoGrupo: "GRP2024XYZ09",
      idJornada: "001",
      cantidadAprendices: 48,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:30:00"
    },
    {
      id: "0123456",
      idPrograma: "012345",
      idResponsable: "2345678901",
      codigoGrupo: "GRP2024XYZ10",
      idJornada: "003",
      cantidadAprendices: 50,
      esCadenaFormación: false,
      fechaRegistro: "2024-12-07T15:35:00"
    }
  ];