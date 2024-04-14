// Importation de la classe Scene de Phaser
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');  // Appel du constructeur de la classe parent 
        this.highScore = 0; 
    }

    // Fonction pour initialiser les variables de scène
    init(data) {
        this.highScore = data.highScore || 0;  // Initialiser le score le plus élevé avec les données transmises
    }

    // Préchargement des assets 
    preload() {
        this.load.image('player', 'assets/images/vaisseau.png');  
        this.load.image('obstacle', 'assets/images/obstacleBombe.png');  
        this.load.image('coin', 'assets/images/coin.png');  
    }

    // Création des objets
    create() {
        // Création et configuration du vaisseau joueur
        this.player = this.physics.add.sprite(400, 500, 'player').setInteractive();
        this.player.setDisplaySize(50, 50);
        this.player.setCollideWorldBounds(true); 

        // Initialisation des scores et création des textes pour les afficher
        this.score = 0;
        this.coinsCollected = 0;
        this.scoreText = this.add.text(16, 50, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });
        this.coinsText = this.add.text(16, 86, 'Coins: 0', { fontSize: '32px', fill: '#ffffff' });
        this.highScoreText = this.add.text(16, 16, 'High Score: ' + this.highScore, { fontSize: '32px', fill: '#ff0000' });

        // Configuration des obstacles
        this.obstacleVelocity = 200;  
        this.obstacleInterval = 450;  

        // Création des groupes d'obstacles et de pièces avec gestion des retours de groupe
        this.obstacles = this.physics.add.group({
            removeCallback: (obstacle) => {
                obstacle.scene.obstacles.killAndHide(obstacle);
                obstacle.scene.physics.world.disableBody(obstacle.body);
            }
        });

        this.coins = this.physics.add.group({
            removeCallback: (coin) => {
                coin.scene.coins.killAndHide(coin);
                coin.scene.physics.world.disableBody(coin.body);
            }
        });

        // Appel de la fonction pour commencer à générer des obstacles et des pièces
        this.spawnObjects();

        // Gestion des collisions
        this.physics.add.collider(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.collider(this.player, this.obstacles, this.endGame, null, this);

        // Création des contrôles du clavier
        this.cursors = this.input.keyboard.createCursorKeys();

        // Événement pour augmenter régulièrement le score
        this.time.addEvent({
            delay: 250,
            callback: () => {
                this.score += 1;
                this.scoreText.setText('Score: ' + this.score);
                // Mise à jour du score le plus élevé si nécessaire
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    this.highScoreText.setText('High Score: ' + this.highScore);
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    // Mise à jour de la scène, appelée pour chaque frame
    update() {
        // Gestion des entrées du clavier pour déplacer le vaisseau
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-450); // Déplacer à gauche
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(450); // Déplacer à droite
        } else {
            this.player.setVelocityX(0); // Arrêter le mouvement
        }

        // Augmentation de la difficulté en fonction du score
        if (this.score >= 200) {
            this.obstacleVelocity = 200;
            this.obstacleInterval = 200;
        }
    }

    // Fonction pour gérer la collecte des pièces
    collectCoin(player, coin) {
        coin.disableBody(true, true); 
        this.coinsCollected += 1;  
        this.coinsText.setText('Coins: ' + this.coinsCollected); 
    }

    // Fonction pour générer des obstacles et des pièces
    spawnObjects() {
        if (this.spawnEvent) {
            this.spawnEvent.remove(false);
        }

        // Générer des obstacles et des pièces à intervalles réguliers
        this.spawnEvent = this.time.addEvent({
            delay: this.obstacleInterval,
            callback: () => {
                for (let i = 0; i < (this.score >= 200 ? 2 : 1); i++) {
                    const obstacle = this.obstacles.create(Phaser.Math.Between(50, 750), 0, 'obstacle');
                    obstacle.setDisplaySize(50, 50);
                    obstacle.setTint(0xff0000);
                    obstacle.setVelocityY(this.obstacleVelocity);
                }

                const coin = this.coins.create(Phaser.Math.Between(50, 750), 0, 'coin');
                coin.setCircle(10);
                coin.setTint(0xffff00);
                coin.setVelocityY(150);
            },
            callbackScope: this,
            loop: true
        });
    }

    // Fonction appelée lors de la collision avec un obstacle
    endGame(player, obstacle) {
        console.log("Collision detected, ending game.");
        this.physics.pause();  // Arrête la physique pour éviter d'autres collisions
        player.setTint(0xff0000);  // Change la couleur du joueur pour indiquer la collision
    
        // Ajoute un léger délai avant de changer de scène pour que le joueur réalise ce qui s'est passé
        this.time.delayedCall(1000, () => {
            console.log("Starting EndScene.");
            this.scene.start('EndScene');
        }, [], this);
    }
    
}
