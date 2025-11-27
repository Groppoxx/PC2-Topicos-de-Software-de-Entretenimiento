import Phaser from "phaser";

class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
        this.load.image("road", "assets/road.png");
        this.load.image("car", "assets/car.png");
        this.load.image("obstacle", "assets/obstacle.png");
    }

    create() {
        this.scene.start("Menu");
    }
}

export default Preload;
