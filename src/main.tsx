import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import "./index.css"

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElememt = document.getElementById('root')!

if (!rootElememt.innerHTML){
    const root = createRoot(rootElememt)
    root.render(
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    )
}