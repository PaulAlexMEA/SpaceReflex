export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.image('playButton', 'assets/images/Play_BTN.png');  // Assurez-vous que le chemin est correct
    }

    create() {
        this.createPlayButton();
    }

    createPlayButton() {
        // Création et positionnement du bouton play
        const playButton = this.add.image(this.scale.width / 2, this.scale.height / 2, 'playButton').setInteractive();
        playButton.setScale(0.6); // Ajustez la taille selon vos besoins

        // Gestionnaire d'événements pour le clic sur le bouton
        playButton.on('pointerdown', () => {
            // Démarrer la scène principale du jeu directement sans demander le nom du joueur
            this.scene.start('GameScene');
        });
    }
}
