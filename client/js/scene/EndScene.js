export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    create() {
        // Configurer le fond de la caméra à noir
        this.cameras.main.setBackgroundColor('#000000');

        // Message de fin de jeu avec un style plus soigné
        const gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Game Over', {
            font: '48px Arial',
            fill: '#ff0000'  // Rouge pour un impact visuel
        }).setOrigin(0.5);

        const restartText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Click to restart', {
            font: '32px Arial',
            fill: '#ffffff'  // Texte blanc pour contraster avec le fond
        }).setOrigin(0.5);

        // Animation pour attirer l'attention sur le texte de redémarrage
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
