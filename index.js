import express from "express";
import axios from "axios";
import pg from "pg";
import "dotenv/config";

const app = express();
const port = 3000;
const db = new pg.Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});
db.connect();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res) =>{
    res.render("index.ejs");
})
















app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})