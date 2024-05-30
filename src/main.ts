import "./style.css";

import * as THREE from "three";

import * as THREE from "https://esm.sh/three";

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

let time = new Date().getTime();

const manipulate = () => {
  const newTime = new Date().getTime();
  const deltaTime = (newTime - time) / 1000;
  time = newTime;

  for (let i = 0; i < things.length; i++) {
    const { thing, changers, duration, initial, initialTime, callBack } =
      things[i];
    const progress = Math.min((newTime - initialTime) / (duration * 1000), 1);

    for (const key in changers) {
      const { changer, value } = changers[key];

      if (thing[changer][key] === value) {
        delete changers[key];
      } else {
        thing[changer][key] = initial[key] + (value - initial[key]) * progress;
      }
    }

    if (Object.keys(changers).length === 0) {
      callBack?.();
      things.splice(i, 1);
      i--;
    }
  }
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  manipulate(); // Call the manipulate function
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

const duration = 1.7;
const angle = 0.15;

function down() {
  things.push({
    thing: mesh,
    changers: {
      x: { changer: "rotation", value: Math.PI * angle * 1 },
    },
    duration,
    initial: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
    initialTime: new Date().getTime(),
    callBack: right,
  });
}

function left() {
  things.push({
    thing: mesh,
    changers: {
      y: { changer: "rotation", value: Math.PI * angle * -1 },
    },
    duration,
    initial: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
    initialTime: new Date().getTime(),
    callBack: down,
  });
}

function right() {
  things.push({
    thing: mesh,
    changers: {
      y: { changer: "rotation", value: Math.PI * angle * 1 },
    },
    duration,
    initial: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
    initialTime: new Date().getTime(),
    callBack: up,
  });
}

function up() {
  things.push({
    thing: mesh,
    changers: {
      x: { changer: "rotation", value: Math.PI * angle * -1 },
    },
    duration,
    initial: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
    initialTime: new Date().getTime(),
    callBack: left,
  });
}

function axisChangeYZntwo() {
  things.push({
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
    initial: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
    initialTime: new Date().getTime(),
    callBack: axisChangeYZone,
  });
}

function axisChangeYZone() {
  things.push({
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
    initial: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
    initialTime: new Date().getTime(),
    callBack: axisChangeYZntwo,
  });
}

right();
axisChangeYZone();

tick();
