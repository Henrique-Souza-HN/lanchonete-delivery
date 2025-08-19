const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simple authentication
app.post('/api/auth', (req, res) => {
    const { password } = req.body;
    const validPassword = "admin123"; // Senha padrão para testes

    if (password === validPassword) {
        res.status(200).send({ message: 'Authenticated' });
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
