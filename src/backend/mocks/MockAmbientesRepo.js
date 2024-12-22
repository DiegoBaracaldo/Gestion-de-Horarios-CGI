//Los mocks llevan info extra como el nombre de la torre,  ya que en la base de datos real
//se obtienen losd atos juntos en un join

export const ambientes = [
    {
      id: "001",
      nombre: "Aula 101",
      idTorre: "101", // Referencia al ID de la tabla edificios
      nombreTorre: "Edificio Central",
      capacidad: 40,
      franjaDisponibilidad: [12, 34, 56, 78, 120],
      fechaRegistro: "2024-12-07T14:00:00"
    },
    {
      id: "002",
      nombre: "Laboratorio de Física",
      idTorre: "102", // Referencia al ID de la tabla edificios
      nombreTorre:"Edificio Administrativo",
      capacidad: 30,
      franjaDisponibilidad: [15, 45, 90, 150, 200],
      fechaRegistro: "2024-12-07T14:05:00"
    },
    {
      id: "003",
      nombre: "Aula 202",
      idTorre: "103",
      nombreTorre: "Edificio de Ciencias",
      capacidad: 50,
      franjaDisponibilidad: [20, 60, 100, 160, 300],
      fechaRegistro: "2024-12-07T14:10:00"
    },
    {
      id: "004",
      nombre: "Laboratorio de Computo",
      idTorre: "104",
      nombreTorre: "Edificio de Humanidades",
      capacidad: 35,
      franjaDisponibilidad: [10, 25, 110, 200, 336],
      fechaRegistro: "2024-12-07T14:15:00"
    },
    {
      id: "005",
      nombre: "Aula de Artes",
      idTorre: "105",
      nombreTorre: "Edificio de Ingeniería",
      capacidad: 45,
      franjaDisponibilidad: [8, 50, 125, 220, 320],
      fechaRegistro: "2024-12-07T14:20:00"
    },
    {
      id: "006",
      nombre: "Aula 302",
      idTorre: "106",
      nombreTorre: "Edificio Deportivo",
      capacidad: 40,
      franjaDisponibilidad: [18, 67, 133, 210, 310],
      fechaRegistro: "2024-12-07T14:25:00"
    },
    {
      id: "007",
      nombre: "Laboratorio de Idiomas",
      idTorre: "107",
      nombreTorre: "Edificio de Artes",
      capacidad: 30,
      franjaDisponibilidad: [5, 99, 150, 240, 300],
      fechaRegistro: "2024-12-07T14:30:00"
    },
    {
      id: "008",
      nombre: "Aula de Música",
      idTorre: "108",
      nombreTorre: "Edificio de Biblioteca",
      capacidad: 50,
      franjaDisponibilidad: [15, 77, 125, 210, 330],
      fechaRegistro: "2024-12-07T14:35:00"
    },
    {
      id: "009",
      nombre: "Laboratorio de Química",
      idTorre: "109",
      nombreTorre: "Edificio de Laboratorios",
      capacidad: 40,
      franjaDisponibilidad: [7, 45, 90, 160, 310],
      fechaRegistro: "2024-12-07T14:40:00"
    },
    {
      id: "010",
      nombre: "Aula de Conferencias",
      idTorre: "110",
      nombreTorre: "Edificio Residencial",
      capacidad: 50,
      franjaDisponibilidad: [10, 50, 100, 200, 336],
      fechaRegistro: "2024-12-07T14:45:00"
    }
  ];
  
  //para conseguirla de nuevo en caso de borrar todos los datos de la original
  const ambientesCopia = [
    {
      id: "001",
      nombre: "Aula 101",
      idTorre: "101", // Referencia al ID de la tabla edificios
      nombreTorre: "Edificio Central",
      capacidad: 40,
      franjaDisponibilidad: [12, 34, 56, 78, 120],
      fechaRegistro: "2024-12-07T14:00:00"
    },
    {
      id: "002",
      nombre: "Laboratorio de Física",
      idTorre: "102", // Referencia al ID de la tabla edificios
      nombreTorre:"Edificio Administrativo",
      capacidad: 30,
      franjaDisponibilidad: [15, 45, 90, 150, 200],
      fechaRegistro: "2024-12-07T14:05:00"
    },
    {
      id: "003",
      nombre: "Aula 202",
      idTorre: "103",
      nombreTorre: "Edificio de Ciencias",
      capacidad: 50,
      franjaDisponibilidad: [20, 60, 100, 160, 300],
      fechaRegistro: "2024-12-07T14:10:00"
    },
    {
      id: "004",
      nombre: "Laboratorio de Computo",
      idTorre: "104",
      nombreTorre: "Edificio de Humanidades",
      capacidad: 35,
      franjaDisponibilidad: [10, 25, 110, 200, 336],
      fechaRegistro: "2024-12-07T14:15:00"
    },
    {
      id: "005",
      nombre: "Aula de Artes",
      idTorre: "105",
      nombreTorre: "Edificio de Ingeniería",
      capacidad: 45,
      franjaDisponibilidad: [8, 50, 125, 220, 320],
      fechaRegistro: "2024-12-07T14:20:00"
    },
    {
      id: "006",
      nombre: "Aula 302",
      idTorre: "103",
      nombreTorre: "Edificio Deportivo",
      capacidad: 40,
      franjaDisponibilidad: [18, 67, 133, 210, 310],
      fechaRegistro: "2024-12-07T14:25:00"
    },
    {
      id: "007",
      nombre: "Laboratorio de Idiomas",
      idTorre: "102",
      nombreTorre: "Edificio de Artes",
      capacidad: 30,
      franjaDisponibilidad: [5, 99, 150, 240, 300],
      fechaRegistro: "2024-12-07T14:30:00"
    },
    {
      id: "008",
      nombre: "Aula de Música",
      idTorre: "105",
      nombreTorre: "Edificio de Biblioteca",
      capacidad: 50,
      franjaDisponibilidad: [15, 77, 125, 210, 330],
      fechaRegistro: "2024-12-07T14:35:00"
    },
    {
      id: "009",
      nombre: "Laboratorio de Química",
      idTorre: "104",
      nombreTorre: "Edificio de Laboratorios",
      capacidad: 40,
      franjaDisponibilidad: [7, 45, 90, 160, 310],
      fechaRegistro: "2024-12-07T14:40:00"
    },
    {
      id: "010",
      nombre: "Aula de Conferencias",
      idTorre: "101",
      nombreTorre: "Edificio Residencial",
      capacidad: 50,
      franjaDisponibilidad: [10, 50, 100, 200, 336],
      fechaRegistro: "2024-12-07T14:45:00"
    }
  ];