# Rakshaayan Platform Frontend

## Quickstart

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Copy environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your backend URLs
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```

## Folder Structure

```
frontend/
├── app/                # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── (other routes)
├── components/         # Reusable UI components (custom + ShadCN wrappers)
│   └── ui/             # ShadCN components
├── lib/                # API clients, utility functions
│   └── api.ts
├── styles/             # Custom CSS modules (optional)
├── public/             # Static assets (images, favicon)
├── env.example         # Example environment variables
├── tailwind.config.mjs # Tailwind config with design tokens
├── postcss.config.mjs
├── tsconfig.json
├── app/globals.css     # Global styles and CSS variables
└── README.md
```

## Design System
- All color, typography, and effect tokens are set in `tailwind.config.mjs` and `app/globals.css`.
- Use Tailwind utility classes and ShadCN components for rapid UI development.

## ShadCN UI
- Scaffold new components with:
  ```bash
  npx shadcn-ui@latest add <component>
  ```
- Customize components in `components/ui/` as needed.

## API Clients
- Use the pre-configured Axios clients in `lib/api.ts` for each backend service.

## Start Building
- Create new pages in `app/`.
- Import and use ShadCN components from `components/ui/`.
- Use Tailwind classes and design tokens for layout and styling.

---
For more details, see the main project README and the design system documentation.
