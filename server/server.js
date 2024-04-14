const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(express.json());

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./game.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err.message);
        return;
    }
    console.log('Connecté à la base de données SQLite.');
    initializeDB();
});

// Initialisation de la base de données avec création de tables et insertion de valeurs initiales
function initializeDB() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                highScore INTEGER DEFAULT 0,
                totalCoins INTEGER DEFAULT 0
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS game_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                parameter TEXT NOT NULL,
                value TEXT NOT NULL
            );
        `, () => {
            // Insérer les paramètres initiaux seulement si la table vient d'être créée
            db.all("SELECT COUNT(*) AS count FROM game_settings", (err, rows) => {
                if (rows[0].count === 0) {
                    const settings = [
                        ['obstacle_type', 'small,large,moving,static'],
                        ['obstacle_frequency', '30'],
                        ['obstacle_speed', '5'],
                        ['coin_frequency', '15'],
                        ['coin_value', '10'],
                        ['player_speed', '5'],
                        ['difficulty_levels', 'increase at 200 score'],
                        ['ui_theme', 'default']
                    ];
                    settings.forEach(setting => {
                        db.run(`INSERT INTO game_settings (parameter, value) VALUES (?, ?)`, setting);
                    });
                }
            });
        });
    });
}

// Route pour démarrer un nouveau jeu et créer un nouvel identifiant de jeu
app.post('/api/new_game', (req, res) => {
    db.run(`INSERT INTO players (highScore, totalCoins) VALUES (0, 0)`, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ gameId: this.lastID });
    });
});

// Route pour récupérer les paramètres du jeu
app.get('/api/game_settings', (req, res) => {
    db.all(`SELECT parameter, value FROM game_settings`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.reduce((acc, row) => ({ ...acc, [row.parameter]: row.value }), {}));
    });
});

// Route pour mettre à jour un paramètre de jeu
app.post('/api/update_settings', (req, res) => {
    const { parameter, value } = req.body;
    db.run(`UPDATE game_settings SET value = ? WHERE parameter = ?`, [value, parameter], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Parameter updated successfully' });
    });
});

// Définition du port et démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
