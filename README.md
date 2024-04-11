# cf-claude-bedrock-proxy

A Cloudflare worker script to proxy Anthropic‘s request to AWS Bedrock Service

使用 Cloudflare Worker 代理 Anthropic 的请求到 AWS Bedrock 服务

**目前仅支持非流式接口，例如沉浸式翻译！**

**目前仅支持非流式接口，例如沉浸式翻译！**

**目前仅支持非流式接口，例如沉浸式翻译！**

AWS 流式返回的请求头中 Content-Type 为 application/vnd.amazon.eventstream，这种格式需要另外处理，暂时不支持。

## 使用说明

将 index.js 中的 REGION 变量修改为你的 AWS 区域，项目目录下执行 npm run build 生成 worker.js，将生成的代码复制到 Cloudflare Worker 控制台中，然后部署。
如果你不想克隆项目到本地，你也可以直接在仓库的 worker.js 中找到 REGION 变量修改。

以沉浸式翻译为例:
APIKEY 填写格式为 accessKeyId=XXXXXX;secretAccessKey=XXXXXX
将 XXXXXX 替换为你的 accessKeyId 和 secretAccessKey。
自定义 API 接口地址写 Cloudflare Worker 的 URL。
