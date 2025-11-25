# NEXUS // INSIGHT

> **AI 驱动的数据洞察终端 / A Cyber-Industrial AI Analytics Terminal**

![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-MVP-blue)
![Stack](https://img.shields.io/badge/tech-React%20%7C%20Gemini%20API%20%7C%20Tailwind-00FF41)

## 1. 愿景 (Vision)

**NEXUS // INSIGHT** 是一款以 AI 为核心驱动的轻量级商业智能（BI）工具。它并非传统笨重的数据管理软件，而是一把为创业者和产品经理打造的数据分析“瑞士军刀”。

核心理念：**AI 辅助理解，用户主导构建**。
通过极简的自然语言交互，降低数据分析门槛，让非技术用户也能像黑客一样高效地挖掘数据价值。

---

## 2. 核心功能 (Features)

### 🔌 数据源连接 (Data Connection)
- **PostgreSQL 直连**: 安全的只读模式连接线上数据库。
- **CSV 上传**: 针对本地数据的快速分析通道。

### 🧠 AI 辅助校准 (Schema Intelligence)
- **交互式清单**: AI 自动识别字段类型与业务含义（如将 `user_id` 识别为“用户唯一标识”）。
- **人工确认**: 用户掌握最终决定权，确保分析语义准确无误。

### 💬 自然语言查询 (Chat-to-SQL)
- **对话即分析**: 这是一个没有复杂拖拽界面的终端。输入 "Show me weekly sales trend"，系统自动生成 SQL 并绘制图表。
- **智能可视化**: 自动选择最合适的图表类型（柱状图、折线图、饼图等）。

### 📊 个人仪表盘 (Personal Dashboard)
- **钉选 (Pinning)**: 将对话中有价值的图表一键保存到仪表盘，构建长期的业务监控视图。

---

## 3. 技术栈 (Tech Stack)

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS (Custom "Cyber-Industrial" Design System)
*   **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
*   **Visualization**: Recharts
*   **Icons**: Lucide React

---

## 4. 快速开始 (Quick Start)

### 前置要求
*   Node.js v18+
*   Google Gemini API Key ([获取密钥](https://aistudio.google.com/app/apikey))

### 安装
```bash
git clone https://github.com/fanux/fulldb.git
cd fulldb
npm install
```

### 配置
在项目根目录创建 `.env` 文件（或设置环境变量）：

```env
# Google Gemini API Key (Required for Schema Analysis & Chat2SQL)
API_KEY=your_google_gemini_api_key_here

# Optional: Default Database Connection String
DATABASE_URL=postgresql://user:pass@host:port/db
```

### 运行
```bash
npm start
```
访问 `http://localhost:3000` 即可进入终端。

---

## 5. 设计美学 (Aesthetics)

项目采用 **"Cyber-Industrial"** 设计语言：
- **色彩**: Deep Void Black (#050505) 背景，配以 Matrix Neon Green (#00FF41) 高光。
- **排版**: 全局使用 Monospace 字体 (JetBrains Mono)，高信息密度。
- **交互**: 瞬时响应，无圆角 (0px border-radius)，硬朗的边框线条。

---

## 6. 路线图 (Roadmap)

- [x] MVP: PG/CSV 连接, AI Schema 分析, 基础 Chat2SQL
- [ ] 支持更多数据源 (MySQL, Snowflake)
- [ ] 复杂 SQL 生成 (Joins, Window Functions)
- [ ] 仪表盘布局自定义
- [ ] 团队分享与协作功能

---

## License

MIT License. Open for community contribution.