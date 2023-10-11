/* var express = require('express');
var app     = express();
var cors    = require('cors');

app.use(express.static('public'));
app.use(cors());

app.get('/account/create/:name/:email/:password', function (req, res) {

    // check if account exists
    dal.find(req.params.email).
        then((users) => {

            // if user exists, return error message
            if(users.length > 0){
                console.log('User already in exists');
                res.send('User already in exists');    
            }
            else{
                // else create user
                dal.create(req.params.name,req.params.email,req.params.password).
                    then((user) => {
                        console.log(user);
                        res.send(user);            
                    });            
            }

        });
});

app.get('/account/login/:email/:password', function (req, res) {

    dal.find(req.params.email).
        then((user) => {

            // if user exists, check password
            if(user.length > 0){
                if (user[0].password === req.params.password){
                    res.send(user[0]);
                }
                else{
                    res.send('Login failed: wrong password');
                }
            }
            else{
                res.send('Login failed: user not found');
            }
    });
    
});

app.get('/account/find/:email', function (req, res) {

    dal.find(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

app.get('/account/findOne/:email', function (req, res) {

    dal.findOne(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

app.get('/account/update/:email/:amount', function (req, res) {

    var amount = Number(req.params.amount);

    dal.update(req.params.email, amount).
        then((response) => {
            console.log(response);
            res.send(response);
    });    
});

app.get('/account/all', function (req, res) {

    dal.all().
        then((docs) => {
            console.log(docs);
            res.send(docs);
    });
});

var port = 3000;
app.listen(port);
console.log('Running on port: ' + port); */

const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
var dbContext = require("./dbcontext");

const app = express();
app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());
app.use(express.json());

//mongoose.connect("mongodb://172.17.0.2:27017", {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
//});

mongoose.connect("mongodb://mongo:r1F0h7DP61XemamxZJ3N@containers-us-west-175.railway.app:6443", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Define API endpoints
// Get user by email
app.get("/user/find/:email", async (req, res) => {
    try {
        const user = await dbContext.getUser(req.params.email);
        console.log("getUser success: " + JSON.stringify(user));
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all users
app.get("/user/all", async (req, res) => {
    try {
        const users = await dbContext.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error("mongo error: " + error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get user count
app.get("/user/count", async (req, res) => {
    try {
        const count = await dbContext.getUserCount();
        res.status(200).json(count);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add user
app.post("/user/add", async (req, res) => {
    try {
        const user = await dbContext.addUser(req.body);
        console.log("User add success");
        res.status(200).json(user);
    } catch (error) {
        console.log("User add error");
        res.status(500).json();
    }
});

// Update user info
app.put("/user/update/:email", async (req, res) => {
    const email = req.params.email;
    const updates = req.body;
    try {
        const updatedUser = await dbContext.updateUser(email, updates);
        console.log("User update success");
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("User update error: " + error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all transactions
app.get("/transaction/all", async (req, res) => {
    try {
        const transactions = await dbContext.getAllTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add new transaction
app.post("/transaction/add", async (req, res) => {
    try {
        const transaction = await dbContext.addTransaction(req.body);
        res.status(200).json(transaction);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//const port = 5000;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
