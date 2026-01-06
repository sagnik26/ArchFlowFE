# ArchFlow Frontend - Interactive Architecture Diagram Visualizer

> Beautiful, interactive architecture diagrams with real-time generation progress and React Flow visualization.

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/React%20Flow-11+-blueviolet.svg)](https://reactflow.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 Overview

ArchFlow Frontend is a modern React application that visualizes AI-generated architecture diagrams with interactive, draggable nodes and beautiful styling. It features seamless integration with the arch-flow Backend.

### ✨ Key Features

- 🎨 **Interactive Diagrams** - Drag, zoom, and pan through architecture diagrams
- 📡 **Real-time Progress** - Live updates during diagram generation (SSE)
- ⚡ **Fast & Responsive** - Optimized rendering with React Flow
- 🎭 **Beautiful UI** - Modern design with Tailwind CSS
- 🔄 **Auto-Layout** - Pre-positioned nodes by architectural layers
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🌈 **Component Styling** - Color-coded by type with custom shapes

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- arch-flow Backend running at `http://localhost:8080`

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/ArchFlow.git
cd ArchFlow

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

The app will start at `http://localhost:5173`

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:
```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Enable SSE streaming (default: true)
VITE_USE_STREAMING=true

# Development mode
VITE_MODE=development
```

## 🤝 Contributing

Contributions are always welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

---

**Made with ❤️ by the Sagnik Ghosh**
