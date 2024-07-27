require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
 
const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
    origin: 'https://sport-landing-page.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

//connct to mongodb
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Defien a schema for contact message
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
        const newContact = new Contact({ name, email, message});
        const savedContact = await newContact.save();  // Save and get the saved document

        console.log('Saved Contact:', savedContact);  // Log the saved document
        console.log('MongoDB URL:', process.env.MONGO_URL);




        res.status(200).json({ message: 'Message sent successfully'})
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message'});
    }
})

// Define routes 
app.get('/', (req,res) => {
    res.send('Welcome to the Sport Landing Page API' )
});

app.listen(PORT, () => {
    console.log(`Server runnig on port ${PORT}`);
});



        // // Send email
        // const transporter = nodemailer.createTransport({
        //     service: 'email',
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         // pass: process.env.EMAIL_PASS,
        //     },
        // });

        // const mailOptions = {
        //     from: email,
        //     to: 'abekuepom@email1.io',
        //     subject: 'Sport Landing Contact Form Submission',
        //     text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Fixed typo in 'Email'
        // };

        // await transporter.sendMail(mailOptions);