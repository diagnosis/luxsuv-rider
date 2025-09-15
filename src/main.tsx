import {createRouter, RouterProvider} from "@tanstack/react-router";


import { routeTree } from "./routeTree.gen"
import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./index.css"

const router = createRouter({ routeTree})
const queryClient =  new QueryClient()

declare module '@tanstack/react-router'{
    interface Register {
        router: typeof router
    }
}

const rootElememt = document.getElementById('root')!

if (!rootElememt.innerHTML){
    const root = createRoot(rootElememt)
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        </StrictMode>
    )
}