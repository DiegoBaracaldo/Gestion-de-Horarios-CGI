/* Este documento es creado para acceder a los arrays que llevan
los menú que serán opciones en los filtros de cada crud, ya que se deben utilizar
en dos archivos, uno es el crud donde se muestra el menú al usuario, y el otro es el archivo de filtro de
datos que lleva la lógica a parte, porque la lista que se use en ambos archivos debe ser la misma */

export const listaMenuIntruct = [
    { texto: 'nombre', valor: 'nombre' },
    { texto: 'cédula', valor: 'cedula' },
    { texto: 'especialidad', valor: 'especialidad' }
]
export const listaMenuAmbientes = [
    { texto: 'nombre', valor: 'nombre' },
    { texto: 'torre', valor: 'torre' }];

export const listaMenuGrupos = [
    { texto: 'ficha', valor: 'ficha' },
    { texto: 'código de grupo', valor: 'codigoGrupo' },
    { texto: 'programa', valor: 'programa' },
    { texto: 'id de responsable', valor: 'idResponsable' },
    { texto: 'jornada', valor: 'jornada' }
];
export const listaMenuCompetencias = [
    {texto: 'código', valor: 'codigo'},
    {texto: 'palabra clave', valor: 'palabraClave'}
];

// export const listaMenuIntruct = ['nombre', 'cedula', 'especialidad'];
// export const listaMenuAmbientes = ['nombre', 'torre'];
// export const listaMenuGrupos = ['ficha', 'codigo de grupo', 'programa', 'id responsable', 'jornada'];
// export const listaMenuCompetencias = ['codigo', 'palabra clave'];