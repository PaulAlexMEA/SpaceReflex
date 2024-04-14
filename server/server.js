const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Utilise CORS pour permettre les requêtes de différentes origines
app.use(cors());

// Permet à l'application de parser les corps des requêtes JSON
app.use(express.json());

// Initialise et connecte la base de données SQLite
const db = new sqlite3.Database('./game.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err.message);
        return;
    }
    console.log('Connecté à la base de données SQLite.');
    initializeDB();  
});

// Fonction pour créer les tables nécessaires dans la base de données
function initializeDB() {
    db.serialize(() => {
        // Crée la table des joueurs si elle n'existe pas déjà
        db.run(`
            CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                highScore INTEGER DEFAULT 0,
                totalCoins INTEGER DEFAULT 0
            );
        `);

        // Crée la table des paramètres du jeu si elle n'existe pas déjà
        db.run(`
            CREATE TABLE IF NOT EXISTS game_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                parameter TEXT NOT NULL,
                value TEXT NOT NULL
            );
        `, () => {
            // Insertion des paramètres par défaut après la création de la table
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
                db.run(`INSERT INTO game_settings (parameter, value) VALUES (?, ?) ON CONFLICT(parameter) DO UPDATE SET value = excluded.value`, setting);
            });
        });
    });
}

// Route pour démarrer un nouveau jeu et enregistrer un nouvel identifiant de jeu
app.post('/api/new_game', (req, res) => {
    db.run(`INSERT INTO players (highScore, totalCoins) VALUES (0, 0)`, function(err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ gameId: this.lastID });
    });
});

// Route pour récupérer les paramètres du jeu
app.get('/api/game_settings', (req, res) => {
    db.all(`SELECT parameter, value FROM game_settings`, [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows.reduce((acc, row) => ({ ...acc, [row.parameter]: row.value }), {}));
    });
});

// Route pour mettre à jour le score et le total de pièces d'un joueur
app.post('/api/update_player', (req, res) => {
    const { gameId, highScore, totalCoins } = req.body;
    db.run(`UPDATE players SET highScore = ?, totalCoins = ? WHERE id = ?`, [highScore, totalCoins, gameId], function(err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Player updated successfully' });
    });
});

// Démarre le serveur sur le port spécifié
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Middleware de gestion d'erreurs pour intercepter toute erreur non gérée
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
