# 系统部署方案

## 1. 引言

### 1.1 编写目的
本文档旨在提供系统部署的详细方案，确保系统能够在目标环境中顺利运行。

### 1.2 适用范围
本文档适用于系统的部署阶段，涵盖了部署前的准备工作、部署步骤以及后续的验证和维护。

### 1.3 预期读者
本文档的预期读者包括系统管理员、运维人员以及相关技术支持人员。

### 1.4 参考文档

- [farm 构建文档](https://www.farmfe.org/docs/tutorials/build)
- [go 构建文档](https://go.dev/doc/install)
- [nunu 构建文档](https://go-nunu.github.io/nunu/config)
- [rust 构建文档](https://doc.rust-lang.org/cargo/commands/cargo-build.html)

## 2. 部署准备

### 2.1 环境要求
- 操作系统：不限，推荐使用 Linux
- 内存：至少 1GB
- 磁盘空间：至少 20GB
- 网络连接：稳定的互联网连接，需要有公网 IP 地址

### 2.2 软件要求
- 数据库：MySQL 8.0 或更高版本
- Web 服务器：Nginx

## 3. 部署方案
### 3.1 服务器资源
- 服务器域名：baka9.vip
- 服务器规格：2 核 CPU， 2GB 内存

### 3.2 官网和用户面板配置
前端网页的构建流程如下：
- 安装 bun
- 克隆代码库
- 安装依赖项
- 调用bun run build构建代码

之后可以将dist目录下的文件部署到 Nginx 服务器上。

nginx 配置如下：
```nginx
server
{
    listen 60000;
    listen 443 ssl http2 ;
    server_name hyacinth.baka9.vip;
    index index.php index.html index.htm default.php default.htm default.html;
    root /www/wwwroot/hyacinth.baka9.vip;
    #CERT-APPLY-CHECK--START
    # 用于SSL证书申请时的文件验证相关配置 -- 请勿删除
    include /www/server/panel/vhost/nginx/well-known/hyacinth.baka9.vip.conf;
    #CERT-APPLY-CHECK--END

    #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
    #error_page 404/404.html;
    ssl_certificate    /www/server/panel/vhost/cert/hyacinth.baka9.vip/fullchain.pem;
    ssl_certificate_key    /www/server/panel/vhost/cert/hyacinth.baka9.vip/privkey.pem;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_tickets on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    error_page 497  https://$host$request_uri;


    #SSL-END

    #ERROR-PAGE-START  错误页配置，可以注释、删除或修改
    error_page 404 /index.html;
    #error_page 502 /502.html;
    #ERROR-PAGE-END

    #PHP-INFO-START  PHP引用配置，可以注释或修改
    include enable-php-00.conf;
    #PHP-INFO-END

    #REWRITE-START URL重写规则引用,修改后将导致面板设置的伪静态规则失效
    include /www/server/panel/vhost/rewrite/hyacinth.baka9.vip.conf;
    #REWRITE-END

    #禁止访问的文件或目录
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.env|\.svn|\.project|LICENSE|README.md)
    {
        return 404;
    }

    #一键申请SSL证书验证目录相关设置
    location ~ \.well-known{
        allow all;
    }

    #禁止在证书验证目录放入敏感文件
    if ( $uri ~ "^/\.well-known/.*\.(php|jsp|py|js|css|lua|ts|go|zip|tar\.gz|rar|7z|sql|bak)$" ) {
        return 403;
    }

    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires      30d;
        error_log /dev/null;
        access_log /dev/null;
    }

    location ~ .*\.(js|css)?$
    {
        expires      12h;
        error_log /dev/null;
        access_log /dev/null;
    }
    
    access_log  /www/wwwlogs/hyacinth.baka9.vip.log;
    error_log  /www/wwwlogs/hyacinth.baka9.vip.error.log;
}
```

### 3.3 后端服务配置
后端服务的构建流程如下：
- 安装 Go
- 克隆代码库
- 安装依赖项
- 调用make build构建代码
- 将bin/server文件部署到服务器上
- 复制config/prod.yml到服务器上，并根据实际情况修改配置文件
- 启动服务：./server -c config/prod.yml

### 3.4 数据库配置
数据库的配置流程如下：
- 安装 MySQL
- 在后端项目下执行`nunu run`并选择`migration`命令，创建数据库表
- 检查数据库创建是否成功
- 可能需要修改数据库部分字符串的排序规则，以确保大小写敏感

### 3.5 EasyTier 配置
EasyTier 的配置流程如下：
- 安装 Rust
- 克隆代码库
- 执行`cargo build --release`构建代码
- 将`target/release/easytier-core`文件部署到服务器上
- 执行`./easytier-core --db_url <sql-url>`启动 EasyTier 服务，其中`<sql-url>`为数据库的连接字符串

## 4. 验证部署
- 访问前端页面，检查是否能够正常加载
- 尝试注册新用户，检查注册功能是否正常
- 尝试登录已注册用户，检查登录功能是否正常
- 尝试创建虚拟网络，检查网络创建功能是否正常
- 尝试连接虚拟网络，检查连接功能是否正常

## 5. 注意事项
- 确保服务器的防火墙规则允许访问所需的端口
- 定期备份数据库和配置文件，以防数据丢失

## 6.版本控制策略

本项目采用 Git 作为分布式版本控制系统，并严格遵循 Git Flow 工作流。Git Flow 为项目的不同阶段和不同类型的开发活动定义了清晰的分支模型，有助于团队协作、版本管理和发布。

### 6.1 Git Flow概述与分支管理

Git Flow 是一种成熟且广泛采用的分支管理策略，它通过定义特定的分支类型及其交互方式，有效地组织和管理复杂的开发流程。

* master分支
  * 作用：此分支是项目的生产就绪代码，永远保持稳定且可发布的状态。每次合并到 master分支的代码都应被视为一个新的发布版本。
  * 保护机制：master 分支应受到严格保护，禁止直接提交 。所有代码变更必须通过 Pull Request (PR) 或 Merge Request (MR) 流程，并经过至少两名团队成员的代码审查和 CI/CD 流程的验证后才能合并。
  * 版本标签：每次成功的合并到 master 分支都必须打上语义化版本标签，以便于追溯和管理。
  * 来源：master 分支只能从 release 分支或 hotfix 分支合并而来。

* develop分支
  * 作用：此分支是日常开发的主线，所有新功能的开发和集成都围绕此分支进行。它包含了最新完成和测试通过的功能。
  * 稳定性：develop 分支的代码应保持相对稳定，包含了即将发布的功能。
  * 合并来源：feature 分支在开发完成后会合并到 develop。hotfix 分支在修复完成后也会合并到 develop 以确保修复也包含在未来的版本中。
  * 同步：定期从 master 分支同步最新的生产环境修复，以避免不必要的冲突。

* feature分支：
  * 作用：用于开发单个新功能。每个功能都应该有自己的独立分支，以隔离开发过程，避免相互影响。
  * 创建：从 develop分支创建。命名规范应清晰反映其目的：feature/<功能描述>。
  * 开发周期：功能开发期间，应频繁地从 develop 分支拉取最新代码并进行合并，以保持本地分支与 develop 同步，减少最终合并时的冲突。
  * 合并：功能开发完成并通过单元测试和本地集成测试后，将 feature 分支合并回 develop分支。合并前经过代码审查。合并后会删除该 feature 分支。

* release分支：

  - 作用：当 develop 分支积累了足够的功能，准备进行发布时，会从 develop 创建一个 release 分支。此分支用于发布前的最后准备工作，包括测试、Bug 修复、版本号更新和文档更新。

  - 创建：从 develop 分支创建。命名规范：release/<版本号>。

  - 稳定性：一旦创建 release分支，除非是关键的 Bug 修复，否则不再允许添加新功能。所有针对 release 分支的提交都是 Bug 修复。

  - 合并：release分支稳定并准备发布后，它将被合并到 master 分支和 develop 分支。合并后删除该 release 分支。

* hotfix分支 ：

  - 作用：用于紧急修复生产环境 中的关键 Bug。当生产环境出现 Bug 且无法等待下一个常规发布周期时，使用 hotfix 分支。

  - 创建：从 master分支创建。命名规范：`hotfix/<Bug描述>`。

  - 修复：在 hotfix 分支上进行 Bug 修复。修复完成后，进行充分的测试。

  - 合并：hotfix 分支修复并测试通过后，它将被合并到 master 分支和 develop 分支。

### 6.2 提交信息规范

清晰、一致的提交信息是版本控制的关键组成部分，有助于团队成员理解代码变更的历史、目的和影响。所有 Git 提交信息必须遵循以下规范：

* 格式：遵循 Conventional Commits 规范，即 type(scope): subject。

  - type ：代表提交的类型，是动词，使用小写。

    * feat：新功能 (a new feature)

    - fix：Bug 修复 (a bug fix)
    - docs：文档更新 
    - style：代码格式、空白等（不影响代码逻辑）
    - refactor：代码重构（不增加新功能，不修复 bug）
    - perf：性能优化
    - test：添加或修改测试
    - build：构建系统或外部依赖的更改 
    - ci：CI 配置文件和脚本的更改 
    - chore：其他不修改 src 或 test 文件的更改 

- scope ：表示本次提交影响的范围。
- subject ：简明扼要地描述本次提交的目的，使用祈使句，首字母小写，不以句号结尾，不超过 50 个字符。

- 正文：解释提交的背景、原因、实现细节、做出的假设以及可能的影响。
- 页脚 ：用于引用相关的 Issue 编号、Breaking Changes (破坏性变更) 信息或相关联的 Pull Request。

### 6.3 代码审查

代码审查是确保代码质量、知识共享和潜在问题早期发现的关键环节。

- 流程：所有合并到 develop 和 master 分支的代码都必须通过 Pull Request (PR) 或 Merge Request (MR) 流程进行代码审查。
- 审查要求：
  - 每个 PR/MR 至少需要获得 两名团队成员 的批准，才能合并。
  - 审查人检查代码的正确性、可读性、性能、安全性、是否遵循编码规范以及测试覆盖率。
  - 审查人有权提出修改意见，发起人必须根据意见进行修改，直到代码达到合并标准。
- 工具集成：利用 Git 托管平台（如 GitHub, GitLab, Bitbucket）内置的 PR/MR 功能进行代码审查，包括评论、建议修改和状态跟踪。

### 6.4 Git 使用规范

- 分支命名：
  - `master, dev`
  - `feature/<功能名>` 
  - `release/<版本号>`
  - `hotfix/<Bug描述>`
- 禁止直接 Push：除了 CI/CD 流程或特殊情况外，严禁直接 push 到 master 和 develop 分支。所有变更必须通过 PR/MR。
- 经常拉取最新代码：在开始新工作前，从 develop 分支拉取最新代码，避免不必要的合并冲突。

* 解决冲突：在合并分支时遇到冲突，立即解决。解决冲突后，进行本地测试，确保功能正常。

* 避免大型提交：将大型功能分解为更小的、独立的提交。每个提交只包含一个逻辑变更，以便于审查和回溯。

## 7.持续集成实践

持续集成是一种软件开发实践，旨在频繁地将代码集成到共享仓库中，并通过自动化构建和测试来验证每次集成，尽早发现并解决集成问题。

### 7.1 CI 流程概述

本项目的 CI 流程将覆盖所有核心组件（前端、后端、核心组网工具），并采用以下主要步骤：

* 代码提交与推送：

  - 开发人员将本地代码变更提交到本地 Git 仓库，并推送到远程 Git 仓库的相应分支。

  - 当 feature 分支通过 PR 合并到 develop 分支时，直接推送到 develop、release、master 分支时，将触发 CI 流水线。

* 触发 CI/CD 流水线：

  - Git 仓库配置 Webhook，当有新的代码提交或合并到指定分支时，自动通知 CI 服务器触发对应的流水线。

  - 对于 develop 分支，每次合并都应触发完整的 CI 流程。

  - 对于 release 和 master 分支，触发 CI/CD (持续交付/部署) 流程。

* 代码拉取 (Checkout)：
  - CI 服务器从 Git 仓库拉取最新代码到构建工作空间。

* 环境准备与依赖安装：

  - 根据项目类型和技术栈，在 CI 环境中安装或确保存在必要的运行时和工具。

  - 前端网页 (Vue + Typescript + Farm + Bun)：
    - 确保 bun 已安装并可用。
    - 执行 bun install 安装所有前端依赖项。

  - 后端服务 (Go + nunu)：
    - 确保 Go 环境已安装并配置好。
    - 执行 go mod tidy 或 go mod download 安装 Go 模块依赖。

  - 核心组网工具 (Rust)：
    - 确保 Rust 和 Cargo 已安装并配置好。
    - 执行 cargo fetch 获取依赖项。

* 代码构建 (Build)：

  - 根据不同组件的构建脚本，执行相应的构建命令，生成可执行文件或部署包。

  - 前端网页：执行 bun run build 命令，将前端源代码编译、打包并优化，生成可部署的静态文件到 dist 目录。

  - 后端服务：执行 make build 命令，编译 Go 源代码，生成 bin/server 可执行文件。

  - 核心组网工具 (EasyTier)：执行 cargo build --release 命令，以发布模式编译 Rust 源代码，生成优化后的 target/release/easytier-core 可执行文件。

* 自动化测试 (Automated Testing)：

  - 确保代码变更不会引入新的问题或破坏现有功能。

  - 单元测试 (Unit Tests)：
    - 针对每个独立的函数、模块或类编写的测试。
    - 前端：使用 Jest/Vitest 运行 bun test。
    - 后端：执行 go test ./... 运行 Go 单元测试。
    - 核心组网工具：执行 cargo test 运行 Rust 单元测试。

  - 集成测试 (Integration Tests)：
    - 测试多个模块或组件协同工作的情况。
    - 后端服务与数据库的交互测试。

  - 端到端测试 (End-to-End Tests - E2E)：
    - 模拟用户从头到尾的真实使用场景，测试整个系统的功能。
    - 使用 Cypress、Playwright等工具。

* 代码质量检查 (Code Quality Checks)：

  - 使用静态代码分析工具检查代码，确保遵循编码规范、发现潜在的 Bug、安全漏洞和性能问题。

  - 前端：使用 ESLint、Prettier。

  - 后端：使用 GoLint、GoVet。

  - 核心组网工具：使用 Clippy。

  - 集成 SonarQube 等工具进行更全面的代码质量管理。

* 构建产物归档 (Artifact Archiving)：

  - 将成功构建生成的所有可部署文件和报告进行归档，以便后续部署或审计。

  - 前端：归档 dist/ 目录。

  - 后端：归档 bin/server 文件。

  - 核心组网工具：归档 target/release/easytier-core 文件。

* 通知与反馈：

  - CI 流水线执行完毕后，自动发送通知给相关人员。

  - 构建失败，应立即通知开发团队，以便及时修复问题。成功的构建也应发送通知。

  - 构建历史和报告应在 CI 工具的界面上可见，方便追溯和分析。

### 7.2 CI 工具选择与配置

本项目使用 Jenkins 作为核心 CI/CD 工具，因为它提供了强大的灵活性、可扩展性和丰富的插件生态系统。

- Jenkins 安装与配置：
  - 确保 Jenkins 服务器已稳定运行，并配置了必要的权限和凭据，以便访问 Git 仓库和部署目标服务器。
  - 安装必要的 Jenkins 插件。
  
- Pipeline as Code (Jenkinsfile)：
  - 使用 Jenkinsfile 来定义 CI/CD 流水线，并将其与项目代码一同存储在 Git 仓库中。这种“Pipeline as Code”的方法提供了以下优势：
    - 版本控制：流水线定义与代码同步，便于历史追溯和回滚。
    - 可审计性：所有流水线变更都在 Git 历史中可见。
    - 协作性：团队成员可以像开发代码一样开发和审查流水线。
    - 可移植性：方便在不同 Jenkins 实例间迁移。
  
- 多仓库支持：
  - 由于本项目包含前端、后端和核心组网工具三个独立的代码仓库，需要为每个仓库配置独立的 Jenkins Pipeline Job。
  
    使用 Jenkins 的多分支 Pipeline 功能，自动发现并运行每个分支下的 Jenkinsfile。

### 7.3 构建触发器与并行化

- Webhook 触发：在 Git 仓库中配置 Webhook，当代码推送到指定分支或创建/更新 Pull Request 时，自动触发 Jenkins Pipeline。
- 定时触发：对于某些不频繁变更但需要定期验证的项目，配置定时构建。
- 并行构建：Jenkins 可以配置多个构建代理，允许同时运行多个 Pipeline Job 中的多个 Stage，从而缩短整体构建时间。
- 共享库：为了避免在每个 Jenkinsfile 中重复编写相同的逻辑，创建了 Jenkins Shared Library，将常用功能封装为可重用的函数。

### 7.4 CI/CD 流程优化

- 本地预检查 (Pre-commit Hooks)：开发人员使用 Git Pre-commit Hooks 在提交代码前自动运行 Linter 和格式化工具，确保代码风格一致，减少 CI 阶段的失败。
- A/B 测试与灰度发布：在后续的持续部署阶段，引入 A/B 测试和灰度发布策略，逐步将新版本推广到用户，降低发布风险。
- 可观测性与监控：
  - 集成 Prometheus、Grafana 等工具，监控 CI/CD 流水线的健康状态、构建时长、成功率等关键指标。
  - 利用 Jenkins Blue Ocean可视化工具，提供直观的流水线运行视图。
- 回滚策略：确保 CI/CD 流程支持快速回滚到已知稳定版本的能力。构建产物归档是回滚的基础，结合部署脚本可以实现自动化回滚。
