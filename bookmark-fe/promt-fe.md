📝 **Project Title: Bookmark Manager**

🎯 **Objective:**  
Build a web-based Bookmark Manager where users can add, view, and delete website links.
Treat it as if it will be used by millions of users, so apply scalable architecture, clean structure, and high-quality code.

---

📌 **Feature Requirements (Frontend only):**

### Add Bookmark Form

- **Fields:**
  - Title (required, string, min length 1)
  - URL (required, must be a valid URL format)
  - Description (optional, string)
- **Form Validation:** Real-time error display (errors appear as the user types or on submit).
- **Success Feedback:** Show a success message (e.g., toast notification or inline text) after successful submission.

### Bookmark Listing Page

- **Display:** Show all bookmarks in reverse chronological order (newest first).
- **Item Details:** Each bookmark displays:
  - Title (plain text)
  - URL (clickable link, opens in a new tab)
  - Description (optional, plain text)
- **Scalability:** Support rendering large datasets (1k–5k items) with either:
  - Infinite Scroll: Use virtualization (e.g., `react-window`) for smooth performance.
- **Delete Functionality:** Each bookmark has a "Delete" button; optional confirmation dialog before deletion.
- **UI States:** Handle loading (spinner), error (message), and empty states ("No bookmarks found").

---

💻 **Frontend Tech Stack Requirements:**

### React.js with Next.js:

- Use **App Router** (Next.js 15) for routing and layouts.
- Configure `next.config.js` if needed (e.g., for image optimization or custom settings).

### TypeScript:

- All components, hooks, and utilities must have explicit type definitions.

### Redux Toolkit:

- Use `configureStore` for store setup with default middleware.
- Avoid Redux Thunk or Saga unless critical (focus on RTK Query).

### RTK Query:

- Define an API slice (`features/bookmarks/api.ts`) with:
  - `getBookmarks`: GET `/bookmarks?page=X&limit=Y` (virtualization and Infinite loading support)
  - `addBookmark`: POST `/bookmarks` (body: `{ title, url, description }`)
  - `deleteBookmark`: DELETE `/bookmarks/:id`
- Use `providesTags` and `invalidatesTags` for cache management (e.g., invalidate on add/delete).

### React Hook Form + Zod:

- Use `zodResolver` from `@hookform/resolvers/zod` in `useForm`.
- Define schemas in `utils/zodSchemas.ts` (e.g., `bookmarkSchema` with title, url, description).
- Set `mode: 'onChange'` for real-time validation.

### TailwindCSS (v4):

- Apply mobile-first responsive design (e.g., list on mobile, grid on desktop).
- Optional: Support dark mode with `dark:` prefix.

### Theme Support (Dark/Light + Custom Colors):

- Implement a **global theme system** using Redux Toolkit.
- Theme state includes:
  - `mode`: `'light' | 'dark'`
  - `color`: `'blue' | 'green' | 'red'`
- Use `class="dark"` and `data-theme="blue"` attributes on the root layout element (`<html>` or `<body>`) to apply theme dynamically.
- Use **Tailwind CSS with `darkMode: 'class'`** and extend colors using **CSS variables** (e.g., `--color-primary`, `--color-bg`, `--color-text`).
- Define CSS variable sets for each `data-theme` in `globals.css`.
- Tailwind `theme.extend.colors` must use these variables (e.g., `primary: var(--color-primary)`).
- Apply UI styles using `bg-primary`, `text-text`, etc., to automatically adapt to both theme mode and color.

### Performance:

- the app has a large lists, implement infinite scroll with virtualization (`react-window`).
- Use `React.memo` for `BookmarkItem` and `useMemo` / `useCallback` where applicable.

### Performance Strategy: Rendering Large Lists (1k–5k items) Efficiently

The app must render and update **1,000–5,000 bookmarks smoothly**, with no lag or scroll freeze. Apply the following best practices:

#### TODO:

    1. Infinite Loading (Cuộn vô hạn)
      Cách hoạt động:
      Frontend tải một phần dữ liệu ban đầu (ví dụ: 20 items) từ backend.
      Khi người dùng cuộn chuột đến cuối danh sách, frontend tự động gọi API để lấy thêm dữ liệu (ví dụ: GET /bookmarks?page=2&limit=20) và nối vào danh sách hiện tại.
      Triển khai:
      Sử dụng event scroll hoặc thư viện như IntersectionObserver để phát hiện khi người dùng cuộn đến cuối.
      Gọi API phân trang và cập nhật state để hiển thị thêm items.
    2. Virtualization (Danh sách ảo)
      Cách hoạt động:
      Frontend chỉ render các items đang hiển thị trong viewport (khu vực người dùng nhìn thấy trên màn hình), ví dụ: 10-20 items thay vì toàn bộ danh sách.
      Khi người dùng cuộn, các thành phần được tái sử dụng để hiển thị dữ liệu mới mà không tạo thêm DOM nodes.
      Triển khai:
      Sử dụng thư viện như react-window (NOT react-virtualized).
      kết hợp với phân trang, frontend chỉ cần tải dữ liệu cần thiết cho vùng hiển thị.
    3.PHẢI Kết hợp Infinite Loading + Virtualization
      Cách hoạt động:
      Tải dữ liệu theo từng phần từ backend (infinite loading).
      Chỉ render các items trong viewport bằng virtualization.
      Triển khai:
      Gọi GET /bookmarks?page=1&limit=20 để lấy dữ liệu ban đầu.
      Dùng react-window để render danh sách ảo.
      Khi cuộn đến gần cuối vùng hiển thị, nhớ là gần cuối nhé, cách 5 items nữa là hết, gọi API để lấy thêm dữ liệu (page=2, page=3, v.v.).

#### Virtualization (Core Strategy)

- Use `react-window` (not `react-virtualized`) for lightweight list rendering.
- Use `FixedSizeList` if item height is constant, or `VariableSizeList` if dynamic.
- If implementing infinite scroll, combine with `react-window-infinite-loader` for progressive rendering.
- Example structure:
  - `BookmarkList.tsx`: wraps `FixedSizeList` with memoized row render function.
  - Each row renders a `BookmarkItem`, receiving data from `itemData` array.

#### Memoization

- Wrap `BookmarkItem` with `React.memo` to avoid unnecessary re-renders.
- Use `useCallback` for delete handlers.
- Use `useMemo` for computed props or filtered list segments.

#### Avoid Anti-patterns

- Do not render full `<ul>{bookmarks.map(...)}</ul>` without virtualization or paging.
- Avoid inline functions or objects inside `.map()` or render.

#### UX Smoothing

- Show a loader placeholder or shimmer for visible rows while data is loading.
- Display empty state placeholder (`"No bookmarks yet"`) when applicable.
- Animate bookmark entry with subtle fade/slide for polish (optional).

#### Scroll Handling

- If infinite scroll is used, debounce scroll events to avoid excessive loads.
- Limit how many DOM elements are in memory at once via virtualized range.

#### Accessibility & Keyboard

- Ensure virtualized rows still support keyboard navigation & screen readers.

> Goal: The app must maintain <16ms per frame render time at all times — even with 5,000 bookmarks.

---

🧠 **Advanced UX and Dev Guidelines:**

- Use infinite scroll + virtualization (must have), debounce fetching and ensure stable scroll behavior.
- Ensure proper HTML semantics (e.g., use `<form>`, `<label>`, `aria-attributes`), keyboard navigation, and focus management for accessibility (a11y).
- Gracefully handle frontend rendering errors using **Error Boundaries** or fallback UIs for critical sections (e.g., `BookmarkList`).
- Apply all best practices of Next.js app, frontend design pattern (Container & Presentational, HOCs, Hooks Pattern, Compound Components, Headless Components ) when implementing UI components
- I have built some files with some boilerplate, let's build the app from those scaffolders

---

✅ **Code Quality & Structure:**

### Code Quality Enforcement (ESLint + Prettier + Husky)

- Set up **ESLint** with recommended rules for React + TypeScript + Tailwind CSS.
- Set up **Prettier** for consistent code formatting.
- Configure **Husky** with Git hooks to run **pre-commit checks**:
  - Use `lint-staged` to run `eslint --fix` and `prettier --check` only on staged files.
- Example desired behavior:
  - When a developer commits, ESLint must auto-fix issues if possible.
  - If code still violates ESLint rules or fails formatting, the commit must be blocked.
- Ensure that project must include the following:
  - `eslint.config.mjs`, `.prettierrc`, and `.husky/pre-commit`
  - `package.json` scripts:
    ```json
    {
      "scripts": {
        "lint": "eslint . --ext .ts,.tsx",
        "format": "prettier --write .",
        "prepare": "husky install"
      }
    }
    ```

> Goal: Ensure the codebase always adheres to linting and formatting standards before any code is committed.

- My existed scaffolder folder structure:

```plaintext
└── src/
    ├── app/                 (Next.js App Router)
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/          (Reusable UI components)
    │   └── Button.tsx
    ├── hooks/               (Custom React hooks)
    │   └── index.ts
    ├── types/              (TypeScript types/interfaces)
    │   └── index.ts
    ├── services/            (API calls and external services)
    │   └── index.ts
    ├── stores/              (State management - Redux Toolkit Slice store here)
    └── utils/               (Utility functions)
        └── index.ts
```
