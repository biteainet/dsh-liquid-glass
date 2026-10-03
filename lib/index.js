/**
 * dsh-liquid-glass host half.
 *
 * 纯浏览器插件：液态玻璃渲染、全局自定义背景、设置面板全部在 client 半
 * （lib/client.js，内联 apple-liquid-glass-webgl@2.5.0 bundle）完成。
 * host 半为空，仅按 DSH Cordis 插件约定导出 name/apply，让 client bundle
 * 被发现并注入浏览器渲染进程。
 */
export const name = 'dsh-liquid-glass'
export function apply(ctx) {
  // 无宿主服务：配置持久化由 client 半写入 localStorage。
}
