export class SceneMainMenu extends Phaser.Scene {
  sfx: any;
  title: any;
  btnPlay: any;
  constructor() {
    super({ key: "SceneMainMenu" });
  }
  preload() {
    this.load.image("sprBtnPlay", "content/sprBtnPlay.png");
    this.load.image("sprBtnPlayHover", "content/sprBtnPlayHover.png");

    this.load.audio("sndBtn", "content/sndBtn.wav");
  }

  create() {
    this.sfx = {
      btn: this.sound.add("sndBtn"),
    };

    this.title = this.add.text(
      <number>this.game.config.width * 0.5,
      <number>this.game.config.height * 0.15,
      "TABLE TENNIS",
      {
        fontFamily: "monospace",
        fontSize: "72px",
        align: "center",
      }
    );
    this.title.setOrigin(0.5);

    this.btnPlay = this.add.sprite(
      <number>this.game.config.width * 0.5,
      <number>this.game.config.height * 0.5,
      "sprBtnPlay"
    );
    this.btnPlay.setInteractive();
    this.btnPlay.on("pointerover", () => {
      this.btnPlay.setTexture("sprBtnPlayHover");
    });
    this.btnPlay.on("pointerout", () => {
      this.btnPlay.setTexture("sprBtnPlay");
    });

    this.btnPlay.on(
      "pointerup",
      () => {
        this.sfx.btn.play();
        this.scene.start("SceneMain");
      },
      this
    );
  }
}
