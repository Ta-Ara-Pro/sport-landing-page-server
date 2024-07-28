require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // You can replace '*' with the specific origin if needed
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();

  });

// Configure CORS
app.use(cors({
    origin: 'https://sport-landing-page.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],  // Include OPTIONS method for preflight requests
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow Authorization header if needed
    credentials: true // Allow credentials if you are sending cookies or auth headers
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define a schema for contact messages
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
});
const Contact = mongoose.model('Contact', contactSchema);

// Create a route to handle submissions
app.post('/api/contact', async (req,res) => {
    const { name, email, message } = req.body;
    try {
        // Save message to database
        const newContact = new Contact({ name, email, message });
        const savedContact = await newContact.save();  // Save and get the saved document

        console.log('Saved Contact:', savedContact);  // Log the saved document
        console.log('MongoDB URL:', process.env.MONGO_URL);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Define routes 
app.get('/', (req, res) => {
    res.send('Welcome to the Sport Landing Page API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  // Fixed typo from 'runnig' to 'running'
});
