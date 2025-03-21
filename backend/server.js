require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:3001'], // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
}));
app.use(express.json());

// create upload the directory if it doesn’t exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

db.sequelize.sync().then(() => {
  app.listen(5000, () => console.log('Server running on port 5000'));
});