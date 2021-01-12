import { GameObjects, Tilemaps } from "phaser";

export class Entity extends Phaser.Physics.Arcade.Sprite {
  // be immediantely added tp the screen when instantiared
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0); // enable physics
  }
}

export class Ball extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprBall");
    this.setOrigin(0.5); // eq to 0.5,0.5 --> center
    this.setBounce(1); //physic ability to bounce back when collider detect
    this.setData("speed", 300); //default speed setting to obj.
    this.setVelocity(this.getData("speed"), 0);
  }
  update() {
    //if y axis is reached bounce back
    let tmp = this.displayHeight * 0.5;
    if (this.y < tmp) {
      this.setVelocityY(this.getData("speed") - 100);
    } else if (this.y > <number>this.scene.game.config.height - tmp) {
      this.setVelocityY(-this.getData("speed") + 100);
    }
  }
}

export class PaddlePlayer extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprPaddle");
    this.setOrigin(0.5); //place in center
    this.setImmovable(true);
    this.setData("speed", 300);
  }

  moveUp() {
    this.setVelocityY(-this.getData("speed"));
  }
  moveDown() {
    this.setVelocityY(this.getData("speed"));
  }
  update() {
    this.setVelocity(0, 0); //stop if nothing is pressed
    this.y = Phaser.Math.Clamp(
      this.y,
      0,
      <number>this.scene.game.config.height //wtf? todo test
    );
  }
}
export class PaddleCPU extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprPaddle");
    this.setOrigin(0.5); //place in center
    this.setImmovable(true);
  }
  //never gets called
  update() {
    this.setVelocity(0, 0); //stop if nothing is pressed

    this.y = Phaser.Math.Clamp(
      this.y,
      0,
      <number>this.scene.game.config.height //wtf? todo test
    );
  }
}
