

const express = require("express")
const server = express()

const db = require("./db")
let id;

 /*const ideas = [
    {
        img: "./img/working.png",
        title: "Programming Course",
        category: "Study",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis eligendi eaque labore praesentium sit autem, id accusamus non quia explicabo vero omnis voluptatibus laborum soluta maxime consequatur? Dolorum, incidunt non."
    },
    {
        img: "./img/work-out.png",
        title: "Physical exercise",
        category: "Cheers",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis eligendi eaque labore praesentium sit autem, id accusamus non quia explicabo vero omnis voluptatibus laborum soluta maxime consequatur? Dolorum, incidunt non."
    },
     {
        img: "./img/guitar-player.png",
        title: "Play an instrument",
        category: "Mentality",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis eligendi eaque labore praesentium sit autem, id accusamus non quia explicabo vero omnis voluptatibus laborum soluta maxime consequatur? Dolorum, incidunt non."
    },
    {
        img: "./img/music.png",
        title: "Play to Heavy Metal",
        category: "Dreaming",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis eligendi eaque labore praesentium sit autem, id accusamus non quia explicabo vero omnis voluptatibus laborum soluta maxime consequatur? Dolorum, incidunt non."
    }
]*/

server.use(express.static("public"))

server.use(express.urlencoded({extended: true}))

const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

server.get("/", function(req, res){

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
       }
            const reversedIdeas = [...rows].reverse()

            let lastIdeas = []
             for(let idea of reversedIdeas ){
                 if(lastIdeas.length < 3){
                lastIdeas.push(idea)
        }
    }
   
    return res.render("index.html", {ideas: lastIdeas})       
    })
})


server.get("/ideas", function(req, res){  


    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) {
             console.log(err)
             return res.send("Erro no banco de dados")
        }

    const reversedIdeas = [...rows].reverse()
    return res.render("ideas.html", { ideas: reversedIdeas})
    })
})
server.post("/", function(req, res){
    const query = `
     INSERT INTO ideas(
         image,
         title,
         category,
         description,
        link
     ) VALUES (?,?,?,?,?);
     `
        const values = [
            req.body.image,
            req.body.title,
            req.body.category,
            req.body.description,
            req.body.link
        ]
     
         db.run(query, values, function(err){
            if (err) {
                console.log(err)
                return res.send("Erro no banco de dados")
           }   
           return res.redirect("/ideas")
    })
})

server.delete("/del/:id", function(req, res){

    let Deleletepost = req.params.id;

    let id = Number(Deleletepost);

    db.run(`DELETE FROM ideas WHERE id = ?`,[id], function(err){
        if (err) return console.log(err)

        console.log("DELETEI", this);
    })
    return res.redirect("/ideas")
})


server.listen(3000)