const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('DevOps Pipeline Running');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

const PORT = 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;