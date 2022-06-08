require('dotenv').config();         // read environment variables from .env file
const express = require('express');
const cors = require('cors');       // middleware to enable CORS (Cross-Origin Resource Sharing)

const app = express();
const port = process.env.PORT;	 	
const host = process.env.HOST ; 

// global.__basedir = __dirname; // get APP base directory

app.use(cors()); //enable ALL CORS requests (client requests from other domain)
// app.use(cors({ origin: "http://localhost:8081" })); //enable ALL CORS requests from client @ http://localhost:8081
app.use(express.json()); //enable parsing JSON body data

//app.use(express.urlencoded({ extended: true }));

// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({ message: 'Welcome to the TUTORIALS api' });
});

// routing middleware 
app.use('/users', require('./routes/users.routes.js'));

// handle invalid routes
app.all('*', function (req, res) {
    res.status(404).json({ message: 'WHAT???' });
})

//listen for incoming requests
app.listen(port, () => console.log(`App listening at http://${host}:${port}/`));
