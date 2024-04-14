export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.image('playButton', 'assets/images/Play_BTN.png');  
    }

    create() {
        this.createPlayButton();
    }

    createPlayButton() {
        const playButton = this.add.image(this.scale.width / 2, this.scale.height / 2, 'playButton').setInteractive();
        playButton.setScale(0.6); 

        // Gestionnaire d'événements pour le clic sur le bouton
        playButton.on('pointerdown', () => {
            // Démarrer la scène principale du jeu directement sans demander le nom du joueur
            this.scene.start('GameScene');
        });
    }
}
