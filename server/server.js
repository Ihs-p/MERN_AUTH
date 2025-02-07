const express = require('express');
const cors   = require('cors')
require('dotenv').config();

const cookieparser  = require('cookie-parser');
const connectDB = require('./config/mongo');


const app = express();
const port = process.env.PORT || 5000;  

connectDB();

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));    


app.get('/', (req, res) => {
    res.send(' auth api is running!')
})

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));


app.listen(port, () => console.log(`Server is running on port ${port}`));