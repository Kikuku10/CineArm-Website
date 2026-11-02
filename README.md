# CineArm 官网 · cinearm.top

> 一个普通用户的影视机械臂站点：产品介绍、机型选型、入门科普、避坑指南、常见问题。

**[在线访问 → cinearm.top](https://cinearm.top)** ｜ [English](https://cinearm.top/en/)

---

## 这个仓库是什么

纯静态站点（HTML + CSS），部署在 GitHub Pages，绑定自定义域名 `cinearm.top`。
**没有构建步骤** —— 改完直接推 `main`，大约一分钟自动发布。

## 页面

| 路径 | 内容 |
| --- | --- |
| `index.html` | 首页：为什么现在拍得起、功能、机型、授权与下载 |
| `features.html` | 功能总览（进入 20 篇详解） |
| `docs/*.html` | 功能详解：工作台、时间线、路径、速度、跟焦、输出轨道… |
| `robots.html` | 支持机型与系列参数对照 |
| `devices.html` | 支持的设备：跟焦马达、索尼相机控制 |
| `basics.html` | 入门科普：机械臂由什么组成、控制柜、示教器、防抖算法 |
| `guide.html` | 避坑指南：二手选购、验机、价格区间、真实踩坑记录 |
| `plans.html` | 免费版与 Studio 对比 |
| `faq.html` | 常见问题（一条一句答案） |
| `disclaimer.html` | 免责声明 |
| `shortcuts.html` | 快捷键速查卡（A4 打印） |
| `en/` | 全部页面的英文镜像 |
| `share-poster.html` | 「一图流」海报的源页面 |

## 本地预览

```sh
python3 -m http.server 8000
# 打开 http://127.0.0.1:8000
```

## 目录结构

```
.
├── assets/
│   ├── site.css          # 全站样式（单文件）
│   └── img/              # 界面截图、分享图、海报
├── docs/                 # 功能详解（中文 20 篇）
├── en/                   # 英文镜像（同样 20 篇 + 顶层页面）
├── app-icon.svg          # 站点图标
├── CNAME                 # cinearm.top
└── .nojekyll
```

## 维护约定

- **改样式**：`assets/site.css`，然后把全站 `site.css?v=N` 统一加一，避免浏览器用旧缓存。
- **功能详解页**：由仓库外的构建脚本生成（`doc_content.py` → `build_v2.py`），不要手改 `docs/*.html`。
- **导航**：全站统一 8 个入口，顺序固定，由脚本一次性写入所有页面。
- **新增页面**：记得同时补 `en/` 镜像与 `hreflang`。

## 相关仓库

- [CineArm-Releases](https://github.com/Kikuku10/CineArm-Releases) —— 安装包与版本记录

## 说明

本站为个人项目，非公司官网。内容为个人经验分享，价格随行情变化，不构成购买建议。
详见 [免责声明](https://cinearm.top/disclaimer.html)。
