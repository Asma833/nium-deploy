# NIUM Web Agent Portal

A modern React-based web portal for NIUM agents built with TypeScript and Vite.

## Features

- **State Management**

  - Redux Toolkit for global state management
  - React Hook Form for efficient form handling
  - React Query for server state management
    - Use hooks like `useQueryInvalidator` for query invalidation
    - ⚠️ Always use hooks that access the QueryClient via `useQueryClient()` instead of importing the client directly

- **UI/UX**

  - Responsive Shadcn and Material-UI components
  - Light/Dark mode support
  - Accessibility compliance

- **API Integration**
  - RESTful API integration via Axios
  - Request caching and optimization with React Query
  - Type-safe API interfaces

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install
```

## Usage

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Folder Structure

```
src/
├── assets/        # Static assets
├── components/    # Reusable UI components
├── features/      # Feature-based modules
├── hooks/         # Custom React hooks
├── layouts/       # Page layouts
├── pages/         # Route components
├── services/      # API services
├── store/         # Redux store configuration
├── types/         # TypeScript definitions
└── utils/         # Utility functions
```

## Naming Conventions

We follow strict naming conventions to maintain consistency throughout the codebase:

### Files

- **Components**: `PascalCase.tsx` (e.g., `Button.tsx`, `UserProfile.tsx`)
- **Custom Hooks**: `camelCase.ts` (e.g., `useAuth.ts`, `useFetch.ts`)
- **Type Definitions**: `kebab-case.types.ts` (e.g., `user-profile.types.ts`)
- **Utilities/Helpers**: `camelCase.ts` (e.g., `formatDate.ts`, `stringUtils.ts`)
- **Style Files**: `camelCase.ts` (e.g., `buttonStyles.ts`)
- **Constants**: `camelCase.ts` (e.g., `apiEndpoints.ts`)
- **Configuration Files**: `kebab-case.config.ts` (e.g., `api-client.config.ts`)
- **Schemas**: `camelCase.schema.ts` (e.g., `userSchema.schema.ts`)
- **Shadcn UI Components**: `kebab-case.tsx`
- **Shadcn Utilities**: `kebab-case.ts`

### Folders

All folders use `kebab-case` (e.g., `user-profiles`, `form-components`)

For more details, refer to `src/config/naming-convention.config.ts`

## Development

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test
```

## Configuration Files

Key configuration files in the project:

- **tsconfig.app.json**: TypeScript configuration for strict type checking and advanced compilation options
- **vite.config.ts**: Vite bundler configuration with plugins and build optimizations
- **eslint.config.js**: ESLint rules for code quality and consistency
- **.prettierrc**: Code formatting rules
- **jest.config.js**: Test runner configuration

## Environment Variables

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_ENV=development
```

## Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Additional Resources

- [Internal API Documentation](./docs/api.md)
- [Component Documentation](./docs/components.md)
- [State Management Guide](./docs/state-management.md)

## Support

Contact the development team through:

- Slack: #nium-support
- Email: dev-support@nium.com

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
