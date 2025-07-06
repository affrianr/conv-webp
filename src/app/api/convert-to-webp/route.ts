import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const qualityParam = formData.get("quality");

    // Parse quality parameter (default to 80 if not provided or invalid)
    const quality = qualityParam ? parseInt(qualityParam.toString()) : 80;
    const validQuality =
      isNaN(quality) || quality < 1 || quality > 100 ? 80 : quality;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 },
      );
    }

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "The provided file is not an image" },
        { status: 400 },
      );
    }

    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Get the original size
    const originalSize = buffer.length;

    let webpBuffer: Buffer;

    // Check if it's a GIF to preserve animation
    if (file.type === "image/gif") {
      // For animated GIFs, use Sharp with animated option
      webpBuffer = await sharp(buffer, { animated: true })
        .webp({
          quality: validQuality,
          effort: 4, // Higher effort for better compression of animated images
          mixed: true, // Allow mixed lossy/lossless encoding
        })
        .toBuffer();
    } else {
      // For static images, use regular conversion
      webpBuffer = await sharp(buffer)
        .webp({ quality: validQuality })
        .toBuffer();
    }

    // Get the size of the converted image
    const webpSize = webpBuffer.length;

    // Calculate size reduction percentage
    const sizeReduction = ((originalSize - webpSize) / originalSize) * 100;

    // Convert the WebP buffer to a base64 data URL
    const base64Image = `data:image/webp;base64,${webpBuffer.toString("base64")}`;

    return NextResponse.json({
      success: true,
      webpUrl: base64Image,
      originalSize,
      webpSize,
      sizeReduction: Math.round(sizeReduction * 100) / 100,
      quality: validQuality,
      isAnimated: file.type === "image/gif",
    });
  } catch (error) {
    console.error("Error converting image:", error);
    return NextResponse.json(
      { error: "Failed to convert image" },
      { status: 500 },
    );
  }
}
