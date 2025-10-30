import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="p-10">
      <h1 className="text-2xl font-bold">Kanban Assignment</h1>
      <p className="mt-2">
        This is the main Vite app. Run 
        <code className="bg-neutral-200 p-1 rounded mx-1">pnpm run storybook</code> 
        to see the component.
      </p>
    </div>
  </React.StrictMode>,
)
