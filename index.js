import express from "express";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
console.log("DB:", process.env.DB_NAME);

const app = express();
const port = 3000;
const db = new pg.Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
db.connect();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

async function getAlbums() {
  const result = await db.query("SELECT * FROM albums");
  return result.rows;
}

app.get("/", async (req,res) =>{
    try{
    const albums = await getAlbums();
    res.render("index.ejs",{albums});
    }catch(error){
        console.log(error);
        res.status(500).send("Internal Error");
    }
});

app.get("/posts:id", async (req,res) =>{
 try{
    const albums = await getAlbums();
    res.render("posts.ejs",{albums})
}catch(error){
        console.log(error);
        res.status(500).send("Internal Error");
    }
});





















app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})