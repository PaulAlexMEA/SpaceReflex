// Dans client/js/game.js
import GameScene from './scene/GameScene.js';
import EndScene from './scene/EndScene.js';

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
    scene: [GameScene, EndScene]
};

new Phaser.Game(config);
