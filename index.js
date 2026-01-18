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

app.get("/posts/:id", async (req,res) =>{
const id = Number(req.params.id);
if(isNaN(id)) return res.status(400).send("Invalid ID");    
try{
    const albumResult = await db.query("SELECT * FROM albums WHERE id = $1",[id]);
     if (albumResult.rows.length === 0) {
      return res.status(404).send("Album not found");
    }
    const album = albumResult.rows[0];
    const result = await db.query("SELECT * FROM comments WHERE album_id = $1 ORDER BY created_at DESC",[id]);
       const comments = result.rows;
    res.render("posts.ejs",{album,comments});
}catch(error){
        console.log(error);
        res.status(500).send("Internal Error");
    }
});

app.post("/posts/:id", async (req,res)=>{
    const id = Number(req.params.id);
    const {name,comments} = req.body;
    if(isNaN(id)) return res.status(400).send("Invalid ID");
    if (!name || !comments) return res.status(400).send("Empty input");
    try {
        const newComent = await db.query("INSERT INTO comments(album_id,author,content) VALUES ($1,$2,$3)",[id,name,comments]);
        res.redirect(`/posts/${id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Error2");
    }
});

app.get("/comments", (req,res)=>{
    res.render("comments.ejs");
})

app.post("/commments/:id/edit", async (req,res) =>{
    const id = Number(req.params.id);
    const newContent = req.body.editContent;
    if(!newContent) return res.status(404).send("Empty content");
    try {
        const result = await db.query("UPDATE comments SET content = $1 WHERE id = $2",[newContent,id]);
        res.redirect(`/posts/${id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Error3");
    }
});

app.post("/comments/:id/delete", async (req,res) =>{
    const id = Number(req.params.id);
    try {
        const result = await db.query("UPDATE comments SET content = 'Commentary Deleted' WHERE id = $1",[id]);
        res.redirect(`/posts/${id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Error4");
    }
})




















app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})