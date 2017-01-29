
import {Point2D} from "./point2D";
import {ColorMethod, ThreeEnv} from "./interfaces";


export function getCircleCord(number: number, total: number): Point2D {
  let normalized = (number / total) * 2 * Math.PI;
  return new Point2D(Math.cos(normalized), Math.sin(normalized));
}

export function updateNumbers(numbersAttribute: THREE.BufferAttribute, total: number) {
  const numbers = <Float32Array> numbersAttribute.array;

  for (let i = 0; i < total * 2; i++) {
    numbers[i] = i;
  }

  numbersAttribute.needsUpdate = true;
}

export function updateMultiplier(material: THREE.ShaderMaterial, multiplier: number) {
  material.uniforms.multiplier.value = multiplier;
  material.needsUpdate = true;
}

// TODO: move calculations to vertex shader because distances is now only available there
export function updateColors(colorsAttribute: THREE.BufferAttribute, distances: Float32Array, total: number, colorMethod: ColorMethod) {
  const colors = <Float32Array> colorsAttribute.array;

  switch (colorMethod) {
    case 'solid':
      for (let i = 0; i < total; i++) {
        // colors start point
        colors[i * 6] = 1;
        colors[i * 6 + 1] = 1;
        colors[i * 6 + 2] = 1;
        // colors end point
        colors[i * 6 + 3] = 1;
        colors[i * 6 + 4] = 1;
        colors[i * 6 + 5] = 1;
      }
      break;
    case 'faded':
      for (let i = 0; i < total; i++) {
        // colors start point
        colors[i * 6] = 1;
        colors[i * 6 + 1] = 1;
        colors[i * 6 + 2] = 1;
        // colors end point
        colors[i * 6 + 3] = 0;
        colors[i * 6 + 4] = 0;
        colors[i * 6 + 5] = 0;
      }
      break;
    case 'lengthOpacity':
      for (let i = 0; i < total; i++) {
        const distance = 1 - distances[i] / 2;

        // colors start point
        colors[i * 6] = distance;
        colors[i * 6 + 1] = distance;
        colors[i * 6 + 2] = distance;
        // colors end point
        colors[i * 6 + 3] = distance;
        colors[i * 6 + 4] = distance;
        colors[i * 6 + 5] = distance;
      }
      break;
    case 'lengthHue':
      for (let i = 0; i < total; i++) {
        const {r, g, b} = new THREE.Color().setHSL(distances[i] / 2, 1, 0.5);

        // colors start point
        colors[i * 6] = r;
        colors[i * 6 + 1] = g;
        colors[i * 6 + 2] = b;
        // colors end point
        colors[i * 6 + 3] = r;
        colors[i * 6 + 4] = g;
        colors[i * 6 + 5] = b;
      }
      break;
    default:
      throw "Unexpected ColorValue";
  }

  colorsAttribute.needsUpdate = true;
}

export function updateOpacity(threeEnv: ThreeEnv, opacity: number) {
  threeEnv.material.uniforms.opacity.value = opacity;
  threeEnv.material.needsUpdate = true;
}

export function updateCamera(threeEnv: ThreeEnv, camPosX: number, camPosY: number) {
  threeEnv.camera.position.setX(camPosX);
  threeEnv.camera.position.setX(camPosY);
}

export function updateZoom(threeEnv: ThreeEnv, zoom: number) {
  threeEnv.camera.zoom = zoom * zoom;
  threeEnv.camera.updateProjectionMatrix();
}

export function updateTotalLines(threeEnv: ThreeEnv, totalLines: number) {
  const positions = new Float32Array(totalLines * 6);
  threeEnv.positionsAttribute.setArray(positions);

  const colors = new Float32Array(totalLines * 6);
  threeEnv.colorsAttribute.setArray(colors);

  const numbers = new Float32Array((totalLines * 2));
  threeEnv.numbersAttribute.setArray(numbers);

  const distances = new Float32Array(totalLines);
  threeEnv.distances = distances;

  threeEnv.material.uniforms.total.value = totalLines;
  threeEnv.material.needsUpdate = true;

  threeEnv.positionsAttribute.needsUpdate = true;
}