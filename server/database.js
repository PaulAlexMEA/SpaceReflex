const sqlite3 = require('sqlite3').verbose();

// Créer une nouvelle base de données SQLite ou ouvrir une existante
const db = new sqlite3.Database('./mygame.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
        initializeDB();
    }
});

// Fonction pour initialiser la base de données
function initializeDB() {
    db.run(`CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        score INTEGER DEFAULT 0,
        coins INTEGER DEFAULT 0,
        skin TEXT DEFAULT 'default.png'
    )`, (err) => {
        if (err) {
            console.error("Erreur lors de la création de la table 'players':", err.message);
        } else {
            console.log("Table 'players' prête ou déjà existante.");
        }
    });
}

// Fonction pour ajouter ou mettre à jour un joueur
function upsertPlayer(playerData, callback) {
    const { name, score, coins, skin } = playerData;
    const sql = `
        INSERT INTO players (name, score, coins, skin)
        VALUES(?, ?, ?, ?)
        ON CONFLICT(name)
        DO UPDATE SET score = excluded.score, coins = excluded.coins, skin = excluded.skin;
    `;
    db.run(sql, [name, score, coins, skin], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { id: this.lastID, changes: this.changes });
        }
    });
}

// Fonction pour récupérer les données d'un joueur
function getPlayerByName(name, callback) {
    const sql = `SELECT * FROM players WHERE name = ?`;
    db.get(sql, [name], (err, row) => {
        if (err) {
            callback(err);
        } else {
            callback(null, row);
        }
    });
}

// Exporter les fonctions pour utilisation externe
module.exports = {
    upsertPlayer,
    getPlayerByName
};
