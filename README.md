# CineArm 官网

`https://cinearm.top` 的站点源码，由 GitHub Pages 托管。

- 仓库：`Kikuku10/CineArm-Website`（public —— 免费账号的 Pages 需要 public）
- 分支：`main`，根目录发布
- 自定义域名：`cinearm.top`（记录在 `CNAME` 文件里）
- 站点文件：`index.html` 单文件，无外部依赖（不引用 CDN，国内访问不依赖第三方）；`.nojekyll` 让 GitHub 跳过 Jekyll 构建

## 发新版后要做的事

下载按钮是直链到 `CineArm-Releases` 的发布附件，**发新版后需要手动改版本号**：

1. 打开 `index.html`，搜 `0.1.46`，全部替换成新版本号（badge、下载链接共 5 处）；
2. 顺手更新每端的文件大小；
3. `git commit && git push`。

如果嫌麻烦，可以把下载区改成读 `release-manifest.json` 动态渲染，但那要多一次网络请求。

## DNS 记录（Dynadot）

| 类型 | 主机 | 值 |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `kikuku10.github.io` |

DNS 模式必须是「Dynadot DNS」，不能是「域名停放」或「域名转发」。

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://127.0.0.1:8000
```
