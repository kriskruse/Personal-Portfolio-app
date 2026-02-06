// Shared types and utilities for MetaBalls components

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Metaball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export type MetaBallMode = "default" | "bounce" | "mask" | "combined";

export const MAX_RECTS = 16;

/** Compute default metaball count based on screen size */
export function computeDefaultCount(): number {
  const area = window.innerWidth * window.innerHeight;
  const estimated = Math.round(area / 50000);
  return Math.min(150, Math.max(6, estimated));
}

/** Get rects from DOM elements matching selector, converted to WebGL coordinates */
export function getRectsFromSelector(selector: string): Rect[] {
  const elements = document.querySelectorAll(selector);
  const dpr = window.devicePixelRatio || 1;
  const rects: Rect[] = [];

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    rects.push({
      x: rect.left * dpr,
      y: (window.innerHeight - rect.bottom) * dpr, // Flip Y for WebGL
      width: rect.width * dpr,
      height: rect.height * dpr,
    });
  });

  return rects.slice(0, MAX_RECTS);
}

/** Initialize metaballs with random positions and velocities */
export function createMetaballs(
  count: number,
  width: number,
  height: number,
  speed: number
): Metaball[] {
  const metaballs: Metaball[] = [];
  const minDim = Math.min(width, height);
  const minRadius = Math.max(8, Math.round(minDim * 0.025));
  const maxRadius = Math.max(minRadius + 4, Math.round(minDim * 0.045));

  for (let i = 0; i < count; i++) {
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const diameter = radius * 2;
    metaballs.push({
      x: Math.random() * (width - diameter) + radius,
      y: Math.random() * (height - diameter) + radius,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: radius,
    });
  }

  return metaballs;
}

/** Handle bouncing off screen edges */
export function bounceOffEdges(mb: Metaball, width: number, height: number): void {
  if (mb.x < mb.r || mb.x > width - mb.r) mb.vx *= -1;
  if (mb.y < mb.r || mb.y > height - mb.r) mb.vy *= -1;
}

/** Handle bouncing off rectangles */
export function bounceOffRects(mb: Metaball, rects: Rect[]): void {
  for (const rect of rects) {
    const closestX = Math.max(rect.x, Math.min(mb.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(mb.y, rect.y + rect.height));

    const distX = mb.x - closestX;
    const distY = mb.y - closestY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < mb.r) {
      const insideX = mb.x >= rect.x && mb.x <= rect.x + rect.width;
      const insideY = mb.y >= rect.y && mb.y <= rect.y + rect.height;

      if (insideX && insideY) {
        // Push out based on shortest escape
        const escapeLeft = mb.x - rect.x + mb.r;
        const escapeRight = rect.x + rect.width - mb.x + mb.r;
        const escapeBottom = mb.y - rect.y + mb.r;
        const escapeTop = rect.y + rect.height - mb.y + mb.r;
        const minEscape = Math.min(escapeLeft, escapeRight, escapeBottom, escapeTop);

        if (minEscape === escapeLeft) {
          mb.x = rect.x - mb.r;
          mb.vx = -Math.abs(mb.vx);
        } else if (minEscape === escapeRight) {
          mb.x = rect.x + rect.width + mb.r;
          mb.vx = Math.abs(mb.vx);
        } else if (minEscape === escapeBottom) {
          mb.y = rect.y - mb.r;
          mb.vy = -Math.abs(mb.vy);
        } else {
          mb.y = rect.y + rect.height + mb.r;
          mb.vy = Math.abs(mb.vy);
        }
      } else if (insideX) {
        if (distY > 0) {
          mb.y = rect.y + rect.height + mb.r;
          mb.vy = Math.abs(mb.vy);
        } else {
          mb.y = rect.y - mb.r;
          mb.vy = -Math.abs(mb.vy);
        }
      } else if (insideY) {
        if (distX > 0) {
          mb.x = rect.x + rect.width + mb.r;
          mb.vx = Math.abs(mb.vx);
        } else {
          mb.x = rect.x - mb.r;
          mb.vx = -Math.abs(mb.vx);
        }
      } else if (distance > 0) {
        // Corner collision
        const normalX = distX / distance;
        const normalY = distY / distance;
        mb.x = closestX + normalX * mb.r;
        mb.y = closestY + normalY * mb.r;
        const dotProduct = mb.vx * normalX + mb.vy * normalY;
        if (dotProduct < 0) {
          mb.vx -= 2 * dotProduct * normalX;
          mb.vy -= 2 * dotProduct * normalY;
        }
      }
    }
  }
}

/** Compile a WebGL shader */
export function compileShader(
  gl: WebGLRenderingContext,
  source: string,
  type: number
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("Shader compile failed: " + info);
  }

  return shader;
}

/** Create and link a WebGL program */
export function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create GL program");
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    throw new Error("Program link failed: " + info);
  }

  return program;
}

/** Vertex shader source (same for all modes) */
export const VERTEX_SHADER_SRC = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/** Generate fragment shader source based on mode */
export function getFragmentShaderSrc(
  width: number,
  height: number,
  numMetaballs: number,
  mode: MetaBallMode
): string {
  const usesMask = mode === "mask" || mode === "combined";

  const maskUniforms = usesMask
    ? `
uniform vec4 maskRects[${MAX_RECTS}];
uniform int numMaskRects;

bool isInMaskRect(float x, float y) {
  for (int i = 0; i < ${MAX_RECTS}; i++) {
    if (i >= numMaskRects) break;
    vec4 rect = maskRects[i];
    if (x >= rect.x && x <= rect.x + rect.z && 
        y >= rect.y && y <= rect.y + rect.w) {
      return true;
    }
  }
  return false;
}
`
    : "";

  const maskCheck = usesMask
    ? `
  if (isInMaskRect(x, y)) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }
`
    : "";

  return `
precision highp float;

const float WIDTH = ${width}.0;
const float HEIGHT = ${height}.0;

uniform vec3 metaballs[${numMetaballs}];
${maskUniforms}

void main(){
  float x = gl_FragCoord.x;
  float y = gl_FragCoord.y;
  ${maskCheck}
  float sum = 0.0;
  float weightedY = 0.0;

  for (int i = 0; i < ${numMetaballs}; i++) {
    vec3 metaball = metaballs[i];
    float dx = metaball.x - x;
    float dy = metaball.y - y;
    float radius = metaball.z;

    float contrib = (radius * radius) / (dx * dx + dy * dy);
    sum += contrib;
    weightedY += metaball.y * contrib;
  }

  if (sum >= 0.99) {
    float avgY = weightedY / sum;
    float upness = clamp(avgY / HEIGHT, 0.0, 1.0);

    vec3 orange = vec3(1.0, 0.5, 0.0);
    vec3 purple = vec3(0.6, 0.0, 0.8);
    float t = clamp((x / WIDTH) * 0.9 + (y / HEIGHT) * 0.1, 0.0, 1.0);
    vec3 baseColor = mix(orange, purple, t);

    vec3 brightened = mix(baseColor, vec3(1.0), upness * 0.6);

    gl_FragColor = vec4(mix(brightened, vec3(0.0), max(0.0, 1.0 - (sum - 0.99) * 100.0)), 1.0);
    return;
  }

  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;
}

