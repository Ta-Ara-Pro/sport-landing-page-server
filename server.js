require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
    origin: 'https://sport-landing-page-server.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
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
app.post('/api/contact', async (req, res) => {
    console.log('POST /api/contact received');
    const { name, email, message } = req.body;
    try {
        const newContact = new Contact({ name, email, message });
        const savedContact = await newContact.save();
        console.log('Saved Contact:', savedContact);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Define routes 
app.get('/', (req, res) => {
    res.send('Welcome to the Sport Landing Page API...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
