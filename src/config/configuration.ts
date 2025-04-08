export default () => ({
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT as string, 10) || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        name: process.env.DB_NAME || 'food_delivery',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'secretKey',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
});