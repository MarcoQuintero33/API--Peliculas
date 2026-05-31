import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Crucial para que Render acepte la conexión segura
    }
  },
  logging: false // Cambia a console.log si quieres ver las consultas SQL en la terminal
});

export default sequelize;