import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
    host: "localhost",
    user: "stefan",
    password: "password",
    database: "test"
});

const checkConnection=async()=>{
    try {
        const connection=await pool.getConnection();
        console.log("Database Connection Successfull!!");
        connection.release();
        
    } catch (error) {
        console.log("Error connecting to database!");
        throw error;
        
    }
}

export {db,checkConnection};