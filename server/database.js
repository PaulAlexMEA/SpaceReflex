const sqlite3 = require('sqlite3').verbose();

// Initialisation et ouverture d'une nouvelle base de données SQLite. Si elle n'existe pas, elle sera créée.
const db = new sqlite3.Database('./mygame.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
        initializeDB();  // Appel de la fonction pour initialiser la structure de la base de données
    }
});

// Fonction pour créer la table des joueurs si elle n'existe pas déjà.
function initializeDB() {
    db.run(`CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        score INTEGER DEFAULT 0,
        highscore INTEGER DEFAULT 0,
        coins INTEGER DEFAULT 0,
        totalCoins INTEGER DEFAULT 0,
        skin TEXT DEFAULT 'default.png'
    )`, (err) => {
        if (err) {
            console.error("Erreur lors de la création de la table 'players':", err.message);
        } else {
            console.log("Table 'players' prête ou déjà existante.");
        }
    });
}

// Fonction pour ajouter ou mettre à jour les données d'un joueur.
function upsertPlayer(playerData, callback) {
    const { name, score, coins, skin } = playerData;
    // SQL pour insérer un nouveau joueur ou mettre à jour s'il existe déjà
    const sql = `
        INSERT INTO players (name, score, coins, totalCoins, highscore, skin)
        VALUES(?, ?, ?, ?, ?, ?)
        ON CONFLICT(name)
        DO UPDATE SET score = excluded.score, coins = excluded.coins,
        totalCoins = totalCoins + excluded.coins,
        highscore = CASE WHEN excluded.score > highscore THEN excluded.score ELSE highscore END,
        skin = excluded.skin;
    `;
    db.run(sql, [name, score, coins, coins, score, skin], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { id: this.lastID, changes: this.changes }); // Retourne l'ID du joueur et les changements effectués
        }
    });
}

// Fonction pour récupérer les informations d'un joueur spécifique par son nom
function getPlayerByName(name, callback) {
    const sql = `SELECT * FROM players WHERE name = ?`; // SQL pour sélectionner un joueur par son nom
    db.get(sql, [name], (err, row) => {
        if (err) {
            callback(err); 
        } else {
            callback(null, row); 
        }
    });
}

// Exportation des fonctions pour les rendre accessibles depuis d'autres fichiers
module.exports = {
    upsertPlayer,
    getPlayerByName
};
