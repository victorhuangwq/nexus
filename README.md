<div align="center">
  
# 🌟 Nexus

### ✨ Type a task, Nexus builds the workspace ✨

> ⚠️ **Work in Progress**: This project is under active development. Features may change and bugs may exist.

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-6B57FF?style=for-the-badge)](https://anthropic.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)

*A desktop command bar that turns any job-to-be-done into an instant, single-window workspace*

[🚀 Features](#-features) • [📸 Demo](#-demo) • [⚡ Quick Start](#-quick-start) • [🛠️ Tech Stack](#️-tech-stack) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 What is Nexus?

**Nexus** is a desktop command bar that turns any job-to-be-done—"plan a weekend in Kyoto," "track BTC/ETH," "export slides + email Alice"—into an instant, single-window workspace. It embeds the right web apps, pre-filters them, and remembers your layout so you stop chasing menus and juggling tabs.

<div align="center">
  <img src="https://via.placeholder.com/600x400/6B57FF/FFFFFF?text=Nexus+Demo" alt="Nexus Demo" width="600">
  <p><i>Type. Generate. Use. It's that simple.</i></p>
</div>

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🎨 Instant Workspace Creation
Type any task and get a perfectly configured workspace in seconds

### 🧠 Smart App Selection
AI understands your task and embeds the right web apps automatically

### 🖥️ Single-Window Focus
All your tools in one place - no more tab juggling or window chaos

</td>
<td width="50%">

### ⚡ Pre-Filtered Content
Apps open with the right context - search results, specific pages, relevant data

### 🎯 Layout Memory
Nexus remembers how you like your tools arranged for each type of task

### 🔧 Stop Menu Hunting
Direct access to what you need - no navigating through endless menus

</td>
</tr>
</table>

## 📸 Demo

### ✨ See the Magic in Action

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://via.placeholder.com/250x200/FF6B6B/FFFFFF?text=Calculator" alt="Calculator Demo" width="250">
        <br />
        <b>📊 "calculator"</b>
        <br />
        <i>Instant graphing calculator</i>
      </td>
      <td align="center">
        <img src="https://via.placeholder.com/250x200/4ECDC4/FFFFFF?text=Travel+Planner" alt="Travel Demo" width="250">
        <br />
        <b>✈️ "tokyo trip"</b>
        <br />
        <i>Travel planner with maps</i>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://via.placeholder.com/250x200/45B7D1/FFFFFF?text=Crypto+Tracker" alt="Crypto Demo" width="250">
        <br />
        <b>💰 "bitcoin"</b>
        <br />
        <i>Live crypto charts</i>
      </td>
      <td align="center">
        <img src="https://via.placeholder.com/250x200/F7DC6F/FFFFFF?text=Weather+App" alt="Weather Demo" width="250">
        <br />
        <b>🌤️ "weather"</b>
        <br />
        <i>Beautiful weather widget</i>
      </td>
    </tr>
  </table>
</div>

## ⚡ Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### 🚀 Installation

```bash
# Clone the magic ✨
git clone https://github.com/victorhuangwq/nexus.git
cd nexus

# Install dependencies 📦
npm install

# Set up your API key 🔑
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=your_key_here

# Launch Nexus! 🎉
npm run dev
```

## 🛠️ Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg" width="48" height="48" alt="Electron" />
        <br>Electron
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
        <br>React
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
        <br>TypeScript
      </td>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/chakra-ui/chakra-ui/main/media/logo-colored@2x.png" width="48" height="48" alt="Chakra UI" />
        <br>Chakra UI
      </td>
      <td align="center" width="96">
        <img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" />
        <br>Vite
      </td>
    </tr>
  </table>
</div>

## 📚 Documentation

### 🎮 Development Commands

```bash
npm run dev          # 🚀 Start development server
npm run build        # 📦 Build for production
npm test             # 🧪 Run test suite
npm run lint         # 🔍 Lint codebase
npm run preview      # 👀 Preview production build
```

### 🏗️ Project Structure

```
nexus/
├── 📂 src/
│   ├── 🎨 components/    # React components
│   ├── 🧠 services/      # AI & business logic
│   ├── 🎯 hooks/         # Custom React hooks
│   └── 🖥️ main/          # Electron main process
├── 📂 public/            # Static assets
├── 📂 tests/             # Test files
└── 📄 package.json       # Project config
```

## 🤝 Contributing

We love contributions! Whether it's bug fixes, new features, or documentation improvements.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  
### 🌟 Star us on GitHub!

Made with ❤️ by [Victor Huang](https://github.com/victorhuangwq)

[⬆ back to top](#-nexus)

</div>