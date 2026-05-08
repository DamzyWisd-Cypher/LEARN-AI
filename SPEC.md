# LearnAI Studio - AI-Powered Learning Platform

## Concept & Vision

LearnAI Studio is an intelligent learning companion that transforms any study material into interactive learning experiences. Upload content or type notes, and watch as AI creates personalized videos, podcasts, and conversations to help you master any subject. The platform feels like having a patient, knowledgeable tutor available 24/7 who speaks your language and adapts to your learning style.

The experience is warm, encouraging, and intellectually stimulating—like a blend of a cozy study room and a cutting-edge tech lab.

## Design Language

### Aesthetic Direction
Modern academic meets futuristic interface. Think Notion's cleanliness combined with Midjourney's AI aesthetic. Soft gradients, glass morphism effects, and subtle animations create a premium, trustworthy feel.

### Color Palette
- **Primary**: #6366F1 (Indigo - intelligence, trust)
- **Secondary**: #8B5CF6 (Purple - creativity, AI)
- **Accent**: #10B981 (Emerald - success, progress)
- **Background**: #0F172A (Dark slate - focus mode)
- **Surface**: #1E293B (Elevated surfaces)
- **Text Primary**: #F8FAFC
- **Text Secondary**: #94A3B8
- **Gradient**: Linear from #6366F1 to #8B5CF6

### Typography
- **Headings**: Inter (700, 600) - clean, modern
- **Body**: Inter (400, 500) - excellent readability
- **Code**: JetBrains Mono - programming content

### Spatial System
- Base unit: 4px
- Section padding: 24-48px
- Card padding: 20-24px
- Component gaps: 12-16px
- Border radius: 12-16px for cards, 8px for buttons, 24px for pills

### Motion Philosophy
- Micro-interactions: 150ms ease-out (buttons, hovers)
- Page transitions: 300ms ease-in-out
- Content reveals: 400ms with stagger effect
- Loading states: Pulsing gradients, skeleton screens
- AI responses: Typewriter effect for chat

### Visual Assets
- Icons: Lucide React (consistent, clean)
- Decorative: Gradient blobs, subtle grid patterns
- Empty states: Custom illustrations with brand colors

## Layout & Structure

### Navigation
- Sidebar navigation (collapsible) with main sections
- Top bar with search, notifications, user profile
- Breadcrumb navigation within sections

### Main Sections
1. **Dashboard** - Overview, recent activity, quick actions
2. **AI Chat** - Interactive learning assistant
3. **Video Generator** - AI-powered tutorial creation
4. **Podcast Studio** - Audio learning content creation
5. **Programming Academy** - Structured coding courses
6. **Library** - Uploaded materials and resources

### Responsive Strategy
- Desktop: Full sidebar, multi-column layouts
- Tablet: Collapsible sidebar, 2-column grids
- Mobile: Bottom navigation, single column, stacked cards

## Features & Interactions

### 1. AI Chat (LearnAI Assistant)
- **Input**: Text area for questions, supports markdown
- **Upload**: Drag-drop for PDF, TXT, DOCX files
- **Context awareness**: Remembers conversation history
- **Responses**: Formatted with code blocks, math support
- **Actions**: Copy, regenerate, start new topic
- **States**: Typing indicator, error handling, empty state guidance

### 2. Video Generator
- **Input**: Paste content or upload files
- **Customization**: Video length (1-10 min), complexity level, style
- **Generation**: Progress indicator with stages
- **Preview**: Thumbnail, duration, quality badge
- **Output**: Embedded video player, download option
- **History**: Previously generated videos

### 3. Podcast Studio
- **Input**: Topic selection, content upload
- **Voice options**: Multiple AI voices (male/female, accents)
- **Style**: Conversational, educational, storytelling
- **Generation**: Real-time progress with audio waveform
- **Output**: Audio player, transcript view, download MP3
- **Sharing**: Generate shareable link

### 4. Programming Academy
- **Course browser**: Grid of programming languages
- **Learning modes**: Video lessons, interactive reading, coding exercises
- **Progress tracking**: Completion percentage, streaks
- **Difficulty levels**: Beginner, Intermediate, Advanced
- **Code editor**: Syntax highlighting, run code (for JS/Python)
- **Certificate**: Completion badge

### Edge Cases & Error Handling
- Empty upload: Show helpful prompt with supported formats
- Long content: Truncate with "expand" option, warn user
- API errors: Toast notification with retry option
- Offline: Cache recent conversations, show offline banner
- Rate limits: Queue system with estimated wait time

## Component Inventory

### Navigation Sidebar
- Logo, nav items with icons, collapse toggle
- States: Active, hover, disabled
- User profile section at bottom

### Chat Interface
- Message bubbles (user: right-aligned indigo, AI: left-aligned surface)
- Input area with send button, upload indicator
- Typing indicator with animated dots

### File Upload Zone
- Drag-drop area with dashed border
- States: Default, drag-over (highlighted), uploading (progress), complete (checkmark)
- File preview chips after upload

### Video Card
- Thumbnail, title, duration, generated date
- Hover: Play overlay, action buttons
- States: Generating (skeleton), ready, error

### Podcast Card
- Waveform visualization, title, duration
- Play/pause button, progress scrubber
- States: Generating, ready, playing

### Course Card
- Language icon/logo, title, difficulty badge
- Progress bar, lesson count
- States: Not started, in progress, completed

### Button Variants
- Primary: Gradient background, white text
- Secondary: Surface background, border
- Ghost: Transparent, text only
- States: Default, hover (lift effect), active (pressed), disabled (opacity 50%), loading (spinner)

### Input Fields
- Label, input area, helper text
- States: Default, focused (ring), error (red border + message), disabled

## Technical Approach

### Framework & Libraries
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- React Router for navigation
- Zustand for state management (or React Context)

### Data Flow
- Local state for UI interactions
- Simulated API responses for demo (mock data)
- LocalStorage for persistence (chat history, progress)

### Key Implementation Notes
- Simulated AI responses with realistic delays
- Mock video/podcast generation with progress simulation
- Programming courses with real content structure
- All interactions fully functional on frontend
