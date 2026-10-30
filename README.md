# cinearm.top

`cinearm.top` 的站点源码，由 GitHub Pages 托管。

- 仓库：`Kikuku10/Kikuku10.github.io`（`<用户名>.github.io` 仓库，Pages 会自动开启）
- 分支：`main`，根目录发布
- 自定义域名：`cinearm.top`（记录在 `CNAME` 文件里）
- 站点文件：`index.html` 单文件，无外部依赖；`.nojekyll` 让 GitHub 跳过 Jekyll 构建

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

## 改站点的流程

```bash
# 编辑 index.html 后
git add -A
git commit -m "Update site"
git push
```

推送后 GitHub Actions 会自动构建，通常 30 秒内生效。
