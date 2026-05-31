import express from 'express';
import sequelize from './database.js';
import { Peliculas } from './bd.js';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 3000;

app.use (express.json())

// Clave secreta para firmar los tokens 
const SECRET_KEY = process.env.SECRET_KEY ||'mi_clave_secreta_super_segura';

// INICIALIZACIÓN ASÍNCRONA DE LA BASE DE DATOS
try {
    await sequelize.authenticate();
    console.log('Conexión con PostgreSQL establecida correctamente.');
    await sequelize.sync(); // Crea la tabla de películas en la nube si no existe
} catch (error) {
    console.error('Error al inicializar la base de datos:', error);
}


// 1. ENDPOINT DE LOGIN 

app.post('/login', (req, res) => {
    const { nombre, password } = req.body;

    // Validación de usuario simulada
    if (nombre === 'admin' && password === '1234') {
        const usuario = { id: 1, name: 'Heber' };

        // Generar JWT (expira en 1 hora)
        const token = jwt.sign(usuario, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login exitoso', token });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
});


// 2. MIDDLEWARE DE VALIDACIÓN 
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        req.user = decoded; // Guardamos los datos del usuario en la petición
        next(); // Continuar al siguiente endpoint
    });
};

// Ruta GET
app.get('/peliculas', async (req, res) => {
    const peliculas = await Peliculas.findAll();
    res.status (200).json({peliculas});
    
});

// POST (ya protegida con token)
app.post('/peliculas', verificarToken, async (req, res) => {

    const nuevaPelicula = await Peliculas.create(req.body);

    res.status(201).json(nuevaPelicula);

});

// PUT (verificada con token)
app.put('/peliculas/:id', verificarToken, async (req, res) => {

    const pelicula = await Peliculas.findByPk(req.params.id);

    if (pelicula) {

        await pelicula.update(req.body);

        res.json(pelicula);

    }
    
    else {

        res.status(404).json({ error: 'No encontrado' });

    }
});

// DELETE (verificada con token)
app.delete('/peliculas/:id', verificarToken, async (req, res) => {

    const pelicula = await Peliculas.findByPk(req.params.id);

    if (pelicula) {
        await pelicula.destroy();
        res.json({ mensaje: 'Película eliminada' });
    } 
    
    else {
        res.status(404).json({ error: 'No encontrado' });
    }
});

// Ruta base de chequeo
app.get('/', async (req, res) => {
    res.send('API de Películas funcionando en Render...');
});

// Servidor
app.listen(port, () => {
    console.log('Servidor corriendo en puerto : ',port);
});