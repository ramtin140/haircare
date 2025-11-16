# Hair Care Routine Webapp - Project Outline

## File Structure
```
/mnt/okcomputer/output/
├── index.html              # Main daily routine interface
├── weekly.html             # Weekly schedule calendar
├── progress.html           # Progress tracking and statistics
├── main.js                 # Main JavaScript functionality
├── resources/              # Images and assets
│   ├── hero-hair-care.png  # Generated hero image
│   ├── product-1.jpg       # Finasteride product image
│   ├── product-2.jpg       # Bioxin shampoo image
│   ├── product-3.jpg       # Minoxidil foam image
│   └── product-4.jpg       # Serta tonic image
├── interaction.md          # Interaction design document
├── design.md              # Design style guide
└── outline.md             # This project outline
```

## Page Breakdown

### 1. index.html - Daily Routine Interface
**Purpose**: Main interactive daily routine tracker
**Sections**:
- Navigation bar with Persian text
- Hero section with generated image and typewriter effect
- Morning routine panel (Finasteride + Shampoo)
- Evening routine panel (Tonic + Massage)
- Today's completion status
- Quick navigation to weekly view
- Interactive checkboxes with animations
- Timer functionality for shampoo application

### 2. weekly.html - Weekly Schedule Calendar
**Purpose**: Interactive weekly calendar showing treatment schedule
**Sections**:
- Persian calendar header with current week
- 7-day grid layout with treatment indicators
- Color-coded treatment types
- Hover effects showing detailed instructions
- Click navigation to specific days
- Dermaroller day special indicators
- Minoxidil vs Tonic day differentiation

### 3. progress.html - Progress Tracking
**Purpose**: Visual progress and statistics dashboard
**Sections**:
- Weekly completion statistics
- Treatment adherence charts
- Streak counters with Persian labels
- Monthly overview visualization
- Achievement badges and milestones
- Motivational messages in Persian
- Progress trends and patterns

## Interactive Features

### Daily Routine Tracker
- Checkbox animations with completion effects
- Timer for shampoo application (5 minutes)
- Massage timer (5 minutes)
- Progress bars for daily completion
- Local storage for progress persistence

### Weekly Calendar
- Interactive day selection
- Treatment type indicators
- Hover tooltips with instructions
- Visual feedback for completed days

### Progress Visualization
- Animated charts showing adherence
- Weekly/monthly comparison views
- Streak tracking with celebrations
- Persian text labels and messages

## Technical Implementation

### Libraries Used
- Anime.js for smooth animations
- ECharts.js for progress visualization
- Typed.js for Persian typewriter effects
- Splitting.js for text animations
- p5.js for background particle effects

### Data Management
- Local storage for routine progress
- JSON structure for treatment schedules
- Persian text localization
- Responsive design for mobile use

### Visual Effects
- Aurora gradient background
- Floating particle system
- Smooth hover transitions
- Completion celebration animations
- Persian typography effects