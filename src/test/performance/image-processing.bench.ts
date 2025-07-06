import { bench, describe } from "vitest";

// Mock Sharp for benchmarking
const mockSharp = {
  webp: () => mockSharp,
  jpeg: () => mockSharp,
  png: () => mockSharp,
  toBuffer: async () => Buffer.from("mock-processed-data"),
};

// Create mock sharp function
const mockSharpFn = () => mockSharp;
Object.assign(mockSharpFn, {
  create: () => mockSharp,
});

// Replace sharp import for benchmarking
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sharpBench = mockSharpFn as any;

describe("Image Processing Benchmarks", () => {
  bench("WebP conversion performance", async () => {
    const testImage = Buffer.from("mock-image-data".repeat(1000));

    await sharpBench(testImage).webp({ quality: 80 }).toBuffer();
  });

  bench("JPEG to WebP conversion", async () => {
    const testImage = Buffer.from("jpeg-data".repeat(1000));

    await sharpBench(testImage).webp({ quality: 75 }).toBuffer();
  });

  bench("PNG to WebP conversion", async () => {
    const testImage = Buffer.from("png-data".repeat(1000));

    await sharpBench(testImage).webp({ quality: 85 }).toBuffer();
  });

  bench("High quality WebP conversion", async () => {
    const testImage = Buffer.from("high-quality-data".repeat(1000));

    await sharpBench(testImage).webp({ quality: 95 }).toBuffer();
  });

  bench("Low quality WebP conversion", async () => {
    const testImage = Buffer.from("low-quality-data".repeat(1000));

    await sharpBench(testImage).webp({ quality: 50 }).toBuffer();
  });

  bench("Large image processing simulation", async () => {
    // Simulate processing a large image
    const largeImageData = Buffer.from("large-image-data".repeat(10000));

    await sharpBench(largeImageData).webp({ quality: 80 }).toBuffer();
  });

  bench("Multiple small images processing", async () => {
    const promises = [];

    for (let i = 0; i < 10; i++) {
      const smallImage = Buffer.from(`small-image-${i}`.repeat(100));
      promises.push(sharpBench(smallImage).webp({ quality: 80 }).toBuffer());
    }

    await Promise.all(promises);
  });

  bench("API request simulation", async () => {
    // Simulate the full API request flow
    const formData = new FormData();
    const file = new File(["test-data".repeat(1000)], "test.jpg", {
      type: "image/jpeg",
    });
    formData.append("image", file);
    formData.append("quality", "80");

    // Simulate file reading
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Simulate Sharp processing
    await sharpBench(buffer).webp({ quality: 80 }).toBuffer();
  });

  bench("Memory allocation pattern", async () => {
    // Test memory allocation patterns
    const buffers = [];

    for (let i = 0; i < 5; i++) {
      const buffer = Buffer.from("test-data".repeat(500));
      const processed = await sharpBench(buffer)
        .webp({ quality: 80 })
        .toBuffer();
      buffers.push(processed);
    }

    // Clear buffers to test garbage collection
    buffers.length = 0;
  });
});
