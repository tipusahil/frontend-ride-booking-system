import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import router from './routes/routes.tsx'
import { store } from "./redux/store.ts"
import { Provider as ReduxProvider } from 'react-redux'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <ReduxProvider store={store}>
    <RouterProvider router={router}/>
     <Toaster richColors position='top-center' duration={3000} />
    {/* router provider e app ta render hobe. */}
    </ReduxProvider>
  </StrictMode>,
)
