const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

module.exports = {
    sequelize: sequelize,
    models: {
        User: require('./user')(sequelize, DataTypes),
        Token: require('./token')(sequelize, DataTypes),
    }
};
