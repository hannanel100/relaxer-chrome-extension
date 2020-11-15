const container = document.getElementById("container");
const text = document.getElementById("text");
const changeButton = document.getElementById("change");
const outerContainer = document.getElementById("outer-container");
const totalTime = 7500;

const breatheTime = (totalTime / 5) * 2;
const holdTime = totalTime / 5;

breathAnimation();

function breathAnimation() {
  text.innerText = "Breathe In!";
  container.className = "container grow";
  setTimeout(() => {
    text.innerText = "Hold!";
    setTimeout(() => {
      text.innerText = "Breathe Out!";
      container.className = "container shrink";
    }, holdTime);
  }, breatheTime);
}

setInterval(breathAnimation, totalTime);

const createCanvas = () => {
  // const canvas = document.createElement("canvas");
  outerContainer.innerHTML = "";
  // container.appendChild(canvas);
  document.body.style.backgroundImage = "url('img/snowBg.jpg')";
  createSnow();
};

const createSnow = () => {
  const CONSTANTS = {
    VX_MAX: 2,
    VY_MAX: 5,
    VY_ACCELERATE: 0.01,
  };
  class SnowFlake {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      this.radius = 0;
      this.alpha = 0;
      this.reset();
    }

    reset() {
      this.radius = this.randBetween(1, 3);
      this.alpha = this.randBetween(0.3, 0.9);
      this.x = this.randBetween(0, window.innerWidth);
      this.y = this.randBetween(-window.innerHeight, -this.radius);
      this.vx = this.randBetween(-CONSTANTS.VX_MAX, CONSTANTS.VX_MAX);
      this.vy = this.randBetween(0, 1);
    }

    update() {
      if (this.vy < CONSTANTS.VY_MAX) {
        this.vy += CONSTANTS.VY_ACCELERATE;
      }
      if (this.vx < CONSTANTS.VX_MAX) {
        this.vx += this.randBetween(0, 0.3);
      }
      if (this.vx > -CONSTANTS.VX_MAX) {
        this.vx -= this.randBetween(0, 0.3);
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.y + this.radius > window.innerHeight) {
        this.reset();
      }
    }

    randBetween(min, max) {
      return min + Math.random() * (max - min);
    }
  }
  class Snow {
    constructor() {
      this.canvas = document.createElement("canvas");
      outerContainer.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
      this.onResize();
      window.addEventListener("resize", () => {
        this.onResize();
      });

      this.updateBound = this.update.bind(this);
      requestAnimationFrame(this.updateBound);

      this.createSnowFlakes();
    }

    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    createSnowFlakes() {
      this.snowFlakesNum = (window.innerHeight * window.innerWidth) / 3000;
      this.snowFlakes = [];
      for (let i = 0; i < this.snowFlakesNum; i++) {
        this.snowFlakes.push(new SnowFlake());
      }
    }

    update() {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.snowFlakes.forEach((snowFlake) => {
        snowFlake.update();

        // draw snow flake
        this.ctx.save();
        this.ctx.fillStyle = "#FFF";
        this.ctx.beginPath();
        this.ctx.arc(
          snowFlake.x,
          snowFlake.y,
          snowFlake.radius,
          0,
          Math.PI * 2
        );
        this.ctx.closePath();
        this.ctx.globalAlpha = snowFlake.alpha;
        this.ctx.fill();
        this.ctx.restore();
      });

      requestAnimationFrame(this.updateBound);
    }
  }

  // let it snow
  new Snow();
};

changeButton.addEventListener("click", createCanvas);
