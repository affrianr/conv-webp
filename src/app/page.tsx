"use client";

import { useState } from "react";
import Image from "next/image";
import { DropZone } from "@/components/drop-zone";
import { Slider } from "@/components/slider";
import { ImageIcon } from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [convertedImage, setConvertedImage] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>("");
  const [quality, setQuality] = useState<number[]>([80]);
  const [conversionStats, setConversionStats] = useState<{
    originalSize: number;
    webpSize: number;
    sizeReduction: number;
    quality: number;
  } | null>(null);

  const handleFileSelected = (file: File) => {
    // Reset states
    setError("");
    setConvertedImage("");
    setConversionStats(null);

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB.");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setIsConverting(true);
    setError("");
    setConversionStats(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("quality", quality.toString());

      const response = await fetch("/api/convert-to-webp", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert image");
      }

      const data = await response.json();
      setConvertedImage(data.webpUrl);
      setConversionStats({
        originalSize: data.originalSize,
        webpSize: data.webpSize,
        sizeReduction: data.sizeReduction,
        quality: data.quality,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview("");
    setConvertedImage("");
    setError("");
    setConversionStats(null);
  };

  const handleDownload = () => {
    if (!convertedImage) return;

    // For base64 data URLs, we can use them directly
    const link = document.createElement("a");
    link.href = convertedImage;
    link.download = `${selectedFile?.name.split(".")[0] || "converted"}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="mb-8 flex items-center justify-center pt-4 sm:pt-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <ImageIcon className="h-6 w-6 text-gray-900" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WebP Converter</h1>
            <p className="text-muted-foreground text-gray-900">
              Convert your images to WebP format with custom quality
            </p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all">
          <div className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Upload Your Image
            </h2>

            <DropZone
              onFileSelected={handleFileSelected}
              selectedFile={selectedFile}
              preview={preview}
            />

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="mt-6 mb-4">
              <label
                htmlFor="quality-slider"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Quality: {quality}%
              </label>
              <Slider
                id="quality"
                min={10}
                max={100}
                step={5}
                value={quality}
                onValueChange={setQuality}
                className="w-full"
              />
              <div className="mt-1 flex justify-between text-sm text-gray-700">
                <span>Lower size</span>
                <span>Higher quality</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleConvert}
                disabled={!selectedFile || isConverting}
                className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConverting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Converting...
                  </span>
                ) : (
                  "Convert to WebP"
                )}
              </button>
              <button
                onClick={handleReset}
                className="cursor-pointer rounded-lg bg-gray-200 px-6 py-3 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-gray-300"
              >
                Reset
              </button>
              {convertedImage && (
                <button
                  onClick={handleDownload}
                  className="cursor-pointer rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-green-700"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download WebP
                  </span>
                </button>
              )}
            </div>
          </div>

          {(preview || convertedImage) && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {preview && (
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-4">
                      <h3 className="mb-2 text-lg font-medium text-gray-900">
                        Original Image
                      </h3>
                      <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={preview}
                          alt="Original image preview"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-gray-500">
                        {selectedFile?.name} (
                        {selectedFile
                          ? Math.round(selectedFile.size / 1024)
                          : 0}{" "}
                        KB)
                      </p>
                    </div>
                  </div>
                )}

                {convertedImage && (
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-4">
                      <h3 className="mb-2 text-lg font-medium text-gray-900">
                        Converted WebP
                      </h3>
                      <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={convertedImage}
                          alt="Converted WebP image"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      {conversionStats && (
                        <div className="mt-3 text-sm">
                          <p className="text-gray-500">
                            Size: {Math.round(conversionStats.webpSize / 1024)}{" "}
                            KB
                          </p>
                          <p className="text-gray-500">
                            Quality: {conversionStats.quality}%
                          </p>
                          <p className="text-green-600">
                            {conversionStats.sizeReduction.toFixed(2)}% smaller
                            than original
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 overflow-hidden">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Smaller File Size</h4>
                <p className="text-sm text-blue-700">
                  Maintain quality while reducing size
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-purple-100 bg-purple-50 px-4 py-3 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-purple-900">
                  Transparency Support
                </h4>
                <p className="text-sm text-purple-700">
                  Like PNG but more efficient
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-green-50 px-4 py-3 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-green-900">
                  Animation Support
                </h4>
                <p className="text-sm text-green-700">
                  Alternative to GIF with better quality
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-amber-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-amber-900">
                  Better Compression
                </h4>
                <p className="text-sm text-amber-700">
                  Superior to JPEG, PNG, and GIF
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-rose-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-rose-900">Faster Loading</h4>
                <p className="text-sm text-rose-700">
                  Improved web page performance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-teal-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-teal-900">Reduced Bandwidth</h4>
                <p className="text-sm text-teal-700">Lower data consumption</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Copyright Footer */}
      <footer className="mx-auto mt-8 max-w-5xl border-t border-gray-200 py-6">
        <div className="flex items-center justify-between px-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Made with ❤️ by Affrian
          </p>
          <a
            href="https://github.com/affrianr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center text-sm font-medium text-gray-500 transition-all"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
