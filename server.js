const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Paměť pro čekající varování
let cekajiciVarovani = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Příjem dat o tom, kde žák je
app.post('/api/data', (req, res) => {
    const dataZaka = req.body;
    io.emit('aktualizacePanelu', dataZaka);
    res.sendStatus(200);
});

// NOVÉ: Učitel klikne na tlačítko a pošle varování
app.post('/api/poslat-varovani', (req, res) => {
    const emailZaka = req.body.email;
    cekajiciVarovani[emailZaka] = true; // Nastavíme past
    res.sendStatus(200);
});

// NOVÉ: Doplněk žáka se pravidelně ptá, jestli má dostat vynadáno
app.get('/api/zkontrolovat-varovani', (req, res) => {
    const email = req.query.email;
    if (cekajiciVarovani[email]) {
        delete cekajiciVarovani[email]; // Smažeme, aby to nevyběhlo 100x
        res.json({ varovat: true });
    } else {
        res.json({ varovat: false });
    }
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server úspěšně běží na portu: ${PORT}`);
});