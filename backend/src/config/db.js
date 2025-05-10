// filepath: /home/conf1g/Documents/Tutorial/backend/src/config/pool.js
import mysql from "mysql2/promise"; // Use the promise-based version of mysql2

const pool = mysql.createPool({
    host: "localhost",
    user: "stefan",
    password: "password",
    database: "test"
});

const checkConnection = async () => {
    try {
        const connection = await pool.getConnection(); // Use await with mysql2
        console.log("Database Connection Successful!");
        connection.release();
    } catch (error) {
        console.log("Error connecting to database!");
        throw error;
    }
};

export default pool;
export { checkConnection };