import express from 'express'
import mysql from "mysql"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
  
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})


con.connect(function(err) {
    if(err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
})

app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set salary = ? WHERE id = ?";
    con.query(sql, [req.body.salary, id], (err, result) => {
        if(err) return res.json({Error: "update employee error in sql"});
        return res.json({Status: "Success"})
    })
})


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    con.query(sql, [email], (err, result) => {
      if (err) {
        console.error("Error in running query:", err);
        return res.json({ Status: "Error", Error: "Error in running query" });
      }
      if (result.length > 0) {
        const hashedPassword = result[0].password;
        console.log(`Stored hashed password for ${email}: ${hashedPassword}`);
        bcrypt.compare(password, hashedPassword, (err, response) => {
          if (response) {
            const token = jwt.sign({ id: result[0].id, role: result[0].role }, "jwt-secret-key", { expiresIn: '1d' });
            res.cookie('token', token);
            console.log(`User ${email} logged in successfully`);
            return res.json({ Status: "Success" });
          } else {
            console.log(`User ${email} provided wrong password`);
            console.log(`Input password: ${password}`);
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
          }
        });
      } else {
        console.log(`User ${email} not found`);
        return res.json({ Status: "Error", Error: "Wrong Email or Password" });
      }
    });
  });


app.post('/create', upload.single('image'), (req, res) => {
    const sql = "INSERT INTO employee (`name`, `email`, `password`, `address`, `salary`, `image`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) return res.json({ Error: "Error in hashing password" });
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary,
            req.file ? req.file.filename : null // Check if file exists
        ];
        con.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "Inside signup query" });
            return res.json({ Status: "Success" });
        });
    });
});


app.listen(8081, ()=> {
    console.log("Running");
})









app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set salary = ? WHERE id = ?";
    con.query(sql, [req.body.salary, id], (err, result) => {
        if(err) return res.json({Error: "update employee error in sql"});
        return res.json({Status: "Success"})
    })
})

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "delete employee error in sql"});
        return res.json({Status: "Success"})
    })
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Error: "You are no Authenticated"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json({Error: "Token wrong"});
            req.role = decoded.role;
            req.id = decoded.id;
            next();
        } )
    }
}

app.get('/dashboard', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ Status: "Error", Error: "Not authenticated" });
    }
  
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Status: "Error", Error: "Failed to authenticate token" });
      }
      
      const userId = decoded.id;
      const role = decoded.role;
  
      res.json({ Status: "Success", id: userId, role: role });
    });
  });
  

app.get('/adminCount', (req, res) => {
    const sql = "Select count(id) as admin from users";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(result);
    })
}) 
app.get('/employeeCount', (req, res) => {
    const sql = "Select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(result);
    })
})

app.get('/salary', (req, res) => {
    const sql = "Select sum(salary) as sumOfSalary from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(result);
    })
})
app.post('/signup', (req, res) => {
    console.log("Signup request received");
    const { email, password, role } = req.body;
  
    if (!email || !password) {
      console.error("Email or password not provided");
      return res.json({ Error: "Email and password are required" });
    }
  
    const sql = "INSERT INTO users (email, password, role) VALUES (?)";
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Error in hashing password:", err);
        return res.json({ Error: "Error in hashing password" });
      }
      const values = [email, hash, role || 'employee']; // Default to employee if role is not provided
      console.log("Values to insert:", values);
      con.query(sql, [values], (err, result) => {
        if (err) {
          console.error("Error inside signup query:", err);
          return res.json({ Error: "Inside signup query", Details: err.message });
        }
        console.log(`User ${email} signed up successfully`);
        return res.json({ Status: "Success" });
      });
    });
  });
  


  

app.post('/employeelogin', (req, res) => {
    const sql = "SELECT * FROM employee Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
        if(result.length > 0) {
            bcrypt.compare(req.body.password.toString(), result[0].password, (err, response)=> {
                if(err) return res.json({Error: "password error"});
                if(response) {
                    const token = jwt.sign({role: "employee", id: result[0].id}, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie('token', token);
                    return res.json({Status: "Success", id: result[0].id})
                } else {
                    return res.json({Status: "Error", Error: "Wrong Email or Password"});
                }
                
            })
            
        } else {
            return res.json({Status: "Error", Error: "Wrong Email or Password"});
        }
    })
})

 app.get('/employee/:id', (req, res) => {
     const id = req.params.id;
     const sql = "SELECT * FROM employee where id = ?";
     con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})




app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.post('/create',upload.single('image'), (req, res) => {
    const sql = "INSERT INTO employee (`name`,`email`,`password`, `address`, `salary`,`image`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if(err) return res.json({Error: "Error in hashing password"});
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary,
            req.file.filename
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Error: "Inside singup query"});
            return res.json({Status: "Success"});
        })
    } )
})


