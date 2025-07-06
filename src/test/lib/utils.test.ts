import { describe, it, expect } from "vitest";
import { cn } from "../../lib/utils";

describe("Utils", () => {
  describe("cn function", () => {
    it("merges class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("handles conditional classes", () => {
      expect(cn("base", true && "conditional", false && "hidden")).toBe(
        "base conditional",
      );
    });

    it("merges tailwind classes with deduplication", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
      expect(cn("text-sm", "text-lg")).toBe("text-lg");
    });

    it("handles undefined and null values", () => {
      expect(cn("base", undefined, null, "valid")).toBe("base valid");
    });

    it("handles empty strings", () => {
      expect(cn("", "valid", "")).toBe("valid");
    });

    it("handles arrays of classes", () => {
      expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
    });

    it("handles objects with boolean values", () => {
      expect(
        cn({
          class1: true,
          class2: false,
          class3: true,
        }),
      ).toBe("class1 class3");
    });

    it("handles complex tailwind conflicts", () => {
      expect(
        cn(
          "px-4 py-2",
          "px-6", // Should override px-4
          "py-3", // Should override py-2
        ),
      ).toBe("px-6 py-3");
    });

    it("preserves non-conflicting classes", () => {
      expect(
        cn(
          "flex items-center justify-center",
          "bg-blue-500 text-white",
          "hover:bg-blue-600",
        ),
      ).toBe(
        "flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600",
      );
    });

    it("handles responsive classes correctly", () => {
      expect(
        cn(
          "text-sm md:text-lg",
          "text-base", // Should not conflict with responsive classes
          "md:text-xl", // Should override md:text-lg
        ),
      ).toBe("text-base md:text-xl");
    });

    it("handles variant classes", () => {
      expect(
        cn("bg-primary text-primary-foreground", "hover:bg-primary/90"),
      ).toBe("bg-primary text-primary-foreground hover:bg-primary/90");
    });

    it("works with no arguments", () => {
      expect(cn()).toBe("");
    });

    it("handles single argument", () => {
      expect(cn("single-class")).toBe("single-class");
    });

    it("handles mixed argument types", () => {
      expect(
        cn(
          "base",
          ["array", "classes"],
          { object: true, hidden: false },
          undefined,
          "final",
        ),
      ).toBe("base array classes object final");
    });

    it("handles tailwind arbitrary values", () => {
      expect(
        cn(
          "w-[100px]",
          "w-[200px]", // Should override
        ),
      ).toBe("w-[200px]");
    });

    it("handles important modifiers", () => {
      expect(
        cn(
          "!text-red-500",
          "text-blue-500", // Should not override important
        ),
      ).toBe("!text-red-500 text-blue-500");
    });
  });
});
