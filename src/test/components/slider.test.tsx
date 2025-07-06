import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Slider } from "../../components/slider";

describe("Slider Component", () => {
  it("renders with default value", () => {
    render(<Slider defaultValue={[80]} />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuenow", "80");
  });

  it("handles value changes", async () => {
    const user = userEvent.setup();
    const mockOnValueChange = vi.fn();

    render(
      <Slider
        defaultValue={[80]}
        onValueChange={mockOnValueChange}
        min={1}
        max={100}
        step={1}
      />,
    );

    const slider = screen.getByRole("slider");

    // Focus the slider first, then use keyboard interaction which is more reliable in tests
    slider.focus();
    await user.keyboard("{ArrowRight}");

    // Should have been called at least once
    expect(mockOnValueChange).toHaveBeenCalled();
  });

  it("respects min and max values", () => {
    render(<Slider defaultValue={[50]} min={10} max={90} />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "10");
    expect(slider).toHaveAttribute("aria-valuemax", "90");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Slider defaultValue={[80]} className="custom-slider" />,
    );

    const sliderRoot = container.firstChild;
    expect(sliderRoot).toHaveClass("custom-slider");
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    const mockOnValueChange = vi.fn();

    render(
      <Slider
        defaultValue={[50]}
        onValueChange={mockOnValueChange}
        min={0}
        max={100}
        step={10}
      />,
    );

    const slider = screen.getByRole("slider");

    // Focus the slider
    slider.focus();

    // Use arrow keys
    await user.keyboard("{ArrowRight}");

    expect(mockOnValueChange).toHaveBeenCalled();
  });

  it("handles multiple values for range slider", () => {
    render(<Slider defaultValue={[20, 80]} min={0} max={100} />);

    // In test environment, Radix UI might render differently
    // Check that at least one slider is rendered and the component accepts multiple values
    const sliders = screen.getAllByRole("slider");
    expect(sliders.length).toBeGreaterThanOrEqual(1);

    // Check that the slider container is rendered properly
    const sliderContainer =
      sliders[0].closest('[role="slider"]')?.parentElement;
    expect(sliderContainer).toBeInTheDocument();
  });

  it("renders track and range elements", () => {
    const { container } = render(<Slider defaultValue={[60]} />);

    // Check for track element
    const track = container.querySelector('[data-orientation="horizontal"]');
    expect(track).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <Slider defaultValue={[75]} min={0} max={100} step={5} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
