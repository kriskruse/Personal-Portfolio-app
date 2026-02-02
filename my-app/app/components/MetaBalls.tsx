"use client";

import { useEffect, useRef } from "react";

export default function MetaBalls({
  className,
  count = 30,
  speed = 1,
}: {
  className?: string;
  count?: number;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get WebGL context
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    const glCtx = gl;

    // Resize canvas to device size
    function resize() {
      const c = canvasRef.current;
      if (!c) return;
      if (!glCtx) return;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
        c.style.width = `${window.innerWidth}px`;
        c.style.height = `${window.innerHeight}px`;
        glCtx.viewport(0, 0, w, h);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const numMetaballs = Math.max(0, Math.floor(count));

    type MB = { x: number; y: number; vx: number; vy: number; r: number };
    const metaballs: MB[] = [];

    const width = canvas.width;
    const height = canvas.height;

    for (let i = 0; i < numMetaballs; i++) {
      const radius = Math.random() * 60 + 20;
      metaballs.push({
        x: Math.random() * (width - 2 * radius) + radius,
        y: Math.random() * (height - 2 * radius) + radius,
        vx: (Math.random() - 0.5) * 2 * speed,
        vy: (Math.random() - 0.5) * 2 * speed,
        r: radius * 0.75,
      });
    }

    const vertexShaderSrc = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

      const fragmentShaderSrc = `
precision highp float;

const float WIDTH = ${width}.0;
const float HEIGHT = ${height}.0;

uniform vec3 metaballs[${numMetaballs}];

void main(){
  float x = gl_FragCoord.x;
  float y = gl_FragCoord.y;

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
    // Contribution-weighted average Y (where higher Y = higher on screen)
    float avgY = weightedY / sum;
    float upness = clamp(avgY / HEIGHT, 0.0, 1.0);

    // Horizontal orange -> purple spectrum (with slight Y influence)
    vec3 orange = vec3(1.0, 0.5, 0.0);
    vec3 purple = vec3(0.6, 0.0, 0.8);
    float t = clamp((x / WIDTH) * 0.9 + (y / HEIGHT) * 0.1, 0.0, 1.0);
    vec3 baseColor = mix(orange, purple, t);

    // Brighten toward white based on how high the contributing metaballs are
    vec3 brightened = mix(baseColor, vec3(1.0), upness * 0.6);

    // Apply the same fade-to-black based on intensity
    gl_FragColor = vec4(mix(brightened, vec3(0.0), max(0.0, 1.0 - (sum - 0.99) * 100.0)), 1.0);
    return;
  }

  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;



    function compileShader(shaderSource: string, shaderType: number) {
      const shader = glCtx.createShader(shaderType);
      if (!shader) throw new Error("Unable to create shader");
      glCtx.shaderSource(shader, shaderSource);
      glCtx.compileShader(shader);

      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        const info = glCtx.getShaderInfoLog(shader);
        glCtx.deleteShader(shader);
        throw new Error("Shader compile failed: " + info);
      }

      return shader;
    }

    const vertexShader = compileShader(vertexShaderSrc, glCtx.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSrc, glCtx.FRAGMENT_SHADER);

    const program = glCtx.createProgram();
    if (!program) throw new Error("Unable to create GL program");
    glCtx.attachShader(program, vertexShader);
    glCtx.attachShader(program, fragmentShader);
    glCtx.linkProgram(program);

    if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
      const info = glCtx.getProgramInfoLog(program);
      throw new Error("Program link failed: " + info);
    }

    glCtx.useProgram(program);

    const vertexData = new Float32Array([
      -1.0, 1.0,
      -1.0, -1.0,
      1.0, 1.0,
      1.0, -1.0,
    ]);

    const vertexDataBuffer = glCtx.createBuffer();
    if (!vertexDataBuffer) throw new Error("Unable to create buffer");
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, vertexDataBuffer);
    glCtx.bufferData(glCtx.ARRAY_BUFFER, vertexData, glCtx.STATIC_DRAW);

    const positionHandle = glCtx.getAttribLocation(program, "position");
    if (positionHandle === -1) throw new Error("Can not find attribute position");
    glCtx.enableVertexAttribArray(positionHandle);
    glCtx.vertexAttribPointer(positionHandle, 2, glCtx.FLOAT, false, 2 * 4, 0);

    const metaballsHandle = glCtx.getUniformLocation(program, "metaballs");
    if (!metaballsHandle) throw new Error("Can not find uniform metaballs");

    let rafId = 0;

    function loop() {
      const c = canvasRef.current;
      if (!c) return;

      // Update metaball positions
      for (let i = 0; i < numMetaballs; i++) {
        const mb = metaballs[i];
        mb.x += mb.vx;
        mb.y += mb.vy;

        if (mb.x < mb.r || mb.x > c.width - mb.r) mb.vx *= -1;
        if (mb.y < mb.r || mb.y > c.height - mb.r) mb.vy *= -1;
      }

      // Upload data
      const dataToSendToGPU = new Float32Array(3 * numMetaballs);
      for (let i = 0; i < numMetaballs; i++) {
        const baseIndex = 3 * i;
        const mb = metaballs[i];
        dataToSendToGPU[baseIndex] = mb.x;
        dataToSendToGPU[baseIndex + 1] = mb.y;
        dataToSendToGPU[baseIndex + 2] = mb.r;
      }

      glCtx.uniform3fv(metaballsHandle, dataToSendToGPU);

      // Draw
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);

      rafId = requestAnimationFrame(loop);
    }

    loop();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      try {
        glCtx.deleteProgram(program);
        glCtx.deleteShader(vertexShader);
        glCtx.deleteShader(fragmentShader);
        if (vertexDataBuffer) glCtx.deleteBuffer(vertexDataBuffer);
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, [count, speed]);

  return (
    <div className={`fixed inset-0 -z-10 pointer-events-none ${className ?? ""}`} aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
