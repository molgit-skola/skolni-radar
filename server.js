const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Povolí doplňku posílat data
app.use(express.json()); // Aby server uměl číst data

// Zobrazení učitelského panelu
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Zde server chytá data od žáků a posílá je vám na obrazovku
app.post('/api/data', (req, res) => {
    const dataZaka = req.body;
    io.emit('aktualizacePanelu', dataZaka);
    res.sendStatus(200);
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Server běží! Učitelský panel otevřete na: http://localhost:${PORT}`);
});