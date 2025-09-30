# Player Game Day Tracker

A modern, intuitive web application for managing sports teams, tracking player participation, and organizing game schedules. Built with React and featuring drag-and-drop functionality, configurable teams, matchday previews, and comprehensive export capabilities.

## 🚀 Features

### 👥 **Player Management**
- **Drag & Drop Reordering**: Intuitively reorder players by dragging them to different positions
- **Player Roster**: Add, edit, and delete players with first and last names
- **Participation Tracking**: Automatic calculation of total game days per player
- **Persistent Storage**: All data is saved locally and persists across sessions

### ⚙️ **Flexible Configuration**
- **Multiple Teams**: Support for 1-4 teams with individual configurations
- **Custom Game Days**: Set different numbers of game days for each team (1-20 days)
- **Dynamic Team Generation**: Teams are created automatically based on your configuration
- **Real-time Updates**: Changes apply immediately without page refresh

### 📅 **Game Day Management**
- **Required Opponent Field**: Every game must have an opponent specified
- **Location Tracking**: Home/Away game designation with visual indicators
- **Date Scheduling**: Set specific dates for each game day
- **Player Selection**: Checkbox system for selecting which players participate in each game
- **Matchday Preview**: Visual overview of all matchdays with opponent, date, location, and players

### 📊 **Matchday Preview System**
- **Team Overview Tables**: Each team displays a comprehensive preview table
- **Horizontal Scrolling**: Handles any number of matchdays with smooth scrolling
- **Home Game Highlighting**: Visual distinction for home vs away games
- **Player Order Preservation**: Shows players in the same order as the roster
- **Real-time Updates**: Preview updates instantly when data changes

### 📤 **Advanced Export Options**
- **General Excel Export**: Download all teams and players in one file
- **Per-Team Excel Export**: Individual team exports with preview-style formatting
- **Per-Team PDF Export**: High-quality PDF exports of team previews
- **One Player Per Row**: Excel exports show each player on separate rows for better readability
- **Preview-Style Format**: Excel exports match the visual preview layout

### 🎨 **Modern UI/UX**
- **Dark/Light Theme**: Toggle between dark and light modes with persistent preference
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, minimalistic design with smooth animations
- **Visual Feedback**: Hover effects, drag animations, and loading states
- **Accessibility**: Full keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **React 19** - Modern React with hooks and functional components
- **@dnd-kit** - Advanced drag and drop functionality
- **Lucide React** - Beautiful, customizable icons
- **SheetJS (XLSX)** - Excel file generation and export
- **jsPDF** - PDF generation for team previews
- **html2canvas** - High-quality image capture for PDF exports
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **LocalStorage** - Client-side data persistence

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd player-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 How to Use

### 1. **Configure Your Teams**
- Click the **"Config"** button in the header
- Select the number of teams (1-4)
- Set the number of game days for each team
- Configuration saves automatically

### 2. **Manage Players**
- Add players using the **"Add Player"** button
- **Drag and drop** players to reorder them (grab the ⋮⋮ handle)
- Edit player names directly in the table
- Delete players using the trash icon

### 3. **Schedule Game Days**
- Each team has its own section with configurable game days
- Set the date for each game day
- Choose Home or Away location
- **Enter opponent name** (required field)
- Select which players will participate

### 4. **View Matchday Previews**
- Each team section shows a comprehensive preview table
- See all matchdays at a glance with opponent, date, location, and players
- Home games are highlighted for easy identification
- Scroll horizontally to view all matchdays

### 5. **Export Data**
- **General Export**: Click **"Download Excel"** to export all teams and players
- **Per-Team Excel**: Use the "Export Excel" button in each team's preview section
- **Per-Team PDF**: Use the "Export PDF" button for high-quality team previews
- All exports include complete data with improved formatting

## 🎯 Key Features Explained

### **Drag & Drop Player Reordering**
- Hover over any player row to see the drag handle (⋮⋮)
- Click and drag to reorder players
- Visual feedback with opacity changes and smooth animations
- Order persists across browser sessions

### **Flexible Team Configuration**
- Start with 2 teams by default
- Add up to 4 teams as needed
- Each team can have different numbers of game days
- Perfect for managing multiple divisions or age groups

### **Required Opponent Tracking**
- Every game day must have an opponent specified
- No more optional fields - ensures complete game information
- Helps with scheduling and opponent management

### **Smart Data Persistence**
- All data automatically saves to browser storage
- No need to manually save - everything is preserved
- Works offline and syncs when browser is refreshed

### **Matchday Preview System**
- Visual overview tables show all matchdays for each team
- Home games are highlighted with special styling
- Players appear in the same order as the roster
- Horizontal scrolling handles any number of matchdays
- Real-time updates when you modify game data

### **Advanced Export Features**
- **Excel Exports**: Preview-style formatting with matchdays as columns
- **PDF Exports**: High-quality captures of team preview tables
- **One Player Per Row**: Excel shows each player on separate rows for clarity
- **Full Width Capture**: PDF exports include all columns, even those requiring scroll

## 🔧 Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Project Structure
```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── index.js        # Application entry point
└── index.css       # Global styles
```

## 🎨 Customization

The application uses a modern design system with:
- **Color Palette**: Purple/blue gradients with clean whites and grays
- **Dark/Light Themes**: Automatic theme switching with persistent preferences
- **Typography**: Inter font family for excellent readability
- **Spacing**: Consistent padding and margins throughout
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design that scales to all screen sizes
- **Preview Tables**: Horizontal scrolling tables with home game highlighting

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Drag and drop by [@dnd-kit](https://dndkit.com/)
- Excel export by [SheetJS](https://sheetjs.com/)
- PDF generation by [jsPDF](https://github.com/parallax/jsPDF)
- Image capture by [html2canvas](https://html2canvas.hertzen.com/)

---

**Player Game Day Tracker** - Making team management simple and intuitive with powerful preview and export features! 🏆