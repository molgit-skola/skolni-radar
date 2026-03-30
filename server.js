const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

// 1. DVEŘNÍK: Povolí úplně všechny dotazy odkudkoliv (musí být nahoře!)
app.use(cors());

// 2. PŘEKLADATEL: Aby server uměl číst data od doplňku
app.use(express.json());

// 3. ZOBRAZENÍ PANELU PRO UČITELE
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 4. PŘÍJEM DAT OD ŽÁKŮ
app.post('/api/data', (req, res) => {
    const dataZaka = req.body;
    io.emit('aktualizacePanelu', dataZaka);
    res.sendStatus(200);
});

// Render nám sám řekne, jaký port máme použít (process.env.PORT)
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server úspěšně běží na portu: ${PORT}`);
});