import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
  }));

  app.use(bodyParser.json());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
  
})

con.connect(function(err) {
    if(err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
})

const imagesDir = path.join(__dirname, 'images');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for profile images
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const imageUpload = multer({ storage: imageStorage });

// Configure multer for document files
const uploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: uploadStorage });

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  app.get('/documents', (req, res) => {
    const sql = `
      SELECT documents.*, employee.name AS employeeName 
      FROM documents 
      JOIN employee ON documents.employee_id = employee.id
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching documents:', err);
        return res.status(500).json({ error: 'Error fetching documents' });
      }
      res.json(result);
    });
  });

  app.post('/documents', upload.single('file'), (req, res) => {
    const { title, content, employeeId } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const sql = 'INSERT INTO documents (title, content, employee_id, file_url) VALUES (?, ?, ?, ?)';
    con.query(sql, [title, content, employeeId, fileUrl], (err, result) => {
      if (err) {
        console.error('Error adding document:', err);
        return res.status(500).json({ error: 'Error adding document' });
      }
      res.json({ status: 'Document Added' });
    });
  });


app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/profile/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT id, name, email, address, salary, image FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get profile error in SQL" });
        return res.json({ Status: "Success", Result: result[0] });
    });
});

app.put('/profile/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;
    const { name, email, address, salary } = req.body;
    let sql = "UPDATE employee SET name = ?, email = ?, address = ?, salary = ? WHERE id = ?";
    let values = [name, email, address, salary, id];

    if (req.file) {
        sql = "UPDATE employee SET name = ?, email = ?, address = ?, salary = ?, image = ? WHERE id = ?";
        values = [name, email, address, salary, req.file.filename, id];
    }

    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Error: "Update profile error in SQL" });
        return res.json({ Status: "Success" });
    });
});

app.post('/sendMessage', (req, res) => {
    const { senderId, recipientId, message } = req.body;

    if (!senderId || !recipientId || !message) {
        return res.status(400).json({ Error: "Missing required fields" });
    }

    // Check if both sender and recipient exist in the 'all' table
    const checkUsersSql = `
        SELECT 
            (SELECT COUNT(*) FROM \`all\` WHERE id = ?) AS senderExists, 
            (SELECT COUNT(*) FROM \`all\` WHERE id = ?) AS recipientExists
    `;
    con.query(checkUsersSql, [senderId, recipientId], (err, result) => {
        if (err) {
            console.error("Error checking users:", err);
            return res.status(500).json({ Error: "Error checking users" });
        }

        if (result[0].senderExists === 0 || result[0].recipientExists === 0) {
            return res.status(400).json({ Error: "Invalid sender or recipient" });
        }

        // Insert the message
        const sql = "INSERT INTO user_messages (senderId, recipientId, content) VALUES (?, ?, ?)";
        con.query(sql, [senderId, recipientId, message], (err, result) => {
            if (err) {
                console.error("Error sending message:", err);
                return res.status(500).json({ Error: "Error sending message" });
            }
            return res.json({ Status: "Success", message: { senderId, recipientId, content: message, timestamp: new Date() } });
        });
    });
});

app.post('/events', (req, res) => {
    const { title, description, start_date, end_date, created_by } = req.body;

    console.log('Received event data:', req.body);

    if (!title || !start_date || !end_date || !created_by) {
        console.error("Error: Missing required fields");
        return res.status(400).json({ Error: "Missing required fields" });
    }

    const formattedStartDate = new Date(start_date).toISOString().slice(0, 19).replace('T', ' ');
    const formattedEndDate = new Date(end_date).toISOString().slice(0, 19).replace('T', ' ');

    const sql = "INSERT INTO calendar_events (title, description, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?)";
    con.query(sql, [title, description, formattedStartDate, formattedEndDate, created_by], (err, result) => {
        if (err) {
            console.error("Error adding event:", err);
            return res.status(500).json({ Error: "Error adding event", Details: err.message });
        }
        return res.json({ Status: "Success", event: { id: result.insertId, title, description, start_date: formattedStartDate, end_date: formattedEndDate, created_by } });
    });
});



app.get('/events', (req, res) => {
    const sql = "SELECT * FROM calendar_events";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching events:", err);
            return res.status(500).json({ Error: "Error fetching events" });
        }
        return res.json(result);
    });
});

app.get('/announcements', (req, res) => {
    const sql = 'SELECT * FROM announcements';
    con.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching announcements:', err);
        return res.status(500).json({ error: 'Error fetching announcements' });
      }
      res.json(result);
    });
  });
  
  
  app.post('/announcements', (req, res) => {
    const { title, content, isImportant } = req.body;
    const sql = 'INSERT INTO announcements (title, content, isImportant) VALUES (?, ?, ?)';
    con.query(sql, [title, content, isImportant], (err, result) => {
      if (err) {
        console.error('Error adding announcement:', err);
        return res.status(500).json({ error: 'Error adding announcement' });
      }
      res.json({ id: result.insertId, title, content, isImportant });
    });
  });

  app.get('/comments/:announcement_id', (req, res) => {
    const { announcement_id } = req.params;
    const sql = 'SELECT * FROM comments WHERE announcement_id = ?';
    con.query(sql, [announcement_id], (err, result) => {
      if (err) {
        console.error('Error fetching comments:', err);
        return res.status(500).json({ error: 'Error fetching comments' });
      }
      res.json(result);
    });
  });
  
  app.post('/comments', (req, res) => {
    const { announcement_id, email, content } = req.body;
    const sql = 'INSERT INTO comments (announcement_id, email, content) VALUES (?, ?, ?)';
    con.query(sql, [announcement_id, email, content], (err, result) => {
      if (err) {
        console.error('Error adding comment:', err);
        return res.status(500).json({ error: 'Error adding comment' });
      }
      res.json({ id: result.insertId, announcement_id, email, content, created_at: new Date() });
    });
  });
  
  app.post('/feedback', (req, res) => {
    const { content } = req.body;
    const sql = 'INSERT INTO feedback (content) VALUES (?)';
    con.query(sql, [content], (err, result) => {
      if (err) {
        console.error('Error submitting feedback:', err);
        return res.status(500).json({ error: 'Error submitting feedback' });
      }
      res.json({ Status: 'Success' });
    });
  });

  app.get('/feedbacks', (req, res) => {
    const sql = 'SELECT * FROM feedback';
    con.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching feedbacks:', err);
        return res.status(500).json({ error: 'Error fetching feedbacks' });
      }
      res.json(result);
    });
  });
  
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;

    const sql = "SELECT email FROM `all` WHERE id = ?";
    con.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching user email:", err);
            return res.status(500).json({ Error: "Error fetching user email" });
        }
        if (result.length === 0) {
            return res.status(404).json({ Error: "User not found" });
        }
        return res.json({ email: result[0].email });
    });
});

app.get('/performance', (req, res) => {
    const sql = `
      SELECT 
        e.name AS employeeName, 
        p.project_completion_rate AS projectCompletionRate,
        p.client_feedback AS clientFeedback,
        p.other_metrics AS otherMetrics
      FROM performance p
      JOIN employee e ON p.employee_id = e.id
    `;
  
    con.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching performance data:", err);
        return res.status(500).json({ Error: "Error fetching performance data" });
      }
      return res.json(result);
    });
  });

  app.post('/performance', (req, res) => {
    const { employee_id, project_completion_rate, client_feedback, other_metrics } = req.body;
    
    if (!employee_id || !project_completion_rate || !client_feedback || !other_metrics) {
      return res.status(400).json({ Error: "All fields are required" });
    }
  
    const sql = "INSERT INTO performance (employee_id, project_completion_rate, client_feedback, other_metrics) VALUES (?, ?, ?, ?)";
    const values = [employee_id, project_completion_rate, client_feedback, other_metrics];
    
    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting performance data:", err);
        return res.status(500).json({ Error: "Error inserting performance data" });
      }
      return res.json({ Status: "Success" });
    });
  });
  
  

app.get('/messages/:id/:adminId', (req, res) => {
    const userId = req.params.id;
    const adminId = req.params.adminId;
    const sql = `
      SELECT m.*, 
             (SELECT email FROM \`all\` WHERE id = m.senderId) AS senderName 
      FROM user_messages m 
      WHERE (m.recipientId = ? AND m.senderId = ?) OR (m.recipientId = ? AND m.senderId = ?)
      ORDER BY m.timestamp;
    `;
    con.query(sql, [userId, adminId, adminId, userId], (err, result) => {
      if (err) {
        console.error("Error fetching messages:", err);
        return res.status(500).json({ Error: "Error fetching messages" });
      }
      return res.json(result);
    });
});



  
  
  


app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ Status: 'Success' });
  });

  
app.get('/getAdmins', (req, res) => {
    const sql = "SELECT id, email FROM users WHERE role = 'admin'";
    con.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching admins:", err);
        return res.status(500).json({ Error: "Error fetching admins" });
      }
      return res.json(result);
    });
  });  

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
    const sql = "INSERT INTO employee (`name`,`email`,`password`, `address`, `salary`,`image`) VALUES (?)";
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

            // Insert into the 'all' table
            const insertAllSql = "INSERT INTO `all` (id, email) VALUES (?, ?)";
            const newEmployeeId = result.insertId; // Get the newly inserted employee's ID
            con.query(insertAllSql, [newEmployeeId, req.body.email], (err, result) => {
                if (err) {
                    console.error("Error inserting into all table:", err);
                    return res.json({ Error: "Error inserting into all table", Details: err.message });
                }
                console.log(`Employee ${req.body.email} signed up successfully and inserted into all table`);
                return res.json({ Status: "Success" });
            });
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



app.get('/employees', (req, res) => {
    const sql = 'SELECT id, name, email FROM employee';
    con.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching employees:', err);
        return res.status(500).json({ error: 'Error fetching employees' });
      }
      res.json(result);
    });
  });
  
  app.get('/reports/performance', (req, res) => {
    const sql = `
      SELECT e.name AS employeeName, p.project_completion_rate AS projectCompletionRate, 
             p.client_feedback AS clientFeedback, p.other_metrics AS otherMetrics
      FROM performance p
      JOIN employee e ON p.employee_id = e.id
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching performance report data:", err);
        return res.status(500).json({ Error: "Error fetching performance report data" });
      }
      return res.json(result);
    });
  });

  app.put('/reports/performance/:id', (req, res) => {
    const { id } = req.params;
    const { projectCompletionRate, clientFeedback, otherMetrics } = req.body;
  
    const sql = `
      UPDATE performance 
      SET project_completion_rate = ?, client_feedback = ?, other_metrics = ? 
      WHERE id = ?
    `;
  
    con.query(sql, [projectCompletionRate, clientFeedback, otherMetrics, id], (err, result) => {
      if (err) {
        console.error("Error updating performance data:", err);
        return res.status(500).json({ Error: "Error updating performance data" });
      }
      return res.json({ Status: "Success" });
    });
  });
  
  
  app.post('/attendance/clock-in', (req, res) => {
    const userId = req.user.id; 
    const clockInTime = new Date();
  
    const sql = 'INSERT INTO attendance (user_id, clock_in) VALUES (?, ?)';
    con.query(sql, [userId, clockInTime], (err, result) => {
      if (err) {
        console.error('Error clocking in:', err);
        return res.status(500).json({ error: 'Error clocking in' });
      }
      return res.json({ status: 'Clocked In' });
    });
  });
  

  app.post('/attendance/clock-out', (req, res) => {
    const userId = req.user.id; 
    const clockOutTime = new Date();
  
    const sql = 'UPDATE attendance SET clock_out = ? WHERE user_id = ? AND DATE(clock_in) = CURDATE() AND clock_out IS NULL';
    con.query(sql, [clockOutTime, userId], (err, result) => {
      if (err) {
        console.error('Error clocking out:', err);
        return res.status(500).json({ error: 'Error clocking out' });
      }
      return res.json({ status: 'Clocked Out' });
    });
  });
  
  app.get('/attendance', (req, res) => {
    const sql = `
      SELECT email, clock_in, clock_out 
      FROM attendance 
      ORDER BY clock_in DESC
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching attendance data:', err);
        return res.status(500).json({ error: 'Error fetching attendance data' });
      }
      const groupedData = result.reduce((acc, row) => {
        const date = new Date(row.clock_in).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(row);
        return acc;
      }, {});
      return res.json(groupedData);
    });
  });
  
  app.get('/attendance/:email', (req, res) => {
    const { email } = req.params;
    const sql = `
      SELECT email, clock_in, clock_out 
      FROM attendance 
      WHERE email = ?
      ORDER BY clock_in DESC
    `;
    con.query(sql, [email], (err, result) => {
      if (err) {
        console.error('Error fetching attendance data:', err);
        return res.status(500).json({ error: 'Error fetching attendance data' });
      }
      return res.json(result);
    });
  });
  
  

  app.post('/attendance/add', (req, res) => {
    const { email, clockIn, clockOut } = req.body;
    const sql = 'INSERT INTO attendance (email, clock_in, clock_out) VALUES (?, ?, ?)';
    
    con.query(sql, [email, clockIn, clockOut], (err, result) => {
      if (err) {
        console.error('Error adding attendance:', err);
        return res.status(500).json({ error: 'Error adding attendance' });
      }
      return res.json({ status: 'Attendance Added' });
    });
  });
  
  
  app.get('/employees/emails', (req, res) => {
    const sql = 'SELECT email FROM `employee`';
    con.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching employee emails:', err);
        return res.status(500).json({ error: 'Error fetching employee emails' });
      }
      return res.json(result);
    });
  });
  

  

  

  
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

        // Insert into the 'all' table
        const insertAllSql = "INSERT INTO `all` (id, email) VALUES (?, ?)";
        const newUserId = result.insertId; // Get the newly inserted user's ID
        con.query(insertAllSql, [newUserId, email], (err, result) => {
          if (err) {
            console.error("Error inserting into all table:", err);
            return res.json({ Error: "Error inserting into all table", Details: err.message });
          }
          console.log(`User ${email} signed up successfully and inserted into all table`);
          return res.json({ Status: "Success" });
        });
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

app.get('/employee/:id/documents', (req, res) => {
    const { id } = req.params;
    const sql = `
      SELECT * 
      FROM documents 
      WHERE employee_id = ?
    `;
    con.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error fetching employee documents:', err);
        return res.status(500).json({ error: 'Error fetching employee documents' });
      }
      res.json(result);
    });
  });
  
app.get('/getEmployees', (req, res) => {
    const sql = 'SELECT id, email FROM employee';
    con.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching employees:", err);
        return res.status(500).json({ Error: "Error fetching employees" });
      }
      return res.json(result);
    });
  });
  


// Add profile endpoint
app.get('/profile', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ Status: "Error", Error: "Not authenticated" });
    }
  
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Status: "Error", Error: "Failed to authenticate token" });
      }
  
      const userId = decoded.id;
      const sql = "SELECT id, email, role FROM users WHERE id = ?";
      con.query(sql, [userId], (err, result) => {
        if (err) {
          return res.json({ Status: "Error", Error: "Error in running query" });
        }
        if (result.length > 0) {
          res.json({ Status: "Success", Profile: result[0] });
        } else {
          res.json({ Status: "Error", Error: "Profile not found" });
        }
      });
    });
  });
  
  

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})




