import Phaser from "phaser";
import FallingEntity from "../prefabs/FallingEntity";
import FallingVehicle from "../prefabs/FallingVehicle";
import PlayerVehicle from "../prefabs/PlayerVehicle";

class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.road = this.add
            .tileSprite(0, 0, width, height, "road")
            .setOrigin(0, 0);
        this.backgroundSpeed = 4;

        this.isGameOver = false;

        this.maxLives = 5;
        this.lives = 3;

        this.currentSpawnDelay = 7000;

        this.player = new PlayerVehicle(
            this,
            width / 2,
            height - 60,
            220
        );

        this.hudGroup = this.add.group();
        this.drawHUD();

        this.fallingGroup = this.physics.add.group();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.on("pointermove", (pointer) => {
            if (!this.player || this.isGameOver) return;
            this.player.followPointerX(pointer.x, width);
        });

        this.spawnEvent = this.time.addEvent({
            delay: this.currentSpawnDelay,
            loop: true,
            callback: () => this.spawnFallingObject(),
        });

        this.spawnFallingObject();

        this.physics.add.overlap(
            this.player,
            this.fallingGroup,
            (player, obj) => this.handleCollision(player, obj),
            null,
            this
        );
    }

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

    spawnFallingObject() {
        if (this.isGameOver) return;

        const width = this.scale.width;

        const isEnemy = Phaser.Math.Between(0, 1) === 0;
        const x = Phaser.Math.Between(40, width - 40);

        let obj;

        if (isEnemy) {
            obj = new FallingEntity(this, x, -30, "obstacle", "enemy");
        } else {
            obj = new FallingVehicle(this, x, -30);
        }

        this.fallingGroup.add(obj);
    }

    increaseDifficulty() {
        if (this.currentSpawnDelay <= 4000) return;

        this.currentSpawnDelay = Math.max(
            4000,
            this.currentSpawnDelay - 200
        );

        if (this.spawnEvent) {
            this.spawnEvent.remove(false);
        }

        this.spawnEvent = this.time.addEvent({
            delay: this.currentSpawnDelay,
            loop: true,
            callback: () => this.spawnFallingObject(),
        });
    }

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

    triggerGameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        this.physics.world.pause();
        if (this.spawnEvent) this.spawnEvent.remove(false);

        this.fallingGroup.clear(true, true);
        this.hudGroup.clear(true, true);
        if (this.player) this.player.destroy();

        this.time.delayedCall(2500, () => {
            const width = this.scale.width;
            const height = this.scale.height;

            this.gameOverText = this.add
                .text(width / 2, height / 2, "Game Over", {
                    fontFamily: "Arial",
                    fontSize: "32px",
                    color: "#ffffff",
                })
                .setOrigin(0.5);

            this.time.delayedCall(3500, () => {
                this.scene.start("Menu");
            });
        });
    }

    update(time, delta) {
        this.road.tilePositionY += this.backgroundSpeed;

        if (this.isGameOver || !this.player) return;

        const width = this.scale.width;
        const dt = delta / 1000;

        this.player.updateMovement(this.cursors, dt, width);

        this.fallingGroup.getChildren().forEach((obj) => {
            if (!obj) return;

            obj.y += 150 * dt;

            if (obj.y > this.scale.height + 40) {
                const type = obj.getData("type");

                if (type === "vehicle") {
                    this.increaseDifficulty();
                }

                obj.destroy();
            }
        });
    }
}

export default Game;
