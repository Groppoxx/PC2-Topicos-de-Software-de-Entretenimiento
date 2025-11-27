import Phaser from "phaser";

class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Fondo de carretera desplazándose en Y
        this.backgroundSpeed = 2;
        this.road = this.add
            .tileSprite(0, 0, width, height, "road")
            .setOrigin(0, 0);

        // Texto con tu nombre y apellido
        this.add
            .text(width / 2, height * 0.25, "Iam Alvarez", {
                fontFamily: "Arial",
                fontSize: "24px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        // Botón "Jugar"
        this.playButton = this.add
            .text(width / 2, height * 0.55, "Jugar", {
                fontFamily: "Arial",
                fontSize: "28px",
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: { x: 12, y: 6 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.playButton.on("pointerup", () => {
            this.scene.start("Game");
        });
    }

    update() {
        // Mover el fondo hacia abajo
        this.road.tilePositionY += this.backgroundSpeed;
    }
}

export default Menu;
