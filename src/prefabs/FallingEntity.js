import Phaser from "phaser";

class FallingEntity extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene  Escena donde se crea
     * @param {number} x            Posición X
     * @param {number} y            Posición Y
     * @param {string} texture      Normalmente "obstacle"
     * @param {string} type         Normalmente "enemy"
     */
    constructor(scene, x, y, texture, type) {
        super(scene, x, y, texture);

        // Añadir a la escena y a la física
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Guardamos el tipo (enemy)
        this.setData("type", type);
    }
}

export default FallingEntity;
