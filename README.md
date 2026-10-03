# dsh-liquid-glass
**把 DeepSeek Harness 的全部 UI 变成 Apple 液态玻璃** + **全局自定义背景** + **自绘玻璃风设置面板**。

- 液态玻璃：输入框、按钮、面板/卡片、侧边栏、工具栏、顶栏等所有可玻璃化 UI，呈现 Apple 风格液态玻璃（WebGL2 SDF 折射、色散、边缘高光）。
- 自定义背景：**库自带暗色壁纸**（暗色地球 / 抽象光轨，来自 apple-liquid-glass-webgl 的 assets/wallpapers，base64 内联）、纯色、6 种渐变预设、图片 URL——背景层铺满整个 DSH 界面（应用到**全部背景**），液态玻璃折射的就是这个背景。默认即暗色壁纸。
- 自绘设置面板：屏幕右侧中部小圆球（水滴 SVG）→ 点击弹出，总开关 / 玻璃强度 / 磨砂 / 背景类型与颜色 / 应用范围即时生效，无需宿主设置表单。

## 液态玻璃内核（重要）
- 使用真实开源项目 **apple-liquid-glass-webgl@2.5.0**（MIT License）
  - GitHub：https://github.com/Oliverrr2424/webgl-apple-liquid-glass
- 库为多文件 ESM，用 esbuild 打包为单文件 IIFE 后**整体内联**进 `lib/client.js`（DSH 的 `/plugins/<id>/` 不静态服务 assets，必须内联）。**库源码未做任何修改**，仅打包拼接。
- 无 WebGL2 的旧环境自动回退 CSS `backdrop-filter`（库内置 fallback）。

## 安装
1. 把本包内容上传到你的 GitHub 仓库；
2. 安装：
```bash
dsh plugin --profile desktop add github:你的用户名/dsh-liquid-glass
# 或本地调试
dsh plugin --profile desktop add link:/path/to/dsh-liquid-glass
```
3. 重启 `dsh`（桌面版 DeepSeek Harness 完全退出重开；必要时硬刷新页面）。

## 使用
点击屏幕右侧中部的小圆球（水滴图标）→ 弹出设置面板：

| 设置项 | 说明 |
| --- | --- |
| 液态玻璃 | 总开关，关闭后移除全部玻璃效果 |
| 玻璃强度 | tint，0–1 滑块，即时生效 |
| 磨砂 | frost，0–1 滑块，即时生效 |
| 自定义背景 | 关闭 / 纯色（取色器）/ 渐变（6 预设）/ **壁纸（库自带暗色：暗色地球、抽象光轨）** / 图片（URL），应用到全部背景 |
| 应用范围 | 输入框 / 按钮 / 面板·卡片 / 侧边栏 / 工具栏 / 顶栏·页头，可勾选 |

- 所有设置保存在 localStorage（键 `dsh-liquid-glass:cfg`），变更即时生效。
- 动态渲染的元素（新消息、新面板）会自动跟随玻璃化（MutationObserver + 防抖）。

## 验证
```bash
dsh --profile desktop --dump-config
```
插件树中应能看到 `dsh-liquid-glass` 节点；界面元素呈液态玻璃效果，右侧小球可用。

## 实现
- `lib/client.js`：DSH 标准 Client 插件（`window.__ModuleLoader__.load`），内联液态玻璃库 bundle + 全局背景层 + 自绘设置面板。
- `lib/index.js`：host 半为空（无宿主服务），仅按 Cordis 约定导出，让 client bundle 被发现并注入浏览器。
- `cordis.patch.yml`：插入 profile 插件树。
- 样式防御：z-index 常规量级（9999/10000）；`html/body` 前缀 + `!important` 清除宿主皮肤注入；类名 `dshlg-` 前缀防冲突。

## 依赖（peerDependencies，由宿主提供）
- `@deepseek-ai/cordis`
- `@deepseek-ai/dsh-system-prompt`
- `@deepseek-ai/schemastery`
