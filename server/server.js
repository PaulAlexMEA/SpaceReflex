const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./database'); // Assurez-vous que le chemin est correct

// Middleware pour parser les corps de requêtes JSON
app.use(express.json());

// Servir les fichiers statiques de votre jeu Phaser situés dans le dossier client
app.use(express.static('../client'));

// Route pour récupérer les données d'un joueur spécifique par son nom
app.get('/player/:name', (req, res) => {
    db.getPlayerByName(req.params.name, (err, player) => {
        if (err) {
            res.status(500).json({ error: 'Erreur du serveur lors de la récupération des données du joueur' });
        } else if (player) {
            res.json(player);
        } else {
            res.status(404).json({ message: 'Joueur non trouvé' });
        }
    });
});

// Route pour enregistrer ou mettre à jour les données d'un joueur
app.post('/player', (req, res) => {
    if (!req.body.name || req.body.score === undefined || req.body.coins === undefined) {
        res.status(400).json({ error: 'Données requises manquantes' });
        return;
    }
    db.upsertPlayer({
        name: req.body.name,
        score: req.body.score,
        coins: req.body.coins,
        skin: req.body.skin || 'default.png' // Utiliser une peau par défaut si aucune n'est fournie
    }, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erreur du serveur lors de la sauvegarde des données du joueur' });
        } else {
            res.status(201).json({ message: 'Données du joueur enregistrées avec succès', data: result });
        }
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
