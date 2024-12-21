export const grupos = [
    {
      id: "1234567",
      idPrograma: "123456", // Referencia al ID de programas académicos
      nombrePrograma: "Desarrollo de Software",
      idResponsable: "9012345678", // Referencia al ID de instructores
      nombreResponsable: "Carlos Gómez",
      codigoGrupo: "GRP2024XYZ01",
      idJornada: "001", // Referencia al ID de jornadas
      jornada: "mañana",
      cantidadAprendices: 45,
      esCadenaFormacion: true,
      fechaRegistro: "2024-12-07T14:50:00"
    },
    {
      id: "2345678",
      idPrograma: "234567",
      nombrePrograma: "Mantenimiento de Computadores",
      idResponsable: "8901234567",
      nombreResponsable: "María López",
      codigoGrupo: "GRP2024XYZ02",
      idJornada: "002",
      jornada: "tarde",
      cantidadAprendices: 52,
      esCadenaFormacion: true,
      fechaRegistro: "2024-12-07T14:55:00"
    },
    {
      id: "3456789",
      idPrograma: "345678",
      nombrePrograma: "Introducción a la Programación",
      idResponsable: "8901234567",
      nombreResponsable: "Juan Pérez",
      codigoGrupo: "GRP2024XYZ03",
      idJornada: "003",
      jornada: "noche",
      cantidadAprendices: 39,
      esCadenaFormacion: true,
      fechaRegistro: "2024-12-07T15:00:00"
    },
    {
      id: "4567890",
      idPrograma: "456789",
      nombrePrograma: "Gestión Empresarial",
      idResponsable: "7890123456",
      nombreResponsable: "Ana Torres",
      codigoGrupo: "GRP2024XYZ04",
      idJornada: "004",
      jornada: "sabatino",
      cantidadAprendices: 41,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:05:00"
    },
    {
      id: "5678901",
      idPrograma: "567890",
      nombrePrograma: "Redes de Datos",
      idResponsable: "6789012345",
      jornada: "virtual",
      nombreResponsable: "Luis Herrera",
      codigoGrupo: "GRP2024XYZ05",
      idJornada: "005",
      cantidadAprendices: 49,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:10:00"
    },
    {
      id: "6789012",
      idPrograma: "678901",
      nombrePrograma: "Diseño Gráfico Básico",
      idResponsable: "5678901234",
      nombreResponsable: "Sofía Martínez",
      codigoGrupo: "GRP2024XYZ06",
      idJornada: "002",
      jornada: "tarde",
      cantidadAprendices: 35,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:15:00"
    },
    {
      id: "7890123",
      idPrograma: "789012",
      nombrePrograma: "Electricidad Residencial",
      idResponsable: "5678901234",
      nombreResponsable: "Andrés Castillo",
      codigoGrupo: "GRP2024XYZ07",
      idJornada: "002",
      jornada: "tarde",
      cantidadAprendices: 47,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:20:00"
    },
    {
      id: "8901234",
      idPrograma: "890123",
      nombrePrograma: "Gestión de Proyectos",
      idResponsable: "4567890123",
      nombreResponsable: "Laura Mejía",
      codigoGrupo: "GRP2024XYZ08",
      idJornada: "001",
      jornada: "mañana",
      cantidadAprendices: 53,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:25:00"
    },
    {
      id: "9012345",
      idPrograma: "901234",
      nombrePrograma: "Marketing Digital",
      idResponsable: "3456789012",
      nombreResponsable: "Ricardo Díaz",
      codigoGrupo: "GRP2024XYZ09",
      idJornada: "001",
      jornada: "mañana",
      cantidadAprendices: 48,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:30:00"
    },
    {
      id: "0123456",
      idPrograma: "012345",
      nombrePrograma: "Sistemas de Información",
      idResponsable: "2345678901",
      nombreResponsable: "Carolina Ríos",
      codigoGrupo: "GRP2024XYZ10",
      idJornada: "003",
      jornada: "noche",
      cantidadAprendices: 50,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:35:00"
    }
  ];
  
  //para conseguirla de nuevo en caso de borrar todos los datos de la original
  const gruposCopia = [
    {
      id: "1234567",
      idPrograma: "123456", // Referencia al ID de programas académicos
      nombrePrograma: "Desarrollo de Software",
      idResponsable: "9012345678", // Referencia al ID de instructores
      nombreResponsable: "Carlos Gómez",
      codigoGrupo: "GRP2024XYZ01",
      idJornada: "001", // Referencia al ID de jornadas
      jornada: "mañana",
      cantidadAprendices: 45,
      esCadenaFormacion: true,
      fechaRegistro: "2024-12-07T14:50:00"
    },
    {
      id: "2345678",
      idPrograma: "234567",
      nombrePrograma: "Mantenimiento de Computadores",
      idResponsable: "8901234567",
      nombreResponsable: "María López",
      codigoGrupo: "GRP2024XYZ02",
      idJornada: "002",
      jornada: "tarde",
      cantidadAprendices: 52,
      esCadenaFormacion: true,
      fechaRegistro: "2024-12-07T14:55:00"
    },
    {
      id: "3456789",
      idPrograma: "345678",
      nombrePrograma: "Introducción a la Programación",
      idResponsable: "8901234567",
      nombreResponsable: "Juan Pérez",
      codigoGrupo: "GRP2024XYZ03",
      idJornada: "003",
      jornada: "noche",
      cantidadAprendices: 39,
      esCadenaFormacion: true,
      fechaRegistro: "2024-12-07T15:00:00"
    },
    {
      id: "4567890",
      idPrograma: "456789",
      nombrePrograma: "Gestión Empresarial",
      idResponsable: "7890123456",
      nombreResponsable: "Ana Torres",
      codigoGrupo: "GRP2024XYZ04",
      idJornada: "004",
      jornada: "sabatino",
      cantidadAprendices: 41,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:05:00"
    },
    {
      id: "5678901",
      idPrograma: "567890",
      nombrePrograma: "Redes de Datos",
      idResponsable: "6789012345",
      jornada: "virtual",
      nombreResponsable: "Luis Herrera",
      codigoGrupo: "GRP2024XYZ05",
      idJornada: "005",
      cantidadAprendices: 49,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:10:00"
    },
    {
      id: "6789012",
      idPrograma: "678901",
      nombrePrograma: "Diseño Gráfico Básico",
      idResponsable: "5678901234",
      nombreResponsable: "Sofía Martínez",
      codigoGrupo: "GRP2024XYZ06",
      idJornada: "002",
      jornada: "tarde",
      cantidadAprendices: 35,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:15:00"
    },
    {
      id: "7890123",
      idPrograma: "789012",
      nombrePrograma: "Electricidad Residencial",
      idResponsable: "5678901234",
      nombreResponsable: "Andrés Castillo",
      codigoGrupo: "GRP2024XYZ07",
      idJornada: "002",
      jornada: "tarde",
      cantidadAprendices: 47,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:20:00"
    },
    {
      id: "8901234",
      idPrograma: "890123",
      nombrePrograma: "Gestión de Proyectos",
      idResponsable: "4567890123",
      nombreResponsable: "Laura Mejía",
      codigoGrupo: "GRP2024XYZ08",
      idJornada: "001",
      jornada: "mañana",
      cantidadAprendices: 53,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:25:00"
    },
    {
      id: "9012345",
      idPrograma: "901234",
      nombrePrograma: "Marketing Digital",
      idResponsable: "3456789012",
      nombreResponsable: "Ricardo Díaz",
      codigoGrupo: "GRP2024XYZ09",
      idJornada: "001",
      jornada: "mañana",
      cantidadAprendices: 48,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:30:00"
    },
    {
      id: "0123456",
      idPrograma: "012345",
      nombrePrograma: "Sistemas de Información",
      idResponsable: "2345678901",
      nombreResponsable: "Carolina Ríos",
      codigoGrupo: "GRP2024XYZ10",
      idJornada: "003",
      jornada: "noche",
      cantidadAprendices: 50,
      esCadenaFormacion: false,
      fechaRegistro: "2024-12-07T15:35:00"
    }
  ];