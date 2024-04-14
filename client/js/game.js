import StartScene from './scene/StartScene.js';
import GameScene from './scene/GameScene.js';
import EndScene from './scene/EndScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',  // Assurez-vous que cet ID correspond à un élément dans votre HTML
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [StartScene, GameScene, EndScene]  // Inclure toutes les scènes ici
};

// Création de l'instance du jeu
const game = new Phaser.Game(config);
