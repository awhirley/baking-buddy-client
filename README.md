# Baking Buddy Client 🍪

A modern, full-featured web application for collecting, viewing and altering recipies over time. Built with React and TypeScript, Baking Buddy provides an intuitive interface for bakers of all skill levels to organize their favorite recipes and make changes to ingredients or instructions over many baking attempts. 

---

## ✨ Features

- **Recipe Collection** - Create a curated collection of baking recipes
- **Modify Recipes** - Update your recipes' ingredients and instructions, and view past versions
- **Recipe Details** - View comprehensive recipe information including ingredients, steps, and baking notes
- **Bake Reporting** - Post photos and reviews of your bakes, take notes on the outcome, and view them again before your next bake
- **Real-time Sync** - Seamless data synchronization with backend services
- **Type-Safe Development** - Full TypeScript support for robust, maintainable code

---

## 🛠️ Technology Stack

### Frontend Framework & Build Tools
- **React** (v19.2.8) - Modern UI library with hooks and concurrent rendering
- **TypeScript** (v6.0.2) - Type-safe JavaScript for scalable development
- **Vite** (v8.2.0) - Lightning-fast build tool with HMR (Hot Module Replacement)

### Styling & UI Components
- **Tailwind CSS** (v4.3.3) - Utility-first CSS framework for rapid UI development
- **Lucide React** - Beautifully consistent icon library
- **Shadcn** - Component library
- **CVA (Class Variance Authority)** - Type-safe component variant management

### Routing & Data Management
- **React Router DOM** (v7.18.2) - Client-side routing and navigation
- **TanStack React Query** (v5.101.4) - Powerful server state management and caching

### API & Backend Integration
- **Axios** (v1.19.0) - Promise-based HTTP client for API requests
- **Supabase** (v2.112.2) - Open-source Firebase alternative for backend services

### Developer Experience
- **ESLint** - Code quality and consistency enforcement
- **Component Library** - shadcn-styled components for consistent UI patterns

---

## 📁 Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Full-page components for routing
├── services/        # API and backend integration
├── lib/             # Utility functions and helpers
├── types/           # TypeScript type definitions
├── routes.tsx       # Route configuration
├── App.tsx          # Root application component
└── index.css        # Global styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/awhirley/baking-buddy-client.git
cd baking-buddy-client

# Install dependencies
npm install
```

### Development

```bash
# Start the development server with hot reload
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

### Code Quality

```bash
# Run ESLint to check code quality
npm run lint
```

---

## 📖 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home page - Browse recipes |
| `/create` | Create a new recipe |
| `/view/:id` | View detailed recipe information |

---

## 🔧 Configuration Files

- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript compiler options
- **`tailwind.config.js`** - Tailwind CSS customization
- **`components.json`** - Component library configuration
- **`eslint.config.js`** - ESLint rules and standards

---

## 📚 Learn More

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Supabase Docs](https://supabase.com/docs)

---

**Happy Baking! 🎂**