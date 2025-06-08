import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { Providers } from "./Providers.tsx";
import { Main } from "./Main/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Main />
    </Providers>
  </StrictMode>
);
