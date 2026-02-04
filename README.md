# Personal Portfolio

A modern, responsive personal portfolio website built with Next.js, React, and Tailwind CSS. Features smooth scrolling navigation, animated MetaBalls background, and showcases projects, work experience, and more.

## 🌐 Live Demo

**[View the live site →](https://kriskruse.github.io/Personal-Portfolio-app)**

## ✨ Features

- **Single Page Application** with smooth scroll navigation
- **Animated MetaBalls Background** for a modern visual effect
- **Responsive Design** that works on all screen sizes
- **Dark Mode Support** with system preference detection
- - Made for Dark Mode, Light mode is not tested.
- **Project Showcase** with interactive project cards
- **Changelog Section** to track updates

## 🛠️ Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with static export
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KrisKruse/Personal-Portfolio-app.git
   cd Personal-Portfolio-app
   ```

2. **Navigate to the app directory**
   ```bash
   cd my-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

### Running Locally

**Development mode** (with hot reload):
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build**:
```bash
npm run build
npm run start
```

### Building for Static Export

To generate a static export (for GitHub Pages or other static hosting):
```bash
npm run build
```
The static files will be output to the `out/` directory.

## 📁 Project Structure

```
my-app/
├── app/
│   ├── components/     # React components
│   ├── icons/          # SVG icons and icon components
│   ├── lib/            # Utility functions and data
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## 🚢 Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch via GitHub Actions.

To manually deploy:
```bash
npm run deploy
```

