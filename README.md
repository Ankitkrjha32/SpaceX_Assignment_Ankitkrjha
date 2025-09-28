# 🚀 SpaceX Mission Explorer

A modern, responsive web application built with React that allows users to explore SpaceX launches, rockets, and missions using the official SpaceX API. Features a beautiful cream-themed UI with comprehensive filtering, search capabilities, and favorites management.

## ✨ Features

- **🔍 Browse & Search**: Explore all SpaceX launches with powerful search functionality
- **🎯 Advanced Filtering**: Filter by year, mission status, and favorites
- **❤️ Favorites System**: Save and manage your favorite missions
- **📱 Responsive Design**: Seamless experience across all devices
- **🎨 Modern UI**: Beautiful cream-themed interface with smooth animations
- **⚡ Real-time Data**: Live data from SpaceX API v4
- **🔗 External Links**: Direct access to YouTube videos, Wikipedia, and news articles

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1.1** - Modern JavaScript library for building user interfaces
- **React Hooks** - State management and lifecycle methods

### State Management
- **Redux Toolkit** - Predictable state container with modern Redux patterns
- **React-Redux** - Official React bindings for Redux

### Styling & UI
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Custom Design System** - Cream-themed color palette with custom utilities
- **CSS Animations** - Smooth transitions and hover effects

### HTTP Client
- **Axios** - Promise-based HTTP client for API calls

### Development Tools
- **Create React App** - React development environment
- **Jest** - Testing framework
- **React Testing Library** - Testing utilities for React components

## 🏗️ Architecture & Project Structure

```
src/
├── components/
│   ├── features/           # Feature-specific components
│   │   ├── LaunchDetailModal.js    # Detailed launch information modal
│   │   ├── LaunchList.js           # Launch grid/list display
│   │   └── SearchAndFilters.js     # Search and filter controls
│   ├── layout/             # Layout components
│   │   └── Header.js               # App header with branding
│   └── ui/                 # Reusable UI components
│       ├── LaunchCard.js           # Individual launch card
│       ├── LoadingSkeleton.js      # Loading state component
│       └── SearchInput.js          # Search input component
├── pages/
│   └── HomePage.js         # Main page component
├── services/
│   └── spacexAPI.js        # API service layer
├── store/
│   ├── index.js            # Redux store configuration
│   └── slices/             # Redux slices
│       ├── favoritesSlice.js       # Favorites state management
│       ├── filtersSlice.js         # Filters state management
│       └── launchesSlice.js        # Launches data management
└── tests/
    └── *.test.js           # Test files
```

## 📡 API Integration

### SpaceX API v4
The application integrates with the official SpaceX REST API (https://api.spacexdata.com/v4/) to fetch real-time data.

#### API Endpoints Used:
```javascript
// Get all launches with populated data
GET /v4/launches?populate=rocket,payloads,cores

// Response includes:
- Launch details (name, date, success status)
- Rocket information
- Payload data
- Core/booster information
- Links (YouTube, Wikipedia, articles)
- Mission patches and images
```

#### API Service Layer (`spacexAPI.js`):
```javascript
const spacexAPI = {
  getLaunches: async () => {
    const response = await axios.get(
      'https://api.spacexdata.com/v4/launches',
      {
        params: {
          populate: 'rocket,payloads,cores'
        }
      }
    );
    return response.data;
  }
};
```

#### Error Handling:
- **Network Errors**: Graceful fallback with error messages
- **API Timeouts**: Automatic retry mechanism
- **Invalid Data**: Data validation and sanitization

## 🏪 State Management (Redux)

### Store Structure
```javascript
{
  launches: {
    launches: [],      // Array of launch data
    loading: false,    // Loading state
    error: null        // Error messages
  },
  favorites: {
    favoriteIds: []    // Array of favorite launch IDs
  },
  filters: {
    searchQuery: '',         // Search term
    launchYear: '',          // Selected year filter
    showSuccessfulOnly: false, // Success status filter
    showFavoritesOnly: false   // Favorites filter
  }
}
```

### Redux Slices

#### 1. **Launches Slice** (`launchesSlice.js`)
- **Purpose**: Manages launch data and loading states
- **Actions**:
  - `fetchLaunches.pending` - Sets loading to true
  - `fetchLaunches.fulfilled` - Stores fetched launches
  - `fetchLaunches.rejected` - Handles API errors

#### 2. **Favorites Slice** (`favoritesSlice.js`)
- **Purpose**: Manages user's favorite launches
- **Actions**:
  - `toggleFavorite(launchId)` - Adds/removes favorites
- **Persistence**: Uses localStorage for data persistence

#### 3. **Filters Slice** (`filtersSlice.js`)
- **Purpose**: Manages all filtering and search states
- **Actions**:
  - `setSearchQuery(query)` - Updates search term
  - `setLaunchYear(year)` - Sets year filter
  - `setSuccessFilter(boolean)` - Sets success filter
  - `toggleFavoritesOnly()` - Toggles favorites filter

### Data Flow
```
API Call → Redux Action → Reducer → State Update → Component Re-render
```

## 🎨 Styling & Design System

### Color Palette
```css
/* Custom Tailwind Colors */
colors: {
  'spacex-dark': '#0f1419',
  'spacex-blue': '#d4af37', /* Gold accent */
  'cream': {
    50: '#fffef7',
    100: '#fffbeb',
    200: '#fef3c7',
    300: '#fde68a',
    400: '#fcd34d',
    500: '#fbbf24',
    600: '#f59e0b',
    700: '#d97706',
    800: '#92400e',
    900: '#78350f',
  },
  'spacex': {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  }
}
```

### Component Design Patterns
- **Card-based Layout**: Consistent card design across components
- **Hover Effects**: Smooth transitions and scale effects
- **Loading States**: Skeleton loaders for better UX
- **Responsive Grid**: CSS Grid with breakpoints
- **Modal Design**: Overlay with backdrop blur

## 🧪 Testing Strategy

### Test Files Structure
```
src/tests/
├── App.test.js              # Integration tests
├── Favorites.test.js        # Favorites functionality tests
├── LaunchDetailModal.test.js # Modal component tests
└── LaunchList.test.js       # Launch list tests
```

### Testing Approach

#### 1. **Integration Tests** (`App.test.js`)
```javascript
// Tests covered:
- App renders with correct title
- API integration works correctly  
- Loading states display properly
- Error handling works
- Search and filter components render
```

#### 2. **Component Tests**
```javascript
// LaunchList.test.js
- Displays launches correctly
- Filtering functionality
- Loading skeleton display
- Error state handling

// LaunchDetailModal.test.js  
- Modal opens and closes properly
- Launch details display correctly
- Favorites toggle works
- External links work

// Favorites.test.js
- Add/remove favorites functionality
- Persistence in localStorage
- Favorites filter integration
```

#### 3. **Mocking Strategy**
```javascript
// API Mocking
jest.mock('./services/spacexAPI');
spacexAPI.spacexAPI.getLaunches.mockResolvedValue(mockData);

// Redux Store Mocking
const mockStore = configureStore({
  reducer: {
    launches: launchesSlice,
    favorites: favoritesSlice,
    filters: filtersSlice
  }
});
```

### Test Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test LaunchList.test.js
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ankitkrjha32/SpaceX_Assignment_Ankitkrjha.git
cd SpaceX_Assignment_Ankitkrjha
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Open in browser**
```
http://localhost:3000
```

### Available Scripts

```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Eject from Create React App (not recommended)
npm run eject
```

## 📱 How It Works

### 1. **Application Flow**
```
App Loads → Fetch Launches from API → Display in Grid → User Interactions
    ↓
Redux Store Updates → Components Re-render → UI Updates
```

### 2. **Key User Interactions**

#### **Browsing Launches**
- App fetches all launches on startup
- Displays in responsive grid layout
- Shows loading skeleton during fetch
- Handles errors gracefully

#### **Search & Filter**
- **Search**: Real-time filtering by mission name
- **Year Filter**: Dropdown with available years
- **Status Filter**: Success/Failure/All missions
- **Favorites Filter**: Toggle to show only favorites

#### **Favorites Management**
- Click heart icon on any launch card
- Persists to localStorage
- Toggle favorites-only view
- Visual indicators (filled/empty heart)

#### **Launch Details**
- Click any launch card to open modal
- Detailed mission information
- External links (YouTube, Wikipedia, Articles)
- Add/remove from favorites
- Click outside modal to close

### 3. **Data Management**
```
SpaceX API → Redux Actions → State Updates → Component Props → UI Render
```

### 4. **Performance Optimizations**
- **Lazy Loading**: Components loaded as needed
- **Memoization**: Prevent unnecessary re-renders
- **Image Optimization**: Fallback for failed images
- **Skeleton Loading**: Better perceived performance

## 🌟 Key Features Explanation

### **Advanced Filtering System**
- **Multi-criteria**: Combine search, year, status, and favorites
- **Real-time**: Instant results as you type/select
- **Persistent**: Maintains filter state during navigation
- **Visual Feedback**: Active filter indicators

### **Favorites System**
- **One-click Toggle**: Easy add/remove functionality
- **Persistent Storage**: Survives browser refresh
- **Visual Indicators**: Clear favorite status
- **Filter Integration**: Show only favorites option

### **Responsive Design**
- **Mobile-First**: Optimized for mobile devices
- **Breakpoint System**: Tailwind's responsive utilities
- **Touch-Friendly**: Large tap targets on mobile
- **Fluid Typography**: Scales across screen sizes

### **Error Handling**
- **Network Errors**: Graceful fallback UI
- **Image Loading**: Fallback to rocket emoji
- **API Failures**: Retry mechanism with user feedback
- **Form Validation**: Input sanitization

## 📞 Contact & Support

**Developer**: Ankit Kumar Jha  
**Email**: ankitkrjha32@gmail.com  
**Phone**: +91 9810275413  

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ for SpaceX enthusiasts and space exploration lovers!* 🚀✨