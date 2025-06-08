# Drag & Drop Todo Application

A modern, responsive todo application built with React, TypeScript, and Vite. Features intuitive drag-and-drop functionality for organizing tasks across customizable columns, perfect for kanban-style project management.

## ✨ Features

- **Drag & Drop Interface**: Seamlessly move todos between columns and reorder them
- **Column Management**: Create, edit, and delete custom columns
- **Todo Management**: Add, edit, delete, and mark todos as complete
- **Batch Operations**: Select multiple todos for bulk actions (move, delete, mark complete)
- **Search & Filter**: Find todos quickly with real-time search and status filtering
- **Theme Support**: Light, dark, and system theme modes
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Local Storage**: Automatically saves your data locally
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dnd-todo-task
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173` to see the application running.

## 🧪 Testing

The project uses Vitest with React Testing Library for comprehensive testing.

### Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (development)
npx vitest

# Run tests with UI
npx vitest --ui
```

### Test Structure

- **Unit Tests**: Component-level testing
- **Integration Tests**: Feature-level testing in `src/__tests__/integration/`
- **Test Utilities**: Helper functions and mocks in `src/test/`

Example test files:

- `todo-management.test.tsx` - Todo CRUD operations
- `column-management.test.tsx` - Column operations
- `drag-drop.test.tsx` - Drag and drop functionality
- `search-filter.test.tsx` - Search and filtering

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory.

## 🛠️ Technologies Used

### Core Technologies

- **React 19** - UI library with latest features
- **TypeScript 5.8** - Type safety and better developer experience
- **Vite 6** - Fast build tool and development server

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **CSS Custom Properties** - Theme system with light/dark mode
- **Classnames** - Conditional class composition

### Drag & Drop

- **@dnd-kit/core** - Modern drag and drop library
- **@dnd-kit/sortable** - Sortable components and utilities

### State Management

- **React Context** - Application state management
- **use-context-selector** - Optimized context consumption
- **immutability-helper** - Immutable state updates

### Development Tools

- **ESLint** - Code linting with TypeScript support
- **Husky** - Git hooks for code quality
- **Commitlint** - Conventional commit message linting

### Testing

- **Vitest** - Fast unit testing framework
- **@testing-library/react** - React component testing utilities
- **@testing-library/user-event** - User interaction testing
- **jsdom** - DOM environment for testing

### Icons & Assets

- **@heroicons/react** - Beautiful SVG icons
- **vite-plugin-svgr** - SVG React component generation

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── atoms/           # Basic building blocks (Button, Input, etc.)
│   └── molecules/       # Composed components (TodoCard, Column, etc.)
├── contexts/            # React Context providers
│   ├── ThemeContext/    # Theme management
│   └── TodoContext/     # Todo and column state management
├── hooks/               # Custom React hooks
├── Main/                # Main application component and logic
├── test/                # Testing utilities and setup
└── __tests__/           # Test files
    └── integration/     # Integration test suites
```

### Key Components

- **Main**: Root application component with drag-and-drop setup
- **Column**: Draggable column containing todos
- **TodoCard**: Individual todo item with actions
- **SearchAndFilterBar**: Search and filtering controls
- **ThemeToggle**: Theme switching component

### State Management

The application uses React Context for state management:

- **TodoContext**: Manages todos, columns, and their operations
- **ThemeContext**: Handles theme switching and persistence

## 🎯 Usage Guide

### Basic Operations

1. **Create a Column**: Click the "Need a column?" button to add a new column
2. **Add Todos**: Click "Add todo" button in any column
3. **Edit Items**: Click on todo or column titles to edit them inline
4. **Drag & Drop**:
   - Drag todos between columns or reorder within columns
   - Drag columns to reorder them

### Advanced Features

1. **Batch Selection**:

   - Check multiple todo checkboxes
   - Use batch action buttons (Delete, Mark Done/Undone, Move To)

2. **Search & Filter**:

   - Use the search bar to find specific todos
   - Filter by status (All, Finished, Unfinished)

3. **Theme Switching**:
   - Click the theme toggle to switch between light, dark, and system themes

## 🤝 Contributing

### Development Setup

1. **Fork the repository** and clone your fork
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Install dependencies**: `npm install`
4. **Start development server**: `npm run dev`

### Code Standards

- **TypeScript**: All new code should be written in TypeScript
- **ESLint**: Run `npm run lint` to check code style
- **Testing**: Add tests for new features
- **Commits**: Use conventional commit messages

### Testing Guidelines

- Write unit tests for new components
- Add integration tests for new features
- Ensure all tests pass: `npm run test`
- Maintain good test coverage

### Pull Request Process

1. **Update tests** for any new functionality
2. **Run linting**: `npm run lint`
3. **Run tests**: `npm run test`
4. **Update documentation** if needed
5. **Create pull request** with clear description

### Coding Conventions

- Use functional components with hooks
- Follow the existing folder structure
- Use TypeScript interfaces for props
- Implement proper error handling
- Add JSDoc comments for complex functions

## 📜 Scripts Reference

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run test`    | Run tests once           |
| `npm run lint`    | Run ESLint               |
| `npm run prepare` | Setup Husky git hooks    |

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `vite.config.ts` or kill the process using port 5173
2. **Build errors**: Ensure all TypeScript errors are resolved
3. **Test failures**: Check that all dependencies are installed and tests are up to date

### Performance Tips

- The app uses React.memo for component optimization
- Drag operations are optimized with proper key props
- Local storage operations are debounced

## 🙏 Acknowledgments

- **@dnd-kit** team for the excellent drag-and-drop library
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** team for the lightning-fast build tool
- **React Testing Library** for testing utilities
