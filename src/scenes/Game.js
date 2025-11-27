import Phaser from "phaser";
import FallingEntity from "../prefabs/FallingEntity";
import FallingVehicle from "../prefabs/FallingVehicle";
import PlayerVehicle from "../prefabs/PlayerVehicle";

// =========================
// Configuración del juego
// =========================
const CONFIG = {
    MAX_LIVES: 5,
    INITIAL_LIVES: 3,

    // Tiempos (en milisegundos)
    INITIAL_SPAWN_DELAY: 7000,  // 7 s entre spawns inicial
    MIN_SPAWN_DELAY: 4000,      // mínimo 4 s
    SPAWN_STEP: 200,            // reduce 0.2 s

    GAMEOVER_DELAY: 2500,       // 2.5 s para mostrar Game Over
    RETURN_MENU_DELAY: 3500,    // 3.5 s para volver al menú

    // Velocidades (en píxeles/segundo)
    PLAYER_SPEED: 220,
    FALLING_SPEED: 150,

    // Fondo
    BACKGROUND_SPEED: 4,
};

class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // --- Fondo en movimiento ---
        this.road = this.add
            .tileSprite(0, 0, width, height, "road")
            .setOrigin(0, 0);
        this.backgroundSpeed = CONFIG.BACKGROUND_SPEED;

        // --- Estado de juego ---
        this.isGameOver = false;

        this.maxLives = CONFIG.MAX_LIVES;
        this.lives = CONFIG.INITIAL_LIVES;

        this.currentSpawnDelay = CONFIG.INITIAL_SPAWN_DELAY;

        // --- Vehicle del jugador (prefab) ---
        this.player = new PlayerVehicle(
            this,
            width / 2,
            height - 60,
            CONFIG.PLAYER_SPEED
        );

        // --- HUD de vidas ---
        this.hudGroup = this.add.group();
        this.drawHUD();

        // --- Grupo de objetos que caen ---
        this.fallingGroup = this.physics.add.group();

        // --- Input teclado ---
        this.cursors = this.input.keyboard.createCursorKeys();

        // --- Seguir mouse/touch solo en X ---
        this.input.on("pointermove", (pointer) => {
            if (!this.player || this.isGameOver) return;
            this.player.followPointerX(pointer.x, width);
        });

        // --- Timer para spawns ---
        this.spawnEvent = this.time.addEvent({
            delay: this.currentSpawnDelay,
            loop: true,
            callback: () => this.spawnFallingObject(),
        });

        // Primer spawn inmediato para no esperar
        this.spawnFallingObject();

        // --- Colisiones ---
        this.physics.add.overlap(
            this.player,
            this.fallingGroup,
            (player, obj) => this.handleCollision(player, obj),
            null,
            this
        );
    }

    // =========================
    // HUD de vidas
    // =========================
    drawHUD() {
        this.hudGroup.clear(true, true);

        for (let i = 0; i < this.lives; i++) {
            const icon = this.add
                .image(20 + i * 26, 20, "car")
                .setOrigin(0, 0)
                .setScale(0.5);
            this.hudGroup.add(icon);
        }
    }

    // =========================
    // Spawns
    // =========================
    // Crea un nuevo objeto que cae (enemigo o vehicle) usando prefabs separados
    spawnFallingObject() {
        if (this.isGameOver) return;

        const width = this.scale.width;

        const isEnemy = Phaser.Math.Between(0, 1) === 0;
        const x = Phaser.Math.Between(40, width - 40);

        let obj;

        if (isEnemy) {
            // Enemigo: obstacle que cae
            obj = new FallingEntity(this, x, -30, "obstacle", "enemy");
        } else {
            // Vehicle: car verde que da vida
            obj = new FallingVehicle(this, x, -30);
        }

        // Lo metemos al grupo de físicas existente
        this.fallingGroup.add(obj);
    }

    increaseDifficulty() {
        if (this.currentSpawnDelay <= CONFIG.MIN_SPAWN_DELAY) return;

        this.currentSpawnDelay = Math.max(
            CONFIG.MIN_SPAWN_DELAY,
            this.currentSpawnDelay - CONFIG.SPAWN_STEP
        );

        // Reiniciar el timer con el nuevo delay
        if (this.spawnEvent) {
            this.spawnEvent.remove(false);
        }

        this.spawnEvent = this.time.addEvent({
            delay: this.currentSpawnDelay,
            loop: true,
            callback: () => this.spawnFallingObject(),
        });
    }

    // =========================
    // Colisiones y vidas
    // =========================
    handleCollision(player, obj) {
        if (!obj || this.isGameOver) return;

        const type = obj.getData("type");

        if (type === "enemy") {
            this.loseLife();
        } else if (type === "vehicle") {
            this.gainLife();
        }

        obj.destroy();
    }

    loseLife() {
        if (this.isGameOver) return;

        this.lives = Math.max(0, this.lives - 1);
        this.drawHUD();

        if (this.lives === 0) {
            this.triggerGameOver();
        }
    }

    gainLife() {
        if (this.isGameOver) return;

        if (this.lives < this.maxLives) {
            this.lives++;
            this.drawHUD();
        }
    }

    // =========================
    // Game Over
    // =========================
    triggerGameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        // Pausamos física y spawns
        this.physics.world.pause();
        if (this.spawnEvent) this.spawnEvent.remove(false);

        // Destruimos elementos en pantalla
        this.fallingGroup.clear(true, true);
        this.hudGroup.clear(true, true);
        if (this.player) this.player.destroy();

        // Mostrar "Game Over" luego de un tiempo reducido
        this.time.delayedCall(CONFIG.GAMEOVER_DELAY, () => {
            const width = this.scale.width;
            const height = this.scale.height;

            this.gameOverText = this.add
                .text(width / 2, height / 2, "Game Over", {
                    fontFamily: "Arial",
                    fontSize: "32px",
                    color: "#ffffff",
                })
                .setOrigin(0.5);

            // Volver al menú un poco más rápido
            this.time.delayedCall(CONFIG.RETURN_MENU_DELAY, () => {
                this.scene.start("Menu");
            });
        });
    }

    // =========================
    // Update
    // =========================
    update(time, delta) {
        // Mover fondo
        this.road.tilePositionY += this.backgroundSpeed;

        if (this.isGameOver || !this.player) return;

        const width = this.scale.width;
        const dt = delta / 1000; // segundos

        // Movimiento del jugador delegando al prefab
        this.player.updateMovement(this.cursors, dt, width);

        // --- Movimiento de enemigos/vehicles que caen ---
        this.fallingGroup.getChildren().forEach((obj) => {
            if (!obj) return;

            obj.y += CONFIG.FALLING_SPEED * dt;

            if (obj.y > this.scale.height + 40) {
                const type = obj.getData("type");

                if (type === "vehicle") {
                    // Si el vehicle sale del escenario -> sube dificultad
                    this.increaseDifficulty();
                }

                obj.destroy();
            }
        });
    }
}

export default Game;
