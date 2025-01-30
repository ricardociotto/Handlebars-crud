const express = require("express")
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.engine('handlebars', exphbs.engine());
app.set("view engine", "handlebars");


app.use(
    session({
      secret: 'extreme-super-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, 
    })
  ); 


  const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      return next();
    }
    res.redirect('/login');
  }; 
   
  app.get('/login', (req, res) => {
    res.render('login');
  }); 


   app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          req.session.userId = user.id;
          res.redirect('/');
        } else {
          res.render('login', { error: 'Credenciais inválidas!' });
        }
      } else {
        res.render('login', { error: 'Usuário não encontrado!' });
      }
    });
  }); 
 
  app.get('/register', (req, res) => {
    res.render('register');
  }); 
   app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, hashedPassword], (err) => {
      if (err) throw err;
      res.redirect('/login');
    });
  }); 
   
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect('/login');
    });
  }); 

  
app.get('/', isAuthenticated, (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('index', { products: results });
  });
});


app.get('/add', isAuthenticated, (req, res) => {
  res.render('add');
});

app.post('/add', isAuthenticated, (req, res) => {
  const { name, price } = req.body;
  const sql = 'INSERT INTO products (name, price) VALUES (?, ?)';
  db.query(sql, [name, price], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});


app.get('/edit/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.render('edit', { product: result[0] });
  });
});

app.post('/edit/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const sql = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
  db.query(sql, [name, price, id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});


app.get('/delete/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
}); 

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

app.get('/', isAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('index', { products: results });
    });
  });

app.get("/add", (req, res) =>{
    res.render("add");
});

app.get('/add', isAuthenticated, (req, res) => {
  res.render('add');
});

app.post('/add', isAuthenticated, (req, res) => {
  const { name, price } = req.body;
  const sql = 'INSERT INTO products (name, price) VALUES (?, ?)';
  db.query(sql, [name, price], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});


app.get('/edit/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.render('edit', { product: result[0] });
    });
  });
  
  app.post('/edit/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    const sql = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
    db.query(sql, [name, price, id], (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  });

  app.get('/delete/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  }); 

app.listen(3000, () =>{
    console.log("Server running on http://localhost:3000");
})