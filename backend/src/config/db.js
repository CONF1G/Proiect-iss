import express from "express";
import mysql from "mysql";

const app = express(); 

const db = mysql.createConnection({
    host: "localhost",
    user: "stefan",
    password: "password",
    database: "test"
});

const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Database Connection Successful!");
        connection.release();
    } catch (error) {
        console.log("Error connecting to database!");
        throw error;
    }
}

export default db;
export { checkConnection };
