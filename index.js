const platformImage = new Image();
platformImage.src = "./imgs/platform.png";
const backgroundImage = new Image();
backgroundImage.src = "./imgs/background.png";
const hillsImage = new Image();
hillsImage.src = "./imgs/hills.png";
const platformSmallImage = new Image();
platformSmallImage.src = "./imgs/platformSmallTall.png";

const marioLeft1Image = new Image();
marioLeft1Image.src = "./imgs/mario-left-1.png";
const marioLeft2Image = new Image();
marioLeft2Image.src = "./imgs/mario-left-2.png";
const marioRight1Image = new Image();
marioRight1Image.src = "./imgs/mario-right-1.png";
const marioRight2Image = new Image();
marioRight2Image.src = "./imgs/mario-right-2.png";
const marioStationaryImage = new Image();
marioStationaryImage.src = "./imgs/mario-stationary.png";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
  constructor() {
    this.speed = 12;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 60;
    this.height = 60;
    this.canJump = false;

    this.frameIndex = 0;
    this.frameInterval = 60;
    this.lastFrameTime = 0;
    this.currentDirection = "stationary";
  }

  draw() {
    const now = performance.now();

    let image = marioStationaryImage;
    let frames;
    let direction = "stationary";

    if (keys.left.pressed) {
      direction = "left";
      frames = [marioLeft1Image, marioLeft2Image];
    } else if (keys.right.pressed) {
      direction = "right";
      frames = [marioRight1Image, marioRight2Image];
    }

    if (frames) {
      // Restart the animation when changing directions
      if (this.currentDirection !== direction) {
        this.currentDirection = direction;
        this.frameIndex = 0;
        this.lastFrameTime = now;
      } else if (now - this.lastFrameTime >= this.frameInterval) {
        // Alternate between the two running frames
        this.frameIndex = (this.frameIndex + 1) % frames.length;
        this.lastFrameTime = now;
      }

      image = frames[this.frameIndex];
    } else {
      this.currentDirection = "stationary";
      this.frameIndex = 0;
      this.lastFrameTime = now;
    }

    // Draw the selected sprite after it has loaded
    if (image.complete && image.naturalWidth > 0) {
      c.drawImage(
        image,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
      );
    }
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // Keep the player from moving left of the starting boundary
    this.position.x = Math.max(100, this.position.x);

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.image = platformImage;

    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
class PlatformSmall {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.image = platformSmallImage;

    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;

    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

let player = new Player();
let platforms = [
  new PlatformSmall({ x: 350, y: 275, image: platformSmallImage }),
  new PlatformSmall({ x: 639, y: 80, image: platformSmallImage }),
  new PlatformSmall({ x: 639, y: 275, image: platformSmallImage }),
  new PlatformSmall({ x: 928, y: 275, image: platformSmallImage }),
  new Platform({ x: -1, y: 451, image: platformImage }),
  new Platform({ x: 778, y: 451, image: platformImage }),
  new PlatformSmall({ x: 1600, y: 351, image: platformSmallImage }),
  new PlatformSmall({ x: 2100, y: 351, image: platformSmallImage }),
  new PlatformSmall({ x: 2900, y: 230, image: platformSmallImage }),
  new PlatformSmall({ x: 3350, y: 51, image: platformSmallImage }),
  new PlatformSmall({ x: 3278, y: 370, image: platformSmallImage }),
  new PlatformSmall({ x: 3350, y: 370, image: platformSmallImage }),
  new Platform({ x: 2600, y: 451, image: platformImage }),
  new Platform({ x: 3179, y: 451, image: platformImage }),
  new PlatformSmall({ x: 4200, y: 551, image: platformSmallImage }),
  new Platform({ x: 4800, y: 451, image: platformImage }),
  new Platform({ x: 5378, y: 451, image: platformImage }),
];
let genericObjects = [
  new GenericObject({ x: -100, y: -1, image: backgroundImage }),
  new GenericObject({ x: -100, y: -1, image: hillsImage }),
];

let decorativeObjects = [
  new GenericObject({ x: 3350, y: 151, image: platformSmallImage }),
  new GenericObject({ x: 500, y: 375, image: platformSmallImage }),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

/* MOBILE TOUCH CONTROLS */

const mobileControlsStyle = document.createElement("style");
mobileControlsStyle.textContent = `
  @media (hover: none), (pointer: coarse) {
    #mobile-controls {
      display: flex !important;
    }
  }

  @media (max-width: 480px) {
    #mobile-controls {
      padding-left: 14px !important;
      padding-right: 14px !important;
    }

    #mobile-controls .move-buttons {
      gap: 8px !important;
    }

    #mobile-controls button {
      width: 58px !important;
      height: 58px !important;
    }
  }
`;
document.head.appendChild(mobileControlsStyle);

const mobileControls = document.createElement("div");
mobileControls.id = "mobile-controls";
mobileControls.style.cssText = `
  position: fixed;
  left: 0;
  right: 0;
  bottom: max(20px, env(safe-area-inset-bottom));
  z-index: 1000;
  display: none;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 24px;
  box-sizing: border-box;
  pointer-events: none;
`;

const moveButtons = document.createElement("div");
moveButtons.className = "move-buttons";
moveButtons.style.cssText = `
  display: flex;
  gap: 12px;
  pointer-events: auto;
`;

function makeControl(symbol, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = symbol;
  button.setAttribute("aria-label", label);

  button.style.cssText = `
    width: 68px;
    height: 68px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.65);
    border-radius: 18px;
    background: rgba(20, 20, 20, 0.28);
    color: rgba(255, 255, 255, 0.95);
    font: bold 30px Arial, sans-serif;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  `;

  button.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  return button;
}

const leftButton = makeControl("◀", "Move left");
const rightButton = makeControl("▶", "Move right");
const jumpButton = makeControl("▲", "Jump");

jumpButton.style.pointerEvents = "auto";

moveButtons.append(leftButton, rightButton);
mobileControls.append(moveButtons, jumpButton);
document.body.appendChild(mobileControls);

function positionMobileControls() {
  const rect = canvas.getBoundingClientRect();

  mobileControls.style.left = `${rect.left}px`;
  mobileControls.style.right = `${window.innerWidth - rect.right}px`;
  mobileControls.style.bottom = `${window.innerHeight - rect.bottom + 12}px`;
}

window.addEventListener("resize", positionMobileControls);
window.addEventListener("orientationchange", positionMobileControls);

positionMobileControls();

function bindHoldControl(button, onPress, onRelease = () => {}) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    onPress();
  });

  button.addEventListener("pointerup", (event) => {
    event.preventDefault();
    onRelease();
  });

  button.addEventListener("pointercancel", onRelease);
  button.addEventListener("lostpointercapture", onRelease);
}

bindHoldControl(
  leftButton,
  () => {
    keys.left.pressed = true;
  },
  () => {
    keys.left.pressed = false;
  },
);

bindHoldControl(
  rightButton,
  () => {
    keys.right.pressed = true;
  },
  () => {
    keys.right.pressed = false;
  },
);

bindHoldControl(jumpButton, () => {
  if (player.canJump) {
    player.velocity.y = -24;
    player.canJump = false;
  }
});

let scrollOffset = 0;

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });
  decorativeObjects.forEach((object) => {
    object.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });

  const previousPlayerBottom = player.position.y + player.height;
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.43;
      });
      decorativeObjects.forEach((object) => {
        object.position.x -= player.speed;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      const scrollAmount = Math.min(player.speed, scrollOffset);
      scrollOffset -= scrollAmount;

      platforms.forEach((platform) => {
        platform.position.x += scrollAmount;
      });

      genericObjects.forEach((genericObject) => {
        genericObject.position.x += scrollAmount * 0.43;
      });

      decorativeObjects.forEach((object) => {
        object.position.x += scrollAmount;
      });
    }
  }

  player.canJump = false;

  platforms.forEach((platform) => {
    const currentPlayerBottom = player.position.y + player.height;

    const crossedPlatform =
      previousPlayerBottom <= platform.position.y &&
      currentPlayerBottom >= platform.position.y;

    const overlapsHorizontally =
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width;

    if (player.velocity.y >= 0 && crossedPlatform && overlapsHorizontally) {
      player.position.y = platform.position.y - player.height;
      player.velocity.y = 0;
      player.canJump = true;
    }
  });

  if (scrollOffset > 5000) {
    c.fillStyle = "black";
    c.font = "bold 48px Arial";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("You Win!", canvas.width / 2, canvas.height / 2);
  }
  if (player.position.y > canvas.height) {
    init();
  }
}

function init() {
  player = new Player();

  platforms = [
    new PlatformSmall({ x: 350, y: 275, image: platformSmallImage }),
    new PlatformSmall({ x: 639, y: 80, image: platformSmallImage }),
    new PlatformSmall({ x: 639, y: 275, image: platformSmallImage }),
    new PlatformSmall({ x: 928, y: 275, image: platformSmallImage }),
    new Platform({ x: -1, y: 451, image: platformImage }),
    new Platform({ x: 778, y: 451, image: platformImage }),
    new PlatformSmall({ x: 1600, y: 351, image: platformSmallImage }),
    new PlatformSmall({ x: 2100, y: 351, image: platformSmallImage }),
    new PlatformSmall({ x: 2900, y: 230, image: platformSmallImage }),
    new PlatformSmall({ x: 3350, y: 51, image: platformSmallImage }),
    new PlatformSmall({ x: 3278, y: 370, image: platformSmallImage }),
    new PlatformSmall({ x: 3350, y: 370, image: platformSmallImage }),
    new Platform({ x: 2600, y: 451, image: platformImage }),
    new Platform({ x: 3179, y: 451, image: platformImage }),
    new PlatformSmall({ x: 4200, y: 551, image: platformSmallImage }),
    new Platform({ x: 4800, y: 451, image: platformImage }),
    new Platform({ x: 5378, y: 451, image: platformImage }),
  ];

  genericObjects = [
    new GenericObject({ x: -100, y: -1, image: backgroundImage }),
    new GenericObject({ x: -100, y: -1, image: hillsImage }),
  ];

  decorativeObjects = [
    new GenericObject({ x: 3350, y: 151, image: platformSmallImage }),
    new GenericObject({ x: 500, y: 375, image: platformSmallImage }),
  ];

  scrollOffset = 0;
}

animate();

window.addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = true;
      player.velocity.x = -player.speed;
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = true;
      player.velocity.x = player.speed;
      break;
    case 87:
      if (player.canJump) {
        player.velocity.y = -24;
        player.canJump = false;
      }
      break;
  }
});
window.addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = false;
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = false;
      break;
    case 87:
      break;
  }
});
