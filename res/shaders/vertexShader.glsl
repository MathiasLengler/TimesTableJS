uniform float multiplier;
uniform float total;
uniform float colorMethod;

attribute float number;

attribute vec3 color;
varying vec3 vColor;

#define PI 3.1415926535897932384626433832795

bool isStartCord(float number);
vec2 getCircleCord(float number, float total);
vec3 hsv2rgb(vec3 c);


void main() {
  vec3 newPosition = position;

  if (isStartCord(number)) {
    newPosition.xy =  getCircleCord(number / 2.0, total);
  } else {
    newPosition.xy =  getCircleCord( floor(number / 2.0) * multiplier, total);
  }

  float theta = 2.0 * PI * floor(number / 2.0) * (multiplier - 1.0) / total;
  float distance = abs(sin(theta / 2.0));

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition,1.0);

  // colorMethod switch
  if (colorMethod == 0.0) {
    // solid
    vColor.xyz = vec3(1.0);
  } else if (colorMethod == 1.0) {
    // faded
    if (isStartCord(number)) {
      vColor.xyz = vec3(1.0);
    } else {
      vColor.xyz = vec3(0.0);
    }
  } else if (colorMethod == 2.0) {
    // lengthOpacity
    vColor.xyz = vec3(1.0 - distance);
  } else if (colorMethod == 3.0) {
    // lengthHue
    vColor.xyz = vec3(hsv2rgb(vec3(distance, 1.0, 1.0)));
  } else {
    // fallback error red
    vColor.xyz = vec3(1.0, 0.0, 0.0);
  }
}

bool isStartCord(float number) {
  return mod(number, 2.0) < 0.01;
}

vec2 getCircleCord(float number, float total) {
    float normalized = (number / total) * 2.0 * PI;
    return vec2(cos(normalized), sin(normalized));
}

// source: http://gamedev.stackexchange.com/a/59808
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}