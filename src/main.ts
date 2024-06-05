import "./style.css";

import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const clock = new THREE.Clock();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const things = [];

function initialize({ thing, changers, duration, callBack }) {
  const initialTime = new Date().getTime();
  const initials = {};

  for (const key in changers) {
    initials[key] = thing[changers[key].changer][key];
  }

  const newObject = {
    thing,
    changers,
    duration,
    initialTime,
    initials,
    callBack,
  };

  things.push(newObject);

  return newObject;
}

let newTime = new Date().getTime();

function manipulate() {
  const currentTime = new Date().getTime();
  const deltaTime = (currentTime - newTime) / 1000;
  newTime = currentTime;

  for (let i = 0; i < things.length; i++) {
    const { thing, changers, duration, initials, initialTime, callBack } =
      things[i];
    const progress = Math.min(
      (currentTime - initialTime) / (duration * 1000),
      1,
    );

    for (const key in changers) {
      const { changer, value } = changers[key];

      if (thing[changer][key] === value) {
        delete changers[key];
      } else {
        thing[changer][key] =
          initials[key] + (value - initials[key]) * progress;
      }
    }

    if (Object.keys(changers).length === 0) {
      callBack?.();
      things.splice(i, 1);
      i--;
    }
  }
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  manipulate();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

const duration = 1.7;
const angle = 0.15;

function down() {
  initialize({
    thing: mesh,
    changers: {
      x: { changer: "rotation", value: Math.PI * angle * 1 },
    },
    duration,
    callBack: right,
  });
}

function left() {
  initialize({
    thing: mesh,
    changers: {
      y: { changer: "rotation", value: Math.PI * angle * -1 },
    },
    duration,
    callBack: down,
  });
}

function right() {
  initialize({
    thing: mesh,
    changers: {
      y: { changer: "rotation", value: Math.PI * angle * 1 },
    },
    duration,
    callBack: up,
  });
}

function up() {
  initialize({
    thing: mesh,
    changers: {
      x: { changer: "rotation", value: Math.PI * angle * -1 },
    },
    duration,
    callBack: left,
  });
}

function axisChangeYZntwo() {
  initialize({
    thing: mesh,
    changers: {
      y: { changer: "position", value: -1 },
      z: {
        changer: "position",
        value: Math.random() < 0.5 ? -1 : 1,
      },
      x: {
        changer: "position",
        value: Math.random() < 0.5 ? -1 : 1,
      },
    },
    duration: 5,
    callBack: axisChangeYZone,
  });
}

function axisChangeYZone() {
  initialize({
    thing: mesh,
    changers: {
      y: { changer: "position", value: 2 },
      z: {
        changer: "position",
        value: Math.random() < 0.5 ? -1 : 1,
      },
      x: {
        changer: "position",
        value: Math.random() < 0.5 ? -1 : 1,
      },
    },
    duration: 5,
    callBack: axisChangeYZntwo,
  });
}

right();
axisChangeYZone();

tick();
