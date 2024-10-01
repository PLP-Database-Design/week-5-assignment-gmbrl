const express = require('express')
const app = express()
const mysql =require('mysql2');
const dotenv = require('dotenv')

// configure envitonment variables
dotenv.config();

//create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


// test the connection
db.connect((err) => {
    // connection is not successful
    if(err) {
        return console.log("Error connecting to the database", err)
    }
    // connection is successful
    console.log("successfully connected to mySQL: ", db.threadId)
})

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// retrieve all patients
app.get('/patients', (req, res) => {
    const getPatients = "SELECT patient_id,first_name,last_name,date_of_birth FROM patients"
    db.query(getPatients, (err, data) => {
        // if an err
        if(err) {
            return res.status(400).send("Failed to get patients", err)
        }

        res.status(200).render('data', { data})
    })
})

// retrieve all providers
app.get('/providers', (req, res) => {
    const getProviders = "SELECT first_name,last_name,provider_specialty FROM providers"
    db.query(getProviders, (err, data) => {
        // if an err
        if(err) {
            return res.status(400).send("Failed to get providers", err)
        }

        res.status(200).render('data', { data})
    })
})

// retrieve all patients by first name
app.get('/patients/first_name', (req, res) => {
    const {first_name} = req.query
    const getPatients = "SELECT first_name FROM patients"
    db.query(getPatients, [first_name], (err, data) => {
      // if an err
      if(err) {
        return res.status(400).send("Failed to get patients", err)
      }
      
      res.status(200).render('data', {data})
    })
  })

// retrieve all patients by provider_specialty
app.get('/providers/provider_specialty', (req, res) => {
    const {provider_specialty} = req.query
    const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers"
    db.query(getProviders, [provider_specialty], (err, data) => {
      // if an err
      if(err) {
        return res.status(400).send("Failed to get providers", err)
      }
      
      res.status(200).render('data', {data})
    })
  })


// start and listen to the server
app.listen(3300, () => {
    console.log(`Server is running on the port 3300..`)
});