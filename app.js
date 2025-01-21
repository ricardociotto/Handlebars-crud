const express = require("express")
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.engine('handlebars', exphbs.engine());
app.set("view engine", "handlebars");

const db = mysql.createConnection({
host: "localhost",
user: "user",
password: "userpassword",
database: "crud_handlebars",
});

db.connect((err) =>{
    if (err) throw err;
    console.log("Conected to the MySQL database")
})

app.get("/", (req, res) =>{
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) =>{
        if (err) throw err;
        res.render("index", {products: results});
    });
});

app.get("/add", (req, res) =>{
    res.render("add");
});

app.post("/add", (req, res) =>{
    const {name, price} = req.body
    const sql = "INSERT INTO products (name, price) VALUES (?, ?)";
    db.query(sql, [name, price], (err) =>{
        res.redirect("/");
    });
});

app.get("/edit/:id", (req, res) => {
    const {id} = req.params;
    const sql = " SELECT * FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) =>{
        if (err) throw err;
        res.render("edit", {product: result[0]});
    });
});

app.post("/edit/:id", (req, res) =>{
const {id} = req.params;
const{name,price} = req.body;
const sql = "UPDATE products SET name = ?,price = ? WHERE id = ?";
db.query(sql, [name,price,id],(err) =>{
    if (err) throw err;
    res.redirect("/");
});
});

app.get("/delete/:id", (req, res) =>{
    const {id} = req.params;
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql,[id], (err) =>{
        if(err) throw err;
        res.redirect("/");
    });
});

app.listen(3000, () =>{
    console.log("Server running on http://localhost:3000");
})