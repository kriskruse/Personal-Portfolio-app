"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  MetaBallMode,
  Rect,
  Metaball,
  MAX_RECTS,
  computeDefaultCount,
  getRectsFromSelector,
  createMetaballs,
  bounceOffEdges,
  bounceOffRects,
  compileShader,
  createProgram,
  VERTEX_SHADER_SRC,
  getFragmentShaderSrc,
} from "./core";

export type { MetaBallMode } from "./core";

export interface MetaBallsProps {
  className?: string;
  count?: number;
  speed?: number;
  opacity?: number;
  /**
   * Mode of operation:
   * - "default": Metaballs move freely
   * - "bounce": Metaballs bounce off elements matching bounceSelector
   * - "mask": Metaballs are hidden behind elements matching maskSelector
   * - "combined": Both bounce and mask behaviors active simultaneously
   */
  mode?: MetaBallMode;
  /**
   * CSS selector for elements to interact with (used for bounce/mask single modes).
   * For combined mode, use bounceSelector and maskSelector instead.
   */
  selector?: string;
  /** CSS selector for elements to bounce off (used in bounce or combined mode) */
  bounceSelector?: string;
  /** CSS selector for elements to mask behind (used in mask or combined mode) */
  maskSelector?: string;
}

export default function MetaBalls({
  className,
  count,
  speed = 0.75,
  opacity = 1,
  mode = "default",
  selector,
  bounceSelector = "[data-metaball-bounce]",
  maskSelector = "[data-metaball-mask]",
}: MetaBallsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const startLoopRef = useRef<(() => void) | null>(null);
  const bounceRectsRef = useRef<Rect[]>([]);
  const maskRectsRef = useRef<Rect[]>([]);
  const maskRectsHandleRef = useRef<WebGLUniformLocation | null>(null);
  const numMaskRectsHandleRef = useRef<WebGLUniformLocation | null>(null);

  // Determine effective selectors based on mode
  const effectiveBounceSelector =
    mode === "bounce" ? (selector ?? bounceSelector) :
    mode === "combined" ? bounceSelector : "";

  const effectiveMaskSelector =
    mode === "mask" ? (selector ?? maskSelector) :
    mode === "combined" ? maskSelector : "";

  const usesBounce = mode === "bounce" || mode === "combined";
  const usesMask = mode === "mask" || mode === "combined";

  // Update rects from DOM elements
  const updateRects = useCallback(() => {
    if (usesBounce && effectiveBounceSelector) {
      bounceRectsRef.current = getRectsFromSelector(effectiveBounceSelector);
    } else {
      bounceRectsRef.current = [];
    }
    if (usesMask && effectiveMaskSelector) {
      maskRectsRef.current = getRectsFromSelector(effectiveMaskSelector);
    } else {
      maskRectsRef.current = [];
    }
  }, [usesBounce, usesMask, effectiveBounceSelector, effectiveMaskSelector]);

  // Keep canvas opacity in sync
  useEffect(() => {
    const c = canvasRef.current;
    if (c) c.style.opacity = String(opacity);
  }, [opacity]);

  // Main WebGL setup and animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Resize canvas to device size
    function resize() {
      const c = canvasRef.current;
      if (!c || !gl) return;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
        c.style.width = `${window.innerWidth}px`;
        c.style.height = `${window.innerHeight}px`;
        gl.viewport(0, 0, w, h);
      }
      updateRects();
    }

    resize();
    window.addEventListener("resize", resize);

    // For bounce/mask modes, listen to scroll and DOM changes
    let observer: MutationObserver | null = null;
    if (mode !== "default") {
      window.addEventListener("scroll", updateRects, { passive: true });
      observer = new MutationObserver(updateRects);
      observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    const numMetaballs = Math.max(0, Math.floor(count ?? computeDefaultCount()));
    const width = canvas.width;
    const height = canvas.height;
    const metaballs: Metaball[] = createMetaballs(numMetaballs, width, height, speed);

    // Compile shaders
    const vertexShader = compileShader(gl, VERTEX_SHADER_SRC, gl.VERTEX_SHADER);
    const fragmentShaderSrc = getFragmentShaderSrc(width, height, numMetaballs, mode);
    const fragmentShader = compileShader(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    // Setup vertex buffer
    const vertexData = new Float32Array([-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0]);
    const vertexDataBuffer = gl.createBuffer();
    if (!vertexDataBuffer) throw new Error("Unable to create buffer");
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    const positionHandle = gl.getAttribLocation(program, "position");
    if (positionHandle === -1) throw new Error("Can not find attribute position");
    gl.enableVertexAttribArray(positionHandle);
    gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

    const metaballsHandle = gl.getUniformLocation(program, "metaballs");
    if (!metaballsHandle) throw new Error("Can not find uniform metaballs");

    // Get mask uniforms if in mask or combined mode
    if (usesMask) {
      maskRectsHandleRef.current = gl.getUniformLocation(program, "maskRects");
      numMaskRectsHandleRef.current = gl.getUniformLocation(program, "numMaskRects");
    }

    function loop() {
      const c = canvasRef.current;
      if (!c || !gl) return;

      const currentOpacity = parseFloat(c.style.opacity || "1");
      if (currentOpacity <= 0.001) {
        rafIdRef.current = null;
        return;
      }

      // Update metaball positions
      for (const mb of metaballs) {
        mb.x += mb.vx;
        mb.y += mb.vy;

        bounceOffEdges(mb, c.width, c.height);

        if (usesBounce) {
          bounceOffRects(mb, bounceRectsRef.current);
        }
      }

      // Upload metaball data
      const dataToSendToGPU = new Float32Array(3 * numMetaballs);
      for (let i = 0; i < numMetaballs; i++) {
        const baseIndex = 3 * i;
        const mb = metaballs[i];
        dataToSendToGPU[baseIndex] = mb.x;
        dataToSendToGPU[baseIndex + 1] = mb.y;
        dataToSendToGPU[baseIndex + 2] = mb.r;
      }
      gl.uniform3fv(metaballsHandle, dataToSendToGPU);

      // Upload mask rects if in mask or combined mode
      if (usesMask) {
        const rects = maskRectsRef.current;
        const maskRectsData = new Float32Array(4 * MAX_RECTS);
        for (let i = 0; i < Math.min(rects.length, MAX_RECTS); i++) {
          const baseIndex = 4 * i;
          const rect = rects[i];
          maskRectsData[baseIndex] = rect.x;
          maskRectsData[baseIndex + 1] = rect.y;
          maskRectsData[baseIndex + 2] = rect.width;
          maskRectsData[baseIndex + 3] = rect.height;
        }
        if (maskRectsHandleRef.current) {
          gl.uniform4fv(maskRectsHandleRef.current, maskRectsData);
        }
        if (numMaskRectsHandleRef.current) {
          gl.uniform1i(numMaskRectsHandleRef.current, rects.length);
        }
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafIdRef.current = requestAnimationFrame(loop);
    }

    startLoopRef.current = () => {
      if (rafIdRef.current != null) return;
      rafIdRef.current = requestAnimationFrame(loop);
    };

    if (opacity > 0) startLoopRef.current();

    return () => {
      window.removeEventListener("resize", resize);
      if (mode !== "default") {
        window.removeEventListener("scroll", updateRects);
        observer?.disconnect();
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      try {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        if (vertexDataBuffer) gl.deleteBuffer(vertexDataBuffer);
      } catch {
        // ignore cleanup errors
      }
    };
  }, [count, speed, mode, updateRects, usesBounce, usesMask]);

  // Start/stop animation based on opacity
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    if (!(opacity > 0)) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      c.style.opacity = "0";
      return;
    }

    c.style.opacity = String(opacity);
    if (startLoopRef.current) startLoopRef.current();
  }, [opacity]);

  return (
    <div className={`fixed inset-0 -z-10 pointer-events-none ${className ?? ""}`} aria-hidden>
      <canvas
        ref={canvasRef}
        style={{
          opacity: opacity ?? 1,
          transition: "opacity 300ms linear",
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      />
      <div aria-hidden className="absolute inset-0 z-10 pointer-events-none bg-zinc-700/20" />
    </div>
  );
}

