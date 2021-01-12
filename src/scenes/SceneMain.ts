import { Ball, PaddleCPU, PaddlePlayer } from "~/ententies/Enteties";

export class SceneMain extends Phaser.Scene {
  halfLines: any;
  sfx: any;
  isGameOver: boolean = false;
  scorePlayer: any;
  scoreCpu: any;
  balls: any;
  player: any;
  cpu: any;
  textScorePlayer: any;
  textScoreCpu: any;
  textWin: any;

  constructor() {
    super({ key: "SceneMain" });
  }
  preload() {
    this.load.image("sprBall", "content/sprBall.png");
    this.load.image("sprPaddle", "content/sprPaddle.png");
    this.load.image("sprHalfLine", "content/sprHalfLine.png");

    this.load.audio("sndHit", "content/sndHit.wav");
  }

  createHalfLine() {
    //todo play around with this
    for (let i = 0; i < <number>this.game.config.height / 16; i++) {
      let line = this.add.sprite(
        <number>this.game.config.width * 0.5,
        i * 24 + 8,
        "sprHalfLine"
      );
      this.halfLines.add(line);
    }
  }

  reset() {
    //has someone won?
    if (this.scorePlayer > 10 || this.scoreCpu > 10) {
      this.setGameOver();
    } else {
      this.textScorePlayer.setVisible(true);
      this.textScoreCpu.setVisible(true);
      this.textWin.setVisible(false);

      this.isGameOver = false;
      this.balls.clear(true, true);

      //add a new ball after 1second
      this.time.addEvent({
        delay: 1000,
        callback: this.createNewBall,
        callbackScope: this,
        loop: false,
      });
      //give speed to the ball
      this.time.addEvent({
        delay: 500,
        callback: this.getNewBallMove,
        callbackScope: this,
        loop: false,
      });
    }
  }
  setGameOver() {
    this.isGameOver = true;
    this.balls.clear(true, true);

    if (this.scorePlayer > 10) {
      this.textWin.setText("YOU WON!");
    } else if (this.scorePlayer > 10) {
      this.textWin.setText("CPU WON!");
    }

    this.textScorePlayer.setVisible(false);
    this.textScoreCpu.setVisible(false);
    this.textWin.setVisible(true);

    //Restart Sequence
    this.time.addEvent({
      delay: 3000,
      callback: this.startMainScene,
      callbackScope: this,
      loop: false,
    });
  }

  create() {
    this.sfx = { hit: this.sound.add("sndHit") };
    this.isGameOver = false;
    this.scoreCpu = 0;
    this.scorePlayer = 0;
    //creat group for ball
    this.balls = this.add.group();
    //create ball
    let ball = new Ball(
      this,
      <number>this.game.config.width * 0.5,
      <number>this.game.config.height * 0.5
    );
    this.balls.add(ball);

    //cpu paddle
    this.cpu = new PaddleCPU(
      this,
      <number>this.game.config.width - 32,
      <number>this.game.config.height * 0.5
    );
    //player paddle
    this.player = new PaddlePlayer(
      this,
      32,
      <number>this.game.config.height * 0.5
    );
    //halfline group
    this.halfLines = this.add.group();
    this.createHalfLine();
    console.log("SeneceMain create()");

    //create Text Elements
    //playertext
    this.textScorePlayer = this.add.text(
      <number>this.game.config.width * 0.25,
      64,
      this.scorePlayer,
      {
        fontFamily: "monospace",
        fontSize: "64px",
      }
    );
    this.textScorePlayer.setOrigin(0.5);
    //cputext
    this.textScoreCpu = this.add.text(
      <number>this.game.config.width * 0.75,
      64,
      this.scoreCpu,
      {
        fontFamily: "monospace",
        fontSize: "64px",
      }
    );
    this.textScoreCpu.setOrigin(0.5);
    //winner
    this.textWin = this.add.text(<number>this.game.config.width * 0.5, 64, "", {
      fontFamily: "monospace",
      fontSize: "64px",
    });
    this.textWin.setOrigin(0.5);
    this.textWin.setVisible(false);

    //Collioson Check
    //add collider to player
    this.physics.add.collider(
      this.balls,
      this.player,
      this.BounceFromPaddle,
      undefined, // null
      this
    );
    // add collider to cpu
    this.physics.add.collider(
      this.balls,
      this.cpu,
      this.BounceFromPaddle,
      undefined,
      this
    );
  }

  update() {
    //update the ball
    if (this.balls.getChildren().length > 0) {
      let ball = this.balls.getChildren()[0];

      ball.update();
      //check if ball is out of scope on the left(player) or the right(cpu)
      if (ball.x < 0) {
        this.scoreCpu++;
        this.textScoreCpu.setText(this.scoreCpu);
        this.reset();
      } else if (ball.x > this.game.config.width) {
        this.scorePlayer++;
        this.textScorePlayer.setText(this.scorePlayer);
        this.reset();
      }

      //move cpu --> lauf dem ball hinterher in zufälliger geschwindigkeit
      if (ball.body !== undefined) {
        let cpuVelY = ball.body.velocity.y;
        this.cpu.body.velocity.y = cpuVelY * Phaser.Math.Between(6, 15) * 0.1;
        //this.cpu.body.velocity.y = cpuVelY; //godmode cpu
      }
    }
    this.player.update();
    this.player.y = this.input.activePointer.y;
  }

  BounceFromPaddle(ball: any, paddle: any) {
    {
      //callback function
      // increase or decrease the angle of the ball the farther is from center of paddle
      let dist = Phaser.Math.Distance.Between(0, ball.y, 0, paddle.y);
      if (ball.y < paddle.y) {
        dist = -dist;
      }
      ball.body.velocity.y = dist * 30;
      this.sfx.hit.play();
    }
  }

  createNewBall() {
    //reset the paddle pos
    this.player.y = <number>this.game.config.height * 0.5;
    this.cpu.y = <number>this.game.config.height * 0.5;
    //remove all the balls (the one we have added)
    this.balls.clear(true, true);
    //create a new one
    var ball = new Ball(
      this,
      <number>this.game.config.width * 0.5,
      <number>this.game.config.height * 0.5
    );
    this.balls.add(ball);
  }

  getNewBallMove() {
    {
      if (this.balls.getChildren().length > 0) {
        let ball = this.balls.getChildren()[0];
        ball.body.setVelocity(ball.getData("speed"), 0);
      }
    }
  }

  startMainScene() {
    this.scene.start("SceneMain");
  }
}
