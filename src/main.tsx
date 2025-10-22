import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import router from './routes/routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <RouterProvider router={router}/>
    {/* router provider e app ta render hobe. */}
  </StrictMode>,
)
