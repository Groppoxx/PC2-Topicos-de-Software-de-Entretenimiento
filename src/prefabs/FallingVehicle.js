import Phaser from "phaser";

class FallingVehicle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "car");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setData("type", "vehicle");

        this.setTint(0x00ff00);
    }
}

export default FallingVehicle;
