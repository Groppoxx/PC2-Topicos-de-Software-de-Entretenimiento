import Phaser from "phaser";

class FallingVehicle extends Phaser.Physics.Arcade.Sprite {
    /**
     * Vehicle que cae y otorga una vida
     * @param {Phaser.Scene} scene  Escena donde se crea
     * @param {number} x            Posición X
     * @param {number} y            Posición Y
     */
    constructor(scene, x, y) {
        super(scene, x, y, "car");

        // Añadir a la escena y a la física
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Este tipo se usa en la lógica del Game
        this.setData("type", "vehicle");

        // Lo pintamos de verde para distinguirlo
        this.setTint(0x00ff00);
    }
}

export default FallingVehicle;
