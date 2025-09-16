import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import App from "./App";
import "./index.css"

const rootElememt = document.getElementById('root')!

if (!rootElememt.innerHTML){
    const root = createRoot(rootElememt)
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    )
}