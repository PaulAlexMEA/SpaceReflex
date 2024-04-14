export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        const gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Game Over', {
            font: '48px Arial',
            fill: '#ff0000'  
        }).setOrigin(0.5);

        const restartText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Click to restart', {
            font: '32px Arial',
            fill: '#ffffff'  
        }).setOrigin(0.5);

        // Animation sur Click to restart
        this.tweens.add({
            targets: restartText,
            alpha: 0.1,
            duration: 900,
            ease: 'Cubic.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Redémarrer le jeu quand on clique n'importe où
        this.input.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
