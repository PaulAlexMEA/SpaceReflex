// Dans client/js/scene/GameScene.js
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('player', 'assets/images/vaisseau.png'); // Chemin relatif depuis la racine du serveur
        this.load.image('obstacle', 'assets/images/obstacleBombe.png');
        this.load.image('coin', 'assets/images/coin.png');
    }

    create() {
        // Vaisseau du joueur
        this.player = this.physics.add.sprite(400, 500, 'player').setInteractive();
        this.player.setDisplaySize(50, 50); // Taille du vaisseau
        this.player.setTint(0x00ff00); // Couleur verte pour le vaisseau
        this.player.setCollideWorldBounds(true); // Empêche le vaisseau de sortir des limites du monde

        // Initialisation du score et du compteur de pièces
        this.score = 0;
        this.coinsCollected = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });
        this.coinsText = this.add.text(16, 50, 'Coins: 0', { fontSize: '32px', fill: '#ffffff' });

        // Paramètres initiaux des obstacles
        this.obstacleVelocity = 200; // Vitesse initiale des obstacles
        this.obstacleInterval = 1000; // Intervalle initial pour la génération des obstacles

        // Création des obstacles
        this.obstacles = this.physics.add.group({
            removeCallback: (obstacle) => {
                obstacle.scene.obstacles.killAndHide(obstacle);
                obstacle.scene.physics.world.disableBody(obstacle.body);
            }
        });

        // Création des pièces
        this.coins = this.physics.add.group({
            removeCallback: (coin) => {
                coin.scene.coins.killAndHide(coin);
                coin.scene.physics.world.disableBody(coin.body);
            }
        });

        this.spawnObjects();  // Lancer la génération initiale des objets

        // Gestionnaire de collision avec les pièces
        this.physics.add.collider(this.player, this.coins, this.collectCoin, null, this);

        // Gestionnaire de collision avec les obstacles
        this.physics.add.collider(this.player, this.obstacles, this.endGame, null, this);

        // Contrôles du clavier
        this.cursors = this.input.keyboard.createCursorKeys();

        // Mise à jour du score avec le temps
        this.time.addEvent({
            delay: 250, // Réduire l'intervalle à 250 millisecondes
            callback: () => { this.score += 1; this.scoreText.setText('Score: ' + this.score); },
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Mise à jour de la logique du jeu
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-360); // Déplacer à gauche
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(360); // Déplacer à droite
        } else {
            this.player.setVelocityX(0); // Arrêter le mouvement horizontal
        }

        // Augmenter la difficulté si le score atteint 200
        if (this.score >= 200) {
            this.obstacleVelocity = 300;  // Augmenter la vitesse des obstacles
            this.obstacleInterval = 700;  // Diminuer l'intervalle de spawn
        }
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true); // Supprimer la pièce à la collecte
        this.coinsCollected += 1; // Augmenter le compteur de pièces
        this.coinsText.setText('Coins: ' + this.coinsCollected); // Mettre à jour le texte des pièces
    }

    spawnObjects() {
        // Arrête l'ancien événement de spawn avant d'en commencer un nouveau si les paramètres ont changé
        if (this.spawnEvent) {
            this.spawnEvent.remove(false);
        }

        // Générer des obstacles et des pièces à intervalles réguliers
        this.spawnEvent = this.time.addEvent({
            delay: this.obstacleInterval,
            callback: () => {
                // Obstacles
                for (let i = 0; i < (this.score >= 200 ? 2 : 1); i++) {  // Condition pour augmenter le nombre d'obstacles
                    const obstacle = this.obstacles.create(Phaser.Math.Between(50, 750), 0, 'obstacle');
                    obstacle.setDisplaySize(50, 50);
                    obstacle.setTint(0xff0000);
                    obstacle.setVelocityY(this.obstacleVelocity);
                }

                // Pièces
                const coin = this.coins.create(Phaser.Math.Between(50, 750), 0, 'coin');
                coin.setCircle(10);
                coin.setTint(0xffff00);
                coin.setVelocityY(150);
            },
            callbackScope: this,
            loop: true
        });
    }

    endGame(player, obstacle) {
        this.physics.pause(); // Arrêter la physique pour éviter d'autres interactions
        player.setTint(0xff0000); // Indiquer la collision en changeant la couleur du joueur
        this.scene.start('EndScene'); // Passer à la scène de fin
    }
}
