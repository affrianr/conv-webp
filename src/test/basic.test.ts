import { describe, it, expect } from "vitest";

describe("Basic Test Suite", () => {
  it("should pass a simple arithmetic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle string operations", () => {
    expect("hello".toUpperCase()).toBe("HELLO");
  });

  it("should work with arrays", () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it("should handle async operations", async () => {
    const promise = Promise.resolve("test");
    await expect(promise).resolves.toBe("test");
  });

  it("should handle object comparisons", () => {
    const obj = { name: "test", value: 42 };
    expect(obj).toEqual({ name: "test", value: 42 });
    expect(obj).toHaveProperty("name", "test");
  });
});
