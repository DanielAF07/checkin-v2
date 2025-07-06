# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Church Attendance App - an offline-first mobile/web application designed to manage Sunday attendance lists for a local church. Built with React Native/Expo, Expo Router for file-based routing, and Tamagui for UI components. The project uses the new React Native architecture (newArchEnabled: true) and supports iOS, Android, and web platforms.

## App Purpose & Features

**Primary Goal**: Provide a lightweight, intuitive and reliable way to track member attendance even without internet access.

**Key Features**:
- **Offline-First**: Works seamlessly without internet connectivity with local data persistence
- **Main Lists Screen**: Home screen displays all created Sunday attendance lists
- **Add New Sundays**: Easy creation of new attendance lists for each Sunday
- **Attendance View**: Tap on a Sunday to open the full list of church members
- **Member Check-in**: Tap each member to mark them as "present" with quick toggling and visual feedback
- **Attendance Summary**: Display total number of attendees for each Sunday

**Target Users**: Church leaders and administrators who need simple weekly attendance tracking in rural or limited-connectivity environments.

## Development Commands

- `pnpm install` - Install dependencies
- `pnpm start` or `npx expo start` - Start the Expo development server
- `pnpm run android` - Start on Android emulator
- `pnpm run ios` - Start on iOS simulator
- `pnpm run web` - Start web version
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Run ESLint with auto-fix
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run reset-project` - Move starter code to app-example/ and create blank app/ directory (already done)

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
- Project has been reset from starter template - example code is in `app-example/`
- Focus on offline-first architecture and local data persistence for church attendance tracking

## Database Schema (SQLite)

The app will use SQLite for local data persistence. The database structure includes:

### `attendees` Table
- `id` - Primary key (INTEGER)
- `name` - First name (TEXT)
- `first_lastname` - First last name (TEXT)
- `second_lastname` - Second last name (TEXT)
- `piime_id` - External ID reference (TEXT, nullable)
- `created` - Creation timestamp (TEXT/ISO string)
- `updated` - Last update timestamp (TEXT/ISO string)

### `events` Table
- `id` - Primary key (INTEGER)
- `name` - Event name/title (TEXT)
- `date` - Event date (TEXT/ISO string)
- `created` - Creation timestamp (TEXT/ISO string)
- `updated` - Last update timestamp (TEXT/ISO string)

### `attendances` Table
- `id` - Primary key (INTEGER)
- `event` - Foreign key to events.id (INTEGER)
- `attendee` - Foreign key to attendees.id (INTEGER)
- `created` - Creation timestamp (TEXT/ISO string)
- `updated` - Last update timestamp (TEXT/ISO string)

### State Management

- **Zustand**: Used for state management with persistence
- Store structure mirrors the SQLite schema for easy migration
- Current implementation uses local storage, ready for SQLite integration

### Future SQLite Integration

When implementing expo-sqlite:
1. Install `expo-sqlite` package
2. Create database initialization scripts
3. Replace Zustand persistence with SQLite operations
4. Implement proper foreign key relationships
5. Add data migration utilities

## Code Quality Tools

- **ESLint**: Configured with React Native, TypeScript, and Prettier rules
- **Prettier**: Standard formatting with single quotes, semicolons, and 80 character line width
- **TypeScript**: Strict mode enabled with path mapping (`@/*`)
- **VS Code**: Format on save enabled with ESLint auto-fix
