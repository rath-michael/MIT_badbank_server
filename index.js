const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
var dbContext = require("./dbcontext");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://mongo:r1F0h7DP61XemamxZJ3N@containers-us-west-175.railway.app:6443", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

app.use(
  cors({
    origin: 'https://michael-rath-badbankcapstone.up.railway.app/',
    methods: 'GET,POST,PUT,DELETE',
  })
);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
