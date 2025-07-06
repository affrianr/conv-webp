# Next.js 15 Image Converter

A modern, high-performance web application built with Next.js 15 that converts images to WebP format using the Sharp package. Features real-time image processing with in-memory conversion and no server-side storage for enhanced privacy and performance.

## Features

- Convert various image formats (JPEG, PNG, GIF, etc.) to WebP
- Preview original and converted images
- Download converted WebP images
- View size reduction statistics
- In-memory processing (no files saved on server)
- Responsive design that works on mobile and desktop
- Dark mode support

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Sharp** - High-performance image processing
- **Bun** - Fast JavaScript runtime and package manager
- **Docker** - Containerized deployment

## Getting Started

### Prerequisites

- **Node.js 18+** or [Bun](https://bun.sh/) (recommended)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- Modern web browser with WebP support

### Installation

#### Option 1: Local Development

1. Clone the repository

```bash
git clone <repository-url>
cd next15-setup
```

2. Install dependencies with Bun

```bash
bun install
```

3. Run the development server

```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

#### Option 2: Docker Deployment

1. Clone the repository

```bash
git clone <repository-url>
cd next15-setup
```

2. Build and run with Docker Compose

```bash
docker-compose up -d --build
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. To stop the container

```bash
docker-compose down
```

## Usage

1. Navigate to the Image Converter page from the homepage
2. Click "Choose File" to select an image from your device
3. Click "Convert to WebP" to process the image
4. View the original and converted images side by side
5. Click "Download WebP" to save the converted image

## Architecture

### Image Processing Pipeline

1. **Client Upload** - Images are selected via drag-and-drop or file picker
2. **In-Memory Processing** - Sharp processes images without disk I/O
3. **WebP Conversion** - Optimized compression with quality settings
4. **Real-time Preview** - Side-by-side comparison of original vs converted
5. **Direct Download** - Converted images served directly from memory

### Docker Configuration

The application uses Alpine Linux with specific dependencies for Sharp:

```dockerfile
# Install dependencies for Sharp image processing
RUN apk add --no-cache build-base python3
```

These dependencies are required because:
- **build-base**: Provides GCC compiler and build tools for native modules
- **python3**: Required by node-gyp for building Sharp's native bindings

## Why WebP?

WebP is a modern image format that provides superior lossless and lossy compression for images on the web. WebP images are typically 25-34% smaller than comparable JPEG images and 26% smaller than comparable PNG images, which means faster page loads and less data consumption.

### Benefits of WebP:

- **Smaller file sizes** while maintaining quality
- **Transparency support** (like PNG)
- **Animation support** (like GIF)
- **Better compression** than JPEG, PNG, and GIF
- **Faster web page loading** times
- **Wide browser support** (95%+ of modern browsers)

## Performance

- **In-memory processing** - No disk I/O for faster conversion
- **Sharp optimization** - Native C++ bindings for maximum performance
- **Streaming uploads** - Large files handled efficiently
- **Client-side preview** - Instant feedback without server round-trips

## Troubleshooting

### Common Issues

**Sharp installation fails in Docker:**
```bash
# Ensure build dependencies are installed
RUN apk add --no-cache build-base python3
```

**Large file uploads fail:**
- Check Next.js body size limits in `next.config.ts`
- Verify Docker memory allocation

**WebP not supported:**
- Ensure browser supports WebP (check caniuse.com)
- Fallback to original format if needed

### Development

```bash
# Run with debug logging
DEBUG=sharp bun run dev

# Check Sharp installation
bun run -e "console.log(require('sharp'))"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
