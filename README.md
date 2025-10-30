# 🚀 Kanban Board Component

This is a production-grade, accessible, and high-performance Kanban board component built from scratch as part of a frontend developer assignment.

It features a clean UI, full drag-and-drop (mouse and keyboard), and is virtualized to handle large datasets.

## 🔴 Live Storybook

https://celadon-macaron-43a914.netlify.app/

---

## 🛠️ Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/kanban-assignment.git](https://github.com/your-username/kanban-assignment.git)
    cd kanban-assignment
    ```

2.  **Install dependencies:**
    (This project uses `npm`.)

    ```bash
    npm install
    ```

3.  **Run the Storybook:**
    ```bash
    npm run storybook
    ```
    This will open the component library at `http://localhost:6006`.

---

## 🏗️ Architecture

This project is built as a reusable, state-driven component.

- **React + TypeScript:** All components are built with React and strict TypeScript.
- **State Management:** The main `KanbanBoard.tsx` component acts as the "brain," managing all state logic via the `useKanbanBoard` hook. This hook handles creating, updating, and moving tasks.
- **Drag & Drop:** Implemented from scratch using the low-level hooks from `@dnd-kit/core` (`useDraggable`, `useDroppable`). [cite_start]This provides full keyboard accessibility [cite: 238] in addition to mouse/touch drag.
- **Performance:** The columns are virtualized using `react-window` and `react-virtualized-auto-sizer` to ensure high performance with 500+ tasks, as required[cite: 281].
- **Styling:** Styled with **Tailwind CSS** using the utility-first approach and the design tokens specified in the assignment[cite: 19].

---

## ✨ Features

- [x] **Drag & Drop:** Smooth drag and drop for tasks between and within columns.
- [x] **Full Keyboard Navigation:** Drag tasks using `Spacebar` + `Arrow Keys`[cite: 239].
- [x] **Task Management:** Create, Read, Update, and Delete tasks via an accessible modal.
- [x] **Performance:** Virtualized columns handle 50+ tasks with no lag.
- [x] **Search:** Real-time task filtering by title.
- [x] **Responsive Design:** Columns stack correctly on mobile devices.
- [x] **WIP Limits:** Columns visually and functionally enforce Work-In-Progress limits[cite: 211, 231].

---

## 💻 Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Storybook 10
- `@dnd-kit/core` (for drag-and-drop primitives)
- `react-window` + `react-virtualized-auto-sizer` (for virtualization)
