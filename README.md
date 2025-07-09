# Church Attendance App 📱⛪

An offline-first mobile/web application designed to manage Sunday attendance lists for local churches. Built with React Native, Expo, and Instant DB for real-time synchronization.

## 🎯 Project Overview

This application provides church leaders and administrators with a lightweight, intuitive, and reliable way to track member attendance even without internet connectivity. Perfect for rural or limited-connectivity environments.

### ✨ Key Features

- **🔄 Offline-First Architecture**: Works seamlessly without internet connectivity with local data persistence
- **📋 Sunday Lists Management**: Home screen displays all created Sunday attendance lists
- **➕ Easy Event Creation**: Quick creation of new attendance lists for each Sunday
- **👥 Member Management**: Add, edit, and manage church members with filtering options
- **✅ Quick Check-in**: Tap members to mark them as present with visual feedback
- **🔍 Smart Filtering**: Filter attendees by presence status or missing ID numbers
- **📊 Real-time Counters**: Display total attendees and present members for each event
- **🔄 Real-time Sync**: Automatic synchronization when internet is available
- **🌙 Dark/Light Mode**: Automatic theme support

## 🏗️ Tech Stack

- **Framework**: React Native with Expo (v53+)
- **Routing**: Expo Router (file-based routing)
- **UI Library**: Tamagui for styling and components
- **Database**: Instant DB for real-time data with offline support
- **State Management**: Built-in Instant DB state + Zustand
- **Animations**: React Native Reanimated
- **Platform Support**: iOS, Android, and Web

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (recommended) or npm
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd checkin-v2
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file with your Instant DB app ID
   EXPO_PUBLIC_INSTANT_APP_ID=your_instant_db_app_id
   ```

4. **Start the development server**
   ```bash
   pnpm start
   # or
   npx expo start
   ```

### Development Commands

- `pnpm start` - Start the Expo development server
- `pnpm run android` - Start on Android emulator
- `pnpm run ios` - Start on iOS simulator
- `pnpm run web` - Start web version
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Run ESLint with auto-fix
- `pnpm run format` - Format code with Prettier
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run create-attendees` - Bulk import attendees from JSON

## 📱 App Structure

### Main Screens

1. **Home Screen** (`app/index.tsx`)
   - Displays list of all Sunday events
   - Shows attendance count for each event
   - Quick access to create new events

2. **Attendance Screen** (`app/attendance/[id].tsx`)
   - Shows all members for a specific event
   - Toggle attendance status
   - Filter by presence or missing ID
   - Add new members on-the-fly

### Key Components

- **EventCard**: Display individual Sunday events
- **AttendeeCard**: Individual member card with attendance toggle
- **FilterToggle**: Filter members by status
- **CreateEventBottomSheet**: Modal for creating new events
- **CreateAttendeeModal**: Modal for adding new members
- **BottomSheetInput**: Custom input with keyboard avoidance

## 🗄️ Database Schema

The app uses Instant DB with the following entities:

### Attendees

```typescript
{
  name: string;              // First name
  first_lastname: string;    // Paternal surname
  second_lastname: string;   // Maternal surname
  piime_id?: string;        // External ID (optional)
  active: boolean;          // Active status
  created: date;            // Creation timestamp
  updated: date;            // Last update timestamp
}
```

### Events

```typescript
{
  name: string; // Event name
  date: date; // Event date and time
  active: boolean; // Active status
  created: date; // Creation timestamp
  updated: date; // Last update timestamp
}
```

### Attendance

```typescript
{
  // Links to attendee and event via relationships
  created: date; // Check-in timestamp
  updated: date; // Last update timestamp
}
```

## 🔧 Configuration

### Instant DB Setup

1. Create an account at [instantdb.com](https://instantdb.com)
2. Create a new app and get your App ID
3. Add the App ID to your environment variables
4. Install the Instant DB CLI:
   ```bash
   pnpm add -D instantdb-cli
   ```
5. Run the Instant DB CLI to set up your database:
   ```bash
   npx instant-cli@latest push schema
   ```

### Tamagui Configuration

The app uses Tamagui v4 with custom theming:

- Configured in `app/_layout.tsx`
- Supports automatic dark/light mode (but dark mode is default)
- Custom path mapping with `@/*` pointing to root

## 📂 Project Structure

```
checkin-v2/
├── app/                    # Main application (Expo Router)
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Home screen
│   └── attendance/        # Attendance screens
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── screens/          # Screen components
│   ├── services/         # Database services
│   └── utils/            # Utility functions
├── assets/               # Static assets
├── scripts/              # Utility scripts
├── instant.schema.ts     # Database schema
└── instant.perms.ts      # Database permissions
```

## 🚀 Deployment

### Building for Production

```bash
# Build for web
pnpm run web

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Environment Variables

Required environment variables:

- `EXPO_PUBLIC_INSTANT_APP_ID` - Your Instant DB app ID
- `INSTANT_ADMIN_TOKEN` - Your Instant DB admin token to populate the database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- ESLint configuration with React Native and TypeScript rules
- Prettier for consistent formatting
- VS Code settings for format-on-save

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- UI powered by [Tamagui](https://tamagui.dev)
- Real-time database by [Instant DB](https://instantdb.com)
- Icons by [Lucide React](https://lucide.dev)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for church communities**
