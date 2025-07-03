# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native/Expo project called "checkin-v2" built with Expo Router for file-based routing and Tamagui for UI components. The project uses the new React Native architecture (newArchEnabled: true) and supports iOS, Android, and web platforms.

## Development Commands

- `pnpm start` or `npx expo start` - Start the Expo development server
- `pnpm run android` - Start on Android emulator
- `pnpm run ios` - Start on iOS simulator
- `pnpm run web` - Start web version
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Run ESLint with auto-fix
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run reset-project` - Move starter code to app-example/ and create blank app/ directory

## Architecture

### Routing

- Uses Expo Router with file-based routing in the `app/` directory
- `app/_layout.tsx` is the root layout wrapping the entire app with TamaguiProvider
- `app/index.tsx` is the main entry point screen
- Typed routes are enabled (`typedRoutes: true`)

### UI Framework

- **Tamagui** is the primary UI library for styling and components
- React Native core components are used for basic elements
- The project includes custom path mapping with `@/*` pointing to the root directory

### Platform Support

- iOS: Supports tablets, uses adaptive icons
- Android: Edge-to-edge enabled, adaptive icons configured
- Web: Uses Metro bundler with static output

### Dependencies

Key dependencies include:

- Expo Router for navigation
- Tamagui for UI components
- React Native Reanimated for animations
- React Native Gesture Handler for touch interactions
- Expo modules for platform-specific APIs

## Project Structure

- `app/` - Main application code using Expo Router
- `app-example/` - Contains the original starter template code
- `assets/` - Images, fonts, and other static assets
- The project has been reset from the starter template, so most example components are in `app-example/`

## Development Notes

- The project uses TypeScript with strict mode enabled
- ESLint is configured with Expo's recommended rules plus TypeScript and React Native best practices
- Prettier is configured for consistent code formatting
- VS Code is configured for format-on-save and auto-fixing ESLint issues
- The app uses automatic UI style (supports both light and dark modes)
- Package management: Uses pnpm (pnpm-lock.yaml exists)

## Code Quality Tools

- **ESLint**: Configured with React Native, TypeScript, and Prettier rules
- **Prettier**: Standard formatting with single quotes, semicolons, and 80 character line width
- **TypeScript**: Strict mode enabled with path mapping (`@/*`)
- **VS Code**: Format on save enabled with ESLint auto-fix
