# Contributing to Japan Highly Skilled Professional Visa Calculator

Thank you for your interest in contributing to this project! This document provides guidelines and instructions to help you get started.

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Git

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/japan-visa-calculator.git
   cd japan-visa-calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

```
src/
  ├── components/        # React components
  │   ├── ui/            # UI components (shadcn)
  │   └── ...
  ├── lib/               # Utility functions and business logic
  ├── hooks/             # Custom React hooks
  ├── styles/            # CSS files
  ├── App.tsx            # Main application component
  ├── main.tsx           # Entry point (do not modify)
  └── index.css          # Global CSS
```

## Code Style and Guidelines

- We use TypeScript for type safety
- Follow existing code formatting and naming conventions
- Use functional components and React hooks
- Document complex functions and components with comments
- Use Tailwind CSS for styling

## Pull Request Process

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test them thoroughly.

3. **Update documentation** if necessary.

4. **Commit your changes** with clear and descriptive commit messages:
   ```bash
   git commit -m "Add feature: brief description of changes"
   ```

5. **Push to your fork** and submit a pull request to the `main` branch.

6. **Describe your changes** in the pull request, including the motivation and context.

7. **Wait for review** and address any feedback.

## Testing

Before submitting a pull request, please test your changes thoroughly:

- Ensure the application builds without errors: `npm run build`
- Verify all features still work as expected
- Test on different browsers if possible
- Check for console errors

## Updating Documentation

If your changes affect user-facing features, please update:

1. Any relevant comments in the code
2. The PRD document if applicable
3. The README.md file if necessary

## License

By contributing to this project, you agree that your contributions will be licensed under the project's license.

## Questions?

If you have any questions or need help, please open an issue in the repository.

Thank you for your contributions!