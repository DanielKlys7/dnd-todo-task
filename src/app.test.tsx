import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Providers } from "./Providers";
import { Main } from "./Main";

describe("App", () => {
  it("renders the main application UI", () => {
    render(
      <Providers>
        <Main />
      </Providers>
    );

    const mainAppElement = screen.getByRole("main");
    expect(mainAppElement).toBeInTheDocument();
  });
});
