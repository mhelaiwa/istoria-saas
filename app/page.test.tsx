import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the iStoria wordmark", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "iStoria" })).toBeInTheDocument();
  });

  it("renders a hello-world message", () => {
    render(<Home />);
    expect(screen.getByText(/hello, world/i)).toBeInTheDocument();
  });

  it("shows a build identifier", () => {
    render(<Home />);
    expect(screen.getByTestId("build-sha")).toHaveTextContent(/build/i);
  });
});
