/**
 * dsh-liquid-glass v1.0.0 · client half（浏览器半）
 * DSH 标准 Client 插件：window.__ModuleLoader__.load({ id, factory })
 *
 * 功能：
 *  1. 液态玻璃 —— 把 DeepSeek Harness 的 UI（输入框/按钮/面板/侧边栏/工具栏/顶栏）
 *     变成 Apple 风格液态玻璃（WebGL2 SDF 折射、色散、边缘光）。
 *  2. 全局自定义背景 —— 背景层铺满整个 DSH 界面（纯色/渐变预设/图片 URL），
 *     液态玻璃折射的就是这个自定义背景（backdrop:'auto' 捕获整页渲染）。
 *  3. 自绘设置面板 —— 屏幕右侧中部小圆球（液态玻璃风 SVG）→ 点击弹出面板，
 *     总开关/玻璃强度/磨砂/背景类型与颜色/应用范围即时生效，localStorage 持久化。
 *
 * 液态玻璃实现说明（重要）：
 *  - 使用真实开源项目 apple-liquid-glass-webgl@2.5.0（MIT License，
 *    https://github.com/Oliverrr2424/webgl-apple-liquid-glass）。
 *  - 库为多文件 ESM，经 esbuild 打包为单文件 IIFE（globalName=LiquidGlassLib）
 *    内联进本文件；库源码未做任何修改，只是打包拼接。
 *  - DSH 的 /plugins/<id>/ 只服务 client bundle、不静态服务 assets，
 *    因此库必须整体内联（与 dsh-mj-spiderman-plugin 的资源内联策略同理）。
 *
 * 样式防御：z-index 用常规量级（9999/10000）；html/body 前缀 + !important
 * 清除宿主皮肤可能注入的背景/边框/滤镜；类名统一 dshlg- 前缀。
 */
window.__ModuleLoader__.load({
  id: 'dsh-liquid-glass',
  factory: (require) => {
    'use strict';
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      exports.name = 'dsh-liquid-glass-client';
      exports.apply = function apply() {};
      return module.exports;
    }
    if (window.__dshLiquidGlassInstalled) {
      exports.name = 'dsh-liquid-glass-client';
      exports.apply = function apply() {};
      return module.exports;
    }
    window.__dshLiquidGlassInstalled = true;

    /* ================================================================
     * apple-liquid-glass-webgl@2.5.0 · esbuild IIFE bundle（内联，未修改）
     * 暴露全局 LiquidGlassLib，含 LiquidGlass（DOM 组件）等导出。
     * ================================================================ */

var LiquidGlassLib = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // lib/src/src/index.js
  var index_exports = {};
  __export(index_exports, {
    BACKDROP_UPDATES: () => BACKDROP_UPDATES2,
    COMPOSITE_MODES: () => COMPOSITE_MODES2,
    DEFAULT_MATERIAL: () => DEFAULT_MATERIAL_V2,
    DEFAULT_MATERIAL_V1: () => DEFAULT_MATERIAL,
    DEFAULT_MATERIAL_V2: () => DEFAULT_MATERIAL_V2,
    DEFAULT_NAVIGATION_LENS: () => DEFAULT_NAVIGATION_LENS,
    LiquidGlass: () => LiquidGlass,
    LiquidGlassNavbar: () => LiquidGlassNavbar,
    LiquidGlassSwitch: () => LiquidGlassSwitch,
    LiquidGlassWebGL: () => LiquidGlassWebGLV2,
    LiquidGlassWebGLV1: () => LiquidGlassWebGLV1,
    LiquidGlassWebGLV2: () => LiquidGlassWebGLV2,
    MAX_GLASS_SHAPES: () => MAX_GLASS_SHAPES,
    MIPS: () => MIPS,
    PRESETS_V1: () => PRESETS,
    PRESSED_CONTROL_MATERIAL_V2: () => PRESSED_CONTROL_MATERIAL_V2,
    REDUCED_TRANSPARENCY_MATERIAL: () => REDUCED_TRANSPARENCY_MATERIAL_V2,
    REDUCED_TRANSPARENCY_MATERIAL_V1: () => REDUCED_TRANSPARENCY_MATERIAL,
    REDUCED_TRANSPARENCY_MATERIAL_V2: () => REDUCED_TRANSPARENCY_MATERIAL_V2,
    SHAPES: () => SHAPES2,
    SLIDERS: () => SLIDERS_V2,
    SLIDERS_V2: () => SLIDERS_V2,
    connectedElementGroups: () => connectedElementGroups,
    distanceToElements: () => distanceToElementsV2,
    distanceToElementsV2: () => distanceToElementsV2,
    getDefaultMaterial: () => getDefaultMaterialV2,
    getDefaultMaterialV1: () => getDefaultMaterial,
    getDefaultMaterialV2: () => getDefaultMaterialV2,
    getPressedControlMaterialV2: () => getPressedControlMaterialV2,
    groupElements: () => groupElements,
    hitTestElements: () => hitTestElementsV2,
    hitTestElementsV1: () => hitTestElements,
    hitTestElementsV2: () => hitTestElementsV2,
    makeMaterial: () => makeMaterialV2,
    makeMaterialV1: () => makeMaterial,
    makeMaterialV2: () => makeMaterialV2,
    sdGroup: () => sdGroup
  });

  // lib/src/src/shaders.js
  var VS_FULLSCREEN = `#version 300 es
in vec2 aPos;
out vec2 vUV;
void main() {
  vUV = aPos;
  gl_Position = vec4(aPos * 2.0 - 1.0, 0.0, 1.0);
}`;
  var VS_GLASS = `#version 300 es
in vec2 aPos;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uPad;
out vec2 vUV;
void main() {
  vec2 half2 = uHalf + uPad;
  vec2 px = uCenter + (aPos * 2.0 - 1.0) * half2;
  vUV = px / uRes;
  gl_Position = vec4(px / uRes * 2.0 - 1.0, 0.0, 1.0);
}`;
  var FS_BLIT = `#version 300 es
precision highp float;
in vec2 vUV;
uniform sampler2D uTex;
out vec4 outColor;
vec3 linearToSrgb(vec3 c) {
  c = max(c, 0.0);
  return mix(1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055,
             12.92 * c,
             lessThanEqual(c, vec3(0.0031308)));
}
void main() { outColor = vec4(linearToSrgb(texture(uTex, vUV).rgb), 1.0); }`;
  var FS_DOWN = `#version 300 es
precision highp float;
in vec2 vUV;
uniform sampler2D uTex;
uniform vec2 uTexel;   // texel size of the SOURCE level
out vec4 outColor;
void main() {
  vec2 t = uTexel;
  vec4 a = texture(uTex, vUV) * 0.125;
  vec4 b = (texture(uTex, vUV + vec2(-t.x, -t.y)) +
            texture(uTex, vUV + vec2( t.x, -t.y)) +
            texture(uTex, vUV + vec2(-t.x,  t.y)) +
            texture(uTex, vUV + vec2( t.x,  t.y))) * 0.125;
  vec4 c = (texture(uTex, vUV + vec2(-2.0 * t.x, 0.0)) +
            texture(uTex, vUV + vec2( 2.0 * t.x, 0.0)) +
            texture(uTex, vUV + vec2(0.0, -2.0 * t.y)) +
            texture(uTex, vUV + vec2(0.0,  2.0 * t.y))) * 0.0625;
  vec4 d = (texture(uTex, vUV + vec2(-2.0 * t.x, -2.0 * t.y)) +
            texture(uTex, vUV + vec2( 2.0 * t.x, -2.0 * t.y)) +
            texture(uTex, vUV + vec2(-2.0 * t.x,  2.0 * t.y)) +
            texture(uTex, vUV + vec2( 2.0 * t.x,  2.0 * t.y))) * 0.03125;
  // RGB stores radiance. Alpha stores normalized optical density, so the mip
  // chain can blur both representations with exactly the same footprint.
  outColor = a + b + c + d;
}`;
  var FS_UP = `#version 300 es
precision highp float;
in vec2 vUV;
uniform sampler2D uLow;
uniform sampler2D uHigh;
uniform vec2 uLowTexel;
out vec4 outColor;
void main() {
  vec2 t = uLowTexel;
  vec4 low = texture(uLow, vUV) * 4.0;
  low += (texture(uLow, vUV + vec2( t.x, 0.0)) +
          texture(uLow, vUV + vec2(-t.x, 0.0)) +
          texture(uLow, vUV + vec2(0.0,  t.y)) +
          texture(uLow, vUV + vec2(0.0, -t.y))) * 2.0;
  low += texture(uLow, vUV + vec2( t.x,  t.y)) +
         texture(uLow, vUV + vec2(-t.x,  t.y)) +
         texture(uLow, vUV + vec2( t.x, -t.y)) +
         texture(uLow, vUV + vec2(-t.x, -t.y));
  low *= 1.0 / 16.0;
  vec4 high = texture(uHigh, vUV);
  outColor = mix(high, low, 0.65);
}`;
  var FS_WALLPAPER = `#version 300 es
precision highp float;
in vec2 vUV;
uniform vec2 uRes;
uniform int uScene;
uniform float uZoom;
uniform sampler2D uWallpaper;
uniform int uUseImage;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 srgbToLinear(vec3 c) {
  bvec3 cutoff = lessThanEqual(c, vec3(0.04045));
  vec3 low = c / 12.92;
  vec3 high = pow((c + 0.055) / 1.055, vec3(2.4));
  return mix(high, low, cutoff);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.02; a *= 0.5; }
  return s;
}
// distance to a quadratic bezier (iterative, good enough for a backdrop)
float sdBezier(vec2 p, vec2 a, vec2 b, vec2 c) {
  float best = 1e9;
  vec2 prev = a;
  for (int i = 1; i <= 40; i++) {
    float t = float(i) / 40.0;
    vec2 q = mix(mix(a, b, t), mix(b, c, t), t);
    vec2 pa = p - prev, ba = q - prev;
    float u = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-9), 0.0, 1.0);
    best = min(best, length(pa - ba * u));
    prev = q;
  }
  return best;
}

vec3 sunsetBranches(vec2 uv) {
  // dusk gradient: cool grey-mauve at the top, warm amber near the horizon
  vec3 top = vec3(0.62, 0.55, 0.55);
  vec3 mid = vec3(0.85, 0.63, 0.53);
  vec3 low = vec3(0.94, 0.70, 0.52);
  vec3 col = mix(mid, top, smoothstep(0.45, 1.0, uv.y));
  col = mix(col, low, smoothstep(0.45, 0.0, uv.y));
  col += (fbm(uv * 3.0) - 0.5) * 0.05;

  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0);
  float sc = uRes.x / uRes.y;
  vec3 bark = vec3(0.17, 0.10, 0.09);
  // main trunk + a few branches, thick and dark like the reference photo
  float d = sdBezier(p, vec2(0.42 * sc, -0.1), vec2(0.52 * sc, 0.45), vec2(0.36 * sc, 1.1));
  float m = smoothstep(0.060, 0.040, d);
  d = sdBezier(p, vec2(0.40 * sc, 0.30), vec2(0.62 * sc, 0.44), vec2(0.95 * sc, 0.26));
  m = max(m, smoothstep(0.034, 0.020, d));
  d = sdBezier(p, vec2(0.44 * sc, 0.62), vec2(0.25 * sc, 0.80), vec2(0.05 * sc, 0.72));
  m = max(m, smoothstep(0.022, 0.010, d));
  d = sdBezier(p, vec2(0.46 * sc, 0.80), vec2(0.72 * sc, 0.95), vec2(1.05 * sc, 0.78));
  m = max(m, smoothstep(0.016, 0.007, d));
  d = sdBezier(p, vec2(0.12 * sc, -0.05), vec2(0.18 * sc, 0.5), vec2(0.06 * sc, 1.05));
  m = max(m, smoothstep(0.038, 0.022, d));
  // seed pods
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec2 c = vec2((0.14 + 0.02 * fi) * sc, 0.30 + 0.26 * fi);
    m = max(m, smoothstep(0.035, 0.022, length((p - c) * vec2(1.0, 0.8))));
  }
  return mix(col, bark, m * 0.94);
}

vec3 deepBlueCity(vec2 uv) {
  vec3 col = mix(vec3(0.06, 0.14, 0.55), vec3(0.02, 0.06, 0.34), smoothstep(0.0, 1.0, uv.y));
  col += (fbm(uv * vec2(90.0, 90.0)) - 0.5) * 0.05;   // fabric-like dither
  // bright vertical tower strip
  float x = abs(uv.x - 0.5);
  float tower = smoothstep(0.035, 0.012, x) * smoothstep(0.02, 0.25, uv.y);
  col = mix(col, vec3(0.72, 0.58, 0.52), tower * 0.85);
  float glow = smoothstep(0.16, 0.0, x) * smoothstep(0.0, 0.5, uv.y) * 0.18;
  col += vec3(0.5, 0.42, 0.36) * glow;
  col = mix(col, vec3(0.10, 0.14, 0.26), smoothstep(0.16, 0.02, uv.y));
  return col;
}

vec3 islandOcean(vec2 uv) {
  float ar = uRes.x / uRes.y;
  vec3 deep = vec3(0.03, 0.26, 0.52);
  vec3 shallow = vec3(0.20, 0.74, 0.82);
  float waves = fbm(vec2(uv.x * ar * 6.0, uv.y * 22.0) + 3.0);
  vec3 col = mix(deep, shallow, smoothstep(0.30, 0.78, waves * 0.7 + uv.y * 0.5));

  vec2 p = (uv - vec2(0.5, 0.40)) * vec2(ar, 1.0);
  float isl = (fbm(p * 2.2 + 11.0) - 0.5) * 0.34;
  float d = length(p * vec2(0.62, 1.25)) - (0.42 + isl);
  // shallow reef ring around the land
  col = mix(col, vec3(0.42, 0.86, 0.86), smoothstep(0.14, 0.03, d) * 0.75);
  col = mix(col, vec3(0.94, 0.90, 0.72), smoothstep(0.035, 0.0, d));        // beach
  vec3 jungle = mix(vec3(0.04, 0.26, 0.09), vec3(0.24, 0.55, 0.20),
                    fbm(p * 9.0 + 5.0));
  col = mix(col, jungle, smoothstep(0.005, -0.02, d));                      // jungle
  return col;
}

vec2 coverUV(vec2 uv) {
  vec2 imageSize = vec2(textureSize(uWallpaper, 0));
  float imageAspect = imageSize.x / max(imageSize.y, 1.0);
  float viewportAspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = uv;
  if (imageAspect > viewportAspect) {
    float crop = (imageAspect / viewportAspect - 1.0) * 0.5;
    p.x = p.x * (1.0 - 2.0 * crop) + crop;
  } else {
    float crop = (viewportAspect / imageAspect - 1.0) * 0.5;
    p.y = p.y * (1.0 - 2.0 * crop) + crop;
  }
  return clamp(p, vec2(0.001), vec2(0.999));
}

void main() {
  vec2 uv = (vUV - 0.5) / max(uZoom, 0.01) + 0.5;
  vec3 col;
  if (uUseImage == 1) {
    // Wallpaper textures are plain RGBA8 holding display/sRGB values; decode
    // to linear radiance here.
    col = srgbToLinear(texture(uWallpaper, coverUV(uv)).rgb);
  } else {
    // Procedural palette constants are authored as display/sRGB colours. The
    // SRGB render target expects linear shader output and encodes it on write.
    col = srgbToLinear(uScene == 0 ? sunsetBranches(uv)
                       : uScene == 1 ? deepBlueCity(uv)
                                     : islandOcean(uv));
  }
  // Beer-Lambert representation of backdrop darkness. A value of 4 optical
  // density units already corresponds to ~1.8% transmission, enough for the
  // near-black branches while retaining useful precision in RGBA8.
  float lum = max(dot(col, vec3(0.2126, 0.7152, 0.0722)), 0.018);
  float density = clamp(-log(lum) / 4.0, 0.0, 1.0);
  outColor = vec4(col, density);
}`;
  var FS_GLASS = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 outColor;

uniform sampler2D uSrc;      // blurred mip chain of the backdrop
uniform sampler2D uBlurSrc;  // tent-upsampled reconstruction chain
uniform vec2  uRes;
uniform vec2  uCenter;       // draw-group bounds centre, px (vertex quad only)
uniform vec2  uHalf;         // element half size, px
const int MAX_SHAPES = 16;
uniform int   uShapeCount;
uniform vec2  uShapeCenters[MAX_SHAPES];
uniform vec2  uShapeHalves[MAX_SHAPES];
uniform int   uShapeTypes[MAX_SHAPES]; // 0 square/rect, 1 capsule, 2 circle
uniform float uShapeRadii[MAX_SHAPES];
uniform float uMergeRadius;  // smooth-union reach, px
uniform float uSquircle;     // superellipse exponent (2 = circular corners)
uniform float uBevel;        // max width of the refracting rim, px
uniform float uHeight;       // max glass height / optical thickness, px
uniform float uSizeAdaptation;// 0 = absolute material lengths, 1 = fit small UI
uniform float uIOR;
uniform float uDispersion;
uniform float uBlurPlateau;  // blur radius in the middle, px
uniform float uBlurRim;      // blur radius at the rim, px
uniform float uOpticalDensity;// dark-detail preservation; 0 = linear radiance
uniform float uMips;         // number of levels in the blurred chain
uniform float uSpecular;
uniform float uSpecPower;
uniform float uHighlightAdapt;
uniform float uHighlightWidth;
uniform float uHighlightSharpness;
uniform float uHighlightBase;
uniform float uFresnel;
uniform float uSat;
uniform float uBright;
uniform float uTintAmount;
uniform vec3  uTintColor;
uniform float uTintAdapt;    // content-aware light/dark material polarity
uniform float uShadow;
uniform float uShadowSize;
uniform float uShadowOffset;
uniform vec2  uLightDir;
uniform float uEdgeLine;
uniform float uEdgeWidth;
uniform float uEdgeDark;
uniform float uRefractScale;
uniform float uMeniscus;     // 1 = concave meniscus rim, 0 = convex lens rim
uniform int   uDebug;        // 0 final, 1 thickness, 2 normals, 3 displacement

float sdSquircle(vec2 p, vec2 b, float r, float n) {
  vec2 q = abs(p) - b + r;
  vec2 m = max(q, 0.0) + 1e-5;
  float e = pow(pow(m.x, n) + pow(m.y, n), 1.0 / n);
  return min(max(q.x, q.y), 0.0) + e - r;
}

float sdPrimitive(vec2 p, vec2 halfSize, int shapeType, float radius) {
  if (shapeType == 2) {
    // Circle is invariant: layout cannot turn it into an ellipse.
    return length(p) - min(halfSize.x, halfSize.y);
  }
  if (shapeType == 1) {
    // Apple's capsule rule: end-cap radius is exactly half the short side.
    return sdSquircle(p, halfSize, min(halfSize.x, halfSize.y), 2.0);
  }
  // Square and rectangular folders share the same fixed-radius corner model;
  // only their bounding boxes differ. The default exponent is 2 per reference.
  return sdSquircle(p, halfSize, radius, max(uSquircle, 2.0));
}

// One distance field represents the complete component group. Because the
// normal is derived from this same field below, the meniscus, refraction and
// highlight bend continuously through the bridge instead of exposing two
// composited glass layers.
float sdAppleShape(vec2 px) {
  float nearest = 1e8;
  for (int i = 0; i < MAX_SHAPES; i++) {
    if (i >= uShapeCount) break;
    float next = sdPrimitive(px - uShapeCenters[i], uShapeHalves[i],
                             uShapeTypes[i], uShapeRadii[i]);
    nearest = min(nearest, next);
  }

  if (uMergeRadius < 0.01) return nearest;

  // Global exponential smooth-min is associative and C-infinity. Pairwise
  // polynomial unions are only C1 and become order-dependent with 3+ shapes;
  // their curvature boundaries show up as diagonal tears under sharp glass
  // highlights. 0.36 matches the polynomial union's depth at equal distances.
  float scale = max(uMergeRadius * 0.36, 0.01);
  float sum = 0.0;
  for (int i = 0; i < MAX_SHAPES; i++) {
    if (i >= uShapeCount) break;
    float next = sdPrimitive(px - uShapeCenters[i], uShapeHalves[i],
                             uShapeTypes[i], uShapeRadii[i]);
    sum += exp(-(next - nearest) / scale);
  }
  return nearest - scale * log(max(sum, 1e-6));
}

// Quintic tangent transition. Besides value and slope, its second derivative
// matches at both ends: f(0/1)=0/1, f'(0/1)=0/1, f''(0/1)=0. This lets a
// circular corner leave a straight side with zero curvature instead of the
// rounded-box SDF's abrupt 0 -> 1/r curvature jump.
float tangentTransition(float u) {
  return u * u * u * (6.0 - 8.0 * u + 3.0 * u * u);
}

vec2 primitiveOpticalGradient(vec2 p, vec2 halfSize,
                              int shapeType, float radius) {
  if (shapeType == 2) return normalize(p + 1e-6);

  float exponent = shapeType == 1 ? 2.0 : max(uSquircle, 2.0);
  float resolvedRadius = shapeType == 1
                       ? min(halfSize.x, halfSize.y) : radius;
  vec2 q = abs(p) - halfSize + resolvedRadius;
  vec2 direction;

  if (q.x > 0.0 && q.y > 0.0) {
    // Analytic Lp-corner normal. Exponents above 2 already approach the side
    // with zero curvature; blend out the circular-corner correction by n=3.
    vec2 lp = normalize(pow(q, vec2(exponent - 1.0)) + 1e-6);
    const float HALF_PI = 1.57079632679;
    const float TRANSITION_ANGLE = 0.43633231299; // 25 degrees at each tangent
    float angle = atan(q.y, q.x);
    float easedAngle = angle;
    if (angle < TRANSITION_ANGLE) {
      easedAngle = TRANSITION_ANGLE *
                   tangentTransition(angle / TRANSITION_ANGLE);
    } else if (angle > HALF_PI - TRANSITION_ANGLE) {
      float fromTop = (HALF_PI - angle) / TRANSITION_ANGLE;
      easedAngle = HALF_PI - TRANSITION_ANGLE *
                   tangentTransition(fromTop);
    }
    vec2 continuousCorner = vec2(cos(easedAngle), sin(easedAngle));
    float circularCorner = 1.0 - smoothstep(2.0, 3.0, exponent);
    direction = normalize(mix(lp, continuousCorner, circularCorner));
  } else if (q.x > q.y) {
    direction = vec2(1.0, 0.0);
  } else {
    direction = vec2(0.0, 1.0);
  }

  return direction * sign(p);
}

vec2 opticalGradient(vec2 px) {
  float nearest = 1e8;
  int nearestIndex = 0;
  for (int i = 0; i < MAX_SHAPES; i++) {
    if (i >= uShapeCount) break;
    float next = sdPrimitive(px - uShapeCenters[i], uShapeHalves[i],
                             uShapeTypes[i], uShapeRadii[i]);
    if (next < nearest) {
      nearest = next;
      nearestIndex = i;
    }
  }

  if (uMergeRadius < 0.01 || uShapeCount == 1) {
    return primitiveOpticalGradient(
      px - uShapeCenters[nearestIndex], uShapeHalves[nearestIndex],
      uShapeTypes[nearestIndex], uShapeRadii[nearestIndex]
    );
  }

  // The derivative of exponential smooth-min is the same weighted average of
  // the primitive derivatives. Reusing those weights keeps fused normals C2
  // through both a primitive's tangent and the union bridge.
  float scale = max(uMergeRadius * 0.36, 0.01);
  vec2 gradientSum = vec2(0.0);
  float weightSum = 0.0;
  for (int i = 0; i < MAX_SHAPES; i++) {
    if (i >= uShapeCount) break;
    vec2 local = px - uShapeCenters[i];
    float next = sdPrimitive(local, uShapeHalves[i],
                             uShapeTypes[i], uShapeRadii[i]);
    float weight = exp(-(next - nearest) / scale);
    gradientSum += primitiveOpticalGradient(
      local, uShapeHalves[i], uShapeTypes[i], uShapeRadii[i]
    ) * weight;
    weightSum += weight;
  }
  return gradientSum / max(weightSum, 1e-6);
}

// Shading adaptation belongs to the primitive under this fragment, not to the
// bounds of the whole draw group. The latter changes whenever any component in
// a connected fusion group moves, making every highlight pulse in sympathy.
//
// Around a genuine smooth-union bridge, use the same exponential influence as
// the distance field so the material centre crosses continuously from one
// primitive to the next. Contributions too weak to affect the visible bridge
// are smoothly discarded; a nearby-but-separate component then has exactly no
// influence on this component's highlight or light/dark tint.
void localComponentMetrics(vec2 px, out vec2 componentCenter,
                           out float componentShortSide) {
  float nearest = 1e8;
  vec2 nearestCenter = uShapeCenters[0];
  float nearestShortSide = 1.0;
  for (int i = 0; i < MAX_SHAPES; i++) {
    if (i >= uShapeCount) break;
    float next = sdPrimitive(px - uShapeCenters[i], uShapeHalves[i],
                             uShapeTypes[i], uShapeRadii[i]);
    if (next < nearest) {
      nearest = next;
      nearestCenter = uShapeCenters[i];
      nearestShortSide = 2.0 * min(uShapeHalves[i].x, uShapeHalves[i].y);
    }
  }

  componentCenter = nearestCenter;
  componentShortSide = nearestShortSide;
  if (uMergeRadius < 0.01 || uShapeCount == 1) return;

  float scale = max(uMergeRadius * 0.36, 0.01);
  vec2 centreSum = vec2(0.0);
  float shortSideSum = 0.0;
  float weightSum = 0.0;
  for (int i = 0; i < MAX_SHAPES; i++) {
    if (i >= uShapeCount) break;
    float next = sdPrimitive(px - uShapeCenters[i], uShapeHalves[i],
                             uShapeTypes[i], uShapeRadii[i]);
    float weight = exp(-(next - nearest) / scale);
    weight *= smoothstep(0.04, 0.20, weight);
    centreSum += uShapeCenters[i] * weight;
    shortSideSum += 2.0 * min(uShapeHalves[i].x, uShapeHalves[i].y) * weight;
    weightSum += weight;
  }
  if (weightSum > 0.0) {
    componentCenter = centreSum / weightSum;
    componentShortSide = shortSideSum / weightSum;
  }
}

vec4 sampleBg(vec2 px, float lod) {
  vec2 uv = clamp(px / uRes, vec2(0.001), vec2(0.999));
  return textureLod(uSrc, uv, lod);
}

vec4 sampleReconstructedBg(vec2 px, float lod) {
  vec2 uv = clamp(px / uRes, vec2(0.001), vec2(0.999));
  return textureLod(uBlurSrc, uv, lod);
}

float luminance(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 linearToSrgb(vec3 c) {
  c = max(c, 0.0);
  return mix(1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055,
             12.92 * c,
             lessThanEqual(c, vec3(0.0031308)));
}

vec2 softLimitOffset(vec2 offset, float limit) {
  float magnitude = length(offset);
  if (magnitude < 1e-4) return offset;
  float limited = tanh(magnitude / max(limit, 1.0)) * limit;
  return offset * (limited / magnitude);
}

// Variable-radius blur, radius in device px.
//
// A single textureLod() tap on the mip chain is not enough. The chain only
// offers radii in powers of two, and on the top levels one texel is tens of
// pixels wide, so a lone bilinear tap (a) averages in a huge slab of the
// screen, which drags the colour toward the frame mean -> washed out, and
// (b) reconstructs as a handful of big diamonds -> the "too few samples" mush.
// Instead take the level whose own radius is about a third of what we want and
// spread TAPS samples over the remainder on a golden-angle spiral. Neighbouring
// taps then land roughly one texel apart at that level, which is exactly the
// spacing at which the level's own filtering makes the disc continuous, so the
// result is a real wide Gaussian that keeps its local colour.
const int TAPS = 12;
const float GOLDEN_ANGLE = 2.39996323;

vec3 blurBg(vec2 px, float radius) {
  if (radius < 1.0) return sampleBg(px, 0.0).rgb;
  float lod = clamp(log2(radius) - 1.585, 0.0, uMips - 1.0);   // 2^lod ~ r/3
  vec3 acc = vec3(0.0);
  float densityAcc = 0.0;
  float wsum = 0.0;
  for (int i = 0; i < TAPS; i++) {
    float fi = float(i) + 0.5;
    float r  = sqrt(fi / float(TAPS));       // equal-area spacing over the disc
    float a  = fi * GOLDEN_ANGLE;
    float w  = exp(-1.8 * r * r);
    vec2 samplePx = px + vec2(cos(a), sin(a)) * r * radius;
    // Keep narrow blur faithful to the original downsample chain, then lean on
    // the reconstructed chain where coarse mip blocks and temporal breathing
    // become visible. Both samplers return linear radiance from sRGB textures.
    float reconstruction = 0.78 * smoothstep(10.0, 52.0, radius);
    vec4 s = mix(sampleBg(samplePx, lod),
                 sampleReconstructedBg(samplePx, lod), reconstruction);
    acc += s.rgb * w;
    densityAcc += s.a * w;
    wsum += w;
  }
  vec3 linearCol = acc / wsum;

  // A pure radiance average spreads a dark branch but also dilutes it toward
  // the pale sky. The density channel averages -log(luminance), equivalent to
  // geometrically averaging transmission. That preserves the visual weight of
  // dark occluders while keeping uniform light regions unchanged. We retain
  // the linear RGB hue and only restore the missing luminance contrast.
  float linearLum = max(dot(linearCol, vec3(0.2126, 0.7152, 0.0722)), 0.001);
  float densityLum = exp(-4.0 * densityAcc / wsum);
  float densityGap = max(linearLum - densityLum, 0.0);
  float radiusGate = smoothstep(1.0, 8.0, radius);
  float targetLum = max(linearLum * 0.22,
                        linearLum - densityGap * uOpticalDensity * radiusGate);
  return linearCol * (targetLum / linearLum);
}

void main() {
  vec2 px = vUV * uRes;

  float d = sdAppleShape(px);
  float aa = smoothstep(0.8, -0.8, d);
  vec2 adaptCenter;
  float localShortSide;
  localComponentMetrics(px, adaptCenter, localShortSide);
  // Material lengths are authored against the large demo components. Treat
  // them as maxima and fit the complete optical system to 30% of a smaller
  // primitive's short side. The shared metric call above also keeps this scale
  // continuous when differently sized primitives form one fused surface.
  float fittedScale = clamp(0.30 * localShortSide / max(uBevel, 1.0), 0.05, 1.0);
  float opticalScale = mix(1.0, fittedScale,
                           clamp(uSizeAdaptation, 0.0, 1.0));
  float bevel = max(uBevel * opticalScale, 1.0);
  float opticalHeight = uHeight * opticalScale;

  // ---- gradient of the SDF = outward direction of the surface -------------
  vec2 g = normalize(opticalGradient(px) + 1e-6);

  // ---- thickness field / bevel profile -----------------------------------
  float t  = clamp(-d / bevel, 0.0, 1.0);    // 0 at the edge, 1 on the plateau
  float ct = 1.0 - t;
  float h  = sqrt(max(1.0 - ct * ct, 0.0));  // convex (circular) bevel
  float dhdt = ct / max(h, 0.10);            // slope, clamped at the silhouette
  float slope = (opticalHeight / bevel) * dhdt;

  // 0 = convex lens, 1 = the default Apple-like concave rim. Values above 1
  // deliberately exaggerate the inward normal for exploratory tuning.
  float curveSign = 1.0 - 2.0 * uMeniscus;
  vec3 n = normalize(vec3(curveSign * g * slope, 1.0));
  vec3 I = vec3(0.0, 0.0, -1.0);

  // ---- refraction (Snell) + dispersion -----------------------------------
  float path = opticalHeight * mix(0.25, 1.0, h) * uRefractScale;
  vec2 dR, dG, dB;
  {
    float e = 1.0 / max(uIOR - uDispersion, 1.0);
    vec3 R = refract(I, n, e);
    dR = (R == vec3(0.0)) ? vec2(0.0) : R.xy / max(-R.z, 0.25) * path;
    e = 1.0 / max(uIOR, 1.0);
    R = refract(I, n, e);
    dG = (R == vec3(0.0)) ? vec2(0.0) : R.xy / max(-R.z, 0.25) * path;
    e = 1.0 / max(uIOR + uDispersion, 1.0);
    R = refract(I, n, e);
    dB = (R == vec3(0.0)) ? vec2(0.0) : R.xy / max(-R.z, 0.25) * path;
  }

  // Strong concave meniscus normals can make the screen-space mapping fold
  // over itself at multi-shape junctions. On hard-edged wallpapers that reads
  // as triangular tearing rather than refraction. Compress only the extreme
  // tail; ordinary offsets remain almost linear while caustic spikes stay
  // within a bevel-sized optical footprint.
  float maxDisplacement = max(1.15 * bevel, max(12.0 * opticalScale, 3.0));
  dR = softLimitOffset(dR, maxDisplacement);
  dG = softLimitOffset(dG, maxDisplacement);
  dB = softLimitOffset(dB, maxDisplacement);

  // ---- scattering: rim stays readable, plateau is frosted ----------------
  float radius = mix(uBlurRim, uBlurPlateau, smoothstep(0.0, 0.85, t))
               * opticalScale;

  vec3 col;
  col.r = blurBg(px + dR, radius).r;
  col.g = blurBg(px + dG, radius).g;
  col.b = blurBg(px + dB, radius).b;

  // Saturation is boosted on the TRANSMITTED backdrop only (this is what
  // UIVisualEffectView's saturationDeltaFactor does). Any wide blur averages
  // colours toward grey; without this the frosted panel reads pale even though
  // the wallpaper behind it is saturated. Doing it before the reflections keeps
  // the specular/Fresnel highlights neutral.
  col = mix(vec3(dot(col, vec3(0.2126, 0.7152, 0.0722))), col, uSat);

  // ---- reflection: backdrop environment + narrow specular lobes -----------
  // Schlick: F0 for glass is ~4%, and the (1-cos)^5 falloff keeps the mirror
  // term confined to the steepest part of the bevel. A softer exponent smears
  // a grey wash across the whole rim and bleaches the refracted image there.
  float fres = 0.04 + 0.96 * pow(1.0 - n.z, 5.0);
  vec2 nn = normalize(n.xy + 1e-6);

  // Keep the reflected environment local to the fragment. Stabilise the lobe
  // controls around the owning primitive below so hard wallpaper edges do not
  // chop one rim into unrelated bright and dark pieces.
  float probeLod = clamp(3.5 + log2(max(opticalScale, 0.05)),
                         0.0, uMips - 1.0);
  float probeRadius = max(1.35 * bevel, max(18.0 * opticalScale, 3.0));
  vec3 envL = sampleBg(px + vec2(-probeRadius, 0.0), probeLod).rgb;
  vec3 envR = sampleBg(px + vec2( probeRadius, 0.0), probeLod).rgb;
  vec3 envB = sampleBg(px + vec2(0.0, -probeRadius), probeLod).rgb;
  vec3 envT = sampleBg(px + vec2(0.0,  probeRadius), probeLod).rgb;
  vec2 fallbackLight = normalize(uLightDir + vec2(1e-5));
  // Highlight adaptation must be stable across one component. Driving its
  // strength and colour from each fragment's probe makes a mountain ridge or
  // tree line cut the rim into bright and dark pieces. Probe around the local
  // component centre while retaining per-fragment environment reflection.
  vec3 adaptL = sampleBg(adaptCenter + vec2(-probeRadius, 0.0), probeLod).rgb;
  vec3 adaptR = sampleBg(adaptCenter + vec2( probeRadius, 0.0), probeLod).rgb;
  vec3 adaptB = sampleBg(adaptCenter + vec2(0.0, -probeRadius), probeLod).rgb;
  vec3 adaptT = sampleBg(adaptCenter + vec2(0.0,  probeRadius), probeLod).rgb;
  vec2 adaptGradient = vec2(luminance(adaptR) - luminance(adaptL),
                            luminance(adaptT) - luminance(adaptB));
  float stableContrast = length(adaptGradient);
  float lightAdapt = clamp(uHighlightAdapt, 0.0, 1.0) *
                     smoothstep(0.025, 0.22, stableContrast);
  // Keep the lobe direction material-local. Steering it with the wallpaper
  // gradient creates a rapidly rotating direction field around hard colour
  // edges, which appears as diagonal tears and lets unrelated components alter
  // each other's highlights. The environment still adapts strength and colour.
  vec2 lightDir = fallbackLight;

  // Reflect the colour seen in the surface-normal direction. A local sample
  // keeps small bright structures (tower lights, clouds, coastlines) attached
  // to the nearby rim instead of turning every frame into the same white ring.
  float wx = clamp(0.5 + 0.5 * nn.x, 0.0, 1.0);
  float wy = clamp(0.5 + 0.5 * nn.y, 0.0, 1.0);
  vec3 envX = mix(envL, envR, wx);
  vec3 envY = mix(envB, envT, wy);
  vec3 ringEnv = (envX * abs(nn.x) + envY * abs(nn.y)) /
                 max(abs(nn.x) + abs(nn.y), 1e-3);
  float localProbeLod = clamp(2.0 + log2(max(opticalScale, 0.05)),
                              0.0, uMips - 1.0);
  vec3 localEnv = sampleBg(px + g * max(0.55 * bevel,
                                        max(6.0 * opticalScale, 2.0)),
                           localProbeLod).rgb;
  vec3 env = mix(ringEnv, localEnv, 0.58);
  float envLum = luminance(env);
  env = mix(env, vec3(envLum), 0.10); // retain wallpaper hue, tame neon spikes
  float envStrength = mix(0.58, 1.0, smoothstep(0.08, 0.75, envLum));
  col = mix(col, env, clamp(fres * uFresnel * envStrength, 0.0, 0.82));

  vec3 L1 = normalize(vec3(lightDir, 0.58));
  vec3 L2 = normalize(vec3(-lightDir, 0.48));
  float sharpness = max(uHighlightSharpness, 0.1);
  float s1 = pow(max(dot(n, L1), 0.0),
                 max(uSpecPower * sharpness, 1.0));
  float s2 = pow(max(dot(n, L2), 0.0),
                 max(uSpecPower * sharpness * 0.78, 1.0)) * 0.18;
  float highlightWidth = clamp(uHighlightWidth, 0.16, 1.0);
  float riseEnd = min(0.10, 0.25 * highlightWidth);
  float specBand = smoothstep(0.015, riseEnd, t) *
                   (1.0 - smoothstep(0.61 * highlightWidth,
                                     highlightWidth, t));
  float baseHighlight = clamp(uHighlightBase, 0.0, 1.0);
  float sourceStrength = baseHighlight + (1.0 - baseHighlight) * lightAdapt;
  vec3 sourceEnv = mix(mix(adaptL, adaptR, 0.5 + 0.5 * lightDir.x),
                       mix(adaptB, adaptT, 0.5 + 0.5 * lightDir.y), 0.5);
  float sourceLum = max(luminance(sourceEnv), 0.08);
  vec3 specColor = clamp(mix(vec3(1.0), sourceEnv / sourceLum, 0.42),
                         vec3(0.45), vec3(2.2));
  col += uSpecular * (s1 + s2) * specBand * sourceStrength * specColor;

  // Dark contour right at the silhouette: at grazing angles the rim reflects
  // the surroundings instead of transmitting, so real glass edges read dark.
  float w = max(uEdgeWidth, 0.5);
  float contour = smoothstep(w, 0.0, abs(d + 0.55 * w));
  col *= 1.0 - uEdgeDark * contour;

  // Crisp inner highlight line; direction and colour follow the local probe.
  float line = smoothstep(1.35 * w, 0.0, abs(d + 2.2 * w));
  float lit = 0.26 + 0.74 * max(dot(g, lightDir), 0.0);
  vec3 stableEnv = (adaptL + adaptR + adaptB + adaptT) * 0.25;
  float stableEnvLum = max(luminance(stableEnv), 0.12);
  vec3 lineColor = mix(vec3(1.0), stableEnv / stableEnvLum, 0.28);
  col += uEdgeLine * line * lit * lineColor;

  // ---- tint --------------------------------------------------------------
  // Tint polarity adapts once per local component, not per draw group.
  // This captures the system-material light/dark switch without letting a hard
  // background edge split one surface into visibly different materials.
  float materialLum = luminance(sampleBg(adaptCenter, uMips - 1.0).rgb);
  float useDarkMaterial = smoothstep(0.38, 0.68, materialLum);
  vec3 automaticTint = mix(vec3(0.97, 0.985, 1.0),
                           vec3(0.035, 0.055, 0.080), useDarkMaterial);
  vec3 resolvedTint = mix(uTintColor, automaticTint, clamp(uTintAdapt, 0.0, 1.0));
  float adaptiveAmount = uTintAmount * mix(1.10, 0.92, useDarkMaterial);
  col = mix(col, resolvedTint, clamp(adaptiveAmount, 0.0, 1.0));
  col += uBright;

  // ---- soft contact shadow ----------------------------------------------
  float ds = sdAppleShape(px + vec2(0.0, uShadowOffset));
  float sh = exp(-max(ds, 0.0) / max(uShadowSize, 0.5)) * uShadow;

  if (uDebug == 1) col = vec3(h);
  if (uDebug == 2) col = vec3(0.5 + 0.5 * n.xy, n.z);
  if (uDebug == 3) col = vec3(length(dG) / max(opticalHeight, 1.0),
                              length(dR - dB) / max(opticalHeight, 1.0) * 6.0, 0.0);

  // The browser drawing buffer stores display/sRGB values, unlike the explicit
  // SRGB8_ALPHA8 offscreen attachments. Encode the final linear material here,
  // then add triangular-distribution noise smaller than one display-space LSB.
  if (uDebug == 0) {
    float n0 = hash12(gl_FragCoord.xy + vec2(17.0, 59.0));
    float n1 = hash12(gl_FragCoord.yx + vec2(83.0, 11.0));
    float noise = (n0 - n1) * (0.85 / 255.0);
    col = clamp(linearToSrgb(col) + noise, 0.0, 1.0);
  }

  float a = aa + sh * (1.0 - aa);
  outColor = vec4(col * aa, a);   // premultiplied; shadow contributes black
}`;

  // lib/src/src/geometry.js
  var MAX_GLASS_SHAPES = 16;
  var MERGE_INFLUENCE_SCALES = 8;
  var MERGE_SCALE_RATIO = 0.36;
  var MAX_CORNER_RATIO = 0.235;
  var SHAPE_TYPES = Object.freeze({ rect: 0, folder: 0, pill: 1, circle: 2 });
  function shapeTypeOf(shape) {
    return SHAPE_TYPES[shape] ?? 0;
  }
  function cornerRadiusOf(element, materialRadius = 0) {
    const short = Math.min(element.w ?? element.width ?? 0, element.h ?? element.height ?? 0);
    return Math.min(element.radius ?? materialRadius, short * MAX_CORNER_RATIO);
  }
  function sdSquircle(px, py, halfX, halfY, radius, exponent) {
    const qx = Math.abs(px) - halfX + radius;
    const qy = Math.abs(py) - halfY + radius;
    const mx = Math.max(qx, 0) + 1e-5;
    const my = Math.max(qy, 0) + 1e-5;
    const e = (mx ** exponent + my ** exponent) ** (1 / exponent);
    return Math.min(Math.max(qx, qy), 0) + e - radius;
  }
  function sdPrimitive(px, py, halfX, halfY, shapeType, radius, squircle = 2) {
    if (shapeType === 2) return Math.hypot(px, py) - Math.min(halfX, halfY);
    if (shapeType === 1) return sdSquircle(px, py, halfX, halfY, Math.min(halfX, halfY), 2);
    return sdSquircle(px, py, halfX, halfY, radius, Math.max(squircle, 2));
  }
  function toShape(element, material) {
    const w = element.w ?? element.width ?? element.size ?? 0;
    const h = element.h ?? element.height ?? element.size ?? w;
    return {
      cx: (element.x ?? 0) + w / 2,
      cy: (element.y ?? 0) + h / 2,
      halfX: w / 2,
      halfY: h / 2,
      type: shapeTypeOf(element.shape),
      radius: cornerRadiusOf({ ...element, w, h }, material.radius ?? 0)
    };
  }
  function sdGroup(x, y, elements, material = {}, mergeRadius = material.mergeRadius ?? 0) {
    if (!elements.length) return Infinity;
    const shapes = elements.map((element) => toShape(element, material));
    const squircle = material.squircle ?? 2;
    let nearest = Infinity;
    const distances = shapes.map((shape) => {
      const d = sdPrimitive(
        x - shape.cx,
        y - shape.cy,
        shape.halfX,
        shape.halfY,
        shape.type,
        shape.radius,
        squircle
      );
      if (d < nearest) nearest = d;
      return d;
    });
    if (!(mergeRadius >= 0.01) || shapes.length === 1) return nearest;
    const scale = Math.max(mergeRadius * MERGE_SCALE_RATIO, 0.01);
    let sum = 0;
    for (const d of distances) sum += Math.exp(-(d - nearest) / scale);
    return nearest - scale * Math.log(Math.max(sum, 1e-6));
  }
  function hitTestElements(x, y, elements, material = {}, options = {}) {
    const mergeRadius = options.fusion === false ? 0 : options.mergeRadius ?? material.mergeRadius ?? 0;
    const tolerance = options.tolerance ?? 0;
    const squircle = material.squircle ?? 2;
    if (options.fusion === false) {
      for (let i = elements.length - 1; i >= 0; i--) {
        const shape = toShape(elements[i], material);
        const d = sdPrimitive(
          x - shape.cx,
          y - shape.cy,
          shape.halfX,
          shape.halfY,
          shape.type,
          shape.radius,
          squircle
        );
        if (d <= tolerance) return elements[i];
      }
      return null;
    }
    const groups = groupElements(elements, mergeRadius, MAX_GLASS_SHAPES).groups;
    for (let groupIndex = groups.length - 1; groupIndex >= 0; groupIndex--) {
      const group = groups[groupIndex];
      if (sdGroup(x, y, group, material, mergeRadius) > tolerance) continue;
      let best = null;
      let bestDistance = Infinity;
      for (let i = group.length - 1; i >= 0; i--) {
        const shape = toShape(group[i], material);
        const d = sdPrimitive(
          x - shape.cx,
          y - shape.cy,
          shape.halfX,
          shape.halfY,
          shape.type,
          shape.radius,
          squircle
        );
        if (d < bestDistance) {
          bestDistance = d;
          best = group[i];
        }
      }
      return best;
    }
    return null;
  }
  function sdRenderedGroups(x, y, elements, material = {}, mergeRadius = material.mergeRadius ?? 0) {
    const groups = groupElements(elements, mergeRadius, MAX_GLASS_SHAPES).groups;
    if (!groups.length) return Infinity;
    let bestDistance = Infinity;
    for (const group of groups) {
      const d = sdGroup(x, y, group, material, mergeRadius);
      if (d < bestDistance) bestDistance = d;
    }
    return bestDistance;
  }
  function boxGap(a, b) {
    const box = (element) => {
      const w = Number(element.w ?? element.width ?? element.size ?? 0);
      const h = Number(element.h ?? element.height ?? element.size ?? w);
      return { x: Number(element.x ?? 0), y: Number(element.y ?? 0), w, h };
    };
    const aa = box(a);
    const bb = box(b);
    const dx = Math.max(0, Math.max(aa.x - (bb.x + bb.w), bb.x - (aa.x + aa.w)));
    const dy = Math.max(0, Math.max(aa.y - (bb.y + bb.h), bb.y - (aa.y + aa.h)));
    return Math.hypot(dx, dy);
  }
  function connectedElementGroups(elements, mergeRadius = 0) {
    if (elements.length <= 1) return elements.length ? [elements.slice()] : [];
    const reach = Math.max(0, mergeRadius) * MERGE_SCALE_RATIO * MERGE_INFLUENCE_SCALES;
    const parent = elements.map((_, i) => i);
    const find = (i) => {
      while (parent[i] !== i) {
        parent[i] = parent[parent[i]];
        i = parent[i];
      }
      return i;
    };
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        if (boxGap(elements[i], elements[j]) <= reach) parent[find(i)] = find(j);
      }
    }
    const byRoot = /* @__PURE__ */ new Map();
    elements.forEach((element, i) => {
      const root = find(i);
      if (!byRoot.has(root)) byRoot.set(root, []);
      byRoot.get(root).push(element);
    });
    return [...byRoot.values()];
  }
  function groupElements(elements, mergeRadius = 0, maxPerGroup = MAX_GLASS_SHAPES) {
    const connected = connectedElementGroups(elements, mergeRadius);
    const groups = [];
    let truncated = false;
    for (const group of connected) {
      if (group.length > maxPerGroup) truncated = true;
      for (let i = 0; i < group.length; i += maxPerGroup) {
        groups.push(group.slice(i, i + maxPerGroup));
      }
    }
    return { groups, truncated };
  }

  // lib/src/src/v2-shaders.js
  var FS_GLASS_V2 = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 outColor;

uniform sampler2D uSrc;
uniform vec2 uRes;
uniform float uDpr;
uniform float uMips;
uniform float uBackdropBlur;
const int MAX_SHAPES = 16;
uniform int uShapeCount;
uniform vec2 uShapeCenters[MAX_SHAPES];
uniform vec2 uShapeHalves[MAX_SHAPES];
uniform int uShapeTypes[MAX_SHAPES];
uniform float uShapeRadii[MAX_SHAPES];
uniform float uShapeTints[MAX_SHAPES];
uniform float uShapeTintLights[MAX_SHAPES];
uniform float uShapeFrosts[MAX_SHAPES];
uniform float uShapeOpacities[MAX_SHAPES];
uniform float uShapePressures[MAX_SHAPES];
uniform vec2 uShapePressAxes[MAX_SHAPES];
uniform vec2 uLightDirs[MAX_SHAPES];
uniform float uRefraction;
uniform float uEdgeReach;
uniform float uEdgeWidth;
uniform float uDispersion;
uniform float uBody;
uniform float uAbsorption;
uniform float uRim;
uniform float uReflection;
uniform float uHighlight;
uniform float uEcho;
uniform float uHairline;
uniform float uHairWidth;

// Softness ratio -> pre-blur radius, as a fraction of the component short side.
const float FROST_PREBLUR_SCALE = 0.05;
// Strength of the pressed-in squash. The mapping slope at the contour is
// 1 - k, so k must stay below 1 to avoid folding the image.
const float PRESS_SQUASH = 0.85;

vec3 linearToSrgb(vec3 c) {
  c = max(c, 0.0);
  return mix(1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055,
             12.92 * c,
             lessThanEqual(c, vec3(0.0031308)));
}

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

// Inside a rounded box the exact distance is max(q.x, q.y), and its gradient
// switches axis across the corner diagonal. Refraction reads that gradient as
// the surface normal, so the switch drew a 45-degree crease into every corner.
// A soft maximum rounds that ridge. It is used for the normal only: distance,
// masks, hairline and silhouette all keep the exact field.
// Unbiased: softMax(a, a, k) == a, so the interior term keeps its sign and
// the clamp below still recognises the inner rectangle.
float softMax(float a, float b, float k) {
  return 0.5 * (a + b + sqrt((a - b) * (a - b) + k * k)) - k * 0.5;
}

float sdRoundBoxSoft(vec2 p, vec2 b, float r, float k) {
  vec2 q = abs(p) - b + r;
  return min(softMax(q.x, q.y, k), 0.0) + length(max(q, 0.0)) - r;
}

float smoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

float shapeSdf(int index, vec2 point) {
  vec2 p = point - uShapeCenters[index];
  vec2 halfSize = uShapeHalves[index];
  int kind = uShapeTypes[index];
  float radius = min(uShapeRadii[index], min(halfSize.x, halfSize.y));
  if (kind == 0) return sdRoundBox(p, halfSize, radius);
  if (kind == 1) return sdRoundBox(p, halfSize, min(halfSize.x, halfSize.y));
  return length(p) - min(halfSize.x, halfSize.y);
}

/** The silhouette field with a rounded interior ridge, for normals. */
float shapeField(int index, vec2 point) {
  vec2 p = point - uShapeCenters[index];
  vec2 halfSize = uShapeHalves[index];
  int kind = uShapeTypes[index];
  float minHalf = min(halfSize.x, halfSize.y);
  float k = clamp(minHalf * 0.08, 1.5, 12.0);
  if (kind == 0) return sdRoundBoxSoft(p, halfSize, min(uShapeRadii[index], minHalf), k);
  if (kind == 1) return sdRoundBoxSoft(p, halfSize, minHalf, k);
  return length(p) - minHalf;
}

vec2 opticalNormal(int index, vec2 point, vec2 sdfNormal) {
  vec2 p = point - uShapeCenters[index];
  vec2 halfSize = max(uShapeHalves[index], vec2(1.0));
  int kind = uShapeTypes[index];

  if (kind == 0) {
    // The sixth-order superellipse is the optical field, while roundness only
    // controls the silhouette. This separation is part of the V2 model.
    vec2 q = p / halfSize;
    vec2 g = vec2(sign(q.x) * pow(abs(q.x), 5.0) / halfSize.x,
                  sign(q.y) * pow(abs(q.y), 5.0) / halfSize.y);
    return normalize(g + sdfNormal * 0.0001);
  }
  if (kind == 1) {
    vec2 closest;
    if (halfSize.x >= halfSize.y) {
      float segment = max(halfSize.x - halfSize.y, 0.0);
      closest = vec2(clamp(p.x, -segment, segment), 0.0);
    } else {
      float segment = max(halfSize.y - halfSize.x, 0.0);
      closest = vec2(0.0, clamp(p.y, -segment, segment));
    }
    return normalize(p - closest + sdfNormal * 0.0001);
  }
  return normalize(p + sdfNormal * 0.0001);
}

// The shared backdrop pipeline stores linear radiance in SRGB8_ALPHA8.
// V2's optical constants were authored in display space, so convert each
// sample back before applying the V2 equations.
vec3 backdropLod(vec2 uv, float lod) {
  return linearToSrgb(textureLod(uSrc, clamp(uv, vec2(0.001), vec2(0.999)),
                                 clamp(lod, 0.0, max(uMips - 1.0, 0.0))).rgb);
}

// The mip level an implicit texture() lookup selects for a refracted
// coordinate. Explicit sampling never drops below it, so compressed capture
// bands stay filtered exactly as before while pre-blur can raise the level.
float footprintLod(vec2 uv) {
  vec2 dx = dFdx(uv) * uRes;
  vec2 dy = dFdy(uv) * uRes;
  return 0.5 * log2(max(max(dot(dx, dx), dot(dy, dy)), 1e-8));
}

vec3 softBackdrop(vec2 uv, float radius) {
  float lod = log2(max(radius * 0.9, 1.0));
  vec2 r = vec2(max(radius * 0.42, 0.35)) / uRes;
  vec2 center = clamp(uv, vec2(0.001), vec2(0.999));
  vec3 c = backdropLod(center, lod) * 0.44;
  c += backdropLod(center + vec2(r.x, 0.0), lod) * 0.14;
  c += backdropLod(center - vec2(r.x, 0.0), lod) * 0.14;
  c += backdropLod(center + vec2(0.0, r.y), lod) * 0.14;
  c += backdropLod(center - vec2(0.0, r.y), lod) * 0.14;
  return c;
}

// The backdrop blurred before refraction: a frosted layer that the liquid
// glass then bends. Radius is in device pixels; zero is the sharp backdrop.
vec3 preBlurredBackdrop(vec2 uv, float radius, float footprint) {
  if (radius <= 0.0) return backdropLod(uv, footprint);
  float lod = max(log2(max(radius * 0.9, 1e-3)), footprint);
  vec2 r = vec2(radius * 0.42) / uRes;
  vec2 center = clamp(uv, vec2(0.001), vec2(0.999));
  vec3 c = backdropLod(center, lod) * 0.44;
  c += backdropLod(center + vec2(r.x, 0.0), lod) * 0.14;
  c += backdropLod(center - vec2(r.x, 0.0), lod) * 0.14;
  c += backdropLod(center + vec2(0.0, r.y), lod) * 0.14;
  c += backdropLod(center - vec2(0.0, r.y), lod) * 0.14;
  return c;
}

float luminance(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

vec3 interfaceColor(vec2 point, vec2 normal, float preBlur) {
  float radius = max(2.0, preBlur);
  vec3 outsideColor = softBackdrop((point + normal * 1.8) / uRes, radius);
  vec3 insideColor = softBackdrop((point - normal * 1.8) / uRes, radius);
  // Apple's outer interface is a neutral contrast line rather than a copy of
  // the wallpaper colour. Include display-space value as well as luminance so
  // saturated blue/purple fields select a dark line even though their formal
  // luminance is modest. The outside carries more weight because that is the
  // field the silhouette must remain legible against.
  float outsideValue = max(outsideColor.r, max(outsideColor.g, outsideColor.b));
  float insideValue = max(insideColor.r, max(insideColor.g, insideColor.b));
  float outsideLight = max(luminance(outsideColor), outsideValue * 0.72);
  float insideLight = max(luminance(insideColor), insideValue * 0.72);
  float interfaceLight = outsideLight * 0.68 + insideLight * 0.32;
  float darkLine = smoothstep(0.40, 0.61, interfaceLight);
  return mix(vec3(0.92, 0.93, 0.96), vec3(0.014, 0.013, 0.018), darkLine);
}

void main() {
  vec2 point = vUV * uRes;
  int chosen = -1;
  float chosenD = 1e6;
  int nearest = 0;
  float nearestD = 1e6;
  for (int i = 0; i < MAX_SHAPES; i++) {
    if (i >= uShapeCount) break;
    float d = shapeSdf(i, point);
    if (d < nearestD) { nearest = i; nearestD = d; }
    if (d <= 2.1) { chosen = i; chosenD = d; }
  }

  // Screen-space derivatives (fwidth, dFdx/dFdy and implicit texture LOD) are
  // only defined in uniform control flow. Fragments outside every surface
  // return early below; if that happened before the derivatives, a lane in
  // the 2x2 quad that exited with the 1e6 sentinel would make its neighbours'
  // hairline width and mip level garbage on some GPUs, sprinkling stray
  // pixels along the silhouette. So the geometric ALU runs for every lane,
  // evaluated on the nearest surface as a continuous extension for outside
  // fragments, and only the texture fetches are skipped after the return.
  bool covered = chosen >= 0;
  if (!covered) { chosen = nearest; chosenD = nearestD; }
  float edgeAA = max(fwidth(nearestD), 0.72);

  vec2 center = uShapeCenters[chosen];
  vec2 halfSize = uShapeHalves[chosen];
  float minHalf = min(halfSize.x, halfSize.y);
  float e = 1.35;
  float dx = shapeField(chosen, point + vec2(e, 0.0)) - shapeField(chosen, point - vec2(e, 0.0));
  float dy = shapeField(chosen, point + vec2(0.0, e)) - shapeField(chosen, point - vec2(0.0, e));
  vec2 normal = normalize(vec2(dx, dy) + vec2(0.0001));
  float depth = clamp(-chosenD / max(12.0, minHalf * 0.62), 0.0, 1.0);
  float refractionSupport = max(14.0, minHalf * 0.50);
  float edgeCurve = pow(1.0 - smoothstep(0.0, refractionSupport, -chosenD), 2.2);
  vec2 local = (point - center) / max(halfSize, vec2(1.0));

  float edgeDepth = max(-chosenD, 0.0);
  float causticSupport = max(8.0, minHalf * uEdgeWidth);
  float captureX = clamp(edgeDepth / causticSupport, 0.0, 1.0);
  float causticT = 1.0 - smoothstep(0.0, causticSupport, edgeDepth);
  float causticShade = causticT * causticT * (3.0 - 2.0 * causticT);
  // The old double-smoothstep displacement flattened at the visible contour.
  // Its source-coordinate derivative therefore changed sign twice, making a
  // captured line turn back just before it touched the edge. A one-sided exit
  // profile keeps a finite slope at the contour and relaxes to zero only on
  // the inner side of the capture band, leaving a single optical fold.
  float captureProfile = pow(1.0 - captureX, 1.64);
  float refractionX = clamp(edgeDepth / refractionSupport, 0.0, 1.0);
  float refractionProfile = pow(1.0 - refractionX, 2.2);
  // The silhouette and optical superellipse deliberately differ in V2, but
  // the visible contour must still exit along the silhouette normal. Blend to
  // the broader optical field only after leaving the outer edge pixels.
  float opticalNormalMix = smoothstep(0.12, 0.55, captureX);
  vec2 bendNormal = normalize(mix(normal, opticalNormal(chosen, point, normal), opticalNormalMix));
  vec2 inward = -bendNormal;
  // Edge pull used to multiply Capture reach as a second public control. Keep
  // its original default as an internal calibration so the default material
  // retains the same displacement with one unambiguous capture parameter.
  const float CAPTURE_REACH_SCALE = 1.24;
  float captureDistance = uEdgeReach * minHalf * 2.0 * CAPTURE_REACH_SCALE * captureProfile;
  float shallowRefraction = uRefraction * refractionProfile * 0.32;
  vec2 lensShift = inward * (shallowRefraction + captureDistance);
  lensShift += -local * (uRefraction * 0.035) * smoothstep(0.16, 0.92, depth);
  // A held lens is pressed in: a shallow diverging surface that squashes what
  // is seen through it. The outward displacement follows the contour normal,
  // vanishes on the centre line and at the silhouette, and softens the
  // ordinary edge fold instead of inflating the rim.
  float pressure = clamp(uShapePressures[chosen], 0.0, 1.0);
  float pressDepth = clamp(edgeDepth / max(minHalf, 1.0), 0.0, 1.0);
  lensShift *= 1.0 - pressure * 0.35;
  // Per-axis weights let a host shorten the squash along one direction, so a
  // wide capsule can keep its length while it flattens (or vice versa).
  vec2 pressAxes = clamp(uShapePressAxes[chosen], 0.0, 1.0);
  lensShift += normal * pressAxes * (PRESS_SQUASH * minHalf * pressure
                                     * pressDepth * (1.0 - pressDepth));
  vec2 chromaShift = bendNormal * uDispersion * (0.32 + edgeCurve * 0.95);
  vec2 uvR = (point + lensShift * (1.0 + uDispersion * 0.009) + chromaShift) / uRes;
  vec2 uvG = (point + lensShift) / uRes;
  vec2 uvB = (point + lensShift * (1.0 - uDispersion * 0.011) - chromaShift) / uRes;
  // Reach controls where the sample comes from, not how fat a captured line
  // becomes. Preserve the tuned reach=35 softness while preventing larger
  // reaches from silently doubling the blur radius.
  float causticBlur = min(0.7 + 1.13 * uDpr, 0.7 + captureDistance * 0.026);
  // Softness and background pre-blur are the same operation: the backdrop is
  // blurred before the lens bends it. Softness is a ratio of the component
  // short side, so a larger card is naturally more frosted at one setting;
  // pre-blur is an absolute radius. Successive blurs add in quadrature.
  float frostRadius = clamp(uShapeFrosts[chosen], 0.0, 1.0) * minHalf * 2.0 * FROST_PREBLUR_SCALE;
  float preBlur = sqrt(frostRadius * frostRadius + uBackdropBlur * uBackdropBlur);
  float lodR = footprintLod(uvR);
  float lodG = footprintLod(uvG);
  float lodB = footprintLod(uvB);
  vec2 echoUv = (point - normal * 11.0) / uRes;
  float echoLod = footprintLod(echoUv);

  if (!covered) {
    outColor = vec4(0.0);
    return;
  }

  vec3 sr = preBlurredBackdrop(uvR, preBlur, lodR);
  vec3 sg = preBlurredBackdrop(uvG, preBlur, lodG);
  vec3 sb = preBlurredBackdrop(uvB, preBlur, lodB);
  // Captured lines keep their slight softening inside the thin caustic band
  // unless the pre-blurred backdrop is already at least that soft.
  float causticMix = causticShade * 0.18;
  if (causticMix > 0.001 && causticBlur > preBlur) {
    sr = mix(sr, softBackdrop(uvR, causticBlur), causticMix);
    sg = mix(sg, softBackdrop(uvG, causticBlur), causticMix);
    sb = mix(sb, softBackdrop(uvB, causticBlur), causticMix);
  }
  vec3 transmitted = vec3(sr.r, sg.g, sb.b);

  float transmittedLum = luminance(transmitted);
  vec3 bodyTarget = mix(vec3(0.030, 0.031, 0.038), vec3(0.94, 0.95, 0.97),
                        smoothstep(0.58, 0.82, transmittedLum));
  transmitted = mix(transmitted, bodyTarget,
                    clamp(uBody * (0.034 + edgeCurve * 0.012), 0.0, 0.11));
  transmitted = mix(vec3(luminance(transmitted)), transmitted, 1.0 - uBody * 0.045);

  float opticalPath = 0.26 + sqrt(depth) * 0.74;
  transmitted *= exp(-vec3(0.018, 0.011, 0.004) * opticalPath * 2.4 * uAbsorption);
  // Tinted Liquid Glass chooses one light/dark material for the whole
  // component. Choosing per fragment lets high-contrast content punch a
  // checkerboard through the surface instead of producing the coherent milky
  // veil used by notifications and other legibility-first controls.
  vec3 tintTarget = mix(vec3(0.055, 0.057, 0.066), vec3(0.975, 0.970, 0.955),
                        clamp(uShapeTintLights[chosen], 0.0, 1.0));
  float tintOpacity = smoothstep(0.0, 1.5, uShapeTints[chosen]) * 0.78;
  transmitted = mix(transmitted, tintTarget, tintOpacity * (0.88 + depth * 0.12));

  float mask = 1.0 - smoothstep(0.0, 1.35, chosenD);
  float thinRim = exp(-pow((chosenD + 0.65) / 1.4, 2.0));
  float innerRim = exp(-pow((chosenD + 6.2) / 3.8, 2.0));
  float fresnel = pow(clamp(edgeCurve, 0.0, 1.0), 0.72);
  vec2 lightDir = normalize(uLightDirs[chosen] + vec2(0.0001));
  float key = pow(max(dot(normal, lightDir), 0.0), 7.0) * fresnel;
  float opposite = pow(max(dot(normal, -lightDir), 0.0), 5.0) * innerRim;
  vec3 color = transmitted;
  // The rim reflection, echo and interface line only exist in a band around
  // the contour. Their weights are resolved first so interior fragments skip
  // the extra backdrop probes; a skipped weight is below 1/2000.
  float rimMix = clamp((thinRim * 0.42 + innerRim * 0.18 + fresnel * 0.10)
                       * uRim * uReflection, 0.0, 0.72);
  if (rimMix > 0.0005) {
    // A softened environment probe keeps moving video/feed edges from turning
    // into one-frame white flashes while preserving the local colour response.
    vec3 reflected = softBackdrop((point + normal * (8.0 + uRefraction * 0.17)) / uRes,
                                  max(5.2, preBlur));
    vec3 adaptiveRim = reflected * 1.45 + vec3(0.06, 0.035, 0.08);
    adaptiveRim = mix(adaptiveRim, vec3(0.96, 0.97, 1.0), 0.24);
    adaptiveRim = mix(adaptiveRim, vec3(0.035, 0.025, 0.045),
                      smoothstep(0.78, 0.98, luminance(reflected)) * 0.48);
    color = mix(color, adaptiveRim, rimMix);
  }
  color += vec3(1.0, 0.82, 0.92) * key * 0.30 * uRim * uHighlight;
  color *= 1.0 - opposite * 0.12 * uRim;
  float echoMix = exp(-pow((chosenD + 11.0) / 5.5, 2.0)) * 0.075 * uRim * uEcho;
  if (echoMix > 0.0005) {
    vec3 echoColor = preBlurredBackdrop(echoUv, preBlur, echoLod);
    color = mix(color, echoColor * 1.12, echoMix);
  }

  float lineWidth = mix(0.34, 1.08, clamp(uHairWidth, 0.0, 1.0));
  float strokeDistance = abs(chosenD + 0.10) - lineWidth * 0.5;
  float hairline = 1.0 - smoothstep(-edgeAA * 0.72, edgeAA * 0.72, strokeDistance);
  // Premultiplied layer composition exactly reproduces the prototype's two
  // sequential mixes when drawn over the supplied backdrop, and also allows
  // the same shader to work in overlay mode over a DOM/canvas backdrop.
  float hairAlpha = clamp(hairline * uHairline * (0.22 + uRim * 0.20), 0.0, 1.0);
  vec3 hairColor = vec3(0.0);
  if (hairAlpha > 0.0) {
    hairColor = interfaceColor(point, normal, preBlur);
    // The contrast line is the default interface. On the light-facing arc the
    // specular key replaces it with the thin white highlight visible in the
    // native material instead of merely brightening the black line underneath.
    float hairHighlight = clamp(key * uHighlight * 2.5 * (0.65 + uRim * 0.60), 0.0, 0.96);
    hairColor = mix(hairColor, vec3(0.985, 0.99, 1.0), hairHighlight);
  }

  float alpha = hairAlpha + mask * (1.0 - hairAlpha);
  // The rim, key highlight and echo terms can push the body colour past 1.0.
  // Inside the surface the drawing buffer clamps that anyway, but on the
  // anti-aliased fringe a premultiplied rgb larger than alpha composites
  // brighter than either the glass or the backdrop, sprinkling over-bright
  // pixels along the outer edge. Saturate before premultiplying.
  color = clamp(color, 0.0, 1.0);
  vec3 premultiplied = hairColor * hairAlpha + color * mask * (1.0 - hairAlpha);
  float surfaceOpacity = clamp(uShapeOpacities[chosen], 0.0, 1.0);
  outColor = vec4(premultiplied * surfaceOpacity, alpha * surfaceOpacity);
}`;

  // lib/src/src/renderer.js
  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error(log + "\n" + src);
    }
    return s;
  }
  function program(gl, vs, fs) {
    const p = gl.createProgram();
    const vertex = compile(gl, gl.VERTEX_SHADER, vs);
    let fragment;
    try {
      fragment = compile(gl, gl.FRAGMENT_SHADER, fs);
    } catch (error) {
      gl.deleteShader(vertex);
      gl.deleteProgram(p);
      throw error;
    }
    gl.attachShader(p, vertex);
    gl.attachShader(p, fragment);
    gl.linkProgram(p);
    gl.detachShader(p, vertex);
    gl.detachShader(p, fragment);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(p);
      gl.deleteProgram(p);
      throw new Error(log);
    }
    const loc = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(p, i).name.replace("[0]", "");
      loc[name] = gl.getUniformLocation(p, name);
    }
    return { p, loc };
  }
  var MIPS = 7;
  var GlassRenderer = class {
    constructor(canvas, options = {}) {
      const gl = canvas.getContext("webgl2", {
        alpha: Boolean(options.alpha),
        antialias: false,
        premultipliedAlpha: true,
        // Reading the canvas back (screenshots, toDataURL) needs the drawing
        // buffer preserved, but it also stops the driver from discarding it
        // between frames. Off by default; the tooling turns it on explicitly.
        preserveDrawingBuffer: Boolean(options.preserveDrawingBuffer)
      });
      if (!gl) throw new Error("WebGL2 unavailable");
      this.gl = gl;
      this.canvas = canvas;
      this.materialVersion = options.materialVersion === 2 ? 2 : 1;
      this.lost = false;
      this.tex = null;
      this.blurTex = null;
      this.wallpapers = [];
      this.fbos = [];
      this.blurFbos = [];
      this.mipLevels = 0;
      this.w = 0;
      this.h = 0;
      this.createResources();
    }
    createResources() {
      const gl = this.gl;
      this.quad = gl.createVertexArray();
      gl.bindVertexArray(this.quad);
      this.quadBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
        gl.STATIC_DRAW
      );
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.bindVertexArray(null);
      this.progWall = program(gl, VS_FULLSCREEN, FS_WALLPAPER);
      this.progDown = program(gl, VS_FULLSCREEN, FS_DOWN);
      this.progUp = program(gl, VS_FULLSCREEN, FS_UP);
      this.progBlit = program(gl, VS_FULLSCREEN, FS_BLIT);
      this.progGlass = program(
        gl,
        VS_GLASS,
        this.materialVersion === 2 ? FS_GLASS_V2 : FS_GLASS
      );
      this.fallbackTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.fallbackTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.SRGB8_ALPHA8,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 255])
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
    releaseResources() {
      const gl = this.gl;
      for (const entry of [
        this.progWall,
        this.progDown,
        this.progUp,
        this.progBlit,
        this.progGlass
      ]) {
        if (entry) gl.deleteProgram(entry.p);
      }
      this.progWall = null;
      this.progDown = null;
      this.progUp = null;
      this.progBlit = null;
      this.progGlass = null;
      if (this.quad) gl.deleteVertexArray(this.quad);
      if (this.quadBuffer) gl.deleteBuffer(this.quadBuffer);
      if (this.fallbackTexture) gl.deleteTexture(this.fallbackTexture);
      this.quad = null;
      this.quadBuffer = null;
      this.fallbackTexture = null;
    }
    releaseTargets() {
      const gl = this.gl;
      if (this.tex) gl.deleteTexture(this.tex);
      if (this.blurTex) gl.deleteTexture(this.blurTex);
      this.fbos.forEach((framebuffer) => gl.deleteFramebuffer(framebuffer));
      this.blurFbos.forEach((framebuffer) => gl.deleteFramebuffer(framebuffer));
      this.tex = null;
      this.blurTex = null;
      this.fbos = [];
      this.blurFbos = [];
      this.mipLevels = 0;
    }
    // Drops every handle without touching the GPU: after a context loss the ids
    // are already invalid and deleting them is meaningless.
    handleContextLost() {
      this.lost = true;
      this.progWall = null;
      this.progDown = null;
      this.progUp = null;
      this.progBlit = null;
      this.progGlass = null;
      this.quad = null;
      this.quadBuffer = null;
      this.fallbackTexture = null;
      this.tex = null;
      this.blurTex = null;
      this.fbos = [];
      this.blurFbos = [];
      for (const entry of this.wallpapers) {
        entry.texture = null;
        entry.ready = false;
        entry.width = 0;
        entry.height = 0;
      }
    }
    // Rebuilds programs, render targets and backdrop textures after the browser
    // restores the context. The WebGL2 context object itself is reused per spec,
    // so only the resources have to be recreated.
    restore() {
      if (!this.lost) return this;
      this.lost = false;
      this.createResources();
      const { w, h } = this;
      this.w = 0;
      this.h = 0;
      if (w > 0 && h > 0) this.resize(w, h);
      this.createWallpaperTextures();
      return this;
    }
    hasLiveBackdrop() {
      return this.wallpapers.some((entry) => entry.update === "live");
    }
    sourceSize(source) {
      return [
        Number(source?.videoWidth || source?.naturalWidth || source?.width || 0),
        Number(source?.videoHeight || source?.naturalHeight || source?.height || 0)
      ];
    }
    uploadWallpaper(entry, forceAllocation = false) {
      if (this.lost || !entry.texture) return false;
      const [width, height] = this.sourceSize(entry.source);
      if (!(width > 0) || !(height > 0)) return false;
      const gl = this.gl;
      gl.bindTexture(gl.TEXTURE_2D, entry.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      if (!forceAllocation && entry.ready && entry.width === width && entry.height === height) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, entry.source);
      } else {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA8,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          entry.source
        );
      }
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      entry.width = width;
      entry.height = height;
      entry.ready = true;
      return true;
    }
    resize(w, h) {
      w = Math.max(1, Math.round(w));
      h = Math.max(1, Math.round(h));
      if (this.lost) {
        this.w = w;
        this.h = h;
        return;
      }
      if (w === this.w && h === this.h) return;
      const gl = this.gl;
      this.w = w;
      this.h = h;
      this.canvas.width = w;
      this.canvas.height = h;
      this.releaseTargets();
      this.mipLevels = Math.min(MIPS, Math.floor(Math.log2(Math.max(w, h))) + 1);
      const createMipTexture = () => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texStorage2D(gl.TEXTURE_2D, this.mipLevels, gl.SRGB8_ALPHA8, w, h);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
      };
      this.tex = createMipTexture();
      this.blurTex = createMipTexture();
      this.fbos = [];
      this.blurFbos = [];
      for (let i = 0; i < this.mipLevels; i++) {
        const f = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tex, i);
        this.fbos.push(f);
        const blurFbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, blurFbo);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          this.blurTex,
          i
        );
        this.blurFbos.push(blurFbo);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    // (Re)allocates a GL texture per backdrop entry and uploads its first frame.
    createWallpaperTextures() {
      if (this.lost) return;
      const gl = this.gl;
      for (const entry of this.wallpapers) {
        if (entry.texture) gl.deleteTexture(entry.texture);
        entry.texture = gl.createTexture();
        entry.ready = false;
        entry.width = 0;
        entry.height = 0;
        gl.bindTexture(gl.TEXTURE_2D, entry.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        this.uploadWallpaper(entry, true);
      }
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
    setWallpapers(images2, options = {}) {
      const gl = this.gl;
      const update = options.update === "live" ? "live" : "static";
      if (!this.lost) this.wallpapers.forEach((entry) => gl.deleteTexture(entry.texture));
      this.wallpapers = images2.map((source) => ({
        texture: null,
        source,
        update,
        ready: false,
        width: 0,
        height: 0
      }));
      this.createWallpaperTextures();
    }
    refreshWallpapers(force = false) {
      if (this.lost) return;
      for (const entry of this.wallpapers) {
        if (force || entry.update === "live") this.uploadWallpaper(entry);
      }
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
    mipSize(level) {
      return [Math.max(1, this.w >> level), Math.max(1, this.h >> level)];
    }
    // Renders the backdrop into mip 0 and builds the progressively blurred chain.
    buildBackdrop(scene, zoom = 1) {
      if (this.lost || !this.fbos.length) return;
      const gl = this.gl;
      this.refreshWallpapers();
      gl.bindVertexArray(this.quad);
      gl.disable(gl.BLEND);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[0]);
      gl.viewport(0, 0, this.w, this.h);
      gl.useProgram(this.progWall.p);
      gl.uniform2f(this.progWall.loc.uRes, this.w, this.h);
      gl.uniform1i(this.progWall.loc.uScene, scene);
      gl.uniform1f(this.progWall.loc.uZoom, zoom);
      const wallpaper = this.wallpapers[scene];
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, wallpaper?.ready ? wallpaper.texture : this.fallbackTexture);
      gl.uniform1i(this.progWall.loc.uWallpaper, 1);
      gl.uniform1i(this.progWall.loc.uUseImage, wallpaper?.ready ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.useProgram(this.progDown.p);
      gl.uniform1i(this.progDown.loc.uTex, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      for (let i = 1; i < this.mipLevels; i++) {
        const [sw, sh] = this.mipSize(i - 1);
        const [dw, dh] = this.mipSize(i);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, i - 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, i - 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[i]);
        gl.viewport(0, 0, dw, dh);
        gl.uniform2f(this.progDown.loc.uTexel, 1 / sw, 1 / sh);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, this.mipLevels - 1);
      if (this.materialVersion === 2) return;
      const last = this.mipLevels - 1;
      const [lastW, lastH] = this.mipSize(last);
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.fbos[last]);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.blurFbos[last]);
      gl.blitFramebuffer(
        0,
        0,
        lastW,
        lastH,
        0,
        0,
        lastW,
        lastH,
        gl.COLOR_BUFFER_BIT,
        gl.NEAREST
      );
      gl.bindVertexArray(this.quad);
      gl.useProgram(this.progUp.p);
      gl.uniform1i(this.progUp.loc.uLow, 0);
      gl.uniform1i(this.progUp.loc.uHigh, 1);
      for (let i = last - 1; i >= 0; i--) {
        const [lowW, lowH] = this.mipSize(i + 1);
        const [dw, dh] = this.mipSize(i);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.blurTex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, i + 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, i + 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, i);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, i);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.blurFbos[i]);
        gl.viewport(0, 0, dw, dh);
        gl.uniform2f(this.progUp.loc.uLowTexel, 1 / lowW, 1 / lowH);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.blurTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, this.mipLevels - 1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, this.mipLevels - 1);
    }
    // Draws the sharp backdrop to the screen.
    drawBackdrop() {
      if (this.lost || !this.tex) return;
      const gl = this.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.w, this.h);
      gl.disable(gl.BLEND);
      gl.bindVertexArray(this.quad);
      gl.useProgram(this.progBlit.p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.uniform1i(this.progBlit.loc.uTex, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    // Clears the visible framebuffer while preserving the offscreen backdrop
    // texture. Used when the canvas overlays an existing DOM/canvas backdrop.
    clearOutput() {
      if (this.lost) return;
      const gl = this.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.w, this.h);
      gl.disable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    // elements: {x, y, w, h, shape} in CSS pixels, y measured from the TOP.
    // The group is evaluated as a single smooth-union SDF. This is important:
    // compositing independent glass draws can overlap, but can never produce the
    // shared silhouette and continuous normals of one fused liquid surface.
    drawGlassGroup(elements, m, dpr, mergeRadius = m.mergeRadius ?? 0) {
      if (!elements.length || this.lost || !this.tex) return;
      const gl = this.gl;
      const { loc, p } = this.progGlass;
      const shapes = elements.slice(0, MAX_GLASS_SHAPES);
      const minX = Math.min(...shapes.map((element) => element.x));
      const minY = Math.min(...shapes.map((element) => element.y));
      const maxX = Math.max(...shapes.map((element) => element.x + element.w));
      const maxY = Math.max(...shapes.map((element) => element.y + element.h));
      const groupWidth = maxX - minX;
      const groupHeight = maxY - minY;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.w, this.h);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindVertexArray(this.quad);
      gl.useProgram(p);
      const cx = (minX + groupWidth / 2) * dpr;
      const cy = this.h - (minY + groupHeight / 2) * dpr;
      const hw = groupWidth / 2 * dpr;
      const hh = groupHeight / 2 * dpr;
      const centers = new Float32Array(MAX_GLASS_SHAPES * 2);
      const halves = new Float32Array(MAX_GLASS_SHAPES * 2);
      const radii = new Float32Array(MAX_GLASS_SHAPES);
      const types = new Int32Array(MAX_GLASS_SHAPES);
      shapes.forEach((element, i) => {
        const short = Math.min(element.w, element.h);
        centers[i * 2] = (element.x + element.w / 2) * dpr;
        centers[i * 2 + 1] = this.h - (element.y + element.h / 2) * dpr;
        halves[i * 2] = element.w / 2 * dpr;
        halves[i * 2 + 1] = element.h / 2 * dpr;
        radii[i] = Math.min(element.radius ?? m.radius, short * 0.235) * dpr;
        types[i] = element.shape === "pill" ? 1 : element.shape === "circle" ? 2 : 0;
      });
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.uniform1i(loc.uSrc, 0);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.blurTex);
      gl.uniform1i(loc.uBlurSrc, 2);
      gl.uniform2f(loc.uRes, this.w, this.h);
      gl.uniform2f(loc.uCenter, cx, cy);
      gl.uniform2f(loc.uHalf, hw, hh);
      gl.uniform1i(loc.uShapeCount, shapes.length);
      gl.uniform2fv(loc.uShapeCenters, centers);
      gl.uniform2fv(loc.uShapeHalves, halves);
      gl.uniform1iv(loc.uShapeTypes, types);
      gl.uniform1fv(loc.uShapeRadii, radii);
      gl.uniform1f(loc.uMergeRadius, Math.max(0, mergeRadius) * dpr);
      gl.uniform1f(loc.uPad, (m.shadowSize * 4 + Math.max(mergeRadius, 0) * 0.3 + 8) * dpr);
      gl.uniform1f(loc.uSquircle, m.squircle);
      gl.uniform1f(loc.uBevel, m.bevel * dpr);
      gl.uniform1f(loc.uHeight, m.height * dpr);
      gl.uniform1f(loc.uSizeAdaptation, m.sizeAdaptation ?? 1);
      gl.uniform1f(loc.uIOR, m.ior);
      gl.uniform1f(loc.uDispersion, m.dispersion);
      gl.uniform1f(loc.uBlurPlateau, m.blurPlateau * dpr);
      gl.uniform1f(loc.uBlurRim, m.blurRim * dpr);
      gl.uniform1f(loc.uOpticalDensity, m.opticalDensity);
      gl.uniform1f(loc.uMips, this.mipLevels);
      gl.uniform1f(loc.uSpecular, m.specular);
      gl.uniform1f(loc.uSpecPower, m.specPower);
      gl.uniform1f(loc.uHighlightAdapt, m.highlightAdapt);
      gl.uniform1f(loc.uHighlightWidth, m.highlightWidth);
      gl.uniform1f(loc.uHighlightSharpness, m.highlightSharpness);
      gl.uniform1f(loc.uHighlightBase, m.highlightBase);
      gl.uniform1f(loc.uFresnel, m.fresnel);
      gl.uniform1f(loc.uSat, m.saturation);
      gl.uniform1f(loc.uBright, m.brightness);
      gl.uniform1f(loc.uTintAmount, m.tintAmount);
      gl.uniform3f(loc.uTintColor, ...m.tintColor);
      gl.uniform1f(loc.uTintAdapt, m.tintAdapt ?? 0);
      gl.uniform1f(loc.uShadow, m.shadow);
      gl.uniform1f(loc.uShadowSize, m.shadowSize * dpr);
      gl.uniform1f(loc.uShadowOffset, m.shadowOffset * dpr);
      gl.uniform2f(loc.uLightDir, m.lightX, m.lightY);
      gl.uniform1f(loc.uEdgeLine, m.edgeLine);
      gl.uniform1f(loc.uEdgeWidth, m.edgeWidth * dpr);
      gl.uniform1f(loc.uEdgeDark, m.edgeDark);
      gl.uniform1f(loc.uRefractScale, m.refractScale);
      gl.uniform1f(loc.uMeniscus, m.meniscus);
      gl.uniform1i(loc.uDebug, m.debug | 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disable(gl.BLEND);
    }
    drawGlass(element, m, dpr) {
      this.drawGlassGroup([element], m, dpr, 0);
    }
    // V2 surfaces share V1's public silhouettes and backdrop/mip pipeline, but
    // nothing from the material calculation. In particular, similarly named
    // uniforms are filled using V2's own units: edgeWidth is a fraction,
    // dispersion is a pixel split, and roundness is a short-half ratio.
    drawGlassV2Group(elements, m, dpr, lightDirections = [], tintLights = []) {
      if (!elements.length || this.lost || !this.tex) return;
      const gl = this.gl;
      const { loc, p } = this.progGlass;
      const shapes = elements.slice(0, MAX_GLASS_SHAPES);
      const minX = Math.min(...shapes.map((element) => element.x));
      const minY = Math.min(...shapes.map((element) => element.y));
      const maxX = Math.max(...shapes.map((element) => element.x + element.w));
      const maxY = Math.max(...shapes.map((element) => element.y + element.h));
      const groupWidth = maxX - minX;
      const groupHeight = maxY - minY;
      const centers = new Float32Array(MAX_GLASS_SHAPES * 2);
      const halves = new Float32Array(MAX_GLASS_SHAPES * 2);
      const radii = new Float32Array(MAX_GLASS_SHAPES);
      const types = new Int32Array(MAX_GLASS_SHAPES);
      const lights = new Float32Array(MAX_GLASS_SHAPES * 2);
      const tints = new Float32Array(MAX_GLASS_SHAPES);
      const tintTones = new Float32Array(MAX_GLASS_SHAPES);
      const frosts = new Float32Array(MAX_GLASS_SHAPES);
      const opacities = new Float32Array(MAX_GLASS_SHAPES);
      const pressures = new Float32Array(MAX_GLASS_SHAPES);
      const pressAxes = new Float32Array(MAX_GLASS_SHAPES * 2);
      shapes.forEach((element, i) => {
        const short = Math.min(element.w, element.h);
        centers[i * 2] = (element.x + element.w / 2) * dpr;
        centers[i * 2 + 1] = this.h - (element.y + element.h / 2) * dpr;
        halves[i * 2] = element.w / 2 * dpr;
        halves[i * 2 + 1] = element.h / 2 * dpr;
        radii[i] = Math.min(
          element.radius ?? short * 0.5 * m.roundness,
          short * 0.5
        ) * dpr;
        types[i] = element.shape === "pill" ? 1 : element.shape === "circle" ? 2 : 0;
        const direction = lightDirections[i] ?? [Math.SQRT1_2, Math.SQRT1_2];
        lights[i * 2] = direction[0];
        lights[i * 2 + 1] = direction[1];
        tints[i] = element.tint ?? m.tint;
        tintTones[i] = tintLights[i] ?? 1;
        frosts[i] = element.frost ?? m.frost;
        opacities[i] = element.opacity ?? 1;
        pressures[i] = element.pressure ?? 0;
        pressAxes[i * 2] = element.pressureAxes?.[0] ?? 1;
        pressAxes[i * 2 + 1] = element.pressureAxes?.[1] ?? 1;
      });
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.w, this.h);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindVertexArray(this.quad);
      gl.useProgram(p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.uniform1i(loc.uSrc, 0);
      gl.uniform2f(loc.uRes, this.w, this.h);
      gl.uniform1f(loc.uDpr, dpr);
      gl.uniform2f(
        loc.uCenter,
        (minX + groupWidth / 2) * dpr,
        this.h - (minY + groupHeight / 2) * dpr
      );
      gl.uniform2f(loc.uHalf, groupWidth / 2 * dpr, groupHeight / 2 * dpr);
      gl.uniform1f(loc.uPad, 4 * dpr);
      gl.uniform1f(loc.uMips, this.mipLevels);
      gl.uniform1i(loc.uShapeCount, shapes.length);
      gl.uniform2fv(loc.uShapeCenters, centers);
      gl.uniform2fv(loc.uShapeHalves, halves);
      gl.uniform1iv(loc.uShapeTypes, types);
      gl.uniform1fv(loc.uShapeRadii, radii);
      gl.uniform1fv(loc.uShapeTints, tints);
      gl.uniform1fv(loc.uShapeTintLights, tintTones);
      gl.uniform1fv(loc.uShapeFrosts, frosts);
      gl.uniform1fv(loc.uShapeOpacities, opacities);
      gl.uniform1fv(loc.uShapePressures, pressures);
      gl.uniform2fv(loc.uShapePressAxes, pressAxes);
      gl.uniform2fv(loc.uLightDirs, lights);
      gl.uniform1f(loc.uRefraction, m.refraction * dpr);
      gl.uniform1f(loc.uEdgeReach, m.edgeReach);
      gl.uniform1f(loc.uBackdropBlur, (m.backdropBlur ?? 0) * dpr);
      gl.uniform1f(loc.uEdgeWidth, m.edgeWidth);
      gl.uniform1f(loc.uDispersion, m.dispersion);
      gl.uniform1f(loc.uBody, m.body);
      gl.uniform1f(loc.uAbsorption, m.absorption);
      gl.uniform1f(loc.uRim, m.rim);
      gl.uniform1f(loc.uReflection, m.reflection);
      gl.uniform1f(loc.uHighlight, m.highlight);
      gl.uniform1f(loc.uEcho, m.echo);
      gl.uniform1f(loc.uHairline, m.hairline);
      gl.uniform1f(loc.uHairWidth, m.hairWidth);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disable(gl.BLEND);
    }
    destroy() {
      if (this.lost) {
        this.wallpapers = [];
        return;
      }
      const gl = this.gl;
      this.releaseTargets();
      this.releaseResources();
      this.wallpapers.forEach((entry) => gl.deleteTexture(entry.texture));
      this.wallpapers = [];
    }
  };

  // lib/src/src/material.js
  var DEFAULT_MATERIAL = {
    radius: 64,
    // corner radius (clamped to 23.5% of the side)
    squircle: 2,
    // Folder corner exponent selected from the references
    mergeRadius: 52,
    // smooth-union reach between nearby components
    bevel: 34,
    // max rim width; scales down below ~113px short side
    height: 21,
    // max slab thickness; follows the small-component scale
    sizeAdaptation: 1,
    // 0 keeps absolute lengths; 1 fits optics to small controls
    ior: 2,
    // effective IOR after screen-space calibration
    dispersion: 0.06,
    // IOR spread between R and B -> chromatic fringe
    refractScale: 3,
    // artistic gain on the displacement
    meniscus: 1,
    // 1 = concave (liquid) rim -> surroundings squeeze into
    // the rim (Apple);  0 = convex lens rim (magnifier)
    blurPlateau: 4.5,
    // blur radius in the middle, CSS px (frosted)
    blurRim: 11,
    // wide rim scattering, CSS px
    opticalDensity: 0.4,
    // artistic dark-detail weight; linear-light blur needs less compensation
    specular: 0.89,
    specPower: 29.5,
    fresnel: 0.65,
    // multiplier on the Schlick term (1 = physical)
    saturation: 1.35,
    // boost on the transmitted backdrop, like iOS materials
    brightness: 0,
    tintAmount: 0.02,
    // strength of the material tint layer
    tintColor: [1, 1, 1],
    tintAdapt: 0.14,
    // choose a light/dark tint from backdrop luminance
    shadow: 0.09,
    shadowSize: 4,
    shadowOffset: 0,
    lightX: -0.18,
    lightY: 0.08,
    highlightAdapt: 0.91,
    // how strongly backdrop gradient steers the highlight
    highlightWidth: 0.87,
    // specular band width as a fraction of the bevel
    highlightSharpness: 0.55,
    // multiplier on specPower
    highlightBase: 0.3,
    // fallback intensity on a flat backdrop
    edgeLine: 0.3,
    edgeWidth: 0.5,
    // px width of the contour / highlight lines
    edgeDark: 0.02,
    // grazing-angle darkening at the silhouette
    debug: 0
    // 0 final, 1 thickness, 2 normals, 3 displacement
  };
  var PRESETS = {
    // iOS 26 folder on a home screen: heavily frosted plateau, strong edge lens
    regular: {},
    // "Clear" variant: almost no frost, refraction and specular do all the work
    clear: {
      blurPlateau: 3,
      blurRim: 1,
      height: 20,
      bevel: 15,
      refractScale: 1.5,
      specular: 0.36,
      fresnel: 1,
      tintAmount: 0.02,
      brightness: 0.02,
      saturation: 1.18
    },
    // exaggerated, for teaching the physics
    lens: {
      bevel: 26,
      height: 34,
      ior: 1.62,
      dispersion: 0.09,
      refractScale: 1.8,
      blurPlateau: 2,
      blurRim: 0,
      specular: 0.42,
      fresnel: 1.2
    }
  };
  var REDUCED_TRANSPARENCY_MATERIAL = {
    tintAmount: 0.86,
    blurPlateau: 0,
    blurRim: 0,
    refractScale: 0,
    dispersion: 0,
    meniscus: 0,
    specular: 0.12,
    fresnel: 0.15,
    saturation: 1,
    highlightBase: 0.06,
    edgeLine: 0.22
  };
  function cloneMaterial(material) {
    return {
      ...material,
      tintColor: [...material.tintColor]
    };
  }
  function getDefaultMaterial() {
    return cloneMaterial(DEFAULT_MATERIAL);
  }
  function makeMaterial(preset = "regular") {
    return { ...getDefaultMaterial(), ...PRESETS[preset] || {} };
  }

  // lib/src/src/v2-material.js
  var DEFAULT_MATERIAL_V2 = Object.freeze({
    refraction: 84,
    // Capture distance as a fraction of the component's short side.
    edgeReach: 0.14,
    edgeWidth: 0.21,
    dispersion: 2,
    // Softness ratio. Like backdropBlur it blurs the backdrop before refraction,
    // but its radius is resolved against each component's short side, so the
    // same value stays delicate on small icons and becomes denser on large cards.
    frost: 0,
    // Absolute pre-blur radius in CSS pixels; combines with frost.
    backdropBlur: 0,
    body: 0.72,
    absorption: 0.58,
    tint: 0,
    rim: 0.24,
    reflection: 0.31,
    highlight: 0.34,
    lightAngle: 136,
    echo: 0.28,
    hairline: 0.92,
    hairWidth: 0.52,
    roundness: 0.47
  });
  var REDUCED_TRANSPARENCY_MATERIAL_V2 = Object.freeze({
    refraction: 0,
    edgeReach: 0,
    dispersion: 0,
    frost: 0,
    backdropBlur: 0,
    body: 1.5,
    tint: 1.35,
    reflection: 0.18,
    highlight: 0.12,
    echo: 0
  });
  var SLIDERS_V2 = Object.freeze([
    ["refraction", 0, 110, 1],
    ["edgeReach", 0, 1.6, 0.01],
    ["edgeWidth", 0, 0.55, 0.01],
    ["dispersion", 0, 7, 0.1],
    ["frost", 0, 1, 0.01],
    ["backdropBlur", 0, 64, 1],
    ["body", 0, 1.5, 0.01],
    ["absorption", 0, 2, 0.01],
    ["tint", 0, 1.5, 0.01],
    ["rim", 0, 1, 0.01],
    ["reflection", 0, 1.5, 0.01],
    ["highlight", 0, 1.5, 0.01],
    ["lightAngle", -180, 180, 1],
    ["echo", 0, 1.5, 0.01],
    ["hairline", 0, 1.5, 0.01],
    ["hairWidth", 0, 1, 0.01],
    ["roundness", 0.05, 0.6, 0.01]
  ]);
  function getDefaultMaterialV2() {
    return { ...DEFAULT_MATERIAL_V2 };
  }
  function makeMaterialV2(overrides = {}) {
    if (typeof overrides === "string") {
      throw new TypeError("Liquid Glass V2 does not use V1 preset names.");
    }
    const unknown = Object.keys(overrides || {}).filter((key) => !(key in DEFAULT_MATERIAL_V2));
    if (unknown.length) {
      throw new TypeError(`Unknown Liquid Glass V2 material parameter${unknown.length === 1 ? "" : "s"}: ${unknown.join(", ")}`);
    }
    return { ...getDefaultMaterialV2(), ...overrides || {} };
  }

  // lib/src/src/v2-geometry.js
  var SHAPE_TYPES_V2 = Object.freeze({ rect: 0, folder: 0, pill: 1, circle: 2 });
  function shapeTypeOfV2(shape) {
    return SHAPE_TYPES_V2[shape] ?? 0;
  }
  function sdRoundBoxV2(px, py, halfX, halfY, radius) {
    const r = Math.min(radius, halfX, halfY);
    const qx = Math.abs(px) - halfX + r;
    const qy = Math.abs(py) - halfY + r;
    return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;
  }
  function cornerRadiusV2(element, roundness = 0.47) {
    const width = Number(element.w ?? element.width ?? element.size ?? 0);
    const height = Number(element.h ?? element.height ?? element.size ?? width);
    if (Number.isFinite(element.radius)) {
      return Math.max(0, Math.min(Number(element.radius), Math.min(width, height) * 0.5));
    }
    return Math.min(width, height) * 0.5 * roundness;
  }
  function sdElementV2(x, y, element, material = {}) {
    const width = Number(element.w ?? element.width ?? element.size ?? 0);
    const height = Number(element.h ?? element.height ?? element.size ?? width);
    const halfX = width / 2;
    const halfY = height / 2;
    const px = x - Number(element.x ?? 0) - halfX;
    const py = y - Number(element.y ?? 0) - halfY;
    const kind = shapeTypeOfV2(element.shape);
    const radius = cornerRadiusV2({ ...element, w: width, h: height }, material.roundness ?? 0.47);
    if (kind === 1) return sdRoundBoxV2(px, py, halfX, halfY, Math.min(halfX, halfY));
    if (kind === 2) return Math.hypot(px, py) - Math.min(halfX, halfY);
    return sdRoundBoxV2(px, py, halfX, halfY, radius);
  }
  function distanceToElementsV2(x, y, elements, material = {}) {
    let nearest = Infinity;
    for (const element of elements) nearest = Math.min(nearest, sdElementV2(x, y, element, material));
    return nearest;
  }
  function hitTestElementsV2(x, y, elements, material = {}, options = {}) {
    const tolerance = options.tolerance ?? 0;
    for (let i = elements.length - 1; i >= 0; i--) {
      if (sdElementV2(x, y, elements[i], material) <= tolerance) return elements[i];
    }
    return null;
  }

  // lib/src/src/v2.js
  var SHAPES = /* @__PURE__ */ new Set(["folder", "rect", "pill", "circle"]);
  var COMPOSITE_MODES = /* @__PURE__ */ new Set(["replace", "overlay"]);
  var BACKDROP_UPDATES = /* @__PURE__ */ new Set(["auto", "static", "live"]);
  var REDUCED_TRANSPARENCY_QUERY = "(prefers-reduced-transparency: reduce)";
  function normalizeCompositeMode(mode) {
    if (!COMPOSITE_MODES.has(mode)) throw new TypeError(`Unknown liquid glass V2 composite mode: ${mode}`);
    return mode;
  }
  function normalizeShape(shape) {
    const normalized = shape === "folderRect" ? "rect" : shape;
    if (!SHAPES.has(normalized)) throw new TypeError(`Unknown liquid glass V2 shape: ${shape}`);
    return normalized;
  }
  function normalizeElement(input, index) {
    const width = Number(input.w ?? input.width ?? input.size ?? 0);
    const height = Number(input.h ?? input.height ?? input.size ?? width);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 0 || height < 0) {
      throw new TypeError("Liquid glass V2 elements need a finite, non-negative width and height.");
    }
    const tint = input.tint == null ? void 0 : Number(input.tint);
    if (tint !== void 0 && !Number.isFinite(tint)) {
      throw new TypeError("Liquid glass V2 element tint must be a finite number.");
    }
    const frost = input.frost == null ? void 0 : Number(input.frost);
    if (frost !== void 0 && !Number.isFinite(frost)) {
      throw new TypeError("Liquid glass V2 element frost must be a finite number.");
    }
    const opacity = input.opacity == null ? void 0 : Number(input.opacity);
    const pressure = Number(input.pressure ?? 0);
    if (!Number.isFinite(pressure)) {
      throw new TypeError("Liquid glass V2 element pressure must be a finite number.");
    }
    const pressureAxes = input.pressureAxes == null ? [1, 1] : [Number(input.pressureAxes[0] ?? 1), Number(input.pressureAxes[1] ?? 1)];
    if (!pressureAxes.every(Number.isFinite)) {
      throw new TypeError("Liquid glass V2 element pressureAxes must be two finite numbers.");
    }
    if (opacity !== void 0 && !Number.isFinite(opacity)) {
      throw new TypeError("Liquid glass V2 element opacity must be a finite number.");
    }
    const tintTone = input.tintTone ?? "light";
    if (!["auto", "light", "dark"].includes(tintTone)) {
      throw new TypeError(`Unknown liquid glass V2 tint tone: ${tintTone}`);
    }
    return {
      ...input,
      id: input.id ?? `glass-v2-${index + 1}`,
      shape: normalizeShape(input.shape ?? "rect"),
      x: Number(input.x ?? 0),
      y: Number(input.y ?? 0),
      w: width,
      h: height,
      ...tint === void 0 ? {} : { tint },
      ...frost === void 0 ? {} : { frost },
      ...opacity === void 0 ? {} : { opacity },
      tintTone,
      pressure: Math.max(0, Math.min(1, pressure)),
      pressureAxes: pressureAxes.map((v) => Math.max(0, Math.min(1, v)))
    };
  }
  function resolveImage(source) {
    if (typeof source !== "string") return Promise.resolve(source);
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Unable to load liquid glass V2 wallpaper: ${source}`));
      image.src = source;
    });
  }
  function isLiveBackdropSource(source) {
    const tagName = source?.tagName?.toUpperCase();
    return tagName === "CANVAS" || tagName === "VIDEO" || source?.constructor?.name === "OffscreenCanvas" || source?.constructor?.name === "VideoFrame";
  }
  function resolveBackdropUpdate(source, update = "auto") {
    if (!BACKDROP_UPDATES.has(update)) {
      throw new TypeError(`Unknown liquid glass V2 backdrop update mode: ${update}`);
    }
    return update === "auto" ? isLiveBackdropSource(source) ? "live" : "static" : update;
  }
  function matchMediaSafe(query) {
    return typeof globalThis.matchMedia === "function" ? globalThis.matchMedia(query) : null;
  }
  function backdropSize(source) {
    return [
      Number(source?.videoWidth || source?.naturalWidth || source?.width || 0),
      Number(source?.videoHeight || source?.naturalHeight || source?.height || 0)
    ];
  }
  function lightProbeRect(sourceWidth, sourceHeight, size, zoom) {
    const scale = Math.max(size / sourceWidth, size / sourceHeight) * zoom;
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    return { x: (size - width) / 2, y: (size - height) / 2, width, height };
  }
  var LIGHT_PROBE_WORKER = `
let canvas = null;
self.onmessage = ({ data }) => {
  const { id, bitmap, size, x, y, width, height } = data;
  let pixels = null;
  try {
    if (!canvas || canvas.width !== size) canvas = new OffscreenCanvas(size, size);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.clearRect(0, 0, size, size);
    context.drawImage(bitmap, x, y, width, height);
    pixels = context.getImageData(0, 0, size, size).data;
  } catch {}
  bitmap.close();
  self.postMessage({ id, pixels }, pixels ? [pixels.buffer] : []);
};`;
  var LIGHT_PROBE_INTERVAL_MS = 84;
  var LiquidGlassWebGLV2 = class {
    static isSupported() {
      if (typeof document === "undefined") return false;
      try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2");
        if (!gl) return false;
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return true;
      } catch {
        return false;
      }
    }
    constructor(canvas, options = {}) {
      if (!canvas || typeof canvas.getContext !== "function") {
        throw new TypeError("LiquidGlassWebGLV2 needs an HTMLCanvasElement.");
      }
      this.canvas = canvas;
      this.version = "v2";
      this.compositeMode = normalizeCompositeMode(options.compositeMode ?? "replace");
      this.renderer = new GlassRenderer(canvas, {
        alpha: this.compositeMode === "overlay",
        preserveDrawingBuffer: Boolean(options.preserveDrawingBuffer),
        materialVersion: 2
      });
      this.material = makeMaterialV2(options.material);
      this.elements = [];
      this.backdrops = [];
      this.wallpaperIndex = 0;
      this.wallpaperZoom = options.wallpaperZoom ?? 1;
      this.running = false;
      this.animationFrame = 0;
      this.dirty = true;
      this.backdropDirty = true;
      this.lightFieldDirty = true;
      this.lastFrame = { width: 0, height: 0, dpr: 0 };
      this.warnedShapeLimit = false;
      this.lightCanvas = null;
      this.lightPixels = null;
      this.lightSampleSize = 64;
      this.smoothedLightDirections = /* @__PURE__ */ new Map();
      this.lastLightFieldUpdate = 0;
      this.lastLightBlendTime = 0;
      this.lastManualBackdropUpdate = -Infinity;
      this.lightFieldAsyncDirty = false;
      this.lightWorker = null;
      this.lightWorkerUnavailable = false;
      this.lightProbeId = 0;
      this.lightProbePending = false;
      this.lightProbeQueued = false;
      this.settledRenderFrame = 0;
      this.onContextLost = options.onContextLost ?? null;
      this.onContextRestored = options.onContextRestored ?? null;
      this.respectReducedTransparency = options.respectReducedTransparency ?? true;
      this.reducedTransparencyQuery = this.respectReducedTransparency ? matchMediaSafe(REDUCED_TRANSPARENCY_QUERY) : null;
      this.handleReducedTransparencyChange = () => {
        this.markDirty();
        this.render();
      };
      this.reducedTransparencyQuery?.addEventListener?.("change", this.handleReducedTransparencyChange);
      this.handleContextLost = (event) => {
        event.preventDefault();
        this.renderer.handleContextLost();
        this.markBackdropDirty();
        this.onContextLost?.(event);
      };
      this.handleContextRestored = (event) => {
        this.renderer.restore();
        this.markBackdropDirty();
        this.lastFrame = { width: 0, height: 0, dpr: 0 };
        this.onContextRestored?.(event);
        this.render();
      };
      canvas.addEventListener("webglcontextlost", this.handleContextLost, false);
      canvas.addEventListener("webglcontextrestored", this.handleContextRestored, false);
      this.resizeObserver = null;
      if ((options.autoResize ?? true) && typeof globalThis.ResizeObserver === "function") {
        this.resizeObserver = new globalThis.ResizeObserver(() => {
          this.lightFieldDirty = true;
          this.markDirty();
          this.render();
        });
        this.resizeObserver.observe(canvas);
      }
      if (options.elements) this.setElements(options.elements, false);
      if (options.wallpapers) this.setWallpapers(options.wallpapers, false);
      if (options.backdrop) {
        this.setBackdrop(options.backdrop, {
          update: options.backdropUpdate,
          autoStart: options.autoStart,
          shouldRender: false
        });
      }
    }
    get contextLost() {
      return this.renderer.lost;
    }
    get reducedTransparency() {
      return Boolean(this.reducedTransparencyQuery?.matches);
    }
    get effectiveMaterial() {
      return this.reducedTransparency ? { ...this.material, ...REDUCED_TRANSPARENCY_MATERIAL_V2 } : this.material;
    }
    markDirty() {
      this.dirty = true;
      return this;
    }
    markBackdropDirty() {
      this.backdropDirty = true;
      this.lightFieldDirty = true;
      this.lastLightFieldUpdate = 0;
      this.smoothedLightDirections.clear();
      return this.markDirty();
    }
    setElements(elements, shouldRender = true) {
      this.elements = elements.map((element, index) => normalizeElement(element, index));
      this.markDirty();
      if (shouldRender) this.render();
      return this;
    }
    addElement(element, shouldRender = true) {
      const normalized = normalizeElement(element, this.elements.length);
      this.elements.push(normalized);
      this.markDirty();
      if (shouldRender) this.render();
      return normalized.id;
    }
    updateElement(id, patch, shouldRender = true) {
      const index = this.elements.findIndex((element) => element.id === id);
      if (index === -1) return this;
      this.elements[index] = normalizeElement({ ...this.elements[index], ...patch }, index);
      this.markDirty();
      if (shouldRender) this.render();
      return this;
    }
    removeElement(id, shouldRender = true) {
      this.elements = this.elements.filter((element) => element.id !== id);
      this.markDirty();
      if (shouldRender) this.render();
      return this;
    }
    setMaterial(material, shouldRender = true) {
      if (typeof material === "string") {
        throw new TypeError("Liquid Glass V2 does not convert V1 preset names. Pass a V2 material object.");
      }
      this.material = makeMaterialV2({ ...this.material, ...material || {} });
      this.markDirty();
      if (shouldRender) this.render();
      return this;
    }
    setWallpapers(images2, shouldRender = true) {
      this.backdrops = images2.slice();
      this.renderer.setWallpapers(images2, { update: "static" });
      this.markBackdropDirty();
      if (shouldRender) this.render();
      return this;
    }
    async loadWallpapers(sources, shouldRender = true) {
      const images2 = await Promise.all(sources.map(resolveImage));
      return this.setWallpapers(images2, shouldRender);
    }
    async setWallpaper(source, shouldRender = true) {
      return this.loadWallpapers([source], shouldRender);
    }
    setBackdrop(source, options = {}) {
      if (!source || typeof source === "string") {
        throw new TypeError("setBackdrop needs a CanvasImageSource. Use loadBackdrop for a URL.");
      }
      const update = resolveBackdropUpdate(source, options.update);
      this.backdrops = [source];
      this.renderer.setWallpapers([source], { update });
      this.wallpaperIndex = 0;
      this.markBackdropDirty();
      if (options.autoStart ?? update === "live") this.start();
      if (options.shouldRender ?? true) this.render();
      return this;
    }
    async loadBackdrop(source, options = {}) {
      const image = await resolveImage(source);
      return this.setBackdrop(image, { ...options, update: options.update ?? "static" });
    }
    updateBackdrop(shouldRender = true) {
      this.renderer.refreshWallpapers(true);
      const now2 = globalThis.performance?.now?.() ?? Date.now();
      const consecutive = now2 - this.lastManualBackdropUpdate < LIGHT_PROBE_INTERVAL_MS;
      this.lastManualBackdropUpdate = now2;
      if (consecutive && this.lightProbeWorker()) {
        this.backdropDirty = true;
        this.lightFieldAsyncDirty = true;
        this.markDirty();
      } else {
        this.markBackdropDirty();
      }
      if (shouldRender) this.render();
      return this;
    }
    setWallpaperIndex(index, shouldRender = true) {
      this.wallpaperIndex = Math.max(0, Math.floor(index));
      this.markBackdropDirty();
      if (shouldRender) this.render();
      return this;
    }
    distanceAt(x, y) {
      return distanceToElementsV2(x, y, this.elements, this.material);
    }
    hitTest(x, y, options = {}) {
      return hitTestElementsV2(x, y, this.elements, this.material, options);
    }
    pointerPosition(event) {
      const rect = this.canvas.getBoundingClientRect();
      const source = event.touches?.[0] ?? event.changedTouches?.[0] ?? event;
      return { x: source.clientX - rect.left, y: source.clientY - rect.top };
    }
    hitTestEvent(event, options = {}) {
      const { x, y } = this.pointerPosition(event);
      const tolerance = options.tolerance ?? (event.pointerType && event.pointerType !== "mouse" ? 8 : 0);
      return this.hitTest(x, y, { ...options, tolerance });
    }
    start() {
      if (this.running) return this;
      if (typeof globalThis.requestAnimationFrame !== "function") {
        throw new Error("LiquidGlassWebGLV2.start() requires requestAnimationFrame.");
      }
      this.running = true;
      const tick2 = () => {
        if (!this.running) return;
        this.render();
        this.animationFrame = globalThis.requestAnimationFrame(tick2);
      };
      this.animationFrame = globalThis.requestAnimationFrame(tick2);
      return this;
    }
    stop() {
      this.running = false;
      if (this.animationFrame && typeof globalThis.cancelAnimationFrame === "function") {
        globalThis.cancelAnimationFrame(this.animationFrame);
      }
      this.animationFrame = 0;
      return this;
    }
    resize(width = this.canvas.clientWidth || this.canvas.width || 1, height = this.canvas.clientHeight || this.canvas.height || 1, dpr = Math.min(globalThis.devicePixelRatio || 1, 2)) {
      this.renderer.resize(Math.round(width * dpr), Math.round(height * dpr));
      return { width, height, dpr };
    }
    updateLightField() {
      this.lightFieldDirty = false;
      this.lightProbeId += 1;
      this.lightProbeQueued = false;
      const source = this.backdrops[this.wallpaperIndex];
      const [sourceWidth, sourceHeight] = backdropSize(source);
      if (!(sourceWidth > 0) || !(sourceHeight > 0) || typeof document === "undefined") {
        this.lightPixels = null;
        return;
      }
      if (!this.lightCanvas) this.lightCanvas = document.createElement("canvas");
      const size = this.lightSampleSize;
      this.lightCanvas.width = size;
      this.lightCanvas.height = size;
      const context = this.lightCanvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        this.lightPixels = null;
        return;
      }
      context.clearRect(0, 0, size, size);
      const rect = lightProbeRect(sourceWidth, sourceHeight, size, this.wallpaperZoom);
      try {
        context.drawImage(source, rect.x, rect.y, rect.width, rect.height);
        this.lightPixels = context.getImageData(0, 0, size, size).data;
      } catch {
        this.lightPixels = null;
      }
    }
    /** Lazily starts the light-probe worker; null when it is unavailable. */
    lightProbeWorker() {
      if (this.lightWorker || this.lightWorkerUnavailable) return this.lightWorker;
      if (typeof globalThis.Worker !== "function" || typeof globalThis.OffscreenCanvas !== "function" || typeof globalThis.createImageBitmap !== "function" || typeof globalThis.Blob !== "function" || typeof globalThis.URL?.createObjectURL !== "function") {
        this.lightWorkerUnavailable = true;
        return null;
      }
      let url = "";
      const revoke = () => {
        if (url) globalThis.URL.revokeObjectURL(url);
        url = "";
      };
      try {
        url = globalThis.URL.createObjectURL(new globalThis.Blob([LIGHT_PROBE_WORKER], { type: "text/javascript" }));
        this.lightWorker = new globalThis.Worker(url);
      } catch {
        revoke();
        this.lightWorkerUnavailable = true;
        return null;
      }
      const fallBackToMainThread = () => {
        this.lightWorker?.terminate();
        this.lightWorker = null;
        this.lightWorkerUnavailable = true;
        this.lightProbePending = false;
        this.lightFieldDirty = true;
        this.markDirty();
      };
      this.lightWorker.onerror = () => {
        revoke();
        fallBackToMainThread();
      };
      this.lightWorker.onmessage = ({ data }) => {
        revoke();
        this.lightProbePending = false;
        if (!data.pixels) {
          fallBackToMainThread();
          return;
        }
        if (data.id !== this.lightProbeId) return;
        this.lightPixels = data.pixels;
        this.markDirty();
        if (this.lightProbeQueued) {
          this.lightProbeQueued = false;
          this.requestLightField({ queue: true });
        }
        if (!this.renderer.hasLiveBackdrop()) this.scheduleSettledRender();
      };
      return this.lightWorker;
    }
    /**
     * Starts an off-main-thread light probe of the current backdrop. Returns
     * false when the caller should use the synchronous probe instead.
     */
    requestLightField({ queue = false } = {}) {
      if (this.lightProbePending) {
        if (queue) this.lightProbeQueued = true;
        return true;
      }
      const source = this.backdrops[this.wallpaperIndex];
      const [sourceWidth, sourceHeight] = backdropSize(source);
      if (!(sourceWidth > 0) || !(sourceHeight > 0) || !this.lightProbeWorker()) return false;
      const id = ++this.lightProbeId;
      const size = this.lightSampleSize;
      const rect = lightProbeRect(sourceWidth, sourceHeight, size, this.wallpaperZoom);
      this.lightProbePending = true;
      globalThis.createImageBitmap(source).then((bitmap) => {
        if (id !== this.lightProbeId || !this.lightWorker) {
          bitmap.close();
          if (id === this.lightProbeId) this.lightProbePending = false;
          return;
        }
        this.lightWorker.postMessage({ id, bitmap, size, ...rect }, [bitmap]);
      }, () => {
        if (id === this.lightProbeId) this.lightProbePending = false;
      });
      return true;
    }
    scheduleSettledRender() {
      if (this.settledRenderFrame || typeof globalThis.requestAnimationFrame !== "function") return;
      this.settledRenderFrame = globalThis.requestAnimationFrame(() => {
        this.settledRenderFrame = 0;
        if (this.dirty) this.render({ dpr: this.lastFrame.dpr || void 0 });
      });
    }
    sampleLuminance(x, y) {
      if (!this.lightPixels) return 0.5;
      const size = this.lightSampleSize;
      const px = Math.max(0, Math.min(size - 1, Math.round(x * (size - 1))));
      const py = Math.max(0, Math.min(size - 1, Math.round(y * (size - 1))));
      const index = (py * size + px) * 4;
      return (this.lightPixels[index] * 0.2126 + this.lightPixels[index + 1] * 0.7152 + this.lightPixels[index + 2] * 0.0722) / 255;
    }
    lightDirection(element, width, height, fallbackAngle) {
      const positions = [-0.34, 0, 0.34];
      let gradientX = 0;
      let gradientY = 0;
      for (const sampleY of positions) {
        for (const sampleX of positions) {
          const x = (element.x + element.w * (0.5 + sampleX)) / Math.max(width, 1);
          const y = (element.y + element.h * (0.5 + sampleY)) / Math.max(height, 1);
          const light = this.sampleLuminance(x, y);
          gradientX += sampleX * light;
          gradientY += sampleY * light;
        }
      }
      const radians = fallbackAngle * Math.PI / 180;
      const fallbackX = Math.cos(radians);
      const fallbackY = Math.sin(radians);
      const contrast = Math.hypot(gradientX, gradientY) / positions.length;
      if (contrast < 8e-3) return [fallbackX, fallbackY];
      const length = Math.hypot(gradientX, gradientY) || 1;
      const autoX = -gradientX / length;
      const autoY = gradientY / length;
      const rawStrength = Math.max(0, Math.min(1, (contrast - 0.015) / 0.13));
      const strength = rawStrength * rawStrength * (3 - 2 * rawStrength) * 0.58;
      const mixedX = fallbackX * (1 - strength) + autoX * strength;
      const mixedY = fallbackY * (1 - strength) + autoY * strength;
      const mixedLength = Math.hypot(mixedX, mixedY) || 1;
      return [mixedX / mixedLength, mixedY / mixedLength];
    }
    tintLightForElement(element, width, height) {
      if (element.tintTone === "light") return 1;
      if (element.tintTone === "dark") return 0;
      const positions = [-24, 0, 24];
      const centerX = element.x + element.w * 0.5;
      const centerY = element.y + element.h * 0.5;
      let luminance = 0;
      for (const sampleY of positions) {
        for (const sampleX of positions) {
          const x = (centerX + sampleX) / Math.max(width, 1);
          const y = (centerY + sampleY) / Math.max(height, 1);
          luminance += this.sampleLuminance(x, y);
        }
      }
      const average = luminance / (positions.length * positions.length);
      const t = Math.max(0, Math.min(1, (average - 0.22) / (0.5 - 0.22)));
      return t * t * (3 - 2 * t);
    }
    render(options = {}) {
      if (this.renderer.lost) return this;
      const width = this.canvas.clientWidth || this.canvas.width || 1;
      const height = this.canvas.clientHeight || this.canvas.height || 1;
      const requestedDpr = Number(options.dpr ?? globalThis.devicePixelRatio ?? 1);
      const dpr = Math.max(0.5, Math.min(Number.isFinite(requestedDpr) ? requestedDpr : 1, 2));
      const resized = width !== this.lastFrame.width || height !== this.lastFrame.height || dpr !== this.lastFrame.dpr;
      const liveBackdrop = this.renderer.hasLiveBackdrop();
      if (!options.force && !this.dirty && !resized && !liveBackdrop) return this;
      this.resize(width, height, dpr);
      const now2 = globalThis.performance?.now?.() ?? Date.now();
      if (this.backdropDirty || resized || liveBackdrop) {
        this.renderer.buildBackdrop(this.wallpaperIndex, this.wallpaperZoom);
        const refreshLiveLight = liveBackdrop && now2 - this.lastLightFieldUpdate >= LIGHT_PROBE_INTERVAL_MS;
        if (this.lightFieldDirty || resized) {
          this.updateLightField();
          this.lastLightFieldUpdate = now2;
        } else if (refreshLiveLight || this.lightFieldAsyncDirty) {
          const queue = this.lightFieldAsyncDirty;
          this.lightFieldAsyncDirty = false;
          if (!this.requestLightField({ queue })) this.updateLightField();
          this.lastLightFieldUpdate = now2;
        }
        this.backdropDirty = false;
      }
      if (this.compositeMode === "overlay") this.renderer.clearOutput();
      else this.renderer.drawBackdrop();
      const material = this.effectiveMaterial;
      const elements = this.elements.filter((element) => element.w > 0 && element.h > 0);
      const elapsed = this.lastLightBlendTime ? Math.min(100, now2 - this.lastLightBlendTime) : 100;
      const blend = liveBackdrop ? 1 - Math.exp(-elapsed / 280) : 1;
      const activeLightIds = new Set(elements.map((element) => element.id));
      for (const id of this.smoothedLightDirections.keys()) {
        if (!activeLightIds.has(id)) this.smoothedLightDirections.delete(id);
      }
      const lightDirections = elements.map((element) => {
        const target = this.lightDirection(element, width, height, material.lightAngle);
        const previous = this.smoothedLightDirections.get(element.id);
        if (!previous || blend >= 1) {
          this.smoothedLightDirections.set(element.id, target);
          return target;
        }
        const mixedX = previous[0] * (1 - blend) + target[0] * blend;
        const mixedY = previous[1] * (1 - blend) + target[1] * blend;
        const length = Math.hypot(mixedX, mixedY) || 1;
        const direction = [mixedX / length, mixedY / length];
        this.smoothedLightDirections.set(element.id, direction);
        return direction;
      });
      const tintLights = elements.map((element) => this.tintLightForElement(element, width, height));
      this.lastLightBlendTime = now2;
      if (elements.length > MAX_GLASS_SHAPES && !this.warnedShapeLimit) {
        this.warnedShapeLimit = true;
        console.warn(`LiquidGlassWebGLV2: more than ${MAX_GLASS_SHAPES} shapes require multiple passes; overlapping shapes across a pass boundary may composite differently.`);
      }
      for (let i = 0; i < elements.length; i += MAX_GLASS_SHAPES) {
        this.renderer.drawGlassV2Group(
          elements.slice(i, i + MAX_GLASS_SHAPES),
          material,
          dpr,
          lightDirections.slice(i, i + MAX_GLASS_SHAPES),
          tintLights.slice(i, i + MAX_GLASS_SHAPES)
        );
      }
      this.dirty = false;
      this.lastFrame = { width, height, dpr };
      return this;
    }
    destroy() {
      this.stop();
      this.lightProbeId += 1;
      if (this.settledRenderFrame && typeof globalThis.cancelAnimationFrame === "function") {
        globalThis.cancelAnimationFrame(this.settledRenderFrame);
      }
      this.settledRenderFrame = 0;
      this.lightWorker?.terminate();
      this.lightWorker = null;
      this.lightProbePending = false;
      this.canvas.removeEventListener("webglcontextlost", this.handleContextLost, false);
      this.canvas.removeEventListener("webglcontextrestored", this.handleContextRestored, false);
      this.reducedTransparencyQuery?.removeEventListener?.("change", this.handleReducedTransparencyChange);
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      this.renderer.destroy();
      this.elements = [];
      this.backdrops = [];
      this.lightPixels = null;
      this.lightCanvas = null;
      this.smoothedLightDirections.clear();
    }
  };

  // lib/src/src/frame-loop.js
  var clients = /* @__PURE__ */ new Set();
  var running = /* @__PURE__ */ new Map();
  var frame = 0;
  var wakeUntil = 0;
  var listening = false;
  var intersection = null;
  var epoch = 0;
  var layoutEpoch = () => epoch;
  function invalidateLayout() {
    epoch++;
    wake(34);
  }
  var now = () => globalThis.performance?.now?.() ?? Date.now();
  function request() {
    if (!frame && typeof globalThis.requestAnimationFrame === "function") {
      frame = globalThis.requestAnimationFrame(tick);
    }
  }
  function wake(ms = 0) {
    wakeUntil = Math.max(wakeUntil, now() + ms);
    request();
  }
  function animationsAffectClients() {
    for (const element of running.keys()) {
      if (!element.isConnected) running.delete(element);
    }
    return running.size > 0;
  }
  function tick() {
    frame = 0;
    const time = now();
    if (running.size) epoch++;
    const active = [];
    for (const client of clients) if (client.visible) active.push(client);
    for (const client of active) {
      try {
        client.measure(time);
      } catch (error) {
        console.error(error);
      }
    }
    let keepAlive = false;
    for (const client of active) {
      try {
        if (client.draw(time)) keepAlive = true;
      } catch (error) {
        console.error(error);
      }
    }
    if (keepAlive || time < wakeUntil || animationsAffectClients()) request();
  }
  function affectsClients(target) {
    if (!target || typeof target.contains !== "function") return false;
    for (const client of clients) {
      for (const element of client.trackedElements()) {
        if (target === element || target.contains(element)) return true;
      }
    }
    return false;
  }
  var onScroll = () => {
    epoch++;
    wake(160);
  };
  var onResize = () => {
    epoch++;
    clients.forEach((client) => client.onViewportResize?.());
    wake(320);
  };
  var onAnimationStart = (event) => {
    if (!affectsClients(event.target)) return;
    running.set(event.target, (running.get(event.target) ?? 0) + 1);
    request();
  };
  var onAnimationEnd = (event) => {
    const count = running.get(event.target);
    if (!count) return;
    if (count <= 1) running.delete(event.target);
    else running.set(event.target, count - 1);
    wake(34);
  };
  var onFontsLoaded = () => {
    epoch++;
    wake(200);
  };
  function listen() {
    if (listening || typeof globalThis.addEventListener !== "function") return;
    listening = true;
    const passive = { capture: true, passive: true };
    globalThis.addEventListener("scroll", onScroll, passive);
    globalThis.addEventListener("resize", onResize, { passive: true });
    for (const type of ["transitionrun", "animationstart"]) {
      document.addEventListener(type, onAnimationStart, true);
    }
    for (const type of ["transitionend", "transitioncancel", "animationend", "animationcancel"]) {
      document.addEventListener(type, onAnimationEnd, true);
    }
    document.fonts?.addEventListener?.("loadingdone", onFontsLoaded);
    if (typeof globalThis.IntersectionObserver === "function") {
      intersection = new globalThis.IntersectionObserver((entries) => {
        for (const entry of entries) {
          for (const client of clients) {
            if (client.element === entry.target) client.visible = entry.isIntersecting;
          }
        }
        wake(64);
      }, { rootMargin: "256px" });
    }
  }
  function unlisten() {
    if (!listening) return;
    listening = false;
    globalThis.removeEventListener("scroll", onScroll, true);
    globalThis.removeEventListener("resize", onResize);
    for (const type of ["transitionrun", "animationstart"]) {
      document.removeEventListener(type, onAnimationStart, true);
    }
    for (const type of ["transitionend", "transitioncancel", "animationend", "animationcancel"]) {
      document.removeEventListener(type, onAnimationEnd, true);
    }
    document.fonts?.removeEventListener?.("loadingdone", onFontsLoaded);
    intersection?.disconnect();
    intersection = null;
    running.clear();
    if (frame && typeof globalThis.cancelAnimationFrame === "function") globalThis.cancelAnimationFrame(frame);
    frame = 0;
  }
  function addClient(client) {
    clients.add(client);
    client.visible = true;
    listen();
    intersection?.observe(client.element);
    wake(120);
  }
  function removeClient(client) {
    if (!clients.delete(client)) return;
    intersection?.unobserve(client.element);
    if (!clients.size) unlisten();
  }
  function eachClient(callback) {
    clients.forEach(callback);
  }

  // lib/src/src/dom-backdrop.js
  var LAYER_ATTRIBUTE = "data-liquid-glass-layer";
  var IMAGE_URL = /(^(data|blob|https?):)|\/|\.(avif|webp|png|apng|jpe?g|gif|svg|bmp|ico)([?#]|$)/i;
  var MEDIA_TAGS = /* @__PURE__ */ new Set(["IMG", "VIDEO", "CANVAS"]);
  var isElement = (value) => typeof Element !== "undefined" && value instanceof Element;
  var images = /* @__PURE__ */ new Map();
  var assetListeners = /* @__PURE__ */ new Set();
  function onBackdropAsset(listener) {
    assetListeners.add(listener);
    return () => assetListeners.delete(listener);
  }
  function imageEntry(url) {
    let entry = images.get(url);
    if (entry) return entry;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    entry = { url, image, state: "loading" };
    entry.promise = new Promise((resolve) => {
      image.onload = () => {
        entry.state = "ready";
        resolve(entry);
        assetListeners.forEach((listener) => listener(entry));
      };
      image.onerror = () => {
        entry.state = "error";
        console.warn(`LiquidGlass: could not load backdrop image ${url} (a cross-origin image needs CORS headers).`);
        resolve(entry);
        assetListeners.forEach((listener) => listener(entry));
      };
    });
    image.src = url;
    images.set(url, entry);
    return entry;
  }
  function mediaSize(source) {
    if (!source) return [0, 0];
    const tag = source.tagName?.toUpperCase();
    if (tag === "IMG") return source.complete ? [source.naturalWidth, source.naturalHeight] : [0, 0];
    if (tag === "VIDEO") return source.readyState >= 2 ? [source.videoWidth, source.videoHeight] : [0, 0];
    return [
      Number(source.displayWidth ?? source.width ?? 0),
      Number(source.displayHeight ?? source.height ?? 0)
    ];
  }
  function splitTop(value, separator) {
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < value.length; i++) {
      const character = value[i];
      if (character === "(") depth++;
      else if (character === ")") depth--;
      else if (depth === 0 && (separator === " " ? /\s/.test(character) : character === separator)) {
        parts.push(value.slice(start, i));
        start = i + 1;
      }
    }
    parts.push(value.slice(start));
    return parts.map((part) => part.trim()).filter(Boolean);
  }
  function lengthPercent(token = "0%") {
    if (token === "left" || token === "top") return { ratio: 0, px: 0 };
    if (token === "center") return { ratio: 0.5, px: 0 };
    if (token === "right" || token === "bottom") return { ratio: 1, px: 0 };
    const result = { ratio: 0, px: 0 };
    const pattern = /([-+])?\s*(\d*\.?\d+(?:e[-+]?\d+)?)(%|px)?/gi;
    for (let match = pattern.exec(token); match; match = pattern.exec(token)) {
      const value = Number(match[2]) * (match[1] === "-" ? -1 : 1);
      if (match[3] === "%") result.ratio += value / 100;
      else result.px += value;
    }
    return result;
  }
  var resolveLength = ({ ratio, px }, extent) => ratio * extent + px;
  function parsePosition(value = "50% 50%") {
    const tokens = splitTop(value, " ");
    if (tokens.length === 1) tokens.push("50%");
    return [lengthPercent(tokens[0]), lengthPercent(tokens[1])];
  }
  function normalizePosition(position) {
    if (Array.isArray(position)) {
      return position.map((part) => typeof part === "number" ? { ratio: part, px: 0 } : lengthPercent(String(part)));
    }
    return parsePosition(position ?? "50% 50%");
  }
  function fitRect(sourceWidth, sourceHeight, box, fit = "cover", position = parsePosition()) {
    let width = box.width;
    let height = box.height;
    if (fit === "cover" || fit === "contain") {
      const scale = (fit === "cover" ? Math.max : Math.min)(box.width / sourceWidth, box.height / sourceHeight);
      width = sourceWidth * scale;
      height = sourceHeight * scale;
    } else if (fit === "none" || fit === "scale-down") {
      const scale = fit === "none" ? 1 : Math.min(1, box.width / sourceWidth, box.height / sourceHeight);
      width = sourceWidth * scale;
      height = sourceHeight * scale;
    }
    return {
      x: box.x + resolveLength(position[0], box.width - width),
      y: box.y + resolveLength(position[1], box.height - height),
      width,
      height
    };
  }
  var BLEND_MODES = /* @__PURE__ */ new Set([
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity"
  ]);
  function applyBlendMode(ctx, style) {
    if (BLEND_MODES.has(style.mixBlendMode)) ctx.globalCompositeOperation = style.mixBlendMode;
  }
  var transparentColor = (color) => !color || color === "transparent" || /^rgba\([^)]*,\s*0(\.0*)?\s*\)$/.test(color) || /\/\s*0(\.0*)?%?\s*\)$/.test(color);
  function borderRadii(style, box) {
    const read = (value, extent) => {
      const first = splitTop(value || "0", " ")[0];
      return Math.max(0, resolveLength(lengthPercent(first), extent));
    };
    return [
      read(style.borderTopLeftRadius, box.width),
      read(style.borderTopRightRadius, box.width),
      read(style.borderBottomRightRadius, box.width),
      read(style.borderBottomLeftRadius, box.width)
    ];
  }
  function clipBox(ctx, box, radii) {
    ctx.beginPath();
    if (radii?.some((radius) => radius > 0) && typeof ctx.roundRect === "function") {
      ctx.roundRect(box.x, box.y, box.width, box.height, radii);
    } else {
      ctx.rect(box.x, box.y, box.width, box.height);
    }
    ctx.clip();
  }
  var rectOf = (element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
  };
  var viewportBox = () => ({
    x: 0,
    y: 0,
    width: globalThis.innerWidth || document.documentElement.clientWidth,
    height: globalThis.innerHeight || document.documentElement.clientHeight
  });
  function contentBox(element, style) {
    const rect = rectOf(element);
    const scaleX = element.offsetWidth ? rect.width / element.offsetWidth : 1;
    const scaleY = element.offsetHeight ? rect.height / element.offsetHeight : 1;
    const left = (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.paddingLeft) || 0);
    const top = (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.paddingTop) || 0);
    const right = (parseFloat(style.borderRightWidth) || 0) + (parseFloat(style.paddingRight) || 0);
    const bottom = (parseFloat(style.borderBottomWidth) || 0) + (parseFloat(style.paddingBottom) || 0);
    return {
      x: rect.x + left * scaleX,
      y: rect.y + top * scaleY,
      width: Math.max(0, rect.width - (left + right) * scaleX),
      height: Math.max(0, rect.height - (top + bottom) * scaleY)
    };
  }
  function gradientStops(parts, lineLength) {
    const stops = [];
    for (const part of parts) {
      const tokens = splitTop(part, " ");
      const positions = [];
      while (tokens.length > 1 && /(%|px)$|^calc\(/.test(tokens[tokens.length - 1])) {
        positions.unshift(tokens.pop());
      }
      const color = tokens.join(" ");
      if (!positions.length) stops.push({ color, offset: null });
      for (const position of positions) {
        stops.push({ color, offset: resolveLength(lengthPercent(position), lineLength) / Math.max(lineLength, 1e-6) });
      }
    }
    if (!stops.length) return stops;
    if (stops[0].offset === null) stops[0].offset = 0;
    if (stops.at(-1).offset === null) stops.at(-1).offset = 1;
    for (let i = 1; i < stops.length; i++) {
      if (stops[i].offset !== null) {
        stops[i].offset = Math.max(stops[i].offset, stops[i - 1].offset);
        continue;
      }
      let next = i;
      while (stops[next].offset === null) next++;
      const from = stops[i - 1].offset;
      const to = Math.max(stops[next].offset, from);
      for (let j = i; j < next; j++) stops[j].offset = from + (to - from) * (j - i + 1) / (next - i + 1);
    }
    return stops;
  }
  function tileStops(stops) {
    if (stops.length < 2) return stops;
    const first = stops[0].offset;
    const period = stops.at(-1).offset - first;
    if (!(period > 5e-4)) return stops;
    const repeated = [];
    for (let i = Math.floor(-first / period); i <= Math.ceil((1 - first) / period); i++) {
      for (const stop of stops) {
        const offset = stop.offset + i * period;
        if (offset < -period || offset > 1 + period) continue;
        repeated.push({ color: stop.color, offset: Math.min(1, Math.max(0, offset)) });
      }
    }
    return repeated.length >= 2 ? repeated : stops;
  }
  function applyStops(gradient, stops) {
    for (const stop of stops) {
      try {
        gradient.addColorStop(Math.min(1, Math.max(0, stop.offset)), stop.color);
      } catch {
      }
    }
    return gradient;
  }
  function angleOf(token) {
    const match = /^(-?\d*\.?\d+)(deg|turn|rad|grad)$/.exec(token);
    if (!match) return null;
    const value = Number(match[1]);
    return { deg: value, turn: value * 360, rad: value * 180 / Math.PI, grad: value * 0.9 }[match[2]];
  }
  function paintLinearGradient(ctx, args, tile, repeating = false) {
    const parts = splitTop(args, ",");
    let angle = 180;
    const head = parts[0] ?? "";
    const explicit = angleOf(head);
    if (explicit !== null) {
      angle = explicit;
      parts.shift();
    } else if (/^to\s/.test(head)) {
      const words = head.slice(3).trim().split(/\s+/);
      const dx2 = words.includes("right") ? 1 : words.includes("left") ? -1 : 0;
      const dy2 = words.includes("bottom") ? 1 : words.includes("top") ? -1 : 0;
      const vx = dx2 && dy2 ? dx2 * tile.height : dx2;
      const vy = dx2 && dy2 ? dy2 * tile.width : dy2;
      angle = Math.atan2(vx, -vy) * 180 / Math.PI;
      parts.shift();
    } else if (/^in\s/.test(head)) {
      parts.shift();
    }
    const radians = angle * Math.PI / 180;
    const length = Math.abs(tile.width * Math.sin(radians)) + Math.abs(tile.height * Math.cos(radians));
    const cx = tile.x + tile.width / 2;
    const cy = tile.y + tile.height / 2;
    const dx = Math.sin(radians) * length / 2;
    const dy = -Math.cos(radians) * length / 2;
    const stops = gradientStops(parts, length);
    ctx.fillStyle = applyStops(
      ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy),
      repeating ? tileStops(stops) : stops
    );
    ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
  }
  function paintRadialGradient(ctx, args, tile, repeating = false) {
    const parts = splitTop(args, ",");
    const head = parts[0] ?? "";
    let circle = false;
    let size = "farthest-corner";
    let explicitSize = null;
    let position = parsePosition("50% 50%");
    const isStop = /^(rgb|hsl|hwb|lab|lch|oklab|oklch|color|#|transparent|currentcolor)/i.test(head) || !/(circle|ellipse|closest|farthest|at\s|\d(px|%))/.test(head);
    if (!isStop) {
      parts.shift();
      const [shapePart, positionPart] = head.split(/\s*\bat\b\s*/);
      if (positionPart) position = parsePosition(positionPart);
      for (const token of splitTop(shapePart ?? "", " ")) {
        if (token === "circle") circle = true;
        else if (token === "ellipse") circle = false;
        else if (/^(closest|farthest)-(side|corner)$/.test(token)) size = token;
        else if (/(px|%)$/.test(token)) (explicitSize ??= []).push(lengthPercent(token));
      }
      if (explicitSize?.length === 1) circle = true;
    }
    const cx = tile.x + resolveLength(position[0], tile.width);
    const cy = tile.y + resolveLength(position[1], tile.height);
    const left = cx - tile.x;
    const right = tile.x + tile.width - cx;
    const top = cy - tile.y;
    const bottom = tile.y + tile.height - cy;
    let rx;
    let ry;
    if (explicitSize) {
      rx = resolveLength(explicitSize[0], tile.width);
      ry = explicitSize[1] ? resolveLength(explicitSize[1], tile.height) : rx;
    } else {
      const pick = size.startsWith("closest") ? Math.min : Math.max;
      const sideX = pick(Math.abs(left), Math.abs(right));
      const sideY = pick(Math.abs(top), Math.abs(bottom));
      if (circle) {
        rx = size.endsWith("side") ? pick(sideX, sideY) : Math.hypot(sideX, sideY);
        ry = rx;
      } else {
        const scale = size.endsWith("corner") ? Math.SQRT2 : 1;
        rx = sideX * scale;
        ry = sideY * scale;
      }
    }
    rx = Math.max(rx, 1e-3);
    ry = Math.max(ry, 1e-3);
    ctx.save();
    ctx.beginPath();
    ctx.rect(tile.x, tile.y, tile.width, tile.height);
    ctx.clip();
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    const stops = gradientStops(parts, rx);
    ctx.fillStyle = applyStops(
      ctx.createRadialGradient(0, 0, 0, 0, 0, rx),
      repeating ? tileStops(stops) : stops
    );
    const reach = Math.max(tile.width, tile.height) * 2 + Math.abs(cx) + Math.abs(cy);
    ctx.fillRect(-reach, -reach * rx / ry, reach * 2, reach * 2 * rx / ry);
    ctx.restore();
  }
  function backgroundTileSize(sizeValue, box, intrinsic) {
    const [iw, ih] = intrinsic ?? [0, 0];
    const hasIntrinsic = iw > 0 && ih > 0;
    if (sizeValue === "cover" || sizeValue === "contain") {
      if (!hasIntrinsic) return [box.width, box.height];
      const scale = (sizeValue === "cover" ? Math.max : Math.min)(box.width / iw, box.height / ih);
      return [iw * scale, ih * scale];
    }
    const [wToken = "auto", hToken = "auto"] = splitTop(sizeValue || "auto", " ");
    let width = wToken === "auto" ? null : resolveLength(lengthPercent(wToken), box.width);
    let height = hToken === "auto" ? null : resolveLength(lengthPercent(hToken), box.height);
    if (width === null && height === null) {
      return hasIntrinsic ? [iw, ih] : [box.width, box.height];
    }
    if (width === null) width = hasIntrinsic ? height * iw / ih : box.width;
    if (height === null) height = hasIntrinsic ? width * ih / iw : box.height;
    return [width, height];
  }
  function paintBackgroundLayer(ctx, layer2, options, box, region) {
    const url = /^url\((['"]?)(.*)\1\)$/.exec(layer2);
    const gradient = /^(repeating-)?(linear|radial)-gradient\((.*)\)$/s.exec(layer2);
    if (!url && !gradient) return true;
    let entry = null;
    if (url) {
      entry = imageEntry(url[2]);
      if (entry.state !== "ready") return entry.state !== "loading";
    }
    const intrinsic = entry ? [entry.image.naturalWidth, entry.image.naturalHeight] : null;
    if (entry && !(intrinsic[0] > 0 && intrinsic[1] > 0)) return true;
    const positioning = options.attachment === "fixed" ? viewportBox() : box;
    const [tileWidth, tileHeight] = backgroundTileSize(options.size, positioning, intrinsic);
    if (!(tileWidth > 0.5 && tileHeight > 0.5)) return true;
    const position = parsePosition(options.position);
    const originX = positioning.x + resolveLength(position[0], positioning.width - tileWidth);
    const originY = positioning.y + resolveLength(position[1], positioning.height - tileHeight);
    const [repeatX, repeatY] = (() => {
      const tokens = splitTop(options.repeat || "repeat", " ");
      if (tokens[0] === "repeat-x") return [true, false];
      if (tokens[0] === "repeat-y") return [false, true];
      const x = tokens[0] !== "no-repeat";
      const y = (tokens[1] ?? tokens[0]) !== "no-repeat";
      return [x, y];
    })();
    const minX = Math.max(box.x, region.x);
    const maxX = Math.min(box.x + box.width, region.x + region.width);
    const minY = Math.max(box.y, region.y);
    const maxY = Math.min(box.y + box.height, region.y + region.height);
    if (minX >= maxX || minY >= maxY) return true;
    const firstX = repeatX ? originX + Math.floor((minX - originX) / tileWidth) * tileWidth : originX;
    const firstY = repeatY ? originY + Math.floor((minY - originY) / tileHeight) * tileHeight : originY;
    const lastX = repeatX ? maxX : originX + 1;
    const lastY = repeatY ? maxY : originY + 1;
    let tiles = 0;
    for (let y = firstY; y < lastY && tiles < 1024; y += tileHeight) {
      for (let x = firstX; x < lastX && tiles < 1024; x += tileWidth) {
        tiles++;
        const tile = { x, y, width: tileWidth, height: tileHeight };
        if (entry) ctx.drawImage(entry.image, x, y, tileWidth, tileHeight);
        else if (gradient[2] === "linear") paintLinearGradient(ctx, gradient[3], tile, Boolean(gradient[1]));
        else paintRadialGradient(ctx, gradient[3], tile, Boolean(gradient[1]));
      }
    }
    return true;
  }
  function paintCssBackground(ctx, element, region, { canvas = false } = {}) {
    const style = getComputedStyle(element);
    if (style.display === "none") return true;
    const box = rectOf(element);
    const opacity = canvas ? 1 : Number(style.opacity);
    if (!(opacity > 4e-3)) return true;
    const images2 = style.backgroundImage && style.backgroundImage !== "none" ? splitTop(style.backgroundImage, ",") : [];
    const color = style.backgroundColor;
    if (!images2.length && transparentColor(color)) return true;
    ctx.save();
    ctx.globalAlpha *= Number.isFinite(opacity) ? opacity : 1;
    if (!canvas) applyBlendMode(ctx, style);
    if (canvas) {
      ctx.beginPath();
      ctx.rect(region.x, region.y, region.width, region.height);
      ctx.clip();
    } else {
      clipBox(ctx, box, borderRadii(style, box));
    }
    if (!transparentColor(color)) {
      ctx.fillStyle = color;
      ctx.fillRect(region.x, region.y, region.width, region.height);
    }
    const list2 = (value) => splitTop(value || "", ",");
    const sizes = list2(style.backgroundSize);
    const positions = list2(style.backgroundPosition);
    const repeats = list2(style.backgroundRepeat);
    const attachments = list2(style.backgroundAttachment);
    const pick = (values, index, fallback) => values.length ? values[index % values.length] : fallback;
    let settled = true;
    for (let i = images2.length - 1; i >= 0; i--) {
      settled = paintBackgroundLayer(ctx, images2[i], {
        size: pick(sizes, i, "auto"),
        position: pick(positions, i, "0% 0%"),
        repeat: pick(repeats, i, "repeat"),
        attachment: pick(attachments, i, "scroll")
      }, canvas ? rectOf(document.documentElement) : box, region) && settled;
    }
    ctx.restore();
    return settled;
  }
  function drawSource(ctx, source, box, fit, position, region) {
    const [sourceWidth, sourceHeight] = mediaSize(source);
    if (!(sourceWidth > 0 && sourceHeight > 0) || !(box.width > 0 && box.height > 0)) return;
    if (box.x >= region.x + region.width || box.x + box.width <= region.x || box.y >= region.y + region.height || box.y + box.height <= region.y) return;
    const target = fitRect(sourceWidth, sourceHeight, box, fit, position);
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.clip();
    try {
      ctx.drawImage(source, target.x, target.y, target.width, target.height);
    } catch {
    }
    ctx.restore();
  }
  function paintMedia(ctx, layer2, region) {
    const { element } = layer2;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return;
    const opacity = Number(style.opacity);
    if (!(opacity > 4e-3)) return;
    ctx.save();
    ctx.globalAlpha *= Number.isFinite(opacity) ? opacity : 1;
    applyBlendMode(ctx, style);
    const box = layer2.anchor ? anchorBox(layer2.anchor) : contentBox(element, style);
    drawSource(
      ctx,
      element,
      box,
      layer2.fit ?? style.objectFit ?? "fill",
      layer2.position ?? parsePosition(style.objectPosition),
      region
    );
    ctx.restore();
  }
  function anchorBox(anchor) {
    if (anchor === "viewport" || anchor == null) return viewportBox();
    if (anchor === "document") return rectOf(document.documentElement);
    if (isElement(anchor)) return rectOf(anchor);
    return viewportBox();
  }
  function resolveString(value, { allowUrl = true } = {}) {
    let element = null;
    try {
      element = document.querySelector(value);
    } catch {
      element = null;
    }
    if (element) return element;
    if (allowUrl && IMAGE_URL.test(value)) return { url: value };
    return { missing: value };
  }
  function layerFromElement(element, extra = {}) {
    if (MEDIA_TAGS.has(element.tagName.toUpperCase())) return { kind: "media", element, ...extra };
    return { kind: "css", element };
  }
  function isDrawableSource(value) {
    return value && typeof value === "object" && !isElement(value) && ("width" in value || "displayWidth" in value) && !("source" in value);
  }
  function normalizeBackdrop(input) {
    if (input == null || input === "auto") return [{ kind: "auto" }];
    if (Array.isArray(input)) return input.flatMap((part) => normalizeBackdrop(part));
    if (typeof input === "function") return [{ kind: "paint", paint: input }];
    if (typeof input === "string") return [{ kind: "ref", ref: input }];
    if (isElement(input)) return [{ kind: "ref", ref: input }];
    if (isDrawableSource(input)) {
      return [{ kind: "source", source: input, fit: "cover", position: parsePosition(), anchor: "viewport" }];
    }
    if (typeof input === "object") {
      if (input.color && !input.source) return [{ kind: "color", color: input.color }];
      if (input.source != null) {
        return [{
          kind: "ref",
          ref: input.source,
          fit: input.fit,
          position: input.position == null ? void 0 : normalizePosition(input.position),
          anchor: input.anchor,
          opacity: input.opacity
        }];
      }
    }
    throw new TypeError("LiquidGlass: unsupported backdrop. Use an element, selector, image URL, canvas/video/image, painter function, or { source, fit, anchor }.");
  }
  function autoLayers(target) {
    const root = document.documentElement;
    const rootStyle = getComputedStyle(root);
    const rootPainted = rootStyle.backgroundImage !== "none" || !transparentColor(rootStyle.backgroundColor);
    return [
      { kind: "css", element: rootPainted || !document.body ? root : document.body, canvas: true },
      { kind: "page", host: target }
    ];
  }
  function resolveLayers(layers, target) {
    const resolved = [];
    for (const layer2 of layers) {
      if (layer2.kind === "auto") {
        resolved.push(...autoLayers(target));
        continue;
      }
      if (layer2.kind !== "ref") {
        resolved.push(layer2);
        continue;
      }
      let ref = layer2.ref;
      if (typeof ref === "string") {
        const found = resolveString(ref);
        if (found.missing) {
          resolved.push({ kind: "missing", ref });
          continue;
        }
        ref = found;
      }
      const extra = {
        ...layer2.fit ? { fit: layer2.fit } : {},
        ...layer2.position ? { position: layer2.position } : {},
        ...layer2.anchor != null ? { anchor: resolveAnchor(layer2.anchor) } : {},
        ...layer2.opacity != null ? { opacity: layer2.opacity } : {}
      };
      if (ref?.url) {
        resolved.push({
          kind: "source",
          entry: imageEntry(ref.url),
          fit: "cover",
          position: parsePosition(),
          anchor: "viewport",
          ...extra
        });
      } else if (isElement(ref) && ref.isConnected) {
        resolved.push(layerFromElement(ref, extra));
      } else if (isDrawableSource(ref) || isElement(ref) && MEDIA_TAGS.has(ref.tagName.toUpperCase())) {
        resolved.push({ kind: "source", source: ref, fit: "cover", position: parsePosition(), anchor: "viewport", ...extra });
      }
    }
    return resolved;
  }
  function resolveAnchor(anchor) {
    if (typeof anchor !== "string" || anchor === "viewport" || anchor === "document") return anchor;
    const found = resolveString(anchor, { allowUrl: false });
    return isElement(found) ? found : "viewport";
  }
  function canvasColor() {
    const scheme = getComputedStyle(document.documentElement).colorScheme || "";
    const dark = /dark/.test(scheme) && !/light/.test(scheme) || /dark/.test(scheme) && globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return dark ? "#121212" : "#ffffff";
  }
  function paintLayers(ctx, layers, region) {
    let settled = true;
    ctx.save();
    ctx.fillStyle = canvasColor();
    ctx.fillRect(region.x, region.y, region.width, region.height);
    for (const layer2 of layers) {
      ctx.save();
      try {
        if (layer2.opacity != null) ctx.globalAlpha *= layer2.opacity;
        switch (layer2.kind) {
          case "css":
            settled = paintCssBackground(ctx, layer2.element, region, { canvas: layer2.canvas }) && settled;
            break;
          case "media":
            paintMedia(ctx, layer2, region);
            break;
          case "source": {
            const source = layer2.entry ? layer2.entry.image : layer2.source;
            if (layer2.entry && layer2.entry.state !== "ready") {
              settled = settled && layer2.entry.state !== "loading";
              break;
            }
            drawSource(ctx, source, anchorBox(layer2.anchor), layer2.fit, layer2.position, region);
            break;
          }
          case "color":
            ctx.fillStyle = layer2.color;
            ctx.fillRect(region.x, region.y, region.width, region.height);
            break;
          case "paint":
            layer2.paint(ctx, { ...region });
            break;
          case "page":
            settled = paintPageContent(ctx, region, layer2.host) && settled;
            break;
          default:
            break;
        }
      } finally {
        ctx.restore();
      }
    }
    ctx.restore();
    return settled;
  }
  function paintElementBackdrop(context, layers, frame2, bleed, dpr) {
    const scaleX = frame2.width > 0 ? frame2.screenWidth / frame2.width : 1;
    const scaleY = frame2.height > 0 ? frame2.screenHeight / frame2.height : 1;
    context.setTransform(
      dpr / scaleX,
      0,
      0,
      dpr / scaleY,
      dpr * (bleed - frame2.x / scaleX),
      dpr * (bleed - frame2.y / scaleY)
    );
    return paintLayers(context, layers, {
      x: frame2.x - bleed * scaleX,
      y: frame2.y - bleed * scaleY,
      width: (frame2.width + bleed * 2) * scaleX,
      height: (frame2.height + bleed * 2) * scaleY
    });
  }
  function layersAreLive(layers) {
    return layers.some((layer2) => {
      if (layer2.kind === "page") return pageContentIsLive(layer2.host);
      const source = layer2.kind === "media" ? layer2.element : layer2.kind === "source" ? layer2.source : null;
      if (!source) return false;
      const tag = source.tagName?.toUpperCase();
      if (tag === "VIDEO") return !source.paused && !source.ended;
      if (tag === "CANVAS") return true;
      const name = source.constructor?.name;
      return name === "OffscreenCanvas" || name === "VideoFrame";
    });
  }
  function layerElements(layers) {
    return layers.flatMap((layer2) => {
      if (layer2.kind === "media" || layer2.kind === "css" && !layer2.canvas) return [layer2.element];
      return [];
    });
  }
  function missingLayers(layers) {
    return layers.filter((layer2) => layer2.kind === "missing").map((layer2) => layer2.ref);
  }

  // lib/src/src/dom-content.js
  var HOST_SELECTOR = "[data-liquid-glass], [data-liquid-glass-control]";
  var SKIP_TAGS = /* @__PURE__ */ new Set([
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "TEMPLATE",
    "HEAD",
    "META",
    "LINK",
    "TITLE",
    "BR",
    "WBR",
    "IFRAME",
    "OBJECT",
    "EMBED",
    "INPUT",
    "TEXTAREA",
    "SELECT",
    "OPTION",
    "BUTTON"
  ]);
  var MEDIA_TAGS2 = /* @__PURE__ */ new Set(["IMG", "VIDEO", "CANVAS"]);
  var XHTML = "http://www.w3.org/1999/xhtml";
  var BLOCK = -0.6;
  var INLINE = -0.4;
  var list = null;
  var dirty = true;
  var listening2 = false;
  var measureContext = null;
  var fontMetricsCache = /* @__PURE__ */ new Map();
  function compareKeys(a, b) {
    const depth = Math.min(a.length, b.length);
    for (let i = 0; i < depth; i++) {
      if (a[i][0] !== b[i][0]) return a[i][0] - b[i][0];
      if (a[i][1] !== b[i][1]) return a[i][1] - b[i][1];
    }
    return a.length - b.length;
  }
  var hasBackground = (style) => style.backgroundImage !== "none" || !transparentColor(style.backgroundColor);
  var hasBorder = (style) => ["Top", "Right", "Bottom", "Left"].some((side) => parseFloat(style[`border${side}Width`]) > 0 && style[`border${side}Style`] !== "none" && !transparentColor(style[`border${side}Color`]));
  function createsStackingContext(style, positioned) {
    return positioned && style.zIndex !== "auto" || style.position === "fixed" || style.position === "sticky" || Number(style.opacity) < 1 || style.transform !== "none" || style.filter !== "none" || style.isolation === "isolate" || style.mixBlendMode !== "normal" || style.backdropFilter && style.backdropFilter !== "none" || /paint|strict|content/.test(style.contain || "");
  }
  function fontOf(style) {
    const fontStyle = style.fontStyle.startsWith("oblique") ? "italic" : style.fontStyle;
    const caps = style.fontVariantCaps === "small-caps" ? "small-caps " : "";
    return `${fontStyle} ${caps}${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  }
  function fontMetrics(font, size) {
    let metrics = fontMetricsCache.get(font);
    if (metrics) return metrics;
    measureContext ??= document.createElement("canvas").getContext("2d");
    measureContext.font = font;
    const measured = measureContext.measureText("Hg");
    metrics = {
      ascent: measured.fontBoundingBoxAscent ?? size * 0.8,
      descent: measured.fontBoundingBoxDescent ?? size * 0.2
    };
    fontMetricsCache.set(font, metrics);
    return metrics;
  }
  function firstTextShadow(value) {
    if (!value || value === "none") return null;
    const tokens = splitTop(splitTop(value, ",")[0], " ");
    const color = tokens.find((token) => !/^-?[\d.]+(px)?$/.test(token));
    const lengths = tokens.filter((token) => /^-?[\d.]+(px)?$/.test(token)).map(parseFloat);
    if (!color || lengths.length < 2) return null;
    return { color, x: lengths[0], y: lengths[1], blur: lengths[2] ?? 0 };
  }
  function transformText(text, transform) {
    if (transform === "uppercase") return text.toUpperCase();
    if (transform === "lowercase") return text.toLowerCase();
    if (transform === "capitalize") return text.replace(/^\p{L}/u, (letter) => letter.toUpperCase());
    return text;
  }
  var intersects = (box, area) => box.x < area.x + area.width && box.x + box.width > area.x && box.y < area.y + area.height && box.y + box.height > area.y;
  function build() {
    const scrollX = globalThis.scrollX || 0;
    const scrollY = globalThis.scrollY || 0;
    const width = globalThis.innerWidth || document.documentElement.clientWidth;
    const height = globalThis.innerHeight || document.documentElement.clientHeight;
    const band = { x: -width * 0.5, y: -height, width: width * 2, height: height * 3 };
    const items = [];
    const hosts = /* @__PURE__ */ new Map();
    const range = document.createRange();
    let order = 0;
    const rootStyle = getComputedStyle(document.documentElement);
    const rootPainted = hasBackground(rootStyle);
    function textItem(node, style, key, alpha, fixed) {
      const data = node.data;
      if (!/\S/.test(data)) return;
      const fill = style.webkitTextFillColor || style.color;
      const strokeWidth = parseFloat(style.webkitTextStrokeWidth) || 0;
      if (transparentColor(fill) && !(strokeWidth > 0)) return;
      range.selectNodeContents(node);
      const whole = range.getBoundingClientRect();
      if (!whole.width || !intersects({ x: whole.left, y: whole.top, width: whole.width, height: whole.height }, band)) return;
      const offsetX = fixed ? 0 : scrollX;
      const offsetY = fixed ? 0 : scrollY;
      const words = [];
      const pushRect = (text, rect) => {
        if (rect.width > 0) {
          words.push({
            text: transformText(text, style.textTransform),
            x: rect.left + offsetX,
            y: rect.top + offsetY,
            width: rect.width,
            height: rect.height
          });
        }
      };
      const pattern = /\S+/g;
      for (let match = pattern.exec(data); match; match = pattern.exec(data)) {
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const rects = range.getClientRects();
        if (rects.length <= 1) {
          if (rects.length) pushRect(match[0], rects[0]);
          continue;
        }
        let run = "";
        let runRect = null;
        for (let i = 0; i < match[0].length; i++) {
          range.setStart(node, match.index + i);
          range.setEnd(node, match.index + i + 1);
          const rect = range.getBoundingClientRect();
          if (runRect && Math.abs(rect.top - runRect.top) > 1) {
            pushRect(run, runRect);
            run = "";
            runRect = null;
          }
          run += match[0][i];
          runRect = runRect ? { left: runRect.left, top: runRect.top, width: rect.right - runRect.left, height: runRect.height } : { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
        }
        if (runRect) pushRect(run, runRect);
      }
      if (!words.length) return;
      items.push({
        type: "text",
        key,
        fixed,
        alpha,
        words,
        box: { x: whole.left + offsetX, y: whole.top + offsetY, width: whole.width, height: whole.height },
        font: fontOf(style),
        size: parseFloat(style.fontSize) || 16,
        fill: transparentColor(fill) ? null : fill,
        stroke: strokeWidth > 0 ? { width: strokeWidth, color: style.webkitTextStrokeColor } : null,
        letterSpacing: style.letterSpacing !== "normal" ? style.letterSpacing : "",
        shadow: firstTextShadow(style.textShadow)
      });
    }
    function visit(element, path, alpha, fixed, paintSelf = true) {
      if (element.namespaceURI !== XHTML) return;
      const tag = element.tagName.toUpperCase();
      if (SKIP_TAGS.has(tag)) return;
      const style = getComputedStyle(element);
      if (style.display === "none" || style.display === "contents" && !element.childNodes.length) return;
      const positioned = style.position !== "static";
      const context = createsStackingContext(style, positioned);
      const zIndex = Number.parseInt(style.zIndex, 10);
      const level = positioned && Number.isFinite(zIndex) ? zIndex : positioned || context ? 0 : style.display.startsWith("inline") ? INLINE : BLOCK;
      const key = [...path, [level, order++]];
      const isFixed = fixed || style.position === "fixed";
      if (element.matches(HOST_SELECTOR)) {
        hosts.set(element, key);
        if (element.getAttribute("data-liquid-glass") !== "fallback") paintSelf = false;
      }
      const opacity = Number(style.opacity);
      const childAlpha = alpha * (Number.isFinite(opacity) ? opacity : 1);
      const visible = style.visibility === "visible" && childAlpha > 4e-3;
      const media = MEDIA_TAGS2.has(tag);
      if (paintSelf && visible && (media || hasBackground(style) || hasBorder(style))) {
        const rect = element.getBoundingClientRect();
        if (rect.width && rect.height) {
          items.push({
            type: media ? "media" : "box",
            element,
            key,
            fixed: isFixed,
            alpha,
            box: {
              x: rect.left + (isFixed ? 0 : scrollX),
              y: rect.top + (isFixed ? 0 : scrollY),
              width: rect.width,
              height: rect.height
            }
          });
        }
      }
      if (media) return;
      const childPath = context || positioned ? key : path;
      for (const child of element.childNodes) {
        if (child.nodeType === 1) {
          visit(child, childPath, childAlpha, isFixed);
        } else if (child.nodeType === 3 && visible) {
          textItem(child, style, [...childPath, [INLINE, order++]], childAlpha, isFixed);
        }
      }
    }
    if (document.body) visit(document.body, [], 1, false, rootPainted);
    items.sort((a, b) => compareKeys(a.key, b.key));
    return { items, hosts, scrollX, scrollY, width, height };
  }
  function current() {
    const width = globalThis.innerWidth || 0;
    const height = globalThis.innerHeight || 0;
    const drifted = list && (Math.abs((globalThis.scrollY || 0) - list.scrollY) > height * 0.5 || Math.abs((globalThis.scrollX || 0) - list.scrollX) > width * 0.25 || width !== list.width || height !== list.height);
    if (!list || dirty || drifted) {
      list = build();
      dirty = false;
    }
    return list;
  }
  function invalidate() {
    if (dirty) return;
    dirty = true;
    invalidateLayout();
  }
  function listen2() {
    if (listening2 || typeof document === "undefined") return;
    listening2 = true;
    if (typeof MutationObserver === "function") {
      new MutationObserver((records) => {
        for (const record of records) {
          const node = record.target.nodeType === 1 ? record.target : record.target.parentElement;
          if (!node || record.type === "attributes" && node.closest(`[${LAYER_ATTRIBUTE}]`)) continue;
          invalidate();
          return;
        }
      }).observe(document.documentElement, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["style", "class", "hidden", "src", "open"]
      });
    }
    globalThis.addEventListener("scroll", (event) => {
      if (event.target !== document && event.target !== document.documentElement) invalidate();
    }, { capture: true, passive: true });
    globalThis.addEventListener("resize", invalidate, { passive: true });
    for (const type of ["transitionend", "transitioncancel", "animationend", "load"]) {
      document.addEventListener(type, invalidate, true);
    }
    const fontsChanged = () => {
      fontMetricsCache.clear();
      invalidate();
    };
    document.fonts?.addEventListener?.("loadingdone", fontsChanged);
    document.fonts?.ready?.then(fontsChanged);
  }
  function paintText(context, item, offsetX, offsetY, region) {
    const { ascent, descent } = fontMetrics(item.font, item.size);
    context.font = item.font;
    context.textBaseline = "alphabetic";
    context.textAlign = "left";
    if (item.letterSpacing && "letterSpacing" in context) context.letterSpacing = item.letterSpacing;
    if (item.shadow) {
      context.shadowColor = item.shadow.color;
      context.shadowOffsetX = item.shadow.x;
      context.shadowOffsetY = item.shadow.y;
      context.shadowBlur = item.shadow.blur;
    }
    if (item.fill) context.fillStyle = item.fill;
    if (item.stroke) {
      context.strokeStyle = item.stroke.color;
      context.lineWidth = item.stroke.width;
    }
    const right = region.x + region.width;
    const bottom = region.y + region.height;
    for (const word of item.words) {
      const x = word.x + offsetX;
      const top = word.y + offsetY;
      if (x > right || x + word.width < region.x || top > bottom || top + word.height < region.y) continue;
      const y = top + (word.height - (ascent + descent)) / 2 + ascent;
      if (item.fill) context.fillText(word.text, x, y);
      if (item.stroke) context.strokeText(word.text, x, y);
    }
  }
  function itemsBelow(host) {
    let state = current();
    let hostKey = state.hosts.get(host);
    if (!hostKey) {
      dirty = true;
      state = current();
      hostKey = state.hosts.get(host);
    }
    if (!hostKey) return { state, end: 0 };
    let low = 0;
    let high = state.items.length;
    while (low < high) {
      const middle = low + high >> 1;
      if (compareKeys(state.items[middle].key, hostKey) < 0) low = middle + 1;
      else high = middle;
    }
    return { state, end: low };
  }
  function paintPageContent(context, region, host) {
    listen2();
    const { state, end } = itemsBelow(host);
    const scrollX = globalThis.scrollX || 0;
    const scrollY = globalThis.scrollY || 0;
    let settled = true;
    for (let i = 0; i < end; i++) {
      const item = state.items[i];
      const offsetX = item.fixed ? 0 : -scrollX;
      const offsetY = item.fixed ? 0 : -scrollY;
      if (!intersects({ ...item.box, x: item.box.x + offsetX, y: item.box.y + offsetY }, region)) continue;
      context.save();
      context.globalAlpha *= item.alpha;
      try {
        if (item.type === "text") {
          paintText(context, item, offsetX, offsetY, region);
        } else if (item.type === "media") {
          paintMedia(context, { element: item.element }, region);
        } else {
          settled = paintCssBackground(context, item.element, region) && settled;
          paintBorder(context, item.element);
        }
      } finally {
        context.restore();
      }
    }
    return settled;
  }
  function paintBorder(context, element) {
    const style = getComputedStyle(element);
    const width = parseFloat(style.borderTopWidth) || 0;
    if (!(width > 0) || style.borderTopStyle === "none" || transparentColor(style.borderTopColor)) return;
    const rect = element.getBoundingClientRect();
    const radius = Math.max(0, (parseFloat(style.borderTopLeftRadius) || 0) - width / 2);
    context.save();
    context.globalAlpha *= Number(style.opacity) || 1;
    context.strokeStyle = style.borderTopColor;
    context.lineWidth = width;
    context.beginPath();
    const x = rect.left + width / 2;
    const y = rect.top + width / 2;
    const w = Math.max(0, rect.width - width);
    const h = Math.max(0, rect.height - width);
    if (radius > 0 && typeof context.roundRect === "function") context.roundRect(x, y, w, h, Math.min(radius, w / 2, h / 2));
    else context.rect(x, y, w, h);
    context.stroke();
    context.restore();
  }
  function pageContentIsLive(host) {
    if (!list) return false;
    const { state, end } = itemsBelow(host);
    const rect = host.getBoundingClientRect();
    const near = { x: rect.left - 96, y: rect.top - 96, width: rect.width + 192, height: rect.height + 192 };
    const scrollX = globalThis.scrollX || 0;
    const scrollY = globalThis.scrollY || 0;
    for (let i = 0; i < end; i++) {
      const { type, element, box, fixed } = state.items[i];
      if (type !== "media") continue;
      if (!intersects({ ...box, x: box.x - (fixed ? 0 : scrollX), y: box.y - (fixed ? 0 : scrollY) }, near)) continue;
      if (element.tagName === "CANVAS") return true;
      if (element.tagName === "VIDEO" && !element.paused && !element.ended) return true;
    }
    return false;
  }
  function invalidatePageContent() {
    invalidate();
  }

  // lib/src/src/dom.js
  var instances = /* @__PURE__ */ new WeakMap();
  var VOID_TAGS = /* @__PURE__ */ new Set(["IMG", "INPUT", "TEXTAREA", "SELECT", "VIDEO", "CANVAS", "IFRAME", "BR", "HR"]);
  var MEDIA_EVENTS = ["load", "loadeddata", "play", "playing", "pause", "seeked", "resize"];
  var supportCache = null;
  function webgl2Supported() {
    if (supportCache === null) supportCache = LiquidGlassWebGLV2.isSupported();
    return supportCache;
  }
  function releaseGlass(glass) {
    if (!glass) return;
    const gl = glass.renderer?.gl;
    glass.destroy();
    gl?.getExtension?.("WEBGL_lose_context")?.loseContext();
  }
  function watchStyles(elements, onChange) {
    if (typeof MutationObserver !== "function") return null;
    const observer = new MutationObserver(onChange);
    const seen = /* @__PURE__ */ new Set();
    for (const start of elements) {
      for (let node = start; node?.nodeType === 1 && !seen.has(node); node = node.parentElement) {
        seen.add(node);
        observer.observe(node, { attributes: true, attributeFilter: ["style", "class"] });
      }
    }
    return observer;
  }
  function resolveTarget(target, name) {
    const element = typeof target === "string" && typeof document !== "undefined" ? document.querySelector(target) : target;
    if (!isElement(element)) throw new TypeError(`${name}: no element matches ${String(target)}.`);
    return element;
  }
  function cssRadius(style, width, height) {
    const token = (style.borderTopLeftRadius || "0").split(/\s+/)[0];
    const value = parseFloat(token) || 0;
    return token.endsWith("%") ? Math.min(width, height) * value / 100 : value;
  }
  function shapeOf(style, width, height, spec) {
    if (spec.shape && spec.shape !== "auto") {
      return { shape: spec.shape, ...Number.isFinite(spec.radius) ? { radius: spec.radius } : {} };
    }
    const radius = Number.isFinite(spec.radius) ? spec.radius : cssRadius(style, width, height);
    const short = Math.min(width, height);
    if (radius >= short / 2 - 0.5) {
      return { shape: Math.abs(width - height) < 1 ? "circle" : "pill" };
    }
    return { shape: "rect", radius: Math.max(0, radius) };
  }
  var SURFACE_KEYS = ["tint", "tintTone", "frost", "opacity"];
  function surfaceProps(...sources) {
    const props = {};
    for (const source of sources) {
      for (const key of SURFACE_KEYS) if (source?.[key] != null) props[key] = source[key];
    }
    return props;
  }
  var LiquidGlass = class {
    /** Whether WebGL2 is available. Without it every instance uses its fallback. */
    static isSupported() {
      return webgl2Supported();
    }
    /** The instance mounted on an element, if any. */
    static from(target) {
      const element = typeof target === "string" ? document.querySelector(target) : target;
      return (element && instances.get(element)) ?? null;
    }
    /**
     * Re-measure and repaint every mounted surface on the next frame. Call it
     * after moving things with JavaScript the page does not announce (a WebGL
     * backdrop that just rendered, a canvas you drew into, a JS animation).
     */
    static refreshAll() {
      invalidatePageContent();
      eachClient((client) => client.refresh?.());
    }
    constructor(target, options = {}) {
      const element = resolveTarget(target, "LiquidGlass");
      if (VOID_TAGS.has(element.tagName.toUpperCase())) {
        throw new TypeError(`LiquidGlass: <${element.tagName.toLowerCase()}> cannot hold the glass layer. Wrap it in an element and pass that.`);
      }
      makeMaterialV2(options.material ?? {});
      instances.get(element)?.destroy();
      instances.set(element, this);
      this.element = element;
      this.options = { ...options };
      this.destroyed = false;
      this.visible = true;
      this.mode = "pending";
      this.glass = null;
      this.canvas = null;
      this.targets = [];
      this.layers = [];
      this.mediaListeners = [];
      this.restore = [];
      this.frame = null;
      this.sizeKey = "";
      this.positionKey = "";
      this.geometryKey = "";
      this.styleDirty = true;
      this.backdropDirty = true;
      this.elementsDirty = true;
      this.warnedMissing = "";
      this.ready = new Promise((resolve) => {
        this.resolveReady = resolve;
      });
      if (!webgl2Supported()) {
        this.enterFallback();
        return;
      }
      this.buffer = document.createElement("canvas");
      this.bufferContext = this.buffer.getContext("2d", { alpha: false });
      this.mountCanvas();
      this.backdropSpec = normalizeBackdrop(options.backdrop);
      this.resolveTargets();
      this.resolveBackdrop();
      this.resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(() => this.refresh({ backdrop: false })) : null;
      this.observeSizes();
      this.unsubscribeAssets = onBackdropAsset(() => {
        this.backdropDirty = true;
        wake(34);
      });
      this.watchStyles();
      addClient(this);
    }
    /** False when this instance is showing its fallback instead of WebGL glass. */
    get supported() {
      return this.mode !== "fallback";
    }
    trackedElements() {
      return [this.element, ...this.targets.map((target) => target.element)];
    }
    setStyle(node, property, value) {
      this.restore.push([node, property, node.style[property]]);
      node.style[property] = value;
    }
    mountCanvas() {
      const { element } = this;
      const style = getComputedStyle(element);
      const setStyle = (property, value) => this.setStyle(element, property, value);
      if (style.position === "static") setStyle("position", "relative");
      if (style.isolation !== "isolate") setStyle("isolation", "isolate");
      const canvas = document.createElement("canvas");
      canvas.setAttribute(LAYER_ATTRIBUTE, "");
      canvas.setAttribute("aria-hidden", "true");
      Object.assign(canvas.style, {
        position: "absolute",
        left: "0px",
        top: "0px",
        width: "0px",
        height: "0px",
        margin: "0",
        padding: "0",
        border: "0",
        maxWidth: "none",
        maxHeight: "none",
        display: "block",
        pointerEvents: "none",
        zIndex: String(this.options.zIndex ?? -1),
        visibility: "hidden"
      });
      element.appendChild(canvas);
      this.canvas = canvas;
      element.setAttribute("data-liquid-glass", "pending");
    }
    resolveTargets() {
      const spec = this.options.targets;
      let list2 = [];
      if (typeof spec === "string") {
        list2 = [...this.element.querySelectorAll(spec)].map((element) => ({ element }));
      } else if (spec && typeof spec[Symbol.iterator] === "function") {
        list2 = [...spec].map((entry) => isElement(entry) ? { element: entry } : entry).filter((entry) => isElement(entry?.element));
      }
      this.targets = list2;
      this.mutationObserver?.disconnect();
      this.mutationObserver = null;
      if (typeof spec === "string" && typeof MutationObserver === "function") {
        this.mutationObserver = new MutationObserver(() => {
          this.resolveTargets();
          this.observeSizes();
          this.refresh({ backdrop: false });
        });
        this.mutationObserver.observe(this.element, { childList: true, subtree: true });
      }
    }
    observeSizes() {
      if (!this.resizeObserver) return;
      this.resizeObserver.disconnect();
      for (const element of this.trackedElements()) this.resizeObserver.observe(element);
    }
    watchStyles() {
      this.styleObserver?.disconnect();
      this.styleObserver = watchStyles([...this.trackedElements(), ...layerElements(this.layers)], () => {
        this.styleDirty = true;
        this.backdropDirty = true;
        wake(120);
      });
    }
    /** Large page backgrounds are re-detected when the viewport changes. */
    onViewportResize() {
      this.refresh();
    }
    resolveBackdrop() {
      for (const [element, listener2] of this.mediaListeners) {
        MEDIA_EVENTS.forEach((type) => element.removeEventListener(type, listener2));
      }
      this.mediaListeners = [];
      this.layers = resolveLayers(this.backdropSpec, this.element);
      const missing = missingLayers(this.layers).join(", ");
      if (missing && missing !== this.warnedMissing) {
        console.warn(`LiquidGlass: backdrop ${missing} matched no element and is not an image URL. Call refresh() once it exists.`);
      }
      this.warnedMissing = missing;
      const listener = () => {
        this.backdropDirty = true;
        wake(34);
      };
      for (const element of layerElements(this.layers)) {
        const tag = element.tagName.toUpperCase();
        if (tag !== "IMG" && tag !== "VIDEO") continue;
        MEDIA_EVENTS.forEach((type) => element.addEventListener(type, listener));
        this.mediaListeners.push([element, listener]);
      }
    }
    measure() {
      if (this.destroyed || this.mode === "fallback") return;
      const { element } = this;
      const rect = element.getBoundingClientRect();
      const frame2 = {
        x: rect.left,
        y: rect.top,
        screenWidth: rect.width,
        screenHeight: rect.height,
        width: element.offsetWidth ?? rect.width,
        height: element.offsetHeight ?? rect.height,
        borderLeft: element.clientLeft,
        borderTop: element.clientTop,
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop,
        targets: this.targets.map(({ element: target }) => {
          const box = target.getBoundingClientRect();
          return {
            x: box.left,
            y: box.top,
            width: target.offsetWidth ?? box.width,
            height: target.offsetHeight ?? box.height,
            screenWidth: box.width,
            screenHeight: box.height
          };
        })
      };
      if (this.styleDirty) {
        this.styles = [element, ...this.targets.map((target) => target.element)].map((node) => getComputedStyle(node)).map((style) => ({ borderTopLeftRadius: style.borderTopLeftRadius }));
        this.styleDirty = false;
        this.elementsDirty = true;
      }
      this.frame = frame2;
    }
    bleed() {
      if (Number.isFinite(this.options.bleed)) return Math.max(0, this.options.bleed);
      const material = this.glass?.material ?? makeMaterialV2(this.options.material ?? {});
      return Math.ceil(Math.min(96, 24 + material.refraction * 0.17 + material.backdropBlur * 2));
    }
    createGlass() {
      try {
        this.glass = new LiquidGlassWebGLV2(this.canvas, {
          compositeMode: "overlay",
          autoResize: false,
          autoStart: false,
          // Glass above this element draws this canvas into its backdrop,
          // possibly on a later frame than the one that rendered it.
          preserveDrawingBuffer: true,
          material: this.options.material,
          respectReducedTransparency: this.options.respectReducedTransparency ?? true,
          onContextLost: (event) => this.options.onContextLost?.(event),
          onContextRestored: (event) => {
            this.sizeKey = "";
            this.backdropDirty = true;
            this.elementsDirty = true;
            wake(64);
            this.options.onContextRestored?.(event);
          }
        });
      } catch (error) {
        console.warn("LiquidGlass: WebGL2 surface could not be created; using the fallback.", error);
        this.enterFallback();
        return false;
      }
      this.mode = "webgl";
      this.element.setAttribute("data-liquid-glass", "webgl");
      return true;
    }
    buildElements(frame2, bleed, scaleX, scaleY) {
      const own = surfaceProps(this.options);
      if (!this.targets.length) {
        return [{
          id: "surface",
          x: bleed,
          y: bleed,
          width: frame2.width,
          height: frame2.height,
          ...shapeOf(this.styles[0], frame2.width, frame2.height, this.options),
          ...own
        }];
      }
      return this.targets.slice(0, frame2.targets.length).map((target, index) => {
        const box = frame2.targets[index];
        const width = box.width || box.screenWidth / scaleX;
        const height = box.height || box.screenHeight / scaleY;
        return {
          id: `target-${index}`,
          x: (box.x - frame2.x) / scaleX + bleed,
          y: (box.y - frame2.y) / scaleY + bleed,
          width,
          height,
          ...shapeOf(this.styles[index + 1] ?? this.styles[0], width, height, { ...this.options, ...target }),
          ...surfaceProps(this.options, target)
        };
      }).filter((surface) => surface.width > 0 && surface.height > 0);
    }
    draw() {
      const frame2 = this.frame;
      if (!frame2 || this.destroyed || this.mode === "fallback") return false;
      if (!(frame2.width > 0 && frame2.height > 0 && frame2.screenWidth > 0 && frame2.screenHeight > 0)) {
        if (this.canvas.style.visibility !== "hidden") this.canvas.style.visibility = "hidden";
        return false;
      }
      if (!this.glass && !this.createGlass()) return false;
      const dpr = Math.max(0.5, Math.min(globalThis.devicePixelRatio || 1, this.options.maxDpr ?? 2));
      const bleed = this.bleed();
      const cssWidth = frame2.width + bleed * 2;
      const cssHeight = frame2.height + bleed * 2;
      const sizeKey = `${cssWidth}x${cssHeight}@${dpr}`;
      if (sizeKey !== this.sizeKey) {
        this.sizeKey = sizeKey;
        this.canvas.style.width = `${cssWidth}px`;
        this.canvas.style.height = `${cssHeight}px`;
        this.buffer.width = Math.max(1, Math.round(cssWidth * dpr));
        this.buffer.height = Math.max(1, Math.round(cssHeight * dpr));
        this.glass.setBackdrop(this.buffer, { update: "static", autoStart: false, shouldRender: false });
        this.backdropDirty = true;
        this.elementsDirty = true;
      }
      const positionKey = `${-bleed - frame2.borderLeft + frame2.scrollLeft},${-bleed - frame2.borderTop + frame2.scrollTop}`;
      if (positionKey !== this.positionKey) {
        this.positionKey = positionKey;
        const [left, top] = positionKey.split(",");
        this.canvas.style.left = `${left}px`;
        this.canvas.style.top = `${top}px`;
      }
      const scaleX = frame2.screenWidth / frame2.width;
      const scaleY = frame2.screenHeight / frame2.height;
      const geometryKey = [
        frame2.x,
        frame2.y,
        frame2.screenWidth,
        frame2.screenHeight,
        ...frame2.targets.flatMap((box) => [box.x, box.y, box.screenWidth, box.screenHeight])
      ].map((value) => Math.round(value * 64)).join(",");
      if (geometryKey !== this.geometryKey) {
        this.geometryKey = geometryKey;
        this.backdropDirty = true;
        this.elementsDirty = true;
      }
      if (layoutEpoch() !== this.epoch) {
        this.epoch = layoutEpoch();
        this.backdropDirty = true;
      }
      const live = this.options.live === true || this.options.live !== false && layersAreLive(this.layers);
      let changed = false;
      let settled = this.settled ?? false;
      if (this.backdropDirty || live) {
        settled = paintElementBackdrop(this.bufferContext, this.layers, frame2, bleed, dpr);
        this.settled = settled;
        this.glass.updateBackdrop(false);
        this.backdropDirty = false;
        changed = true;
      }
      if (this.elementsDirty) {
        this.glass.setElements(this.buildElements(frame2, bleed, scaleX, scaleY), false);
        this.elementsDirty = false;
        changed = true;
      }
      if (changed || this.glass.dirty) {
        this.glass.render({ force: true, dpr });
        if (this.canvas.style.visibility) this.canvas.style.visibility = "";
        this.options.onRender?.(this);
      }
      if (settled && this.resolveReady) {
        this.resolveReady(this);
        this.resolveReady = null;
      }
      return live;
    }
    enterFallback() {
      this.mode = "fallback";
      releaseGlass(this.glass);
      this.glass = null;
      this.canvas?.remove();
      this.canvas = null;
      const { element } = this;
      element.setAttribute("data-liquid-glass", "fallback");
      const fallback = this.options.fallback ?? "css";
      if (typeof fallback === "function") {
        fallback(element);
      } else if (fallback === "css") {
        const spec = this.options.targets;
        const surfaces = typeof spec === "string" ? [...element.querySelectorAll(spec)] : spec ? [...spec].map((entry) => isElement(entry) ? entry : entry?.element).filter(isElement) : [element];
        const blur = Math.round(14 + (this.options.frost ?? 0) * 30);
        const tint = Math.min(1, this.options.tint ?? 0);
        for (const node of surfaces) {
          const style = getComputedStyle(node);
          if (!style.backdropFilter || style.backdropFilter === "none") {
            this.setStyle(node, "backdropFilter", `blur(${blur}px) saturate(1.6)`);
            this.setStyle(node, "webkitBackdropFilter", `blur(${blur}px) saturate(1.6)`);
          }
          if (transparentColor(style.backgroundColor)) {
            this.setStyle(node, "backgroundColor", this.options.tintTone === "dark" ? `rgba(20,21,26,${(0.28 + tint * 0.5).toFixed(3)})` : `rgba(255,255,255,${(0.14 + tint * 0.5).toFixed(3)})`);
          }
        }
      }
      this.resolveReady?.(this);
      this.resolveReady = null;
    }
    /** Re-read the element, its targets and the backdrop on the next frame. */
    refresh({ backdrop = true } = {}) {
      if (this.destroyed || this.mode === "fallback") return this;
      if (backdrop) {
        if (typeof this.options.targets === "string") this.resolveTargets();
        this.resolveBackdrop();
        this.observeSizes();
        this.watchStyles();
      }
      this.styleDirty = true;
      this.backdropDirty = true;
      this.elementsDirty = true;
      wake(64);
      return this;
    }
    /** Merge new options. Pass `material` as a partial V2 material. */
    update(options = {}) {
      if (this.destroyed) return this;
      if ("material" in options) makeMaterialV2({ ...this.options.material ?? {}, ...options.material ?? {} });
      this.options = {
        ...this.options,
        ...options,
        ..."material" in options ? { material: { ...this.options.material ?? {}, ...options.material ?? {} } } : {}
      };
      if (this.mode === "fallback") return this;
      if ("material" in options) this.glass?.setMaterial(options.material ?? {}, false);
      if ("zIndex" in options && this.canvas) this.canvas.style.zIndex = String(options.zIndex ?? -1);
      if ("backdrop" in options) this.backdropSpec = normalizeBackdrop(options.backdrop);
      if ("targets" in options) this.resolveTargets();
      this.sizeKey = "";
      return this.refresh();
    }
    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      removeClient(this);
      this.resizeObserver?.disconnect();
      this.mutationObserver?.disconnect();
      this.styleObserver?.disconnect();
      this.unsubscribeAssets?.();
      for (const [element, listener] of this.mediaListeners) {
        MEDIA_EVENTS.forEach((type) => element.removeEventListener(type, listener));
      }
      releaseGlass(this.glass);
      this.glass = null;
      this.canvas?.remove();
      this.canvas = null;
      for (const [node, property, value] of this.restore.reverse()) node.style[property] = value;
      this.element.removeAttribute("data-liquid-glass");
      if (instances.get(this.element) === this) instances.delete(this.element);
      this.resolveReady?.(this);
      this.resolveReady = null;
    }
  };

  // lib/src/src/controls.js
  var clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  var registry = /* @__PURE__ */ new WeakMap();
  var PRESSED_CONTROL_MATERIAL_V2 = Object.freeze({
    refraction: 17,
    edgeReach: 0.14,
    edgeWidth: 0.22,
    dispersion: 0,
    frost: 0,
    backdropBlur: 0,
    body: 0.72,
    absorption: 0.58,
    tint: 0
  });
  var DEFAULT_NAVIGATION_LENS = Object.freeze({
    outerWidth: 0.13,
    outerHeight: 1.24,
    innerLength: 0,
    innerHeight: 0.24
  });
  function getPressedControlMaterialV2(material = {}) {
    return { ...getDefaultMaterialV2(), ...material, ...PRESSED_CONTROL_MATERIAL_V2 };
  }
  var DEFAULT_SIZE = { navbar: [312, 72], switch: [84, 28] };
  var SWITCH_TRACK_ASPECT = 3;
  var RELEASE_MATERIAL_MS = 140;
  var RESTING_THUMB = Object.freeze({
    switch: { tint: 1.5, frost: 0.24, tintTone: "light" },
    navbar: { tint: 0.34, frost: 0.32, tintTone: "dark" }
  });
  function layer(tag, host, zIndex) {
    const node = document.createElement(tag);
    node.setAttribute(LAYER_ATTRIBUTE, "");
    node.setAttribute("aria-hidden", "true");
    Object.assign(node.style, {
      position: "absolute",
      left: "0px",
      top: "0px",
      margin: "0",
      padding: "0",
      border: "0",
      maxWidth: "none",
      maxHeight: "none",
      display: "block",
      pointerEvents: "none",
      zIndex: String(zIndex)
    });
    host?.appendChild(node);
    return node;
  }
  function roundRect(context, x, y, width, height, radius = height / 2) {
    context.beginPath();
    context.roundRect(x, y, width, height, Math.max(0, Math.min(radius, width / 2, height / 2)));
  }
  function pressureSpring(state, target, seconds, stiffness, damping) {
    state.velocity += (target - state.value) * stiffness * seconds;
    state.velocity *= Math.exp(-damping * seconds);
    state.value += state.velocity * seconds;
  }
  function normalizeItems(items) {
    const list2 = items ?? [
      { value: "first", label: "First" },
      { value: "second", label: "Second" }
    ];
    if (!Array.isArray(list2) || list2.length < 2) {
      throw new TypeError("LiquidGlassNavbar needs at least two items.");
    }
    return list2.map((item, index) => typeof item === "string" ? { value: item, label: item } : { value: item.value ?? String(index), label: item.label ?? String(item.value ?? index), icon: item.icon });
  }
  var LiquidGlassControl = class {
    constructor(target, options, kind) {
      const name = kind === "navbar" ? "LiquidGlassNavbar" : "LiquidGlassSwitch";
      const container = resolveTarget(target, name);
      makeMaterialV2(options?.material ?? {});
      registry.get(container)?.destroy();
      registry.set(container, this);
      this.container = container;
      this.element = container;
      this.options = { ...options ?? {} };
      this.kind = kind;
      this.destroyed = false;
      this.visible = true;
      this.items = kind === "navbar" ? normalizeItems(this.options.items) : null;
      const index = kind === "switch" ? this.options.checked ? 1 : 0 : this.indexOf(this.options.value);
      this.position = { value: index, velocity: 0 };
      this.positionTarget = index;
      this.amount = { value: 0, velocity: 0 };
      this.value = kind === "switch" ? Boolean(index) : this.items[index].value;
      this.material = { ...getDefaultMaterialV2(), ...this.options.material ?? {} };
      this.lens = { ...DEFAULT_NAVIGATION_LENS, ...this.options.lens ?? {} };
      this.dragging = false;
      this.animating = false;
      this.releasing = false;
      this.releaseMix = 1;
      this.releaseStartedAt = 0;
      this.activePointerId = null;
      this.lastTime = 0;
      this.frame = null;
      this.size = null;
      this.sizeKey = "";
      this.geometryKey = "";
      this.staticDirty = true;
      this.dirty = true;
      this.pressedShown = false;
      this.settled = false;
      this.settledWaiters = [];
      this.restore = [];
      this.ready = new Promise((resolve) => {
        this.settledWaiters.push(() => resolve(this));
      });
      this.setupContainer();
      this.supported = webgl2Supported();
      this.backdropCanvas = layer("canvas", null, 0);
      this.compositeCanvas = layer("canvas", null, 0);
      this.baseCanvas = kind === "navbar" ? layer("canvas", container, 0) : null;
      this.trackCanvas = layer("canvas", container, 1);
      this.pressCanvas = layer("canvas", container, 2);
      this.restCanvas = layer("canvas", container, 3);
      this.labelLayer = layer("div", container, 4);
      Object.assign(this.labelLayer.style, { inset: "0", width: "100%", height: "100%" });
      this.labelLayer.removeAttribute("aria-hidden");
      if (this.supported) {
        try {
          this.baseGlass = this.baseCanvas ? new LiquidGlassWebGLV2(this.baseCanvas, {
            material: this.material,
            compositeMode: "overlay",
            autoResize: false,
            preserveDrawingBuffer: true
          }) : null;
          this.pressGlass = new LiquidGlassWebGLV2(this.pressCanvas, {
            material: getPressedControlMaterialV2(this.material),
            compositeMode: "overlay",
            autoResize: false,
            preserveDrawingBuffer: true
          });
        } catch (error) {
          console.warn(`${name}: WebGL2 unavailable, drawing the flat fallback.`, error);
          releaseGlass(this.baseGlass);
          this.baseGlass = null;
          this.pressGlass = null;
          this.supported = false;
        }
      }
      container.setAttribute("data-liquid-glass", this.supported ? "webgl" : "fallback");
      this.onPointerDown = (event) => this.pointerDown(event);
      this.onPointerMove = (event) => this.pointerMove(event);
      this.onPointerEnd = (event) => this.pointerEnd(event);
      this.onKeyDown = (event) => this.keyDown(event);
      container.addEventListener("pointerdown", this.onPointerDown);
      container.addEventListener("pointermove", this.onPointerMove);
      container.addEventListener("pointerup", this.onPointerEnd);
      container.addEventListener("pointercancel", this.onPointerEnd);
      container.addEventListener("lostpointercapture", this.onPointerEnd);
      container.addEventListener("keydown", this.onKeyDown);
      this.onFocusChange = (event) => {
        if (event.type === "blur") this.pointerFocus = false;
        this.dirty = true;
        wake(34);
      };
      container.addEventListener("focus", this.onFocusChange);
      container.addEventListener("blur", this.onFocusChange);
      this.layers = resolveLayers(normalizeBackdrop(this.options.backdrop), container);
      this.unsubscribeAssets = onBackdropAsset(() => {
        this.staticDirty = true;
        wake(34);
      });
      this.resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(() => wake(64)) : null;
      this.resizeObserver?.observe(container);
      this.watchStyles();
      this.buildLabels();
      this.updateAccessibility();
      addClient(this);
    }
    static from(target) {
      const element = typeof target === "string" ? document.querySelector(target) : target;
      return (element && registry.get(element)) ?? null;
    }
    setupContainer() {
      const { container, kind } = this;
      const style = getComputedStyle(container);
      const setStyle = (property, value) => {
        this.restore.push([property, container.style[property]]);
        container.style[property] = value;
      };
      if (style.position === "static") setStyle("position", "relative");
      if (style.isolation !== "isolate") setStyle("isolation", "isolate");
      if (style.display === "inline") setStyle("display", "inline-block");
      const [defaultWidth, defaultHeight] = DEFAULT_SIZE[kind];
      const unsized = container.clientHeight === 0 && !container.style.height;
      if (this.options.width != null || unsized && !container.style.width) {
        setStyle("width", `${this.options.width ?? defaultWidth}px`);
      }
      if (this.options.height != null || unsized) {
        setStyle("height", `${this.options.height ?? defaultHeight}px`);
      }
      setStyle("touchAction", "none");
      setStyle("userSelect", "none");
      setStyle("webkitUserSelect", "none");
      setStyle("cursor", this.options.disabled ? "default" : "pointer");
      setStyle("outline", "none");
      this.originalAttributes = ["tabindex", "role", "aria-checked", "aria-label", "aria-disabled", "data-liquid-glass"].map((attribute) => [attribute, container.getAttribute(attribute)]);
      container.tabIndex = this.options.disabled ? -1 : container.tabIndex >= 0 ? container.tabIndex : 0;
      container.dataset.liquidGlassControl = kind;
    }
    trackedElements() {
      return [this.container];
    }
    watchStyles() {
      this.styleObserver?.disconnect();
      this.styleObserver = watchStyles([this.container, ...layerElements(this.layers)], () => {
        this.staticDirty = true;
        wake(120);
      });
    }
    onViewportResize() {
      this.refresh();
    }
    count() {
      return this.kind === "navbar" ? this.items.length : 2;
    }
    indexOf(value) {
      const index = this.items.findIndex((item) => item.value === value);
      return index < 0 ? 0 : index;
    }
    // ---- frame loop -------------------------------------------------------
    measure() {
      const rect = this.container.getBoundingClientRect();
      this.frame = {
        x: rect.left,
        y: rect.top,
        screenWidth: rect.width,
        screenHeight: rect.height,
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      };
    }
    draw(now2) {
      const { frame: frame2 } = this;
      if (!frame2 || this.destroyed || !(frame2.width > 0 && frame2.height > 0)) return false;
      const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
      const sizeKey = `${frame2.width}x${frame2.height}@${dpr}`;
      if (sizeKey !== this.sizeKey) {
        this.sizeKey = sizeKey;
        this.layout(frame2.width, frame2.height, dpr);
      }
      const geometryKey = [frame2.x, frame2.y, frame2.screenWidth, frame2.screenHeight].map((value) => Math.round(value * 64)).join(",");
      if (geometryKey !== this.geometryKey || layoutEpoch() !== this.epoch) {
        this.geometryKey = geometryKey;
        this.epoch = layoutEpoch();
        this.staticDirty = true;
      }
      const live = this.options.live === true || this.options.live !== false && this.supported && layersAreLive(this.layers);
      if (live) this.staticDirty = true;
      const animating = this.animating && this.step(now2);
      if (this.staticDirty || this.dirty) this.render();
      return animating || live;
    }
    layout(width, height, dpr) {
      const bleed = Math.ceil(36 + height * 0.5);
      this.size = { width, height, dpr, bleed };
      const cssWidth = width + bleed * 2;
      const cssHeight = height + bleed * 2;
      const pixelWidth = Math.max(1, Math.round(cssWidth * dpr));
      const pixelHeight = Math.max(1, Math.round(cssHeight * dpr));
      for (const canvas of [this.baseCanvas, this.trackCanvas, this.pressCanvas, this.restCanvas]) {
        if (!canvas) continue;
        Object.assign(canvas.style, {
          left: `${-bleed}px`,
          top: `${-bleed}px`,
          width: `${cssWidth}px`,
          height: `${cssHeight}px`
        });
      }
      for (const canvas of [this.backdropCanvas, this.compositeCanvas, this.trackCanvas, this.restCanvas]) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      let trackWidth = width;
      let trackHeight = height;
      if (this.kind === "switch") {
        if (width / height < SWITCH_TRACK_ASPECT) trackHeight = width / SWITCH_TRACK_ASPECT;
        else trackWidth = height * SWITCH_TRACK_ASPECT;
      }
      this.track = {
        x: bleed + (width - trackWidth) / 2,
        y: bleed + (height - trackHeight) / 2,
        w: trackWidth,
        h: trackHeight
      };
      this.baseGlass?.setBackdrop(this.backdropCanvas, { update: "static", autoStart: false, shouldRender: false });
      this.pressGlass?.setBackdrop(this.compositeCanvas, { update: "static", autoStart: false, shouldRender: false });
      this.staticDirty = true;
      this.dirty = true;
      this.buildLabels();
    }
    step(now2) {
      const seconds = clamp((now2 - this.lastTime) / 1e3, 1e-3, 0.034);
      this.lastTime = now2;
      const reduceMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const amountTarget = this.dragging ? 1 : 0;
      const last = this.count() - 1;
      if (reduceMotion) {
        this.amount.value = amountTarget;
        this.amount.velocity = 0;
        this.position.value = this.positionTarget;
        this.position.velocity = 0;
      } else {
        pressureSpring(this.amount, amountTarget, seconds, this.dragging ? 520 : 540, this.dragging ? 28 : 31);
        pressureSpring(this.position, this.positionTarget, seconds, this.dragging ? 420 : 360, this.dragging ? 31 : 27);
      }
      this.amount.value = clamp(this.amount.value, 0, 1.12);
      this.position.value = clamp(this.position.value, 0, last);
      if (this.releasing) {
        this.releaseMix = reduceMotion ? 1 : clamp((now2 - this.releaseStartedAt) / RELEASE_MATERIAL_MS);
      }
      const settled = Math.abs(this.amount.value - amountTarget) < 4e-3 && Math.abs(this.amount.velocity) < 0.018 && Math.abs(this.position.value - this.positionTarget) < 3e-3 && Math.abs(this.position.velocity) < 0.018 && (!this.releasing || this.releaseMix >= 1);
      if (settled) {
        this.amount.value = amountTarget;
        this.position.value = this.positionTarget;
        this.animating = this.dragging;
        if (!this.dragging) this.releasing = false;
      }
      this.dirty = true;
      return !settled || this.dragging;
    }
    startAnimation() {
      if (this.destroyed) return;
      if (!this.animating) {
        this.animating = true;
        this.lastTime = globalThis.performance?.now?.() ?? Date.now();
      }
      this.dirty = true;
      wake(34);
    }
    // ---- drawing ----------------------------------------------------------
    thumbGeometry(amount = this.amount.value) {
      const { track } = this;
      const inset = track.h * 0.08;
      const count = this.count();
      const progress = clamp(this.position.value / (count - 1));
      const restingWidth = this.kind === "navbar" ? (track.w - inset * 2) / count : track.w * 0.65;
      const restingHeight = track.h * 0.84;
      const travel = Math.max(0, track.w - restingWidth - inset * 2);
      const restingX = track.x + inset + travel * progress;
      const restingY = track.y + inset;
      let scaleX;
      let scaleY;
      if (this.kind === "navbar") {
        scaleX = 1 + amount * this.lens.outerWidth;
        scaleY = 1 + amount * Math.max(0, track.h * this.lens.outerHeight / restingHeight - 1);
      } else {
        scaleX = 1 + amount * 0.33;
        scaleY = 1 + amount;
      }
      const w = restingWidth * scaleX;
      const h = restingHeight * scaleY;
      const centeredX = restingX - (w - restingWidth) / 2;
      const overtravel = this.kind === "navbar" ? Math.max(0, (h - track.h) / 2) : track.h * 0.42;
      const anchoredX = track.x - overtravel + (track.w + overtravel * 2 - w) * progress;
      return {
        x: centeredX + (anchoredX - centeredX) * clamp(amount),
        y: restingY - (h - restingHeight) / 2,
        w,
        h
      };
    }
    context(canvas) {
      const context = canvas.getContext("2d");
      context.setTransform(this.size.dpr, 0, 0, this.size.dpr, 0, 0);
      return context;
    }
    drawBackdrop() {
      const context = this.backdropCanvas.getContext("2d");
      return paintElementBackdrop(context, this.layers, this.frame, this.size.bleed, this.size.dpr);
    }
    drawTrack() {
      const context = this.context(this.trackCanvas);
      context.clearRect(0, 0, this.trackCanvas.width, this.trackCanvas.height);
      if (this.kind === "navbar" && this.baseGlass) return;
      const { x, y, w, h } = this.track;
      context.save();
      roundRect(context, x, y, w, h);
      if (this.kind === "switch") {
        const gray = context.createLinearGradient(x, y, x + w, y + h);
        gray.addColorStop(0, "#c2c3c7");
        gray.addColorStop(1, "#a9abb0");
        context.fillStyle = gray;
        context.fill();
        roundRect(context, x, y, w, h);
        const progress = clamp(this.position.value);
        context.globalAlpha = progress * progress * (3 - 2 * progress);
        if (this.options.color) {
          context.fillStyle = this.options.color;
        } else {
          const green = context.createLinearGradient(x, y, x + w, y + h);
          green.addColorStop(0, "#34d86a");
          green.addColorStop(1, "#25c653");
          context.fillStyle = green;
        }
        context.fill();
      } else {
        const dark = this.darkTrack();
        context.fillStyle = dark ? "rgba(30,32,38,.72)" : "rgba(225,230,238,.72)";
        context.fill();
        context.strokeStyle = dark ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.5)";
        context.stroke();
      }
      context.restore();
    }
    renderBase() {
      if (!this.baseGlass) return;
      this.baseGlass.updateBackdrop(false);
      this.baseGlass.setElements([{
        id: "navbar-track",
        shape: "pill",
        ...this.track,
        tint: this.options.tint ?? 0.86,
        tintTone: this.options.tintTone ?? "light"
      }], false);
      this.baseGlass.render({ force: true, dpr: this.size.dpr });
    }
    composePressedBackdrop() {
      const context = this.compositeCanvas.getContext("2d");
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.drawImage(this.backdropCanvas, 0, 0);
      if (this.baseCanvas) context.drawImage(this.baseCanvas, 0, 0, this.compositeCanvas.width, this.compositeCanvas.height);
      context.drawImage(this.trackCanvas, 0, 0);
    }
    renderPressed(liquid) {
      if (!this.pressGlass) return;
      if (!liquid) {
        this.pressGlass.setElements([], false);
        this.pressGlass.render({ force: true, dpr: this.size.dpr });
        this.pressedShown = false;
        return;
      }
      const amount = clamp(this.amount.value);
      const materialAmount = this.releasing ? 1 - this.releaseMix : amount;
      const resting = RESTING_THUMB[this.kind];
      this.pressGlass.updateBackdrop(false);
      this.pressGlass.setElements([{
        id: `${this.kind}-pressed-thumb`,
        shape: "pill",
        ...this.thumbGeometry(),
        tint: resting.tint * (1 - materialAmount),
        frost: resting.frost * (1 - materialAmount),
        opacity: this.releasing ? 1 - this.releaseMix : 1,
        pressure: this.kind === "navbar" ? amount : 0,
        pressureAxes: this.kind === "navbar" ? [1 - this.lens.innerLength, 1 - this.lens.innerHeight] : [1, 1],
        tintTone: resting.tintTone
      }], false);
      this.pressGlass.render({ force: true, dpr: this.size.dpr });
      this.pressedShown = true;
    }
    drawRestingThumb(composed) {
      const context = this.context(this.restCanvas);
      context.clearRect(0, 0, this.restCanvas.width, this.restCanvas.height);
      const held = this.dragging;
      const active = this.supported && (held || this.releasing);
      const opacity = active ? held ? 0 : this.releaseMix : 1;
      if (opacity <= 1e-3) return;
      const thumb = this.thumbGeometry(active || !this.supported ? this.amount.value : 0);
      const radius = thumb.h / 2;
      context.save();
      context.globalAlpha = opacity;
      if (this.kind === "switch") {
        context.shadowColor = "rgba(0,0,0,.18)";
        context.shadowBlur = thumb.h * 0.16;
        context.shadowOffsetY = thumb.h * 0.045;
        roundRect(context, thumb.x, thumb.y, thumb.w, thumb.h, radius);
        const fill = context.createLinearGradient(thumb.x, thumb.y, thumb.x, thumb.y + thumb.h);
        fill.addColorStop(0, "rgba(255,255,255,.97)");
        fill.addColorStop(1, "rgba(238,239,242,.94)");
        context.fillStyle = fill;
        context.fill();
        context.shadowColor = "transparent";
        roundRect(context, thumb.x + 0.75, thumb.y + 0.75, thumb.w - 1.5, thumb.h - 1.5, radius - 0.75);
        context.strokeStyle = "rgba(83,85,91,.34)";
        context.lineWidth = 1.5;
        context.stroke();
      } else {
        const dark = this.darkTrack();
        context.shadowColor = "rgba(0,0,0,.055)";
        context.shadowBlur = thumb.h * 0.09;
        context.shadowOffsetY = thumb.h * 0.045;
        roundRect(context, thumb.x, thumb.y, thumb.w, thumb.h, radius);
        context.clip();
        if (composed && "filter" in context) {
          const { dpr } = this.size;
          const blur = Math.max(5, thumb.h * 0.105);
          const pad = blur * 2.5;
          const x = Math.max(0, thumb.x - pad);
          const y = Math.max(0, thumb.y - pad);
          const w = thumb.w + pad * 2;
          const h = thumb.h + pad * 2;
          context.filter = `blur(${blur}px)`;
          context.drawImage(this.compositeCanvas, x * dpr, y * dpr, w * dpr, h * dpr, x, y, w, h);
          context.filter = "none";
          context.globalCompositeOperation = "color";
          context.fillStyle = dark ? "rgba(46,48,54,.72)" : "rgba(148,150,155,.72)";
          context.fillRect(thumb.x, thumb.y, thumb.w, thumb.h);
          context.globalCompositeOperation = "source-over";
          context.fillStyle = dark ? "rgba(12,13,17,.42)" : "rgba(142,145,152,.24)";
        } else {
          const fill = context.createLinearGradient(thumb.x, thumb.y, thumb.x, thumb.y + thumb.h);
          fill.addColorStop(0, dark ? "rgba(62,64,72,.9)" : "rgba(174,178,186,.88)");
          fill.addColorStop(1, dark ? "rgba(42,44,50,.86)" : "rgba(145,149,158,.82)");
          context.fillStyle = fill;
        }
        context.fillRect(thumb.x, thumb.y, thumb.w, thumb.h);
      }
      context.restore();
    }
    /** Whether the navbar track reads as dark glass (`tintTone`, or measured for `auto`). */
    darkTrack() {
      const tone = this.options.tintTone ?? "light";
      if (tone !== "auto") return tone === "dark";
      const track = this.baseGlass?.elements[0];
      if (!track || !this.size) return false;
      const { width, height, bleed } = this.size;
      return this.baseGlass.tintLightForElement(track, width + bleed * 2, height + bleed * 2) < 0.5;
    }
    labelColor() {
      return this.options.labelColor ?? (this.darkTrack() ? "rgba(245,246,250,.95)" : "rgba(22,25,31,.9)");
    }
    drawFocusRing() {
      let visible;
      try {
        visible = this.container.matches(":focus-visible");
      } catch {
        visible = document.activeElement === this.container;
      }
      if (!visible || this.pointerFocus) return;
      const context = this.context(this.restCanvas);
      const { x, y, w, h } = this.track;
      context.save();
      roundRect(context, x - 3, y - 3, w + 6, h + 6);
      context.lineWidth = 2;
      context.strokeStyle = "rgba(10,132,255,.95)";
      context.stroke();
      context.restore();
    }
    render() {
      if (this.destroyed || !this.size || !this.frame) return this;
      if (this.staticDirty) {
        this.settled = this.supported ? this.drawBackdrop() : true;
        this.renderBase();
        if (this.kind === "navbar" && this.options.tintTone === "auto") {
          const color = this.labelColor();
          if (color !== this.appliedLabelColor) {
            this.appliedLabelColor = color;
            for (const label of this.labelLayer.children) label.style.color = color;
          }
        }
        this.staticDirty = false;
      }
      this.drawTrack();
      const liquid = this.dragging || this.releasing && this.releaseMix < 1;
      const composed = this.supported && (liquid || this.kind === "navbar");
      if (composed) this.composePressedBackdrop();
      if (liquid || this.pressedShown) this.renderPressed(liquid);
      this.drawRestingThumb(composed);
      this.drawFocusRing();
      this.updateAccessibility();
      this.dirty = false;
      if (this.settled && this.settledWaiters.length) {
        this.settledWaiters.splice(0).forEach((resolve) => resolve());
      }
      return this;
    }
    buildLabels() {
      this.labelLayer.replaceChildren();
      if (this.kind !== "navbar") return;
      const width = this.size?.width ?? this.container.offsetWidth;
      const height = this.size?.height ?? this.container.offsetHeight;
      const inset = height * 0.08;
      const slot = (width - inset * 2) / this.items.length;
      this.items.forEach((item, index) => {
        const label = document.createElement("span");
        label.dataset.index = String(index);
        label.setAttribute("role", "tab");
        label.textContent = `${item.icon ? `${item.icon}  ` : ""}${item.label}`;
        Object.assign(label.style, {
          position: "absolute",
          left: `${inset + slot * index}px`,
          top: "0px",
          width: `${slot}px`,
          height: `${height}px`,
          display: "grid",
          placeItems: "center",
          color: this.labelColor(),
          font: "inherit",
          fontSize: `${this.options.fontSize ?? Math.max(13, Math.min(17, height * 0.22))}px`,
          fontWeight: "600",
          lineHeight: "1",
          whiteSpace: "nowrap",
          pointerEvents: "none"
        });
        this.labelLayer.appendChild(label);
      });
    }
    updateAccessibility() {
      const { container } = this;
      if (this.kind === "switch") {
        container.setAttribute("role", "switch");
        container.setAttribute("aria-checked", String(Boolean(this.value)));
        container.setAttribute("aria-label", this.options.ariaLabel ?? container.getAttribute("aria-label") ?? "Liquid glass switch");
      } else {
        container.setAttribute("role", "tablist");
        container.setAttribute("aria-label", this.options.ariaLabel ?? container.getAttribute("aria-label") ?? "Liquid glass navigation");
        const selected = Math.round(this.positionTarget);
        for (const label of this.labelLayer.children) {
          label.setAttribute("aria-selected", String(Number(label.dataset.index) === selected));
        }
      }
    }
    // ---- input ------------------------------------------------------------
    localPoint(event) {
      const rect = this.container.getBoundingClientRect();
      const width = this.size?.width || rect.width || 1;
      const height = this.size?.height || rect.height || 1;
      return {
        x: (event.clientX - rect.left) * width / (rect.width || 1),
        y: (event.clientY - rect.top) * height / (rect.height || 1)
      };
    }
    progressForPointer(event) {
      const { x } = this.localPoint(event);
      const { track, size } = this;
      const thumb = this.thumbGeometry(0);
      const inset = track.h * 0.08;
      const travel = Math.max(1, track.w - thumb.w - inset * 2);
      return clamp((x + size.bleed - track.x - inset - thumb.w / 2) / travel) * (this.count() - 1);
    }
    pointerDown(event) {
      if (this.options.disabled || event.button !== 0 || !this.size) return;
      event.preventDefault();
      this.dragging = true;
      const start = Math.round(this.positionTarget);
      this.press = { x: event.clientX, y: event.clientY, moved: false, start };
      this.activePointerId = event.pointerId;
      this.releasing = false;
      this.releaseMix = 0;
      const progress = this.progressForPointer(event);
      this.positionTarget = this.kind === "switch" ? Math.round(progress) : progress;
      try {
        this.container.setPointerCapture?.(event.pointerId);
      } catch {
      }
      this.pointerFocus = true;
      this.container.focus({ preventScroll: true });
      this.startAnimation();
    }
    pointerMove(event) {
      if (!this.dragging || event.pointerId !== this.activePointerId) return;
      event.preventDefault();
      if (!this.press.moved) {
        if (Math.hypot(event.clientX - this.press.x, event.clientY - this.press.y) < 4) return;
        this.press.moved = true;
      }
      this.positionTarget = this.progressForPointer(event);
      this.startAnimation();
    }
    pointerEnd(event) {
      if (!this.dragging || event.pointerId !== this.activePointerId) return;
      event.preventDefault();
      this.dragging = false;
      const { start } = this.press ?? { start: Math.round(this.positionTarget) };
      if (event.type === "pointercancel") this.positionTarget = start;
      else this.positionTarget = Math.round(this.positionTarget);
      this.activePointerId = null;
      this.press = null;
      this.releasing = true;
      this.releaseMix = 0;
      this.releaseStartedAt = globalThis.performance?.now?.() ?? Date.now();
      this.commitValue(this.positionTarget);
      this.startAnimation();
    }
    keyDown(event) {
      if (this.pointerFocus) {
        this.pointerFocus = false;
        this.dirty = true;
        wake(34);
      }
      if (this.options.disabled) return;
      const last = this.count() - 1;
      const current2 = Math.round(this.positionTarget);
      let next = null;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, current2 - 1);
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(last, current2 + 1);
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = last;
      if (this.kind === "switch" && (event.key === " " || event.key === "Enter")) next = current2 ? 0 : 1;
      if (next === null) return;
      event.preventDefault();
      this.positionTarget = next;
      this.commitValue(next);
      this.startAnimation();
    }
    commitValue(index, notify = true) {
      const previous = this.value;
      this.value = this.kind === "switch" ? Boolean(index) : this.items[index].value;
      if (notify && previous !== this.value) {
        const detailIndex = this.kind === "switch" ? void 0 : index;
        this.options.onChange?.(this.value, detailIndex);
        this.container.dispatchEvent(new CustomEvent("change", {
          detail: { value: this.value, index: detailIndex },
          bubbles: true
        }));
      }
      this.updateAccessibility();
    }
    jumpTo(index, notify) {
      this.positionTarget = index;
      this.position.value = index;
      this.position.velocity = 0;
      this.commitValue(index, notify);
      this.dirty = true;
      wake(34);
      return this;
    }
    // ---- public -----------------------------------------------------------
    /** Replace the backdrop. Resolves once the new backdrop has been drawn. */
    setBackdrop(backdrop) {
      this.options.backdrop = backdrop;
      return this.refresh().nextSettled();
    }
    nextSettled() {
      return new Promise((resolve) => {
        this.settled = false;
        this.settledWaiters.push(() => resolve(this));
      });
    }
    setMaterial(material) {
      makeMaterialV2({ ...this.options.material ?? {}, ...material ?? {} });
      this.material = { ...this.material, ...material ?? {} };
      this.baseGlass?.setMaterial(this.material, false);
      this.pressGlass?.setMaterial(getPressedControlMaterialV2(this.material), false);
      this.staticDirty = true;
      wake(34);
      return this;
    }
    /** Update the navbar's pressed-lens geometry without remounting it. */
    setLens(lens) {
      if (this.kind !== "navbar") return this;
      this.lens = { ...this.lens, ...lens ?? {} };
      this.dirty = true;
      wake(34);
      return this;
    }
    /** Update the navbar track/label tone without remounting it. */
    setTintTone(tintTone) {
      if (this.kind !== "navbar") return this;
      this.options.tintTone = tintTone;
      this.appliedLabelColor = null;
      this.staticDirty = true;
      this.dirty = true;
      this.buildLabels();
      wake(34);
      return this;
    }
    setDisabled(disabled) {
      this.options.disabled = Boolean(disabled);
      this.container.tabIndex = disabled ? -1 : 0;
      this.container.style.cursor = disabled ? "default" : "pointer";
      this.container.setAttribute("aria-disabled", String(Boolean(disabled)));
      return this;
    }
    /** Re-resolve the backdrop and redraw on the next frame. */
    refresh() {
      if (this.destroyed) return this;
      this.layers = resolveLayers(normalizeBackdrop(this.options.backdrop), this.container);
      this.watchStyles();
      this.staticDirty = true;
      this.dirty = true;
      wake(64);
      return this;
    }
    /** Alias of `refresh()`, kept from 2.2. */
    updateBackdrop() {
      return this.refresh();
    }
    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      removeClient(this);
      this.resizeObserver?.disconnect();
      this.styleObserver?.disconnect();
      this.unsubscribeAssets?.();
      releaseGlass(this.baseGlass);
      releaseGlass(this.pressGlass);
      this.baseGlass = null;
      this.pressGlass = null;
      const { container } = this;
      container.removeEventListener("pointerdown", this.onPointerDown);
      container.removeEventListener("pointermove", this.onPointerMove);
      container.removeEventListener("pointerup", this.onPointerEnd);
      container.removeEventListener("pointercancel", this.onPointerEnd);
      container.removeEventListener("lostpointercapture", this.onPointerEnd);
      container.removeEventListener("keydown", this.onKeyDown);
      container.removeEventListener("focus", this.onFocusChange);
      container.removeEventListener("blur", this.onFocusChange);
      for (const node of [this.baseCanvas, this.trackCanvas, this.pressCanvas, this.restCanvas, this.labelLayer]) {
        node?.remove();
      }
      delete container.dataset.liquidGlassControl;
      for (const [property, value] of this.restore.reverse()) container.style[property] = value;
      for (const [attribute, value] of this.originalAttributes) {
        if (value === null) container.removeAttribute(attribute);
        else container.setAttribute(attribute, value);
      }
      if (registry.get(container) === this) registry.delete(container);
      this.settledWaiters.splice(0).forEach((resolve) => resolve());
    }
  };
  var LiquidGlassNavbar = class extends LiquidGlassControl {
    constructor(container, options = {}) {
      super(container, options, "navbar");
    }
    setValue(value, { notify = false } = {}) {
      return this.jumpTo(this.indexOf(value), notify);
    }
  };
  var LiquidGlassSwitch = class extends LiquidGlassControl {
    constructor(container, options = {}) {
      super(container, options, "switch");
    }
    get checked() {
      return Boolean(this.value);
    }
    setChecked(checked, { notify = false } = {}) {
      return this.jumpTo(checked ? 1 : 0, notify);
    }
  };

  // lib/src/src/index.js
  var SHAPES2 = Object.freeze({
    FOLDER: "folder",
    RECT: "rect",
    PILL: "pill",
    CIRCLE: "circle"
  });
  var COMPOSITE_MODES2 = Object.freeze({
    REPLACE: "replace",
    OVERLAY: "overlay"
  });
  var BACKDROP_UPDATES2 = Object.freeze({
    AUTO: "auto",
    STATIC: "static",
    LIVE: "live"
  });
  var REDUCED_TRANSPARENCY_QUERY2 = "(prefers-reduced-transparency: reduce)";
  function normalizeCompositeMode2(mode) {
    if (!Object.values(COMPOSITE_MODES2).includes(mode)) {
      throw new TypeError(`Unknown liquid glass composite mode: ${mode}`);
    }
    return mode;
  }
  function isLiveBackdropSource2(source) {
    const tagName = source?.tagName?.toUpperCase();
    return tagName === "CANVAS" || tagName === "VIDEO" || source?.constructor?.name === "OffscreenCanvas" || source?.constructor?.name === "VideoFrame";
  }
  function resolveBackdropUpdate2(source, update = BACKDROP_UPDATES2.AUTO) {
    if (!Object.values(BACKDROP_UPDATES2).includes(update)) {
      throw new TypeError(`Unknown liquid glass backdrop update mode: ${update}`);
    }
    return update === BACKDROP_UPDATES2.AUTO ? isLiveBackdropSource2(source) ? BACKDROP_UPDATES2.LIVE : BACKDROP_UPDATES2.STATIC : update;
  }
  function normalizeShape2(shape) {
    const normalized = shape === "folderRect" ? SHAPES2.RECT : shape;
    if (!Object.values(SHAPES2).includes(normalized)) {
      throw new TypeError(`Unknown liquid glass shape: ${shape}`);
    }
    return normalized;
  }
  function resolveImage2(source) {
    if (typeof source !== "string") return Promise.resolve(source);
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Unable to load liquid glass wallpaper: ${source}`));
      image.src = source;
    });
  }
  function normalizeElement2(input, index) {
    const width = Number(input.w ?? input.width ?? input.size ?? 0);
    const height = Number(input.h ?? input.height ?? input.size ?? width);
    if (!(width > 0) || !(height > 0)) {
      throw new TypeError("Liquid glass elements need a positive width and height.");
    }
    return {
      ...input,
      id: input.id ?? `glass-${index + 1}`,
      shape: normalizeShape2(input.shape ?? SHAPES2.FOLDER),
      x: Number(input.x ?? 0),
      y: Number(input.y ?? 0),
      w: width,
      h: height
    };
  }
  function matchMediaSafe2(query) {
    return typeof globalThis.matchMedia === "function" ? globalThis.matchMedia(query) : null;
  }
  var LiquidGlassWebGLV1 = class {
    /**
     * Whether this environment can run the component, so callers can fall back to
     * a CSS surface without catching a constructor throw. The probe canvas is
     * discarded immediately.
     */
    static isSupported() {
      if (typeof document === "undefined") return false;
      try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2");
        if (!gl) return false;
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return true;
      } catch {
        return false;
      }
    }
    constructor(canvas, options = {}) {
      if (!canvas || typeof canvas.getContext !== "function") {
        throw new TypeError("LiquidGlassWebGL needs an HTMLCanvasElement.");
      }
      this.canvas = canvas;
      this.compositeMode = normalizeCompositeMode2(options.compositeMode ?? COMPOSITE_MODES2.REPLACE);
      this.renderer = new GlassRenderer(canvas, {
        alpha: this.compositeMode === COMPOSITE_MODES2.OVERLAY,
        preserveDrawingBuffer: Boolean(options.preserveDrawingBuffer)
      });
      this.material = typeof options.material === "string" ? makeMaterial(options.material) : { ...makeMaterial("regular"), ...options.material || {} };
      this.elements = [];
      this.fusion = Boolean(options.fusion ?? false);
      this.wallpaperIndex = 0;
      this.wallpaperZoom = options.wallpaperZoom ?? 1;
      this.running = false;
      this.animationFrame = 0;
      this.onContextLost = options.onContextLost ?? null;
      this.onContextRestored = options.onContextRestored ?? null;
      this.dirty = true;
      this.backdropDirty = true;
      this.lastFrame = { width: 0, height: 0, dpr: 0 };
      this.warnedShapeLimit = false;
      this.respectReducedTransparency = options.respectReducedTransparency ?? true;
      this.reducedTransparencyQuery = this.respectReducedTransparency ? matchMediaSafe2(REDUCED_TRANSPARENCY_QUERY2) : null;
      this.handleReducedTransparencyChange = () => {
        this.markDirty();
        this.render();
      };
      this.reducedTransparencyQuery?.addEventListener?.("change", this.handleReducedTransparencyChange);
      this.handleContextLost = (event) => {
        event.preventDefault();
        this.renderer.handleContextLost();
        this.markBackdropDirty();
        this.onContextLost?.(event);
      };
      this.handleContextRestored = (event) => {
        this.renderer.restore();
        this.markBackdropDirty();
        this.lastFrame = { width: 0, height: 0, dpr: 0 };
        this.onContextRestored?.(event);
        this.render();
      };
      canvas.addEventListener("webglcontextlost", this.handleContextLost, false);
      canvas.addEventListener("webglcontextrestored", this.handleContextRestored, false);
      this.resizeObserver = null;
      if ((options.autoResize ?? true) && typeof globalThis.ResizeObserver === "function") {
        this.resizeObserver = new globalThis.ResizeObserver(() => {
          this.markDirty();
          this.render();
        });
        this.resizeObserver.observe(canvas);
      }
      if (options.elements) this.setElements(options.elements, false);
      if (options.wallpapers) this.setWallpapers(options.wallpapers, false);
      if (options.backdrop) {
        this.setBackdrop(options.backdrop, {
          update: options.backdropUpdate,
          autoStart: options.autoStart,
          shouldRender: false
        });
      }
    }
    /** True while the GPU context is gone; the surface holds its last frame. */
    get contextLost() {
      return this.renderer.lost;
    }
    /** True while the user has asked the platform to reduce transparency. */
    get reducedTransparency() {
      return Boolean(this.reducedTransparencyQuery?.matches);
    }
    /**
     * The material actually handed to the shader. Identical to `material` unless
     * reduced transparency is active.
     */
    get effectiveMaterial() {
      return this.reducedTransparency ? { ...this.material, ...REDUCED_TRANSPARENCY_MATERIAL } : this.material;
    }
    /** Marks the next `render()` as necessary. Every mutator calls this. */
    markDirty() {
      this.dirty = true;
      return this;
    }
    /** Marks both the sampled backdrop mip chain and the visible frame dirty. */
    markBackdropDirty() {
      this.backdropDirty = true;
      return this.markDirty();
    }
    setElements(elements, shouldRender = true) {
      this.elements = elements.map((element, index) => normalizeElement2(element, index));
      this.markDirty();
      if (shouldRender) this.render();
      return this;
    }
    addElement(element, shouldRender = true) {
      const normalized = normalizeElement2(element, this.elements.length);
      this.elements.push(normalized);
      this.markDirty();
      if (shouldRender) this.render();
      return normalized.id;
    }
    updateElement(id, patch, shouldRender = true) {
      const index = this.elements.findIndex((element) => element.id === id);
      if (index === -1) return this;
      this.elements[index] = normalizeElement2({ ...this.elements[index], ...patch }, index);
      this.markDirty();
      if (shouldRender) this.render();
      return this;
    }
    removeElement(id, shouldRender = true) {
      this.elements = this.elements.filter((element) => element.id !== id);
      this.markDirty();
      if (shouldRender) this.render();
      return this;
    }
    setMaterial(materialOrPreset, shouldRender = true) {
      this.material = typeof materialOrPreset === "string" ? makeMaterial(materialOrPreset) : { ...this.material, ...materialOrPreset || {} };
      this.markDirty();
      if (shouldRender) this.render();
      return this;
    }
    setFusion(enabled, mergeRadius = this.material.mergeRadius, shouldRender = true) {
      this.fusion = Boolean(enabled);
      if (Number.isFinite(mergeRadius)) this.material.mergeRadius = Math.max(0, mergeRadius);
      this.markDirty();
      if (shouldRender) this.render();
      return this;
    }
    setWallpapers(images2, shouldRender = true) {
      this.renderer.setWallpapers(images2, { update: BACKDROP_UPDATES2.STATIC });
      this.markBackdropDirty();
      if (shouldRender) this.render();
      return this;
    }
    /**
     * Use an image, canvas, video, ImageBitmap, or OffscreenCanvas as the
     * backdrop sampled by the glass. Canvas/video sources default to live mode.
     */
    setBackdrop(source, options = {}) {
      if (!source || typeof source === "string") {
        throw new TypeError("setBackdrop needs a CanvasImageSource. Use loadBackdrop for a URL.");
      }
      const update = resolveBackdropUpdate2(source, options.update);
      this.renderer.setWallpapers([source], { update });
      this.wallpaperIndex = 0;
      this.markBackdropDirty();
      if (options.autoStart ?? update === BACKDROP_UPDATES2.LIVE) this.start();
      if (options.shouldRender ?? true) this.render();
      return this;
    }
    async loadBackdrop(source, options = {}) {
      const image = await resolveImage2(source);
      return this.setBackdrop(image, {
        ...options,
        update: options.update ?? BACKDROP_UPDATES2.STATIC
      });
    }
    updateBackdrop(shouldRender = true) {
      this.renderer.refreshWallpapers(true);
      this.markBackdropDirty();
      if (shouldRender) this.render();
      return this;
    }
    async loadWallpapers(sources, shouldRender = true) {
      const images2 = await Promise.all(sources.map(resolveImage2));
      return this.setWallpapers(images2, shouldRender);
    }
    async setWallpaper(source, shouldRender = true) {
      return this.loadWallpapers([source], shouldRender);
    }
    setWallpaperIndex(index, shouldRender = true) {
      this.wallpaperIndex = Math.max(0, Math.floor(index));
      this.markBackdropDirty();
      if (shouldRender) this.render();
      return this;
    }
    /**
     * Signed distance from a point to the fused glass surface, in CSS pixels
     * relative to the canvas. Negative inside, positive outside.
     */
    distanceAt(x, y, options = {}) {
      const mergeRadius = options.fusion ?? this.fusion ? options.mergeRadius ?? this.material.mergeRadius : 0;
      return sdRenderedGroups(x, y, this.elements, this.material, mergeRadius);
    }
    /**
     * The element under a point, or `null` outside the surface. This evaluates
     * the same signed distance field as the shader, so circles, capsules and
     * squircle corners are respected instead of their bounding boxes, and in
     * fusion mode the bridges between components are hittable too.
     */
    hitTest(x, y, options = {}) {
      return hitTestElements(x, y, this.elements, this.material, {
        fusion: options.fusion ?? this.fusion,
        mergeRadius: options.mergeRadius,
        tolerance: options.tolerance ?? 0
      });
    }
    /** Canvas-relative CSS pixel position of a pointer/mouse/touch event. */
    pointerPosition(event) {
      const rect = this.canvas.getBoundingClientRect();
      const source = event.touches?.[0] ?? event.changedTouches?.[0] ?? event;
      return { x: source.clientX - rect.left, y: source.clientY - rect.top };
    }
    /** `hitTest` for a pointer event, with a larger tolerance for coarse input. */
    hitTestEvent(event, options = {}) {
      const { x, y } = this.pointerPosition(event);
      const tolerance = options.tolerance ?? (event.pointerType && event.pointerType !== "mouse" ? 8 : 0);
      return this.hitTest(x, y, { ...options, tolerance });
    }
    start() {
      if (this.running) return this;
      if (typeof globalThis.requestAnimationFrame !== "function") {
        throw new Error("LiquidGlassWebGL.start() requires requestAnimationFrame.");
      }
      this.running = true;
      const tick2 = () => {
        if (!this.running) return;
        this.render();
        this.animationFrame = globalThis.requestAnimationFrame(tick2);
      };
      this.animationFrame = globalThis.requestAnimationFrame(tick2);
      return this;
    }
    stop() {
      this.running = false;
      if (this.animationFrame && typeof globalThis.cancelAnimationFrame === "function") {
        globalThis.cancelAnimationFrame(this.animationFrame);
      }
      this.animationFrame = 0;
      return this;
    }
    resize(width = this.canvas.clientWidth || this.canvas.width || 1, height = this.canvas.clientHeight || this.canvas.height || 1, dpr = Math.min(globalThis.devicePixelRatio || 1, 2)) {
      this.renderer.resize(Math.round(width * dpr), Math.round(height * dpr));
      return { width, height, dpr };
    }
    /**
     * Draws a frame. Returns without touching the GPU when nothing changed since
     * the last frame, so an animation loop over a static scene costs nothing.
     * Pass `{ force: true }` to redraw regardless, which is what a read-back of
     * the drawing buffer needs.
     */
    render(options = {}) {
      if (this.renderer.lost) return this;
      const width = this.canvas.clientWidth || this.canvas.width || 1;
      const height = this.canvas.clientHeight || this.canvas.height || 1;
      const requestedDpr = Number(options.dpr ?? globalThis.devicePixelRatio ?? 1);
      const dpr = Math.max(0.5, Math.min(Number.isFinite(requestedDpr) ? requestedDpr : 1, 2));
      const resized = width !== this.lastFrame.width || height !== this.lastFrame.height || dpr !== this.lastFrame.dpr;
      if (!options.force && !this.dirty && !resized && !this.renderer.hasLiveBackdrop()) {
        return this;
      }
      const liveBackdrop = this.renderer.hasLiveBackdrop();
      this.resize(width, height, dpr);
      if (this.backdropDirty || resized || liveBackdrop) {
        this.renderer.buildBackdrop(this.wallpaperIndex, this.wallpaperZoom);
        this.backdropDirty = false;
      }
      if (this.compositeMode === COMPOSITE_MODES2.OVERLAY) {
        this.renderer.clearOutput();
      } else {
        this.renderer.drawBackdrop();
      }
      const material = this.effectiveMaterial;
      if (this.fusion) {
        const { groups, truncated } = groupElements(
          this.elements,
          material.mergeRadius,
          MAX_GLASS_SHAPES
        );
        if (truncated && !this.warnedShapeLimit) {
          this.warnedShapeLimit = true;
          console.warn(
            `LiquidGlassWebGL: more than ${MAX_GLASS_SHAPES} fused shapes are within merging distance of each other. They are drawn in separate passes, so the silhouette will not bridge across every one of them.`
          );
        }
        for (const group of groups) {
          this.renderer.drawGlassGroup(group, material, dpr, material.mergeRadius);
        }
      } else {
        for (const element of this.elements) {
          this.renderer.drawGlass(element, material, dpr);
        }
      }
      this.dirty = false;
      this.lastFrame = { width, height, dpr };
      return this;
    }
    destroy() {
      this.stop();
      this.canvas.removeEventListener("webglcontextlost", this.handleContextLost, false);
      this.canvas.removeEventListener("webglcontextrestored", this.handleContextRestored, false);
      this.reducedTransparencyQuery?.removeEventListener?.("change", this.handleReducedTransparencyChange);
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      this.renderer.destroy();
      this.elements = [];
    }
  };
  return __toCommonJS(index_exports);
})();


    /* ================= 配置（localStorage 持久化） ================= */
    var CFG_KEY = 'dsh-liquid-glass:cfg';
    var DEFAULT_CFG = {
      enabled: true,
      tint: 0.35,
      frost: 0.45,
      tintTone: 'dark',
      bgType: 'gradient',
      bgColor: '#0f1526',
      bgGradient: 'glassblue',
      bgImage: '',
      scope: ['input', 'button', 'panel', 'sidebar', 'toolbar', 'header'],
    };
    var GRADIENTS = {
      glassblue: 'linear-gradient(135deg,#0b1020 0%,#1b2a4a 45%,#2f3b5e 100%)',
      night: 'linear-gradient(160deg,#05060a 0%,#101423 60%,#1a2335 100%)',
      neon: 'linear-gradient(135deg,#0f0c29 0%,#302b63 55%,#24243e 100%)',
      pinkpurple: 'linear-gradient(135deg,#2b0b3a 0%,#5b2a86 50%,#8e4bb0 100%)',
      mint: 'linear-gradient(135deg,#0a2e2a 0%,#14504a 55%,#2a6b62 100%)',
      sunset: 'linear-gradient(135deg,#2a0d10 0%,#5a1e14 55%,#8a3a1a 100%)',
    };
    var GRADIENT_NAMES = ['glassblue', 'night', 'neon', 'pinkpurple', 'mint', 'sunset'];

    var cfg = loadCfg();

    function loadCfg() {
      try {
        var raw = localStorage.getItem(CFG_KEY);
        if (!raw) return cloneCfg(DEFAULT_CFG);
        var p = JSON.parse(raw);
        var merged = Object.assign({}, DEFAULT_CFG, p);
        if (!Array.isArray(merged.scope)) merged.scope = DEFAULT_CFG.scope.slice();
        merged.scope = merged.scope.filter(function (s) { return DEFAULT_CFG.scope.indexOf(s) >= 0; });
        if (!merged.scope.length) merged.scope = DEFAULT_CFG.scope.slice();
        return merged;
      } catch (e) { return cloneCfg(DEFAULT_CFG); }
    }
    function cloneCfg(src) {
      return { enabled: src.enabled, tint: src.tint, frost: src.frost, tintTone: src.tintTone, bgType: src.bgType, bgColor: src.bgColor, bgGradient: src.bgGradient, bgImage: src.bgImage, scope: src.scope.slice() };
    }
    function saveCfg() {
      try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) { /* 隐私模式 */ }
    }
    function clamp01(v) { v = Number(v); return isFinite(v) ? Math.max(0, Math.min(1, v)) : 0; }

    /* ================= 全局自定义背景层（应用到全部背景） ================= */
    var bgEl = null;
    function cssColor(c) { return /^#[0-9a-fA-F]{3,8}$/.test(String(c)) ? String(c) : '#0f1526'; }
    function cssUrl(u) { return String(u).replace(/\\/g, '/').replace(/"/g, '%22'); }
    function applyBg() {
      if (bgEl && bgEl.parentNode) bgEl.parentNode.removeChild(bgEl);
      bgEl = null;
      if (cfg.bgType === 'off') return;
      var css = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:-2;pointer-events:none;';
      if (cfg.bgType === 'color') {
        css += 'background:' + cssColor(cfg.bgColor) + ';';
      } else if (cfg.bgType === 'gradient') {
        css += 'background:' + (GRADIENTS[cfg.bgGradient] || GRADIENTS.glassblue) + ';';
      } else if (cfg.bgType === 'image' && cfg.bgImage) {
        css += 'background:url("' + cssUrl(cfg.bgImage) + '") center/cover no-repeat;';
        css += 'background-color:#0a0e18;';
      } else {
        return;
      }
      bgEl = document.createElement('div');
      bgEl.id = 'dshlg-bg';
      bgEl.style.cssText = css;
      document.body.insertBefore(bgEl, document.body.firstChild);
    }

    /* ================= 元素收集（哪些能玻璃化，哪些不能） =================
     * 能：输入框(textarea/input/contenteditable)、按钮、面板/卡片/弹层、
     *     侧边栏/导航/会话列表、工具栏/顶栏、页头。
     * 不能：svg/img/video/canvas/iframe/script/style、checkbox 等小控件、
     *     尺寸过小元素、隐藏元素、宿主已带 backdrop-filter 的元素、
     *     我们自己的 UI（dshlg-*）。
     */
    var SCOPE_SELECTORS = {
      input: 'textarea,input[type="text"],input[type="search"],input[type="email"],input[type="password"],input:not([type]),[contenteditable="true"],[role="textbox"],[class*="composer"],[class*="editor"]',
      button: 'button,[role="button"],[class*="send-button"],[class*="action-button"]',
      panel: '[class*="panel"],[class*="card"],[class*="dialog"],[class*="modal"],[class*="drawer"],[class*="popover"],[class*="dropdown"]',
      sidebar: '[class*="sidebar"],[class*="side-bar"],[class*="nav"],[class*="conversation-list"],[class*="chat-list"],[class*="thread-list"]',
      toolbar: '[class*="toolbar"],[class*="topbar"],[class*="menu-bar"],[class*="action-bar"]',
      header: '[class*="header"],[class*="title-bar"],[class*="breadcrumb"]',
    };
    var SCOPE_LABELS = { input: '输入框', button: '按钮', panel: '面板/卡片', sidebar: '侧边栏', toolbar: '工具栏', header: '顶栏/页头' };

    function keyOf(el) {
      var cls = '';
      if (el.className) { try { cls = String(el.className).slice(0, 80); } catch (e) {} }
      var testid = '';
      if (el.getAttribute) { try { testid = String(el.getAttribute('data-testid') || ''); } catch (e) {} }
      return el.tagName + ':' + (el.id || '') + ':' + cls + ':' + testid;
    }
    function eligible(el) {
      if (!el || el.nodeType !== 1) return false;
      var tag = el.tagName;
      if (tag === 'SVG' || tag === 'IMG' || tag === 'VIDEO' || tag === 'CANVAS' || tag === 'IFRAME' || tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'META' || tag === 'OPTION') return false;
      if (tag === 'INPUT') {
        var it = String(el.type || 'text').toLowerCase();
        if (/^(checkbox|radio|range|color|file|submit|reset|hidden|date|time|month|week|number)$/.test(it)) return false;
      }
      if (el.id && String(el.id).indexOf('dshlg-') === 0) return false;
      if (el.closest) {
        try { if (el.closest('#dshlg-ball,#dshlg-panel,#dshlg-bg,#dshlg-style')) return false; } catch (e) {}
      }
      if (el.hasAttribute && el.hasAttribute('data-dshlg')) return false;
      var r = el.getBoundingClientRect();
      if (r.width < 28 || r.height < 20) return false;
      var st = null;
      try { st = getComputedStyle(el); } catch (e) { return false; }
      if (!st) return false;
      if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) === 0) return false;
      var bf = st.backdropFilter || st.webkitBackdropFilter;
      if (bf && bf !== 'none') return false;
      return true;
    }
    function collectTargets() {
      var all = [];
      cfg.scope.forEach(function (key) {
        var sel = SCOPE_SELECTORS[key];
        if (!sel) return;
        try {
          var nodes = document.querySelectorAll(sel);
          for (var i = 0; i < nodes.length; i++) all.push(nodes[i]);
        } catch (e) {}
      });
      var seen = Object.create(null);
      var out = [];
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (!el || !el.tagName) continue;
        var k = keyOf(el);
        if (seen[k]) continue;
        seen[k] = true;
        if (!eligible(el)) continue;
        out.push(el);
      }
      return out;
    }

    /* ================= 液态玻璃实例 ================= */
    var glass = null;
    var glassEls = [];

    function destroyGlass() {
      if (glass) {
        try { glass.destroy(); } catch (e) {}
        glass = null;
      }
      for (var i = 0; i < glassEls.length; i++) {
        var el = glassEls[i];
        if (el && el.hasAttribute && el.hasAttribute('data-dshlg')) el.removeAttribute('data-dshlg');
      }
      glassEls = [];
    }

    function applyGlass(els) {
      destroyGlass();
      if (!cfg.enabled) return;
      var Lib = LiquidGlassLib;
      if (!Lib || !Lib.LiquidGlass) return;
      try {
        if (Lib.LiquidGlass.isSupported && !Lib.LiquidGlass.isSupported()) return;
      } catch (e) { return; }
      if (!els || !els.length) els = collectTargets();
      if (!els.length) return;
      var main = els[0];
      var rest = els.slice(1);
      var opts = {
        tint: clamp01(cfg.tint),
        frost: clamp01(cfg.frost),
        tintTone: cfg.tintTone,
        backdrop: 'auto',
        maxDpr: 2,
        respectReducedTransparency: false,
        fallback: 'css',
        material: { refraction: 80, dispersion: 2 },
      };
      if (rest.length) opts.targets = rest;
      try {
        glass = new Lib.LiquidGlass(main, opts);
      } catch (e) {
        glass = null;
        return;
      }
      for (var i = 0; i < els.length; i++) els[i].setAttribute('data-dshlg', '1');
      glassEls = els.slice();
    }

    function rebuildGlass() { applyGlass(null); }

    function refreshBackdrop() {
      if (glass && glass.refresh) {
        try { glass.refresh({ backdrop: true }); } catch (e) {}
      }
    }
    function updateGlassOpts() {
      if (glass && glass.update) {
        try { glass.update({ tint: clamp01(cfg.tint), frost: clamp01(cfg.frost), tintTone: cfg.tintTone }); } catch (e) { rebuildGlass(); }
      }
    }

    /* ================= 动态界面监听（防抖 + 快照去重） ================= */
    var observer = null;
    var rebuildTimer = null;
    var lastKeys = '';
    function snapshotKeys() {
      var els = collectTargets();
      var keys = [];
      for (var i = 0; i < els.length; i++) keys.push(keyOf(els[i]));
      return keys.join('|');
    }
    function scheduleRebuild() {
      if (rebuildTimer) return;
      rebuildTimer = setTimeout(function () {
        rebuildTimer = null;
        if (document.hidden) return;
        var keys = snapshotKeys();
        if (keys === lastKeys) return;
        lastKeys = keys;
        applyGlass(collectTargets());
      }, 400);
    }
    function startObserver() {
      if (observer || typeof MutationObserver === 'undefined') return;
      observer = new MutationObserver(function () { scheduleRebuild(); });
      try {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style'],
        });
      } catch (e) {}
    }

    /* ================= 自绘设置面板（右侧小球，液态玻璃风） ================= */
    var UI_CSS =
      /* ---- 小球 ---- */
      '#dshlg-ball{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:9999;' +
      'width:46px;height:46px;border-radius:50% 0 0 50%;display:flex;align-items:center;justify-content:center;' +
      'cursor:pointer;background:rgba(34,44,72,.55);backdrop-filter:blur(14px) saturate(1.4);' +
      '-webkit-backdrop-filter:blur(14px) saturate(1.4);border:1px solid rgba(255,255,255,.18);border-right:none;' +
      'box-shadow:-2px 2px 12px rgba(0,0,0,.35);color:#e9effc;transition:background .2s,transform .15s;' +
      'user-select:none;-webkit-user-select:none}' +
      '#dshlg-ball:hover{background:rgba(58,74,116,.75)}' +
      '#dshlg-ball:active{transform:translateY(-50%) scale(.96)}' +
      '#dshlg-ball svg{width:24px;height:24px;display:block}' +
      /* ---- 面板 ---- */
      '#dshlg-panel{position:fixed;right:14px;top:50%;transform:translateY(-50%);z-index:10000;' +
      'width:316px;background:rgba(18,24,42,.82);backdrop-filter:blur(24px) saturate(1.5);' +
      '-webkit-backdrop-filter:blur(24px) saturate(1.5);border:1px solid rgba(255,255,255,.14);border-radius:18px;' +
      'box-shadow:0 16px 48px rgba(0,0,0,.45);color:#e9effc;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;' +
      'overflow:hidden;display:none;user-select:none;-webkit-user-select:none;max-height:min(680px,88vh);overflow-y:auto}' +
      '#dshlg-panel.open{display:block}' +
      '#dshlg-panel::-webkit-scrollbar{width:6px}#dshlg-panel::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:3px}' +
      '#dshlg-panel .dshlg-head{display:flex;align-items:center;justify-content:space-between;' +
      'padding:14px 16px 12px;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;background:inherit}' +
      '#dshlg-panel .dshlg-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600}' +
      '#dshlg-panel .dshlg-title svg{width:18px;height:18px;color:#8ab8ff}' +
      '#dshlg-panel .dshlg-close{width:26px;height:26px;border:none;background:transparent;cursor:pointer;' +
      'border-radius:8px;display:flex;align-items:center;justify-content:center;color:#9fb0d4;padding:0}' +
      '#dshlg-panel .dshlg-close:hover{background:rgba(255,255,255,.1);color:#fff}' +
      '#dshlg-panel .dshlg-close svg{width:16px;height:16px}' +
      '#dshlg-panel .dshlg-body{padding:4px 16px 12px}' +
      '#dshlg-panel .dshlg-group{padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06)}' +
      '#dshlg-panel .dshlg-group:last-child{border-bottom:none}' +
      '#dshlg-panel .dshlg-glabel{display:flex;align-items:center;justify-content:space-between;font-size:12.5px;margin-bottom:8px;color:#c8d6f2}' +
      '#dshlg-panel .dshlg-glabel b{font-weight:600;color:#eef3ff}' +
      '#dshlg-panel .dshlg-val{font-size:11px;color:#8ab8ff;font-variant-numeric:tabular-nums}' +
      /* 开关 */
      '#dshlg-panel .dshlg-switch{position:relative;width:42px;height:24px;flex:none;cursor:pointer;border-radius:12px;' +
      'background:rgba(255,255,255,.16);transition:background .18s;border:1px solid rgba(255,255,255,.1)}' +
      '#dshlg-panel .dshlg-switch.on{background:linear-gradient(135deg,#3d7bfd,#7a5cff);border-color:rgba(255,255,255,.18)}' +
      '#dshlg-panel .dshlg-switch::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;' +
      'background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:left .18s}' +
      '#dshlg-panel .dshlg-switch.on::after{left:20px}' +
      /* 滑块 */
      '#dshlg-panel input[type="range"].dshlg-range{width:100%;height:20px;-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer}' +
      '#dshlg-panel input[type="range"].dshlg-range::-webkit-slider-runnable-track{height:6px;border-radius:3px;' +
      'background:linear-gradient(90deg,rgba(61,123,253,.6),rgba(122,92,255,.6))}' +
      '#dshlg-panel input[type="range"].dshlg-range::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;' +
      'background:#fff;margin-top:-5px;box-shadow:0 1px 4px rgba(0,0,0,.4);border:2px solid rgba(61,123,253,.7)}' +
      /* 分段背景类型 */
      '#dshlg-panel .dshlg-seg{display:flex;gap:6px;flex-wrap:wrap}' +
      '#dshlg-panel .dshlg-seg button{flex:1;min-width:60px;padding:7px 0;font-size:12px;border-radius:9px;cursor:pointer;' +
      'background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#c8d6f2;transition:all .15s}' +
      '#dshlg-panel .dshlg-seg button.on{background:linear-gradient(135deg,#3d7bfd,#7a5cff);color:#fff;border-color:transparent}' +
      /* 色卡 */
      '#dshlg-panel .dshlg-swatches{display:flex;gap:8px;flex-wrap:wrap}' +
      '#dshlg-panel .dshlg-swatch{width:34px;height:34px;border-radius:50%;cursor:pointer;border:2px solid rgba(255,255,255,.22);' +
      'transition:transform .12s;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}' +
      '#dshlg-panel .dshlg-swatch:hover{transform:scale(1.1)}' +
      '#dshlg-panel .dshlg-swatch.on{border-color:#fff;box-shadow:0 0 0 2px rgba(61,123,253,.9),inset 0 0 0 1px rgba(0,0,0,.2)}' +
      /* 输入 */
      '#dshlg-panel .dshlg-row{display:flex;gap:8px;align-items:center}' +
      '#dshlg-panel input[type="text"].dshlg-text{flex:1;min-width:0;padding:8px 10px;font-size:12px;border-radius:9px;' +
      'background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.12);color:#eef3ff;outline:none}' +
      '#dshlg-panel input[type="text"].dshlg-text:focus{border-color:rgba(61,123,253,.7)}' +
      '#dshlg-panel input[type="color"].dshlg-color{width:38px;height:34px;padding:2px;border-radius:9px;cursor:pointer;' +
      'background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.12)}' +
      '#dshlg-panel .dshlg-btn{padding:8px 14px;font-size:12px;border-radius:9px;cursor:pointer;flex:none;' +
      'background:linear-gradient(135deg,#3d7bfd,#7a5cff);border:none;color:#fff;transition:opacity .15s}' +
      '#dshlg-panel .dshlg-btn:active{opacity:.8}' +
      '#dshlg-panel .dshlg-btn.ghost{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#c8d6f2}' +
      /* 勾选范围 */
      '#dshlg-panel .dshlg-scope{display:flex;flex-wrap:wrap;gap:6px}' +
      '#dshlg-panel .dshlg-scope label{display:flex;align-items:center;gap:6px;font-size:12px;padding:6px 10px;border-radius:9px;' +
      'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);cursor:pointer;color:#c8d6f2;transition:all .15s}' +
      '#dshlg-panel .dshlg-scope label.on{background:rgba(61,123,253,.16);border-color:rgba(61,123,253,.55);color:#fff}' +
      '#dshlg-panel .dshlg-scope input{accent-color:#4a7dff;width:14px;height:14px;cursor:pointer}' +
      '#dshlg-panel .dshlg-foot{padding:10px 16px 14px;font-size:11px;color:#7f90b8;line-height:1.5;border-top:1px solid rgba(255,255,255,.06)}' +
      /* 纵深防御 */
      'html #dshlg-ball,body #dshlg-ball,html #dshlg-panel,body #dshlg-panel,' +
      'html #dshlg-panel input,body #dshlg-panel input,' +
      'html #dshlg-panel button,body #dshlg-panel button,' +
      'html #dshlg-panel label,body #dshlg-panel label{' +
      'background-image:none !important;border-radius:inherit !important;outline:0 !important;' +
      'backdrop-filter:blur(24px) saturate(1.5) !important;-webkit-backdrop-filter:blur(24px) saturate(1.5) !important;filter:none !important}' +
      'html #dshlg-ball,body #dshlg-ball{width:46px !important;height:46px !important;' +
      'background:rgba(34,44,72,.55) !important;backdrop-filter:blur(14px) saturate(1.4) !important;-webkit-backdrop-filter:blur(14px) saturate(1.4) !important}' +
      'html #dshlg-panel,body #dshlg-panel{background:rgba(18,24,42,.82) !important;width:316px !important}' +
      '#dshlg-ball svg,#dshlg-panel svg{width:24px !important;height:24px !important}';

    function mountUI() {
      if (document.getElementById('dshlg-ball')) return;
      var style = document.createElement('style');
      style.id = 'dshlg-style';
      style.textContent = UI_CSS;
      document.head.appendChild(style);
      /* 小球（液态水滴 SVG） */
      var ball = document.createElement('div');
      ball.id = 'dshlg-ball';
      ball.title = '液态玻璃 · 设置';
      ball.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12 3.2s5.8 6.4 5.8 10.1a5.8 5.8 0 1 1-11.6 0C6.2 9.6 12 3.2 12 3.2z" />' +
        '<path d="M8.8 14.6a3.6 3.6 0 0 0 2.9 3.1" />' +
        '</svg>';
      document.body.appendChild(ball);
      /* 面板 */
      var panel = document.createElement('div');
      panel.id = 'dshlg-panel';
      panel.innerHTML =
        '<div class="dshlg-head">' +
          '<div class="dshlg-title">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M12 2.5s6.2 6.8 6.2 10.6a6.2 6.2 0 1 1-12.4 0C5.8 9.3 12 2.5 12 2.5z" />' +
              '<path d="M8.5 15.2a3.9 3.9 0 0 0 3.2 3.4" />' +
            '</svg>' +
            '液态玻璃' +
          '</div>' +
          '<button class="dshlg-close" title="关闭">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>' +
          '</button>' +
        '</div>' +
        '<div class="dshlg-body">' +
          '<div class="dshlg-group">' +
            '<div class="dshlg-glabel"><b>液态玻璃</b><span id="dshlg-enabled-hint" class="dshlg-val">开</span></div>' +
            '<div class="dshlg-row" style="justify-content:flex-end"><div class="dshlg-switch on" id="dshlg-enabled"></div></div>' +
          '</div>' +
          '<div class="dshlg-group">' +
            '<div class="dshlg-glabel"><b>玻璃强度</b><span class="dshlg-val" id="dshlg-tint-val">0.35</span></div>' +
            '<input type="range" class="dshlg-range" id="dshlg-tint" min="0" max="1" step="0.05" value="0.35">' +
          '</div>' +
          '<div class="dshlg-group">' +
            '<div class="dshlg-glabel"><b>磨砂</b><span class="dshlg-val" id="dshlg-frost-val">0.45</span></div>' +
            '<input type="range" class="dshlg-range" id="dshlg-frost" min="0" max="1" step="0.05" value="0.45">' +
          '</div>' +
          '<div class="dshlg-group">' +
            '<div class="dshlg-glabel"><b>自定义背景</b><span class="dshlg-val">应用到全部背景</span></div>' +
            '<div class="dshlg-seg" id="dshlg-bgtype">' +
              '<button data-v="off">关闭</button>' +
              '<button data-v="color">纯色</button>' +
              '<button data-v="gradient">渐变</button>' +
              '<button data-v="image">图片</button>' +
            '</div>' +
          '</div>' +
          '<div class="dshlg-group" id="dshlg-bg-color-wrap" style="display:none">' +
            '<div class="dshlg-row">' +
              '<input type="color" class="dshlg-color" id="dshlg-bg-color" value="#0f1526">' +
              '<input type="text" class="dshlg-text" id="dshlg-bg-color-hex" value="#0f1526" maxlength="9">' +
            '</div>' +
          '</div>' +
          '<div class="dshlg-group" id="dshlg-bg-grad-wrap" style="display:none">' +
            '<div class="dshlg-swatches" id="dshlg-bg-grad"></div>' +
          '</div>' +
          '<div class="dshlg-group" id="dshlg-bg-img-wrap" style="display:none">' +
            '<div class="dshlg-row">' +
              '<input type="text" class="dshlg-text" id="dshlg-bg-image" placeholder="图片 URL（https://…）">' +
              '<button class="dshlg-btn" id="dshlg-bg-image-apply">应用</button>' +
            '</div>' +
          '</div>' +
          '<div class="dshlg-group">' +
            '<div class="dshlg-glabel"><b>应用范围</b></div>' +
            '<div class="dshlg-scope" id="dshlg-scope"></div>' +
          '</div>' +
          '<div class="dshlg-group">' +
            '<div class="dshlg-row">' +
              '<button class="dshlg-btn ghost" id="dshlg-reset" style="flex:1">重置默认</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="dshlg-foot">设置保存在 localStorage · 变更即时生效 · 液态玻璃内核：apple-liquid-glass-webgl v2.5.0（MIT）</div>';
      document.body.appendChild(panel);
      /* 渐变色卡 */
      var swatchBox = panel.querySelector('#dshlg-bg-grad');
      GRADIENT_NAMES.forEach(function (name) {
        var s = document.createElement('div');
        s.className = 'dshlg-swatch' + (cfg.bgGradient === name ? ' on' : '');
        s.setAttribute('data-v', name);
        s.style.background = GRADIENTS[name];
        s.title = name;
        swatchBox.appendChild(s);
      });
      /* 应用范围勾选 */
      var scopeBox = panel.querySelector('#dshlg-scope');
      Object.keys(SCOPE_SELECTORS).forEach(function (key) {
        var label = document.createElement('label');
        var on = cfg.scope.indexOf(key) >= 0;
        if (on) label.className = 'on';
        var box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = on;
        box.setAttribute('data-v', key);
        label.appendChild(box);
        label.appendChild(document.createTextNode(SCOPE_LABELS[key] || key));
        scopeBox.appendChild(label);
      });

      /* ===== 交互 ===== */
      function refreshUI() {
        var en = panel.querySelector('#dshlg-enabled');
        en.classList.toggle('on', cfg.enabled);
        panel.querySelector('#dshlg-enabled-hint').textContent = cfg.enabled ? '开' : '关';
        var t = panel.querySelector('#dshlg-tint');
        t.value = String(clamp01(cfg.tint));
        panel.querySelector('#dshlg-tint-val').textContent = clamp01(cfg.tint).toFixed(2);
        var f = panel.querySelector('#dshlg-frost');
        f.value = String(clamp01(cfg.frost));
        panel.querySelector('#dshlg-frost-val').textContent = clamp01(cfg.frost).toFixed(2);
        var segBtns = panel.querySelectorAll('#dshlg-bgtype button');
        for (var i = 0; i < segBtns.length; i++) segBtns[i].classList.toggle('on', segBtns[i].getAttribute('data-v') === cfg.bgType);
        panel.querySelector('#dshlg-bg-color-wrap').style.display = cfg.bgType === 'color' ? '' : 'none';
        panel.querySelector('#dshlg-bg-grad-wrap').style.display = cfg.bgType === 'gradient' ? '' : 'none';
        panel.querySelector('#dshlg-bg-img-wrap').style.display = cfg.bgType === 'image' ? '' : 'none';
        panel.querySelector('#dshlg-bg-color').value = cssColor(cfg.bgColor);
        panel.querySelector('#dshlg-bg-color-hex').value = cssColor(cfg.bgColor);
        panel.querySelector('#dshlg-bg-image').value = cfg.bgImage || '';
        var swatches = panel.querySelectorAll('.dshlg-swatch');
        for (var j = 0; j < swatches.length; j++) swatches[j].classList.toggle('on', swatches[j].getAttribute('data-v') === cfg.bgGradient);
        var labels = panel.querySelectorAll('.dshlg-scope label');
        for (var k = 0; k < labels.length; k++) {
          var cb = labels[k].querySelector('input');
          labels[k].className = cb.checked ? 'on' : '';
        }
      }

      ball.addEventListener('click', function () {
        panel.classList.toggle('open');
        refreshUI();
      });
      panel.querySelector('.dshlg-close').addEventListener('click', function () {
        panel.classList.remove('open');
      });

      panel.querySelector('#dshlg-enabled').addEventListener('click', function () {
        cfg.enabled = !cfg.enabled;
        saveCfg();
        if (cfg.enabled) {
          applyBg();
          applyGlass(null);
        } else {
          destroyGlass();
        }
        refreshUI();
      });

      panel.querySelector('#dshlg-tint').addEventListener('input', function () {
        cfg.tint = Number(this.value);
        saveCfg();
        updateGlassOpts();
        refreshUI();
      });
      panel.querySelector('#dshlg-frost').addEventListener('input', function () {
        cfg.frost = Number(this.value);
        saveCfg();
        updateGlassOpts();
        refreshUI();
      });

      var bgTypeBtns = panel.querySelectorAll('#dshlg-bgtype button');
      for (var b = 0; b < bgTypeBtns.length; b++) {
        bgTypeBtns[b].addEventListener('click', function () {
          cfg.bgType = this.getAttribute('data-v');
          saveCfg();
          applyBg();
          refreshBackdrop();
          refreshUI();
        });
      }
      var colorInput = panel.querySelector('#dshlg-bg-color');
      var colorHex = panel.querySelector('#dshlg-bg-color-hex');
      colorInput.addEventListener('input', function () {
        cfg.bgColor = this.value;
        colorHex.value = this.value;
        saveCfg();
        applyBg();
        refreshBackdrop();
      });
      colorHex.addEventListener('change', function () {
        var v = cssColor(this.value);
        cfg.bgColor = v;
        colorInput.value = v;
        this.value = v;
        saveCfg();
        applyBg();
        refreshBackdrop();
      });
      var gradSwatches = panel.querySelectorAll('.dshlg-swatch');
      for (var g = 0; g < gradSwatches.length; g++) {
        gradSwatches[g].addEventListener('click', function () {
          cfg.bgGradient = this.getAttribute('data-v');
          saveCfg();
          applyBg();
          refreshBackdrop();
          refreshUI();
        });
      }
      var imgInput = panel.querySelector('#dshlg-bg-image');
      panel.querySelector('#dshlg-bg-image-apply').addEventListener('click', function () {
        cfg.bgImage = imgInput.value.trim();
        saveCfg();
        applyBg();
        refreshBackdrop();
        refreshUI();
      });
      imgInput.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') {
          cfg.bgImage = imgInput.value.trim();
          saveCfg();
          applyBg();
          refreshBackdrop();
          refreshUI();
        }
      });

      var scopeCbs = panel.querySelectorAll('.dshlg-scope input');
      for (var c = 0; c < scopeCbs.length; c++) {
        scopeCbs[c].addEventListener('change', function () {
          var key = this.getAttribute('data-v');
          var idx = cfg.scope.indexOf(key);
          if (this.checked && idx < 0) cfg.scope.push(key);
          if (!this.checked && idx >= 0) cfg.scope.splice(idx, 1);
          saveCfg();
          rebuildGlass();
          refreshUI();
        });
      }

      panel.querySelector('#dshlg-reset').addEventListener('click', function () {
        cfg = cloneCfg(DEFAULT_CFG);
        saveCfg();
        applyBg();
        applyGlass(null);
        refreshUI();
      });
    }

    /* ================= 启动 ================= */
    function boot() {
      mountUI();
      startObserver();
      applyBg();
      lastKeys = snapshotKeys();
      applyGlass(null);
    }
    if (document.body) {
      boot();
    } else {
      document.addEventListener('DOMContentLoaded', boot);
    }

    exports.name = 'dsh-liquid-glass-client';
    exports.apply = function apply() {};
    return module.exports;
  },
});
