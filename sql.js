const express = require('express');
const sqlite = require('sqlite');

const port = 3000;
const ip = "192.168.1.13";

const app = express();

const db = new sqlite.Database('mydb.sqlite');

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.status(500).send({error: 'Have error'});
        }
        else {
            res.json(rows);
        }
    });
});

app.listen(3000, () => {
    console.log(`Listening at ${ip}:${port}...`);
});
