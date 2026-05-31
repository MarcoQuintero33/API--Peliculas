// Conexion a postgre
import { DataTypes } from 'sequelize';
import db from './database.js';

// Modelo Peliculas
const Peliculas = db.define('Peliculas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING
    },
    genero: {
        type: DataTypes.STRING
    }
});

// Crear tabla e insertar peliculas
async function IniciarBD() {
    await db.sync({ force: true });

    await Peliculas.create({
        titulo: 'Titanic',
        genero: 'Romance'
    });

    await Peliculas.create({
        titulo: 'Avengers',
        genero: 'Accion'
    });

    await Peliculas.create({
        titulo: 'Toy Story',
        genero: 'Animacion'
    });

    const peliculas = await Peliculas.findAll();

    console.log('peliculas', peliculas);
}

// Ejecutar conexion
IniciarBD();

// Exportar modelo
export {Peliculas};