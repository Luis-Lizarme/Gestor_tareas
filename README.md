# Gestor de Tareas

Una aplicación web sencilla y eficiente para gestionar tus tareas diarias. Permite crear, editar, eliminar y organizar tareas con diferentes niveles de prioridad.

## Características

- **Gestión de Tareas**: Crear, leer, actualizar y eliminar tareas (CRUD).
- **Prioridades**: Asignar prioridades (Alta, Media, Baja) a cada tarea.
- **Fechas de Vencimiento**: Establecer fechas límite para las tareas.
- **Filtrado y Búsqueda**: Filtrar por estado (Todas, Pendientes, Completadas) y buscar por texto.
- **Persistencia de Datos**: Las tareas se guardan automáticamente en el almacenamiento local del navegador (LocalStorage), por lo que no se pierden al recargar la página.
- **Diseño Responsivo**: Interfaz adaptada a diferentes tamaños de pantalla.

## Tecnologías Utilizadas

- HTML5
- CSS3 (Variables CSS, Flexbox, Diseño Responsivo)
- JavaScript (Vanilla JS, DOM Manipulation, LocalStorage)
- FontAwesome (Iconos)

## Instalación y Ejecución

Esta es una aplicación web estática, por lo que no requiere instalación de dependencias ni servidores complejos.

### Pasos para ejecutar:

1.  **Clonar o descargar el repositorio**:
    Si tienes Git instalado, puedes clonar el repositorio. Si no, descarga el código como un archivo ZIP y extráelo.

2.  **Abrir la aplicación**:
    Navega a la carpeta del proyecto y haz doble clic en el archivo `index.html` para abrirlo en tu navegador web predeterminado.

    Opcionalmente, puedes usar una extensión como "Live Server" en VS Code para ejecutarlo en un servidor local.

## Uso

1.  **Agregar Tarea**: Rellena el formulario con el título, prioridad, fecha y descripción, y haz clic en "Agregar Tarea".
2.  **Completar Tarea**: Haz clic en el círculo (checkbox) a la izquierda de una tarea para marcarla como completada o pendiente.
3.  **Editar Tarea**: Haz clic en el icono de lápiz o en el título de la tarea para cargar sus datos en el formulario y modificarlos.
4.  **Eliminar Tarea**: Haz clic en el icono de basura para eliminar la tarea permanentemente.
5.  **Filtrar**: Usa los botones "Todas", "Pendientes" y "Completadas" en la parte superior para filtrar la lista.
