# 架构总览

本项目学习了其他开源 Frp 站的结构，在拥有一个前后端站点供用户创建/修改/删除虚拟网络的同时，独立出另一个服务端口供 EasyTier 客户端连接。

项目架构图如下：

![](/assets/architecture-overview/架构图.png)

后端和组网核心只通过数据库连接，优点在于可以随时更新组网核心，而不影响前端站点的运行。

项目类图如下：

![](/assets/architecture-overview/类图.png)

项目用例图如下：

![](/assets/architecture-overview/用例图.png)

项目时序图见 [项目时序图](./sequence-diagram)。