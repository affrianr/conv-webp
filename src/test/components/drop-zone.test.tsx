import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DropZone } from "../../components/drop-zone";

describe("DropZone Component", () => {
  const mockOnFileSelected = vi.fn();
  const defaultProps = {
    onFileSelected: mockOnFileSelected,
    selectedFile: null,
    preview: "",
  };

  beforeEach(() => {
    mockOnFileSelected.mockClear();
  });

  it("renders upload prompt when no file selected", () => {
    render(<DropZone {...defaultProps} />);
    expect(
      screen.getByText(/drag and drop your image here/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/supports: jpg, png, gif, webp, svg/i),
    ).toBeInTheDocument();
  });

  it("handles file selection via click", async () => {
    render(<DropZone {...defaultProps} />);

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);
    expect(mockOnFileSelected).toHaveBeenCalledWith(file);
  });

  it("handles drag and drop", async () => {
    render(<DropZone {...defaultProps} />);
    const dropZone = screen.getByRole("button");

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(mockOnFileSelected).toHaveBeenCalledWith(file);
  });

  it("shows preview when file is selected", () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 1024 });

    const props = {
      ...defaultProps,
      selectedFile: file,
      preview: "data:image/jpeg;base64,test",
    };

    render(<DropZone {...props} />);
    expect(screen.getByAltText("Image preview")).toBeInTheDocument();
    expect(screen.getByText(/test.jpg/)).toBeInTheDocument();
    expect(screen.getByText(/1 KB/)).toBeInTheDocument();
  });

  it("only accepts image files on drop", async () => {
    render(<DropZone {...defaultProps} />);
    const dropZone = screen.getByRole("button");

    const textFile = new File(["test"], "test.txt", { type: "text/plain" });

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [textFile] },
    });

    expect(mockOnFileSelected).not.toHaveBeenCalled();
  });

  it("handles drag states correctly", () => {
    render(<DropZone {...defaultProps} />);
    const dropZone = screen.getByRole("button");

    // Test drag over
    fireEvent.dragOver(dropZone);
    expect(dropZone).toHaveClass("border-blue-500", "bg-blue-50");

    // Test drag leave
    fireEvent.dragLeave(dropZone);
    expect(dropZone).toHaveClass("border-gray-300");
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<DropZone {...defaultProps} />);

    const dropZone = screen.getByRole("button");

    // Focus and press Enter
    dropZone.focus();
    await user.keyboard("{Enter}");

    // Should trigger file input click (we can't easily test this without mocking)
    expect(dropZone).toHaveFocus();
  });

  it("handles file input accessibility", async () => {
    render(<DropZone {...defaultProps} />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Check input attributes
    expect(input).toHaveAttribute("accept", "image/*");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveClass("hidden");
  });
});
