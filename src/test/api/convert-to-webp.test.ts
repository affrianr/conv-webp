import { describe, it, expect, vi } from "vitest";
import { POST } from "@/app/api/convert-to-webp/route";
import { NextRequest } from "next/server";

// Mock sharp to avoid errors during testing
vi.mock("sharp", () => {
  return {
    default: vi.fn(() => ({
      webp: vi.fn(() => ({
        toBuffer: vi.fn(() => Promise.resolve(Buffer.from("mock-webp-buffer"))),
      })),
    })),
  };
});

// Helper to create a mock file
const createMockFile = (name: string, type: string, size: number): File => {
  const content = "a".repeat(size);
  const file = new File([content], name, { type });

  // Add arrayBuffer method for compatibility with the API
  Object.defineProperty(file, "arrayBuffer", {
    value: () => Promise.resolve(new TextEncoder().encode(content).buffer),
    writable: true,
  });

  return file;
};

describe("API Route: /api/convert-to-webp", () => {
  it("should return a 200 OK response for a valid image", async () => {
    // 1. Arrange
    const mockFile = createMockFile("test.webp", "image/webp", 1024);
    const formData = new FormData();
    formData.append("image", mockFile);
    formData.append("quality", "75");

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    // 2. Act
    const response = await POST(request);

    // 3. Assert
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.webpUrl).toMatch(/^data:image\/webp;base64,/);
    expect(body.originalSize).toBeGreaterThan(0);
    expect(body.webpSize).toBeGreaterThan(0);
    expect(body.quality).toBe(75);
  });

  it("should return a 400 Bad Request if no file is provided", async () => {
    // 1. Arrange
    const formData = new FormData();
    formData.append("quality", "75");

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    // 2. Act
    const response = await POST(request);

    // 3. Assert
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      error: "No image file provided",
    });
  });

  it("should return a 400 Bad Request for an unsupported file type", async () => {
    // 1. Arrange
    const mockFile = createMockFile("test.txt", "text/plain", 1024);
    const formData = new FormData();
    formData.append("image", mockFile);

    const request = {
      formData: async () => formData,
    } as unknown as NextRequest;

    // 2. Act
    const response = await POST(request);

    // 3. Assert
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      error: "The provided file is not an image",
    });
  });
});
