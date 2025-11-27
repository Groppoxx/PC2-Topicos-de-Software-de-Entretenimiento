import Phaser from "phaser";

class FallingEntity extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, type) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setData("type", type);
    }
}

export default FallingEntity;
