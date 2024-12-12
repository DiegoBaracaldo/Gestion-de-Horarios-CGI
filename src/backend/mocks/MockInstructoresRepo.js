export const instructores = [
  {
    id: "1234567890",
    nombre: "Carlos Gómez",
    topeHoras: 40,
    correo: "carlos.gomez@example.com",
    telefono: "3001234567",
    especialidad: "Ingeniería de Sistemas",
    disponible: true,
    esResponsable: true,
    franjaDisponibilidad: [12, 45, 78, 120, 250],
    fechaRegistro: "2024-12-07T13:00:00"
  },
  {
    id: "2345678901",
    nombre: "María López",
    topeHoras: 35,
    correo: "maria.lopez@example.com",
    telefono: "3012345678",
    especialidad: "Psicología",
    disponible: true,
    esResponsable: false,
    franjaDisponibilidad: [25, 89, 133, 200, 320],
    fechaRegistro: "2024-12-07T13:05:00"
  },
  {
    id: "3456789012",
    nombre: "Juan Pérez",
    topeHoras: 50,
    correo: "juan.perez@example.com",
    telefono: "3023456789",
    especialidad: "Matemáticas",
    disponible: true,
    esResponsable: true,
    franjaDisponibilidad: [14, 67, 101, 201, 300],
    fechaRegistro: "2024-12-07T13:10:00"
  },
  {
    id: "4567890123",
    nombre: "Ana Torres",
    topeHoras: 30,
    correo: "ana.torres@example.com",
    telefono: "3034567890",
    especialidad: "Física",
    disponible: true,
    esResponsable: false,
    franjaDisponibilidad: [10, 50, 120, 200, 336],
    fechaRegistro: "2024-12-07T13:15:00"
  },
  {
    id: "5678901234",
    nombre: "Luis Herrera",
    topeHoras: 45,
    correo: "luis.herrera@example.com",
    telefono: "3045678901",
    especialidad: "Química",
    disponible: false,
    esResponsable: true,
    franjaDisponibilidad: [5, 45, 110, 250, 310],
    fechaRegistro: "2024-12-07T13:20:00"
  },
  {
    id: "6789012345",
    nombre: "Sofía Martínez",
    topeHoras: 32,
    correo: "sofia.martinez@example.com",
    telefono: "3056789012",
    especialidad: "Lenguas Extranjeras",
    disponible: true,
    esResponsable: false,
    franjaDisponibilidad: [7, 88, 150, 260, 300],
    fechaRegistro: "2024-12-07T13:25:00"
  },
  {
    id: "7890123456",
    nombre: "Andrés Castillo",
    topeHoras: 38,
    correo: "andres.castillo@example.com",
    telefono: "3067890123",
    especialidad: "Historia",
    disponible: true,
    esResponsable: true,
    franjaDisponibilidad: [15, 67, 133, 220, 330],
    fechaRegistro: "2024-12-07T13:30:00"
  },
  {
    id: "8901234567",
    nombre: "Laura Mejía",
    topeHoras: 47,
    correo: "laura.mejia@example.com",
    telefono: "3078901234",
    especialidad: "Arte",
    disponible: false,
    esResponsable: false,
    franjaDisponibilidad: [20, 99, 140, 200, 335],
    fechaRegistro: "2024-12-07T13:35:00"
  },
  {
    id: "9012345678",
    nombre: "Ricardo Díaz",
    topeHoras: 42,
    correo: "ricardo.diaz@example.com",
    telefono: "3089012345",
    especialidad: "Economía",
    disponible: true,
    esResponsable: true,
    franjaDisponibilidad: [3, 88, 150, 240, 325],
    fechaRegistro: "2024-12-07T13:40:00"
  },
  {
    id: "0123456789",
    nombre: "Carolina Ríos",
    topeHoras: 39,
    correo: "carolina.rios@example.com",
    telefono: "3090123456",
    especialidad: "Biología",
    disponible: true,
    esResponsable: false,
    franjaDisponibilidad: [18, 77, 125, 210, 320],
    fechaRegistro: "2024-12-07T13:45:00"
  }
];


//para conseguirla de nuevo en caso de borrar todos los datos de la original
const instructoresCopia = [
  {
    id: "1234567890",
    nombre: "Carlos Gómez",
    topeHoras: 40,
    correo: "carlos.gomez@example.com",
    telefono: "3001234567",
    especialidad: "Ingeniería de Sistemas",
    disponible: true,
    esResponsable: true,
    franjaDisponibilidad: [12, 45, 78, 120, 250],
    fechaRegistro: "2024-12-07T13:00:00"
  },
  {
    id: "2345678901",
    nombre: "María López",
    topeHoras: 35,
    correo: "maria.lopez@example.com",
    telefono: "3012345678",
    especialidad: "Psicología",
    disponible: true,
    esResponsable: false,
    franjaDisponibilidad: [25, 89, 133, 200, 320],
    fechaRegistro: "2024-12-07T13:05:00"
  },
  {
    id: "3456789012",
    nombre: "Juan Pérez",
    topeHoras: 50,
    correo: "juan.perez@example.com",
    telefono: "3023456789",
    especialidad: "Matemáticas",
    disponible: true,
    esResponsable: true,
    franjaDisponibilidad: [14, 67, 101, 201, 300],
    fechaRegistro: "2024-12-07T13:10:00"
  },
  {
    id: "4567890123",
    nombre: "Ana Torres",
    topeHoras: 30,
    correo: "ana.torres@example.com",
    telefono: "3034567890",
    especialidad: "Física",
    disponible: true,
    esResponsable: false,
    franjaDisponibilidad: [10, 50, 120, 200, 336],
    fechaRegistro: "2024-12-07T13:15:00"
  },
  {
    id: "5678901234",
    nombre: "Luis Herrera",
    topeHoras: 45,
    correo: "luis.herrera@example.com",
    telefono: "3045678901",
    especialidad: "Química",
    disponible: false,
    esResponsable: true,
    franjaDisponibilidad: [5, 45, 110, 250, 310],
    fechaRegistro: "2024-12-07T13:20:00"
  },
  {
    id: "6789012345",
    nombre: "Sofía Martínez",
    topeHoras: 32,
    correo: "sofia.martinez@example.com",
    telefono: "3056789012",
    especialidad: "Lenguas Extranjeras",
    disponible: true,
    esResponsable: false,
    franjaDisponibilidad: [7, 88, 150, 260, 300],
    fechaRegistro: "2024-12-07T13:25:00"
  },
  {
    id: "7890123456",
    nombre: "Andrés Castillo",
    topeHoras: 38,
    correo: "andres.castillo@example.com",
    telefono: "3067890123",
    especialidad: "Historia",
    disponible: true,
    esResponsable: true,
    franjaDisponibilidad: [15, 67, 133, 220, 330],
    fechaRegistro: "2024-12-07T13:30:00"
  },
  {
    id: "8901234567",
    nombre: "Laura Mejía",
    topeHoras: 47,
    correo: "laura.mejia@example.com",
    telefono: "3078901234",
    especialidad: "Arte",
    disponible: false,
    esResponsable: false,
    franjaDisponibilidad: [20, 99, 140, 200, 335],
    fechaRegistro: "2024-12-07T13:35:00"
  },
  {
    id: "9012345678",
    nombre: "Ricardo Díaz",
    topeHoras: 42,
    correo: "ricardo.diaz@example.com",
    telefono: "3089012345",
    especialidad: "Economía",
    disponible: true,
    esResponsable: true,
    franjaDisponibilidad: [3, 88, 150, 240, 325],
    fechaRegistro: "2024-12-07T13:40:00"
  },
  {
    id: "0123456789",
    nombre: "Carolina Ríos",
    topeHoras: 39,
    correo: "carolina.rios@example.com",
    telefono: "3090123456",
    especialidad: "Biología",
    disponible: true,
    esResponsable: false,
    franjaDisponibilidad: [18, 77, 125, 210, 320],
    fechaRegistro: "2024-12-07T13:45:00"
  }
];