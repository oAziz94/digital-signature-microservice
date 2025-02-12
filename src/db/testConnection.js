const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    try {
        await client.connect();
        console.log('Connected to the database successfully!');
        await client.end();
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

testConnection();
