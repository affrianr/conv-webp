

# Next.js 15 Modern Boilerplate

A modern and optimized Next.js 15 boilerplate with App Router, featuring Bun, Tailwind CSS v4, ESLint, Prettier, and Husky.

## Features

- ⚡️ **Next.js 15** with App Router
- 🏃 **Bun** - Incredibly fast JavaScript runtime and package manager
- 💎 **Tailwind CSS v4** - Utility-first CSS framework
- 📏 **ESLint** - Pluggable JavaScript linter
- 💖 **Prettier** - Opinionated code formatter
- 🐶 **Husky** - Git hooks made easy

## Prerequisites

- Bun (latest version)
- Node.js 18.17 or later

## Getting Started

1. Clone this repository:
```bash
git clone https://github.com/affrianr/next15-setup.git
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```plaintext
.
├── app/                # App router directory
├── components/         # React components
├── public/            # Static assets
└── styles/           # Global styles
```

## Available Scripts

- `bun dev` - Start development server with Turbopack
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun format` - Run Prettier formatting

## ESLint and Prettier

This boilerplate uses ESLint and Prettier for code consistency. The configuration includes:

- ESLint with Next.js recommended rules
- Prettier for code formatting
- Tailwind CSS plugin for class name ordering
- Import sorting
- JSX accessibility rules

## Git Hooks

Husky is configured to run the following checks before commits:

- Lint staged files
- Format code
- Type checking

## Contributing

Feel free to open issues and pull requests!

## License

MIT
