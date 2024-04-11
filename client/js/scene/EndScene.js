// Dans client/js/scene/EndScene.js
export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    create() {
        // Message de fin de jeu
        this.add.text(400, 300, 'Game Over!\nClick to restart', { fontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5);

        // Redémarrer le jeu quand on clique n'importe où
        this.input.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
