const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', async(req, res) => {
    res.send('Hello, AI!');
})

app.use('/ai', aiRoutes)
module.exports = app;