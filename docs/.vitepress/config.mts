import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "Hyacinth Docs",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '文档主页', link: '/' },
      { text: '用户面板', link: 'https://hyacinth.baka9.vip/user/dashboard' }
    ],
    logo: '/logo.png',

    sidebar: [
      {
        text: '产品信息',
        items: [
          { text: '项目概览', link: '/introduction' },
          { text: '快速开始', link: '/quick-start' },
          { text: 'API 参考', link: '/api-reference' },
        ]
      },
      {
        text: '开发日志',
        items: [
          { text: '开发计划', link: '/development-plan' },
          {
            text: '项目架构',
            collapsed: false,
            items: [
              { 'text': '架构总览', link: '/project-architecture/architecture-overview' },
              { 'text': '项目时序图', link: '/project-architecture/sequence-diagram' },
            ]
          },
          { text: '组会记录', link: '/meeting-notes' },
          { text: '单元测试', link: '/unit-tests' },
          {
            text: '集成测试',
            collapsed: false,
            items: [
              { 'text': '测试计划', link: '/test-plan' },
              {
                text: '用户界面测试',
                collapsed: false,
                items: [
                  { 'text': '测试阶段一', link: '/frontend-test/test-Web-1' },
                  { 'text': '测试阶段二', link: '/frontend-test/test-Web-2' },
                  { 'text': '测试阶段三', link: '/frontend-test/test-Web-3' },
                ]
              },
              {
                text: '客户端连接测试',
                collapsed: false,
                items: [
                  { 'text': '总览', link: '/client-test/client-test-overview' },
                  { 'text': '测试阶段一', link: '/client-test/test-GUI-1' },
                  { 'text': '测试阶段二', link: '/client-test/test-GUI-2' },
                  { 'text': '测试阶段三', link: '/client-test/test-GUI-3' },
                ]
              },
            ]
          }
        ]
      }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Hyacinth'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hyacinth-dev/' }
    ]
  }
})
