import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock Next.js modules
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

vi.mock("next/image", () => {
  return {
    default: ({
      src,
      alt,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement> & {
      src: string;
      alt: string;
    }) => {
      // eslint-disable-next-line jsx-a11y/alt-text
      return React.createElement("img", { src, alt, ...props });
    },
  };
});

// Mock browser APIs
Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: vi.fn(() => "mock-url"),
    revokeObjectURL: vi.fn(),
  },
  writable: true,
});

// Mock global URL constructor for Node.js environment
Object.defineProperty(global, "URL", {
  value: class MockURL {
    constructor(url: string, base?: string) {
      // Simple URL parsing for test environment
      if (base && !url.startsWith("http")) {
        this.href = base.endsWith("/") ? base + url : base + "/" + url;
      } else {
        this.href = url;
      }
      this.origin = "http://localhost:3000";
      this.protocol = "http:";
      this.host = "localhost:3000";
      this.hostname = "localhost";
      this.port = "3000";
      this.pathname = url.startsWith("/") ? url : "/";
      this.search = "";
      this.hash = "";
    }
    href: string;
    origin: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    toString() {
      return this.href;
    }
  },
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

// Mock FileReader for file upload tests
class MockFileReader implements Partial<FileReader> {
  result: string | ArrayBuffer | null = null;
  error: DOMException | null = null;
  readyState: 0 | 1 | 2 = 0;
  onload: ((ev: ProgressEvent<FileReader>) => void) | null = null;
  onerror: ((ev: ProgressEvent<FileReader>) => void) | null = null;
  onabort: ((ev: ProgressEvent<FileReader>) => void) | null = null;
  onloadstart: ((ev: ProgressEvent<FileReader>) => void) | null = null;
  onloadend: ((ev: ProgressEvent<FileReader>) => void) | null = null;
  onprogress: ((ev: ProgressEvent<FileReader>) => void) | null = null;

  // FileReader constants
  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;
  readonly EMPTY = 0;
  readonly LOADING = 1;
  readonly DONE = 2;

  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readAsDataURL(_file: Blob) {
    this.readyState = 1; // LOADING
    setTimeout(() => {
      this.result = "data:image/jpeg;base64,mock-data";
      this.readyState = 2; // DONE
      if (this.onload) {
        this.onload({ target: this } as unknown as ProgressEvent<FileReader>);
      }
    }, 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readAsText(_file: Blob) {
    this.readyState = 1;
    setTimeout(() => {
      this.result = "mock text content";
      this.readyState = 2;
      if (this.onload) {
        this.onload({ target: this } as unknown as ProgressEvent<FileReader>);
      }
    }, 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readAsArrayBuffer(_file: Blob) {
    this.readyState = 1;
    setTimeout(() => {
      this.result = new ArrayBuffer(8);
      this.readyState = 2;
      if (this.onload) {
        this.onload({ target: this } as unknown as ProgressEvent<FileReader>);
      }
    }, 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readAsBinaryString(_file: Blob) {
    this.readyState = 1;
    setTimeout(() => {
      this.result = "mock binary string";
      this.readyState = 2;
      if (this.onload) {
        this.onload({ target: this } as unknown as ProgressEvent<FileReader>);
      }
    }, 0);
  }

  abort() {
    this.readyState = 2;
    if (this.onabort) {
      this.onabort({ target: this } as unknown as ProgressEvent<FileReader>);
    }
  }
}

global.FileReader = MockFileReader as unknown as typeof FileReader;

// Mock ResizeObserver for Radix UI components
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock Blob first
class MockBlob {
  size: number;
  type: string;
  private data: BlobPart[];

  constructor(blobParts: BlobPart[] = [], options: BlobPropertyBag = {}) {
    this.data = blobParts;
    this.type = options.type || "";
    this.size = this.calculateSize(blobParts);
  }

  private calculateSize(parts: BlobPart[]): number {
    return parts.reduce((total, part) => {
      if (typeof part === "string") {
        return total + new TextEncoder().encode(part).length;
      } else if (part instanceof ArrayBuffer) {
        return total + part.byteLength;
      } else if (part instanceof Uint8Array) {
        return total + part.length;
      }
      return total;
    }, 0);
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return new Promise((resolve) => {
      const encoder = new TextEncoder();
      let totalSize = 0;
      const buffers: ArrayBuffer[] = [];

      for (const part of this.data) {
        if (typeof part === "string") {
          const buffer = encoder.encode(part).buffer;
          buffers.push(
            buffer instanceof ArrayBuffer
              ? buffer.slice(0)
              : new ArrayBuffer(0),
          );
          totalSize += buffer.byteLength;
        } else if (part instanceof ArrayBuffer) {
          buffers.push(part);
          totalSize += part.byteLength;
        } else if (part instanceof Uint8Array) {
          buffers.push(
            part.buffer instanceof SharedArrayBuffer
              ? new Uint8Array(new ArrayBuffer(part.buffer.byteLength)).buffer
              : part.buffer.slice(),
          );
          totalSize += part.buffer.byteLength;
        }
      }

      const result = new ArrayBuffer(totalSize);
      const view = new Uint8Array(result);
      let offset = 0;

      for (const buffer of buffers) {
        view.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
      }

      resolve(result);
    });
  }

  async text(): Promise<string> {
    const buffer = await this.arrayBuffer();
    return new TextDecoder().decode(buffer);
  }

  slice(start?: number, end?: number, contentType?: string): Blob {
    return new MockBlob(this.data, { type: contentType || this.type });
  }

  stream(): ReadableStream {
    throw new Error("stream() not implemented in mock");
  }

  async bytes(): Promise<Uint8Array> {
    const buffer = await this.arrayBuffer();
    return new Uint8Array(buffer);
  }

  get [Symbol.toStringTag]() {
    return "Blob";
  }
}

// Mock File that extends MockBlob
class MockFile extends MockBlob {
  name: string;
  lastModified: number;
  webkitRelativePath: string;

  constructor(
    fileBits: BlobPart[],
    fileName: string,
    options?: FilePropertyBag,
  ) {
    super(fileBits, options);
    this.name = fileName;
    this.lastModified = options?.lastModified ?? Date.now();
    this.webkitRelativePath = "";
  }

  get [Symbol.toStringTag]() {
    return "File";
  }
}

// Ensure Blob and File are available globally
if (typeof global.Blob === "undefined") {
  global.Blob = MockBlob as unknown as typeof Blob;
}

if (typeof global.File === "undefined") {
  global.File = MockFile as unknown as typeof File;
}

// Mock FormData
class MockFormData {
  private data = new Map<string, FormDataEntryValue | FormDataEntryValue[]>();

  append(name: string, value: string | Blob) {
    if (this.data.has(name)) {
      const existing = this.data.get(name)!;
      if (Array.isArray(existing)) {
        existing.push(value as FormDataEntryValue);
      } else {
        this.data.set(name, [existing, value as FormDataEntryValue]);
      }
    } else {
      this.data.set(name, value as FormDataEntryValue);
    }
  }

  get(name: string): FormDataEntryValue | null {
    const value = this.data.get(name);
    if (Array.isArray(value)) {
      return value[0];
    }
    return value || null;
  }

  getAll(name: string): FormDataEntryValue[] {
    const value = this.data.get(name);
    if (Array.isArray(value)) {
      return value;
    }
    return value ? [value] : [];
  }

  has(name: string): boolean {
    return this.data.has(name);
  }

  set(name: string, value: string | Blob) {
    this.data.set(name, value as FormDataEntryValue);
  }

  delete(name: string) {
    this.data.delete(name);
  }

  *entries(): IterableIterator<[string, FormDataEntryValue]> {
    for (const [key, value] of this.data) {
      if (Array.isArray(value)) {
        for (const item of value) {
          yield [key, item];
        }
      } else {
        yield [key, value];
      }
    }
  }

  *keys(): IterableIterator<string> {
    for (const [key] of this.entries()) {
      yield key;
    }
  }

  *values(): IterableIterator<FormDataEntryValue> {
    for (const [, value] of this.entries()) {
      yield value;
    }
  }

  [Symbol.iterator]() {
    return this.entries();
  }
}

if (typeof global.FormData === "undefined") {
  global.FormData = MockFormData as unknown as typeof FormData;
}
