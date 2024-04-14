import StartScene from './scene/StartScene.js';
import GameScene from './scene/GameScene.js';
import EndScene from './scene/EndScene.js';

// Configuration initiale de Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [StartScene, GameScene, EndScene]
};

// Création de l'instance du jeu
const game = new Phaser.Game(config);

// Chargement asynchrone des paramètres de configuration du jeu depuis le backend
fetch('http://localhost:3000/api/game_settings')
    .then(response => response.json())
    .then(settings => {
        // Stocker les paramètres dans une propriété globale accessible par toutes les scènes
        game.globalSettings = settings.reduce((acc, item) => {
            acc[item.parameter] = item.value;
            return acc;
        }, {});
    })
    .catch(error => console.error('Failed to load game settings:', error));
