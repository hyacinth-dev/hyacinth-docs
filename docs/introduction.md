# 项目概览

欢迎使用 [Hyacinth](https://hyacinth.baka9.vip/)！  
这是一个基于 EasyTier、Go 和 Vue 构建的虚拟组网平台，旨在为跨校园网络通信、远程开发、虚拟局域网游戏联机等场景提供轻量、高效的商业化组网解决方案。

## 主要功能

- 虚拟网络创建：用户可以创建多个虚拟网络，每个网络都可以设置独立的网络名称、密码和最大连接数。
- 虚拟 IP 分配：每个虚拟网络中的设备将获得一个唯一的虚拟 IP 地址，确保设备间的安全通信。
- DHCP 支持：支持 DHCP 功能，自动分配虚拟 IP 地址，简化网络配置。
- 多平台支持：提供 Windows、Linux 和 Android 客户端，确保不同操作系统的用户都能轻松接入虚拟网络。
- 兼容原版 EasyTier：支持原版 EasyTier 的客户端，用户可以继续使用现有的 EasyTier 客户端连接 Hyacinth 虚拟网络。

## 技术栈

- 前端：使用 Vue.js 构建用户界面，Vue Router 进行路由管理，Vuex 管理应用状态，Axios 进行 HTTP 请求，Vitest 进行单元测试。
- 后端：基于 Go 语言开发，使用 Gin 框架构建 RESTful API，Gorm 进行数据库操作，Swagger 提供 API 文档，GoMock 进行后端模拟测试。
- 数据库：使用 MySQL 存储用户数据和虚拟网络信息。
- 服务器核心：基于 EasyTier 核心进行修改和拓展。
- 客户端：提供 EasyTier GUI 客户端，支持 Windows、Linux 和 Android 平台，使用 Rust + Tauri 进行跨平台开发。

## 使用场景

- 跨校园网络通信：在不同校园或网络环境中，用户可以通过 Hyacinth 轻松建立虚拟网络，实现无缝通信。
- 远程开发：开发者可以在 Hyacinth 虚拟网络中进行协作开发，享受低延迟的网络连接。
- 虚拟局域网游戏联机：玩家可以通过 Hyacinth 创建虚拟局域网，实现多人游戏联机，享受更好的游戏体验。

## 相关链接

- [Hyacinth 官网](https://hyacinth.baka9.vip/)
- [EasyTier GitHub 仓库](https://github.com/hyacinth-dev/)