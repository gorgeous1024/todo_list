# TodoApp - SvelteKit Task Management Application

A modern, responsive task management application built with SvelteKit, TypeScript, and Tailwind CSS. This application provides an intuitive interface for creating, managing, and tracking tasks with multiple view modes, advanced filtering, and real-time updates.

## 🚀 Features

### Core Functionality
- ✅ **Task Management**: Create, read, update, and delete tasks
- 📝 **Rich Task Details**: Title, description, due dates, priorities, and status
- 📸 **Image Attachments**: Upload and attach images to tasks
- 🔄 **Status Tracking**: Todo, In Progress, and Done states
- ⚡ **Optimistic Updates**: Instant UI feedback with backend synchronization

### User Interface
- 🌓 **Dark/Light Mode**: System-aware theme switching
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 👁️ **Multiple Views**: List, Grid, and Kanban board layouts
- 🔍 **Advanced Filtering**: Filter by status, priority, completion, and search
- 📊 **Task Statistics**: Real-time overview of task completion rates

### Technical Features
- 🎯 **TypeScript**: Full type safety throughout the application
- ✨ **Modern UI**: Clean design with smooth animations
- 🧪 **Comprehensive Testing**: Unit, integration, and E2E tests
- 📐 **Form Validation**: Client-side validation with Zod schemas
- ♿ **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Tech Stack

- **Framework**: [SvelteKit 2.0+](https://kit.svelte.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide Svelte](https://lucide.dev/)
- **Validation**: [Zod](https://github.com/colinhacks/zod)
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-list
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   │   ├── Header.svelte
│   │   ├── TaskCard.svelte
│   │   ├── TaskForm.svelte
│   │   ├── KanbanBoard.svelte
│   │   └── ...
│   ├── stores/              # Svelte stores for state management
│   │   └── tasks.ts
│   ├── services/            # API communication layer
│   │   └── api.ts
│   ├── schemas/             # Zod validation schemas
│   │   └── task.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── utils/               # Utility functions
│       └── index.ts
├── routes/                  # SvelteKit routes
│   ├── +layout.svelte       # Main application layout
│   ├── +page.svelte         # Dashboard page
│   ├── tasks/
│   │   └── +page.svelte     # All tasks view
│   ├── kanban/
│   │   └── +page.svelte     # Kanban board view
│   └── task/
│       ├── new/
│       │   └── +page.svelte # Create task form
│       └── [id]/
│           └── +page.svelte # Task detail/edit page
├── test/                    # Test setup and utilities
└── app.css                  # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run check` - Type check with svelte-check

## 🌐 API Integration

The application is designed to work with a REST API backend. Configure the API base URL in `src/lib/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000/api'; // Change to your API URL
```

### Expected API Endpoints

- `GET /api/tasks/` - Get all tasks
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get task by ID
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task
- `GET /api/tasks/nearest-deadline/` - Get task with nearest deadline

### Task Data Structure

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  photo?: string;
  completed: boolean;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}
```

## 🎨 Customization

### Theming
The application supports both light and dark themes. Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary color palette
      }
    }
  }
}
```

### Components
All components are modular and customizable. Key components include:

- **TaskCard**: Individual task display
- **TaskForm**: Create/edit task form
- **KanbanBoard**: Drag-and-drop board view
- **FilterBar**: Advanced filtering interface

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
- **Components**: User interactions and state changes
- **Stores**: State management and derived values
- **Utils**: Helper functions and utilities
- **E2E**: Complete user workflows

## 📱 Mobile Support

The application is fully responsive and provides an optimized mobile experience:

- Touch-friendly interface
- Responsive grid layouts
- Mobile navigation menu
- Optimized form inputs

## ♿ Accessibility

- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Semantic HTML structure

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload 'build' directory to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run tests: `npm run test && npm run test:e2e`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Vercel](https://vercel.com/) for deployment platform

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](https://kit.svelte.dev/docs)
2. Search [existing issues](https://github.com/your-repo/issues)
3. Create a [new issue](https://github.com/your-repo/issues/new)

---

Made with ❤️ using SvelteKit and TypeScript