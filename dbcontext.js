const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    accountNumber: Number,
    firstName: String,
    lastName: String,
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: Number,
    createdAt: {
        type: Date,
    },
});
const User = mongoose.model("User", userSchema);

const transactionSchema = new mongoose.Schema({
    accountNumber: Number,
    type: String,
    amount: Number,
    timestamp: {
        type: Date,
    },
    newBalance: Number,
});
const Transaction = mongoose.model("Transaction", transactionSchema);

async function getUser(email) {
    try {
        return await User.findOne({ email }).exec();
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    try {
        return await User.find({}).exec();
    } catch (error) {
        throw error;
    }
}

async function getUserCount() {
    try {
        return await User.countDocuments({}).exec();
    } catch (error) {
        throw error;
    }
}

async function addUser(user) {
    console.log(user);
    try {
        const newUser = new User(user);
        return await newUser.save();
    } catch (error) {
        throw error;
    }
}

async function updateUser(email, updates) {
    try {
        const user = await User.findOne({ email }).exec();

        if (!user) {
            throw new Error("User not found");
        }

        // Update the user document with the provided updates
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                user[key] = updates[key];
            }
        }

        // Save the updated user document
        await user.save();

        return user; // Return the updated user document
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

async function getAllTransactions() {
    try {
        return await Transaction.find({}).exec();
    } catch (error) {
        throw error;
    }
}

async function addTransaction(transaction) {
    const { accountNumber, type, amount, timestamp } = transaction;

    try {
        // Fetch the user based on the account number
        const user = await User.findOne({ accountNumber }).exec();

        if (!user) {
            throw new Error("User not found");
        }

        // Update the user's balance based on the transaction type
        if (type === "Deposit") {
            user.balance += amount;
        } else if (type === "Withdraw") {
            user.balance -= amount;
        } else {
            throw new Error("Invalid transaction type");
        }

        // Save the updated user document
        await user.save();

        // Create a new transaction document and save it
        const newTransaction = new Transaction({
            accountNumber,
            type,
            amount,
            timestamp,
            newBalance: user.balance,
        });

        await newTransaction.save();

        // Return the new transaction document or any other relevant data
        return newTransaction;
    } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
    }
}

module.exports = {
    getUser,
    getAllUsers,
    getUserCount,
    addUser,
    updateUser,
    getAllTransactions,
    addTransaction,
};
