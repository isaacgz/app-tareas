require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadosChecklist } = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

console.clear();

const main = async() => {   

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB) {
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        //Imprime el menu
        opt = await inquirerMenu();
        // console.log({opt});

        switch (opt) {
            case '1':
                //opcion crear
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);

                break;
            case '2': //Lista todas
                tareas.listadoCompleto();
                break;
            case '3': //Listar completadas
                tareas.listarPendientesCompletadas(true);
                break;
            case '4': // Listar pendientes
                tareas.listarPendientesCompletadas(false);
                break;
            case '5': //Completado | pendiente
                const ids = await mostrarListadosChecklist( tareas.listadoArr );
                
                tareas.toggleCompletadas(ids);

                break;
            case '6': //Borrar
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0' ) {                                    
                    const ok = await confirmar('¿Está seguro?');
                    if ( ok ) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
                break;
        }

        guardarDB(tareas.listadoArr);


        await pausa();

    } while (opt !== '0');

    // pausa();
}

main();
