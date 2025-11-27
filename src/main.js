import Phaser from "phaser";
import Preload from "./scenes/Preload";
import Menu from "./scenes/Menu";
import Game from "./scenes/Game";

const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 480,
    scene: [Preload, Menu, Game],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
};

new Phaser.Game(config);
