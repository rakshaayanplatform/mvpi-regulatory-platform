# Getting Started – Rakshaayan Frontend Developer Guide

Welcome to the Rakshaayan Platform frontend! Follow these steps to get your local environment ready and start building pages, components, and integrations.

---

## 1. Clone the Repository

```bash
git clone <repo-url>
cd mvpi-regulatory-platform/frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Set Up Environment Variables

- Copy the example env file:
  ```bash
  cp env.example .env.local
  ```
- Edit `.env.local` and set the backend base URL:
  ```env
  NEXT_PUBLIC_API_BASE_URL=http://<backend-ip>:<port>
  # Example: http://localhost:8000
  ```
- All service URLs (auth, patient, etc.) will use this base URL automatically.

---

## 4. Run the Development Server

```bash
npm run dev
```
- Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Project Structure Overview

```
frontend/
├── app/                # Next.js App Router pages
├── components/         # UI components (custom + ShadCN)
│   └── ui/             # ShadCN components
├── lib/                # API clients (see api.ts)
├── styles/             # Custom CSS modules (optional)
├── public/             # Static assets
├── env.example         # Example env vars
├── tailwind.config.mjs # Design tokens
├── app/globals.css     # Global styles
└── README.md
```

---

## 6. Using ShadCN UI Components

- Scaffold a new component:
  ```bash
  npx shadcn-ui@latest add <component>
  # Example: npx shadcn-ui@latest add button
  ```
- Customize in `components/ui/` as needed.

---

## 7. Building Pages & Layouts

- Add new pages in `app/` (e.g., `app/login/page.tsx`).
- Use Tailwind classes and design tokens for layout and styling.
- Use ShadCN and custom components for UI.

---

## 8. API Integration

- Import API clients from `lib/api.ts`:
  ```ts
  import { authApi, patientApi } from '@/lib/api';
  ```
- Example usage:
  ```ts
  // Login
  await authApi.post('/login/', { email, password });
  // Fetch patient profile
  const res = await patientApi.get('/profile/');
  ```
- No need to change URLs in code—just update `.env.local` if backend moves.

---

## 9. Using Utility Libraries

- **Icons:** Use Heroicons or Lucide (`import { IconName } from 'lucide-react'`)
- **Tables:** Use TanStack Table for advanced tables
- **Forms:** Use React Hook Form + Zod for validation
- **Toasts:** Use `react-hot-toast` for notifications
- **Date/Time:** Use `date-fns` for date formatting

---

## 10. Accessibility & Best Practices

- Use semantic HTML and ARIA attributes
- Ensure all images/icons have `alt` text
- Use focus states and keyboard navigation
- Test color contrast (WCAG 2.1 AA)

---

## 11. Troubleshooting

- **API not connecting?** Check `.env.local` and backend status
- **Styles not applying?** Check Tailwind config and class names
- **Component not rendering?** Ensure correct import and usage
- **Build errors?** Run `npm run lint` and fix all issues

---

## 12. Next Steps

- Start with authentication and patient flows
- Build and test each page/component as per the design system
- Integrate other services as they become available

---

**Happy coding! If you have questions, check the README or ask the team.** 