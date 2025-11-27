import Phaser from "phaser";

class PlayerVehicle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, speed) {
        super(scene, x, y, "car");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);

        this.speed = speed;
    }

    updateMovement(cursors, dt, sceneWidth) {
        let vx = 0;

        if (cursors.left.isDown) {
            vx -= this.speed;
        }
        if (cursors.right.isDown) {
            vx += this.speed;
        }

        this.x += vx * dt;

        this.x = Phaser.Math.Clamp(
            this.x,
            this.width / 2,
            sceneWidth - this.width / 2
        );
    }

    followPointerX(pointerX, sceneWidth) {
        this.x = Phaser.Math.Clamp(
            pointerX,
            this.width / 2,
            sceneWidth - this.width / 2
        );
    }
}

export default PlayerVehicle;
