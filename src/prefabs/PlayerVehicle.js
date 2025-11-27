import Phaser from "phaser";

class PlayerVehicle extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene    Escena donde se crea
     * @param {number} x              Posición X inicial
     * @param {number} y              Posición Y inicial
     * @param {number} speed          Velocidad en píxeles/segundo
     */
    constructor(scene, x, y, speed) {
        super(scene, x, y, "car");

        // Añadimos a la escena y a la física
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Que no salga de la pantalla
        this.setCollideWorldBounds(true);

        // Guardamos la velocidad para el movimiento
        this.speed = speed;
    }

    /**
     * Movimiento con teclado (solo en X)
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors
     * @param {number} dt           Delta time en segundos
     * @param {number} sceneWidth   Ancho de la escena
     */
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

    /**
     * Seguir al mouse/touch solo en X
     * @param {number} pointerX
     * @param {number} sceneWidth
     */
    followPointerX(pointerX, sceneWidth) {
        this.x = Phaser.Math.Clamp(
            pointerX,
            this.width / 2,
            sceneWidth - this.width / 2
        );
    }
}

export default PlayerVehicle;
