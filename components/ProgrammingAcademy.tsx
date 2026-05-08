import { useState } from 'react';
import { 
  Code, 
  Play, 
  BookOpen, 
  CheckCircle, 
  Circle,
  ChevronRight,
  ChevronDown,
  Terminal,
  FileCode,
  Copy,
  Check,
  X,
  Lightbulb,
  Trophy,
  Search,
  GraduationCap,
  Award,
  Zap,
  Filter,
  Grid,
  List,
  Globe,
  Smartphone,
  Database,
  Cpu,
  BarChart3,
  Layers,
  Cog,
  Gamepad2,
  Shield
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgGradient: string;
  lessons: number;
  completedLessons: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  category: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'exercise';
  duration: string;
  completed: boolean;
  content?: string;
}

const initialCourses: Course[] = [
  // ==================== WEB DEVELOPMENT ====================
  {
    id: 'html-css',
    name: 'HTML & CSS',
    icon: '🌐',
    color: 'from-orange-400 to-red-500',
    bgGradient: 'from-orange-500/20 to-red-500/10',
    lessons: 30,
    completedLessons: 22,
    difficulty: 'beginner',
    description: 'Build and style beautiful websites from scratch',
    category: 'Web Development',
    modules: [
      {
        id: 'html-basics',
        title: 'HTML Fundamentals',
        lessons: [
          { id: 'html-1', title: 'Introduction to HTML', type: 'video', duration: '10:00', completed: true },
          { id: 'html-2', title: 'HTML Document Structure', type: 'reading', duration: '8 min', completed: true },
          { id: 'html-3', title: 'Text Elements & Headings', type: 'video', duration: '12:30', completed: true },
          { id: 'html-4', title: 'Links, Images & Media', type: 'reading', duration: '10 min', completed: true },
          { id: 'html-5', title: 'Lists & Tables', type: 'exercise', duration: '15 min', completed: true },
          { id: 'html-6', title: 'Forms & Input Elements', type: 'video', duration: '18:00', completed: true },
          { id: 'html-7', title: 'Semantic HTML5', type: 'reading', duration: '12 min', completed: false },
          { id: 'html-8', title: 'HTML Best Practices', type: 'exercise', duration: '20 min', completed: false },
        ]
      },
      {
        id: 'css-basics',
        title: 'CSS Styling',
        lessons: [
          { id: 'css-1', title: 'CSS Syntax & Selectors', type: 'video', duration: '14:00', completed: true },
          { id: 'css-2', title: 'Colors, Fonts & Text', type: 'reading', duration: '10 min', completed: true },
          { id: 'css-3', title: 'Box Model & Layout', type: 'video', duration: '16:30', completed: true },
          { id: 'css-4', title: 'Flexbox Deep Dive', type: 'video', duration: '22:00', completed: true },
          { id: 'css-5', title: 'CSS Grid Mastery', type: 'video', duration: '20:00', completed: true },
          { id: 'css-6', title: 'Responsive Design', type: 'reading', duration: '15 min', completed: true },
          { id: 'css-7', title: 'Animations & Transitions', type: 'exercise', duration: '25 min', completed: false },
          { id: 'css-8', title: 'CSS Variables & Custom Properties', type: 'reading', duration: '10 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '🟨',
    color: 'from-yellow-400 to-amber-500',
    bgGradient: 'from-yellow-500/20 to-amber-500/10',
    lessons: 36,
    completedLessons: 18,
    difficulty: 'beginner',
    description: 'Master the language of the web',
    category: 'Web Development',
    modules: [
      {
        id: 'js-basics',
        title: 'JavaScript Basics',
        lessons: [
          { id: 'js-1', title: 'Introduction to JavaScript', type: 'video', duration: '10:30', completed: true },
          { id: 'js-2', title: 'Variables and Data Types', type: 'reading', duration: '8 min', completed: true },
          { id: 'js-3', title: 'Your First JavaScript Program', type: 'exercise', duration: '15 min', completed: true },
          { id: 'js-4', title: 'Operators and Expressions', type: 'video', duration: '12:45', completed: true },
          { id: 'js-5', title: 'Control Flow: If Statements', type: 'reading', duration: '10 min', completed: false },
          { id: 'js-6', title: 'Loops and Iteration', type: 'video', duration: '15:00', completed: false },
          { id: 'js-7', title: 'Functions & Scope', type: 'video', duration: '18:00', completed: false },
          { id: 'js-8', title: 'Arrays & Objects', type: 'reading', duration: '14 min', completed: false },
        ]
      },
      {
        id: 'js-advanced',
        title: 'Advanced Concepts',
        lessons: [
          { id: 'js-9', title: 'Closures Explained', type: 'video', duration: '18:20', completed: false },
          { id: 'js-10', title: 'Prototypes and Inheritance', type: 'reading', duration: '15 min', completed: false },
          { id: 'js-11', title: 'Async/Await Deep Dive', type: 'video', duration: '22:00', completed: false },
          { id: 'js-12', title: 'Promises & Callbacks', type: 'video', duration: '16:00', completed: false },
          { id: 'js-13', title: 'ES6+ Features', type: 'reading', duration: '20 min', completed: false },
          { id: 'js-14', title: 'DOM Manipulation', type: 'exercise', duration: '30 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    color: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/20 to-indigo-500/10',
    lessons: 24,
    completedLessons: 8,
    difficulty: 'intermediate',
    description: 'Type-safe JavaScript for scalable apps',
    category: 'Web Development',
    modules: [
      {
        id: 'ts-basics',
        title: 'TypeScript Fundamentals',
        lessons: [
          { id: 'ts-1', title: 'Why TypeScript?', type: 'video', duration: '8:00', completed: true },
          { id: 'ts-2', title: 'Basic Types', type: 'reading', duration: '10 min', completed: true },
          { id: 'ts-3', title: 'Interfaces & Types', type: 'video', duration: '14:00', completed: false },
          { id: 'ts-4', title: 'Generics', type: 'video', duration: '18:00', completed: false },
          { id: 'ts-5', title: 'Enums & Union Types', type: 'reading', duration: '12 min', completed: false },
          { id: 'ts-6', title: 'Type Guards', type: 'exercise', duration: '20 min', completed: false },
        ]
      },
      {
        id: 'ts-advanced',
        title: 'Advanced TypeScript',
        lessons: [
          { id: 'ts-7', title: 'Mapped Types', type: 'video', duration: '15:00', completed: false },
          { id: 'ts-8', title: 'Conditional Types', type: 'reading', duration: '14 min', completed: false },
          { id: 'ts-9', title: 'Decorators', type: 'video', duration: '12:00', completed: false },
          { id: 'ts-10', title: 'Module Systems', type: 'reading', duration: '10 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    color: 'from-cyan-400 to-sky-500',
    bgGradient: 'from-cyan-500/20 to-sky-500/10',
    lessons: 32,
    completedLessons: 25,
    difficulty: 'intermediate',
    description: 'Build modern web apps with React',
    category: 'Web Development',
    modules: [
      {
        id: 'react-basics',
        title: 'React Essentials',
        lessons: [
          { id: 'r-1', title: 'What is React?', type: 'video', duration: '12:00', completed: true },
          { id: 'r-2', title: 'Components & JSX', type: 'video', duration: '15:30', completed: true },
          { id: 'r-3', title: 'Props & State', type: 'reading', duration: '10 min', completed: true },
          { id: 'r-4', title: 'Event Handling', type: 'exercise', duration: '25 min', completed: true },
          { id: 'r-5', title: 'Hooks Deep Dive', type: 'video', duration: '22:00', completed: true },
          { id: 'r-6', title: 'Context API', type: 'reading', duration: '14 min', completed: false },
        ]
      },
      {
        id: 'react-advanced',
        title: 'Advanced React',
        lessons: [
          { id: 'r-7', title: 'React Router', type: 'video', duration: '16:00', completed: false },
          { id: 'r-8', title: 'Redux State Management', type: 'video', duration: '20:00', completed: false },
          { id: 'r-9', title: 'Performance Optimization', type: 'reading', duration: '15 min', completed: false },
          { id: 'r-10', title: 'Testing React Apps', type: 'exercise', duration: '30 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: '🔴',
    color: 'from-red-500 to-pink-600',
    bgGradient: 'from-red-500/20 to-pink-500/10',
    lessons: 28,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Enterprise-grade web framework by Google',
    category: 'Web Development',
    modules: [
      {
        id: 'ng-basics',
        title: 'Angular Fundamentals',
        lessons: [
          { id: 'ng-1', title: 'Introduction to Angular', type: 'video', duration: '14:00', completed: false },
          { id: 'ng-2', title: 'Components & Templates', type: 'reading', duration: '12 min', completed: false },
          { id: 'ng-3', title: 'Data Binding & Directives', type: 'video', duration: '18:00', completed: false },
          { id: 'ng-4', title: 'Services & Dependency Injection', type: 'video', duration: '16:00', completed: false },
          { id: 'ng-5', title: 'Routing & Navigation', type: 'reading', duration: '14 min', completed: false },
          { id: 'ng-6', title: 'Forms & Validation', type: 'exercise', duration: '25 min', completed: false },
        ]
      },
      {
        id: 'ng-advanced',
        title: 'Advanced Angular',
        lessons: [
          { id: 'ng-7', title: 'RxJS & Observables', type: 'video', duration: '20:00', completed: false },
          { id: 'ng-8', title: 'NgRx State Management', type: 'video', duration: '18:00', completed: false },
          { id: 'ng-9', title: 'Angular Modules', type: 'reading', duration: '12 min', completed: false },
          { id: 'ng-10', title: 'Testing Angular Apps', type: 'exercise', duration: '30 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'vue',
    name: 'Vue.js',
    icon: '💚',
    color: 'from-emerald-400 to-green-600',
    bgGradient: 'from-emerald-500/20 to-green-500/10',
    lessons: 24,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Progressive JavaScript framework for UIs',
    category: 'Web Development',
    modules: [
      {
        id: 'vue-basics',
        title: 'Vue.js Essentials',
        lessons: [
          { id: 'vue-1', title: 'Getting Started with Vue', type: 'video', duration: '10:00', completed: false },
          { id: 'vue-2', title: 'Template Syntax', type: 'reading', duration: '8 min', completed: false },
          { id: 'vue-3', title: 'Reactive Data & Computed', type: 'video', duration: '14:00', completed: false },
          { id: 'vue-4', title: 'Components & Props', type: 'video', duration: '16:00', completed: false },
          { id: 'vue-5', title: 'Vue Router', type: 'reading', duration: '12 min', completed: false },
          { id: 'vue-6', title: 'Pinia State Management', type: 'exercise', duration: '20 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'svelte',
    name: 'Svelte',
    icon: '🔥',
    color: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-500/20 to-red-500/10',
    lessons: 18,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Compile-time framework for lean apps',
    category: 'Web Development',
    modules: [
      {
        id: 'svelte-basics',
        title: 'Svelte Fundamentals',
        lessons: [
          { id: 'sv-1', title: 'Introduction to Svelte', type: 'video', duration: '10:00', completed: false },
          { id: 'sv-2', title: 'Reactivity & Assignments', type: 'reading', duration: '10 min', completed: false },
          { id: 'sv-3', title: 'Components & Props', type: 'video', duration: '14:00', completed: false },
          { id: 'sv-4', title: 'SvelteKit Routing', type: 'video', duration: '16:00', completed: false },
          { id: 'sv-5', title: 'Stores & State', type: 'exercise', duration: '20 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: '▲',
    color: 'from-slate-300 to-slate-600',
    bgGradient: 'from-slate-400/20 to-slate-600/10',
    lessons: 22,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Full-stack React framework for production',
    category: 'Web Development',
    modules: [
      {
        id: 'next-basics',
        title: 'Next.js Fundamentals',
        lessons: [
          { id: 'nx-1', title: 'Introduction to Next.js', type: 'video', duration: '12:00', completed: false },
          { id: 'nx-2', title: 'File-Based Routing', type: 'reading', duration: '10 min', completed: false },
          { id: 'nx-3', title: 'Server vs Client Components', type: 'video', duration: '18:00', completed: false },
          { id: 'nx-4', title: 'API Routes & Server Actions', type: 'video', duration: '16:00', completed: false },
          { id: 'nx-5', title: 'SSR, SSG & ISR', type: 'reading', duration: '14 min', completed: false },
          { id: 'nx-6', title: 'Building a Full-Stack App', type: 'exercise', duration: '40 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: '🟩',
    color: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-500/20 to-emerald-500/10',
    lessons: 26,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Server-side JavaScript runtime',
    category: 'Web Development',
    modules: [
      {
        id: 'node-basics',
        title: 'Node.js Essentials',
        lessons: [
          { id: 'nd-1', title: 'Introduction to Node.js', type: 'video', duration: '12:00', completed: false },
          { id: 'nd-2', title: 'Modules & npm', type: 'reading', duration: '10 min', completed: false },
          { id: 'nd-3', title: 'File System Operations', type: 'video', duration: '14:00', completed: false },
          { id: 'nd-4', title: 'Express.js Framework', type: 'video', duration: '20:00', completed: false },
          { id: 'nd-5', title: 'REST API Development', type: 'exercise', duration: '30 min', completed: false },
          { id: 'nd-6', title: 'Authentication & Security', type: 'reading', duration: '15 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'php',
    name: 'PHP',
    icon: '🐘',
    color: 'from-indigo-400 to-purple-600',
    bgGradient: 'from-indigo-500/20 to-purple-500/10',
    lessons: 24,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Server-side scripting for the web',
    category: 'Web Development',
    modules: [
      {
        id: 'php-basics',
        title: 'PHP Fundamentals',
        lessons: [
          { id: 'php-1', title: 'PHP Setup & Syntax', type: 'video', duration: '10:00', completed: false },
          { id: 'php-2', title: 'Variables & Data Types', type: 'reading', duration: '8 min', completed: false },
          { id: 'php-3', title: 'Functions & Arrays', type: 'video', duration: '14:00', completed: false },
          { id: 'php-4', title: 'Forms & Validation', type: 'exercise', duration: '20 min', completed: false },
          { id: 'php-5', title: 'MySQL Integration', type: 'video', duration: '18:00', completed: false },
          { id: 'php-6', title: 'Laravel Framework Intro', type: 'reading', duration: '12 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: '💎',
    color: 'from-red-400 to-rose-600',
    bgGradient: 'from-red-400/20 to-rose-500/10',
    lessons: 22,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Elegant, developer-friendly language',
    category: 'Web Development',
    modules: [
      {
        id: 'ruby-basics',
        title: 'Ruby Fundamentals',
        lessons: [
          { id: 'rb-1', title: 'Introduction to Ruby', type: 'video', duration: '10:00', completed: false },
          { id: 'rb-2', title: 'Variables & Types', type: 'reading', duration: '8 min', completed: false },
          { id: 'rb-3', title: 'Blocks & Iterators', type: 'video', duration: '14:00', completed: false },
          { id: 'rb-4', title: 'Classes & Modules', type: 'reading', duration: '12 min', completed: false },
          { id: 'rb-5', title: 'Ruby on Rails Intro', type: 'video', duration: '20:00', completed: false },
        ]
      }
    ]
  },
  {
    id: 'sass',
    name: 'Sass/SCSS',
    icon: '🎨',
    color: 'from-pink-400 to-fuchsia-600',
    bgGradient: 'from-pink-400/20 to-fuchsia-500/10',
    lessons: 16,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Powerful CSS preprocessor',
    category: 'Web Development',
    modules: [
      {
        id: 'sass-basics',
        title: 'Sass Essentials',
        lessons: [
          { id: 'sass-1', title: 'Introduction to Sass', type: 'video', duration: '8:00', completed: false },
          { id: 'sass-2', title: 'Variables & Nesting', type: 'reading', duration: '8 min', completed: false },
          { id: 'sass-3', title: 'Mixins & Functions', type: 'video', duration: '14:00', completed: false },
          { id: 'sass-4', title: 'Inheritance & Extend', type: 'exercise', duration: '15 min', completed: false },
        ]
      }
    ]
  },

  // ==================== PYTHON ====================
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    color: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/10',
    lessons: 40,
    completedLessons: 14,
    difficulty: 'beginner',
    description: 'The most versatile programming language',
    category: 'General Purpose',
    modules: [
      {
        id: 'py-basics',
        title: 'Python Fundamentals',
        lessons: [
          { id: 'py-1', title: 'Python Setup & Syntax', type: 'video', duration: '8:00', completed: true },
          { id: 'py-2', title: 'Variables & Basic Types', type: 'reading', duration: '6 min', completed: true },
          { id: 'py-3', title: 'Lists and Dictionaries', type: 'video', duration: '14:30', completed: true },
          { id: 'py-4', title: 'Functions & Lambda', type: 'reading', duration: '12 min', completed: true },
          { id: 'py-5', title: 'List Comprehensions', type: 'exercise', duration: '20 min', completed: false },
          { id: 'py-6', title: 'Classes & OOP', type: 'video', duration: '22:00', completed: false },
          { id: 'py-7', title: 'Error Handling', type: 'reading', duration: '10 min', completed: false },
          { id: 'py-8', title: 'File I/O', type: 'exercise', duration: '15 min', completed: false },
        ]
      },
      {
        id: 'py-advanced',
        title: 'Advanced Python',
        lessons: [
          { id: 'py-9', title: 'Decorators & Generators', type: 'video', duration: '18:00', completed: false },
          { id: 'py-10', title: 'Context Managers', type: 'reading', duration: '12 min', completed: false },
          { id: 'py-11', title: 'Async Programming', type: 'video', duration: '20:00', completed: false },
          { id: 'py-12', title: 'Type Hints', type: 'reading', duration: '10 min', completed: false },
        ]
      }
    ]
  },

  // ==================== MOBILE DEVELOPMENT ====================
  {
    id: 'swift',
    name: 'Swift',
    icon: '🍎',
    color: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-500/20 to-red-500/10',
    lessons: 28,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Build iOS & macOS apps with Swift',
    category: 'Mobile Development',
    modules: [
      {
        id: 'swift-basics',
        title: 'Swift Fundamentals',
        lessons: [
          { id: 'sw-1', title: 'Introduction to Swift', type: 'video', duration: '12:00', completed: false },
          { id: 'sw-2', title: 'Variables & Optionals', type: 'reading', duration: '10 min', completed: false },
          { id: 'sw-3', title: 'Control Flow & Loops', type: 'video', duration: '14:00', completed: false },
          { id: 'sw-4', title: 'Functions & Closures', type: 'reading', duration: '12 min', completed: false },
          { id: 'sw-5', title: 'Structs & Classes', type: 'video', duration: '18:00', completed: false },
          { id: 'sw-6', title: 'Protocols & Extensions', type: 'reading', duration: '14 min', completed: false },
        ]
      },
      {
        id: 'swiftui',
        title: 'SwiftUI',
        lessons: [
          { id: 'swi-1', title: 'SwiftUI Basics', type: 'video', duration: '16:00', completed: false },
          { id: 'swi-2', title: 'Layouts & Navigation', type: 'video', duration: '18:00', completed: false },
          { id: 'swi-3', title: 'State & Data Flow', type: 'reading', duration: '14 min', completed: false },
          { id: 'swi-4', title: 'Building a Complete App', type: 'exercise', duration: '45 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    icon: '🟣',
    color: 'from-purple-500 to-violet-600',
    bgGradient: 'from-purple-500/20 to-violet-500/10',
    lessons: 26,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Modern language for Android development',
    category: 'Mobile Development',
    modules: [
      {
        id: 'kotlin-basics',
        title: 'Kotlin Fundamentals',
        lessons: [
          { id: 'kt-1', title: 'Introduction to Kotlin', type: 'video', duration: '10:00', completed: false },
          { id: 'kt-2', title: 'Variables & Null Safety', type: 'reading', duration: '10 min', completed: false },
          { id: 'kt-3', title: 'Functions & Lambdas', type: 'video', duration: '14:00', completed: false },
          { id: 'kt-4', title: 'Classes & Inheritance', type: 'reading', duration: '12 min', completed: false },
          { id: 'kt-5', title: 'Coroutines', type: 'video', duration: '20:00', completed: false },
          { id: 'kt-6', title: 'Android Jetpack Compose', type: 'video', duration: '22:00', completed: false },
        ]
      }
    ]
  },
  {
    id: 'dart',
    name: 'Dart',
    icon: '🎯',
    color: 'from-cyan-500 to-blue-600',
    bgGradient: 'from-cyan-500/20 to-blue-600/10',
    lessons: 24,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Language behind Flutter for cross-platform apps',
    category: 'Mobile Development',
    modules: [
      {
        id: 'dart-basics',
        title: 'Dart Fundamentals',
        lessons: [
          { id: 'dart-1', title: 'Introduction to Dart', type: 'video', duration: '10:00', completed: false },
          { id: 'dart-2', title: 'Variables & Types', type: 'reading', duration: '8 min', completed: false },
          { id: 'dart-3', title: 'Functions & Closures', type: 'video', duration: '14:00', completed: false },
          { id: 'dart-4', title: 'Classes & Mixins', type: 'reading', duration: '12 min', completed: false },
          { id: 'dart-5', title: 'Async Programming', type: 'video', duration: '16:00', completed: false },
          { id: 'dart-6', title: 'Flutter Widgets', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'flutter',
    name: 'Flutter',
    icon: '💙',
    color: 'from-sky-400 to-blue-500',
    bgGradient: 'from-sky-400/20 to-blue-500/10',
    lessons: 28,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Build beautiful cross-platform mobile apps',
    category: 'Mobile Development',
    modules: [
      {
        id: 'flutter-basics',
        title: 'Flutter Essentials',
        lessons: [
          { id: 'fl-1', title: 'Flutter Setup & First App', type: 'video', duration: '14:00', completed: false },
          { id: 'fl-2', title: 'Widget Tree & Layout', type: 'reading', duration: '12 min', completed: false },
          { id: 'fl-3', title: 'Stateful vs Stateless', type: 'video', duration: '16:00', completed: false },
          { id: 'fl-4', title: 'Navigation & Routing', type: 'video', duration: '14:00', completed: false },
          { id: 'fl-5', title: 'HTTP & APIs', type: 'exercise', duration: '25 min', completed: false },
          { id: 'fl-6', title: 'State Management (Riverpod)', type: 'reading', duration: '15 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'react-native',
    name: 'React Native',
    icon: '📱',
    color: 'from-blue-400 to-indigo-500',
    bgGradient: 'from-blue-400/20 to-indigo-500/10',
    lessons: 22,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Cross-platform mobile apps with React',
    category: 'Mobile Development',
    modules: [
      {
        id: 'rn-basics',
        title: 'React Native Essentials',
        lessons: [
          { id: 'rn-1', title: 'Introduction to React Native', type: 'video', duration: '12:00', completed: false },
          { id: 'rn-2', title: 'Core Components', type: 'reading', duration: '10 min', completed: false },
          { id: 'rn-3', title: 'Styling & Layout', type: 'video', duration: '14:00', completed: false },
          { id: 'rn-4', title: 'Navigation', type: 'video', duration: '16:00', completed: false },
          { id: 'rn-5', title: 'Native Modules', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },

  // ==================== SYSTEMS PROGRAMMING ====================
  {
    id: 'c',
    name: 'C',
    icon: '⚙️',
    color: 'from-gray-400 to-slate-600',
    bgGradient: 'from-gray-400/20 to-slate-600/10',
    lessons: 30,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'The foundation of modern programming',
    category: 'Systems Programming',
    modules: [
      {
        id: 'c-basics',
        title: 'C Fundamentals',
        lessons: [
          { id: 'c-1', title: 'Introduction to C', type: 'video', duration: '12:00', completed: false },
          { id: 'c-2', title: 'Variables & Data Types', type: 'reading', duration: '10 min', completed: false },
          { id: 'c-3', title: 'Operators & Control Flow', type: 'video', duration: '14:00', completed: false },
          { id: 'c-4', title: 'Functions & Scope', type: 'reading', duration: '12 min', completed: false },
          { id: 'c-5', title: 'Arrays & Strings', type: 'video', duration: '16:00', completed: false },
          { id: 'c-6', title: 'Pointers Deep Dive', type: 'video', duration: '22:00', completed: false },
        ]
      },
      {
        id: 'c-advanced',
        title: 'Advanced C',
        lessons: [
          { id: 'c-7', title: 'Dynamic Memory Allocation', type: 'video', duration: '18:00', completed: false },
          { id: 'c-8', title: 'Structs & Unions', type: 'reading', duration: '14 min', completed: false },
          { id: 'c-9', title: 'File I/O', type: 'exercise', duration: '20 min', completed: false },
          { id: 'c-10', title: 'Preprocessor & Macros', type: 'reading', duration: '10 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚡',
    color: 'from-blue-600 to-indigo-700',
    bgGradient: 'from-blue-600/20 to-indigo-700/10',
    lessons: 34,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'High-performance systems programming',
    category: 'Systems Programming',
    modules: [
      {
        id: 'cpp-basics',
        title: 'C++ Fundamentals',
        lessons: [
          { id: 'cpp-1', title: 'C++ Setup & Basics', type: 'video', duration: '12:00', completed: false },
          { id: 'cpp-2', title: 'References & Pointers', type: 'reading', duration: '14 min', completed: false },
          { id: 'cpp-3', title: 'Classes & Objects', type: 'video', duration: '18:00', completed: false },
          { id: 'cpp-4', title: 'Inheritance & Polymorphism', type: 'video', duration: '20:00', completed: false },
          { id: 'cpp-5', title: 'Templates', type: 'reading', duration: '16 min', completed: false },
          { id: 'cpp-6', title: 'STL Containers', type: 'video', duration: '22:00', completed: false },
        ]
      },
      {
        id: 'cpp-advanced',
        title: 'Modern C++',
        lessons: [
          { id: 'cpp-7', title: 'Smart Pointers', type: 'video', duration: '16:00', completed: false },
          { id: 'cpp-8', title: 'Move Semantics', type: 'reading', duration: '14 min', completed: false },
          { id: 'cpp-9', title: 'Concurrency & Threads', type: 'video', duration: '20:00', completed: false },
          { id: 'cpp-10', title: 'C++20 Features', type: 'reading', duration: '12 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    color: 'from-orange-400 to-red-500',
    bgGradient: 'from-orange-500/20 to-red-500/10',
    lessons: 28,
    completedLessons: 3,
    difficulty: 'advanced',
    description: 'Safe, fast, concurrent systems language',
    category: 'Systems Programming',
    modules: [
      {
        id: 'rust-basics',
        title: 'Rust Fundamentals',
        lessons: [
          { id: 'ru-1', title: 'Introduction to Rust', type: 'video', duration: '15:00', completed: true },
          { id: 'ru-2', title: 'Ownership & Borrowing', type: 'reading', duration: '20 min', completed: true },
          { id: 'ru-3', title: 'Pattern Matching', type: 'video', duration: '12:00', completed: false },
          { id: 'ru-4', title: 'Enums & Structs', type: 'reading', duration: '14 min', completed: false },
          { id: 'ru-5', title: 'Error Handling with Result', type: 'video', duration: '16:00', completed: false },
          { id: 'ru-6', title: 'Traits & Generics', type: 'video', duration: '20:00', completed: false },
        ]
      },
      {
        id: 'rust-advanced',
        title: 'Advanced Rust',
        lessons: [
          { id: 'ru-7', title: 'Lifetimes Deep Dive', type: 'video', duration: '18:00', completed: false },
          { id: 'ru-8', title: 'Concurrency in Rust', type: 'video', duration: '22:00', completed: false },
          { id: 'ru-9', title: 'Async Rust', type: 'reading', duration: '16 min', completed: false },
          { id: 'ru-10', title: 'Building a CLI Tool', type: 'exercise', duration: '40 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🐹',
    color: 'from-cyan-400 to-teal-500',
    bgGradient: 'from-cyan-500/20 to-teal-500/10',
    lessons: 24,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Simple, reliable, efficient backend language',
    category: 'Systems Programming',
    modules: [
      {
        id: 'go-basics',
        title: 'Go Fundamentals',
        lessons: [
          { id: 'g-1', title: 'Getting Started with Go', type: 'video', duration: '10:00', completed: false },
          { id: 'g-2', title: 'Variables & Types', type: 'reading', duration: '8 min', completed: false },
          { id: 'g-3', title: 'Functions & Packages', type: 'video', duration: '12:00', completed: false },
          { id: 'g-4', title: 'Structs & Interfaces', type: 'reading', duration: '14 min', completed: false },
          { id: 'g-5', title: 'Goroutines & Channels', type: 'video', duration: '18:00', completed: false },
          { id: 'g-6', title: 'Building a Web Server', type: 'exercise', duration: '30 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'zig',
    name: 'Zig',
    icon: '🟠',
    color: 'from-amber-400 to-orange-600',
    bgGradient: 'from-amber-400/20 to-orange-600/10',
    lessons: 18,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Low-level language competing with C',
    category: 'Systems Programming',
    modules: [
      {
        id: 'zig-basics',
        title: 'Zig Fundamentals',
        lessons: [
          { id: 'zig-1', title: 'Introduction to Zig', type: 'video', duration: '12:00', completed: false },
          { id: 'zig-2', title: 'Variables & Types', type: 'reading', duration: '10 min', completed: false },
          { id: 'zig-3', title: 'Control Flow', type: 'video', duration: '14:00', completed: false },
          { id: 'zig-4', title: 'Structs & Enums', type: 'reading', duration: '12 min', completed: false },
          { id: 'zig-5', title: 'Memory Management', type: 'video', duration: '18:00', completed: false },
        ]
      }
    ]
  },
  {
    id: 'assembly',
    name: 'Assembly',
    icon: '🔧',
    color: 'from-slate-400 to-zinc-600',
    bgGradient: 'from-slate-400/20 to-zinc-600/10',
    lessons: 20,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Direct hardware-level programming',
    category: 'Systems Programming',
    modules: [
      {
        id: 'asm-basics',
        title: 'Assembly Basics',
        lessons: [
          { id: 'asm-1', title: 'CPU Architecture Basics', type: 'video', duration: '14:00', completed: false },
          { id: 'asm-2', title: 'Registers & Memory', type: 'reading', duration: '12 min', completed: false },
          { id: 'asm-3', title: 'Instructions & Addressing', type: 'video', duration: '18:00', completed: false },
          { id: 'asm-4', title: 'Control Flow in ASM', type: 'video', duration: '16:00', completed: false },
          { id: 'asm-5', title: 'Writing Simple Programs', type: 'exercise', duration: '30 min', completed: false },
        ]
      }
    ]
  },

  // ==================== JVM LANGUAGES ====================
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    color: 'from-red-500 to-orange-600',
    bgGradient: 'from-red-500/20 to-orange-600/10',
    lessons: 36,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Write once, run anywhere enterprise language',
    category: 'JVM Languages',
    modules: [
      {
        id: 'java-basics',
        title: 'Java Fundamentals',
        lessons: [
          { id: 'java-1', title: 'Introduction to Java', type: 'video', duration: '12:00', completed: false },
          { id: 'java-2', title: 'Variables & Data Types', type: 'reading', duration: '10 min', completed: false },
          { id: 'java-3', title: 'Control Flow & Loops', type: 'video', duration: '14:00', completed: false },
          { id: 'java-4', title: 'Arrays & Strings', type: 'reading', duration: '12 min', completed: false },
          { id: 'java-5', title: 'OOP: Classes & Objects', type: 'video', duration: '20:00', completed: false },
          { id: 'java-6', title: 'Inheritance & Polymorphism', type: 'video', duration: '18:00', completed: false },
          { id: 'java-7', title: 'Interfaces & Abstract Classes', type: 'reading', duration: '14 min', completed: false },
          { id: 'java-8', title: 'Exception Handling', type: 'exercise', duration: '20 min', completed: false },
        ]
      },
      {
        id: 'java-advanced',
        title: 'Advanced Java',
        lessons: [
          { id: 'java-9', title: 'Collections Framework', type: 'video', duration: '20:00', completed: false },
          { id: 'java-10', title: 'Generics', type: 'reading', duration: '14 min', completed: false },
          { id: 'java-11', title: 'Streams & Lambdas', type: 'video', duration: '18:00', completed: false },
          { id: 'java-12', title: 'Multithreading', type: 'video', duration: '22:00', completed: false },
          { id: 'java-13', title: 'Spring Boot Intro', type: 'video', duration: '24:00', completed: false },
        ]
      }
    ]
  },
  {
    id: 'kotlin-jvm',
    name: 'Kotlin (JVM)',
    icon: '🟣',
    color: 'from-violet-500 to-purple-700',
    bgGradient: 'from-violet-500/20 to-purple-700/10',
    lessons: 20,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Modern JVM language, better Java',
    category: 'JVM Languages',
    modules: [
      {
        id: 'ktjvm-basics',
        title: 'Kotlin for JVM',
        lessons: [
          { id: 'ktj-1', title: 'Kotlin JVM Setup', type: 'video', duration: '10:00', completed: false },
          { id: 'ktj-2', title: 'Null Safety & Smart Casts', type: 'reading', duration: '10 min', completed: false },
          { id: 'ktj-3', title: 'Extension Functions', type: 'video', duration: '14:00', completed: false },
          { id: 'ktj-4', title: 'DSLs in Kotlin', type: 'reading', duration: '12 min', completed: false },
          { id: 'ktj-5', title: 'Spring Boot + Kotlin', type: 'exercise', duration: '30 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'scala',
    name: 'Scala',
    icon: '🔴',
    color: 'from-red-400 to-red-700',
    bgGradient: 'from-red-400/20 to-red-700/10',
    lessons: 22,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Blend OOP and functional programming',
    category: 'JVM Languages',
    modules: [
      {
        id: 'scala-basics',
        title: 'Scala Fundamentals',
        lessons: [
          { id: 'sc-1', title: 'Introduction to Scala', type: 'video', duration: '12:00', completed: false },
          { id: 'sc-2', title: 'Values, Variables & Types', type: 'reading', duration: '10 min', completed: false },
          { id: 'sc-3', title: 'Functions & Pattern Matching', type: 'video', duration: '18:00', completed: false },
          { id: 'sc-4', title: 'Collections & Higher-Order Functions', type: 'reading', duration: '14 min', completed: false },
          { id: 'sc-5', title: 'Traits & Mixin Composition', type: 'video', duration: '16:00', completed: false },
        ]
      }
    ]
  },
  {
    id: 'groovy',
    name: 'Groovy',
    icon: '⭐',
    color: 'from-sky-400 to-blue-600',
    bgGradient: 'from-sky-400/20 to-blue-600/10',
    lessons: 16,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Dynamic JVM language for scripting & testing',
    category: 'JVM Languages',
    modules: [
      {
        id: 'groovy-basics',
        title: 'Groovy Essentials',
        lessons: [
          { id: 'grv-1', title: 'Introduction to Groovy', type: 'video', duration: '10:00', completed: false },
          { id: 'grv-2', title: 'Groovy Syntax', type: 'reading', duration: '8 min', completed: false },
          { id: 'grv-3', title: 'Closures & Builders', type: 'video', duration: '14:00', completed: false },
          { id: 'grv-4', title: 'Gradle Build Scripts', type: 'exercise', duration: '20 min', completed: false },
        ]
      }
    ]
  },

  // ==================== DATA SCIENCE & AI ====================
  {
    id: 'r',
    name: 'R',
    icon: '📊',
    color: 'from-blue-400 to-sky-600',
    bgGradient: 'from-blue-400/20 to-sky-600/10',
    lessons: 24,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Statistical computing and graphics',
    category: 'Data Science & AI',
    modules: [
      {
        id: 'r-basics',
        title: 'R Fundamentals',
        lessons: [
          { id: 'r-1', title: 'Introduction to R', type: 'video', duration: '10:00', completed: false },
          { id: 'r-2', title: 'Vectors & Matrices', type: 'reading', duration: '10 min', completed: false },
          { id: 'r-3', title: 'Data Frames & dplyr', type: 'video', duration: '16:00', completed: false },
          { id: 'r-4', title: 'ggplot2 Visualization', type: 'video', duration: '18:00', completed: false },
          { id: 'r-5', title: 'Statistical Analysis', type: 'reading', duration: '14 min', completed: false },
          { id: 'r-6', title: 'Machine Learning in R', type: 'exercise', duration: '30 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'julia',
    name: 'Julia',
    icon: '🟣',
    color: 'from-purple-400 to-green-600',
    bgGradient: 'from-purple-400/20 to-green-600/10',
    lessons: 20,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'High-performance scientific computing',
    category: 'Data Science & AI',
    modules: [
      {
        id: 'julia-basics',
        title: 'Julia Fundamentals',
        lessons: [
          { id: 'jl-1', title: 'Introduction to Julia', type: 'video', duration: '12:00', completed: false },
          { id: 'jl-2', title: 'Types & Multiple Dispatch', type: 'reading', duration: '12 min', completed: false },
          { id: 'jl-3', title: 'Arrays & Linear Algebra', type: 'video', duration: '16:00', completed: false },
          { id: 'jl-4', title: 'Plotting & Visualization', type: 'video', duration: '14:00', completed: false },
          { id: 'jl-5', title: 'Performance & Parallelism', type: 'reading', duration: '14 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'matlab',
    name: 'MATLAB',
    icon: '📈',
    color: 'from-amber-400 to-orange-600',
    bgGradient: 'from-amber-400/20 to-orange-600/10',
    lessons: 18,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Numerical computing for engineering',
    category: 'Data Science & AI',
    modules: [
      {
        id: 'matlab-basics',
        title: 'MATLAB Essentials',
        lessons: [
          { id: 'ml-1', title: 'Introduction to MATLAB', type: 'video', duration: '10:00', completed: false },
          { id: 'ml-2', title: 'Matrices & Operations', type: 'reading', duration: '10 min', completed: false },
          { id: 'ml-3', title: 'Plotting & Visualization', type: 'video', duration: '14:00', completed: false },
          { id: 'ml-4', title: 'Scripts & Functions', type: 'exercise', duration: '20 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    icon: '🧠',
    color: 'from-orange-500 to-amber-600',
    bgGradient: 'from-orange-500/20 to-amber-600/10',
    lessons: 26,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'End-to-end machine learning platform',
    category: 'Data Science & AI',
    modules: [
      {
        id: 'tf-basics',
        title: 'TensorFlow Essentials',
        lessons: [
          { id: 'tf-1', title: 'Introduction to TensorFlow', type: 'video', duration: '14:00', completed: false },
          { id: 'tf-2', title: 'Tensors & Operations', type: 'reading', duration: '12 min', completed: false },
          { id: 'tf-3', title: 'Building Neural Networks', type: 'video', duration: '20:00', completed: false },
          { id: 'tf-4', title: 'CNNs for Image Recognition', type: 'video', duration: '22:00', completed: false },
          { id: 'tf-5', title: 'NLP with TensorFlow', type: 'reading', duration: '16 min', completed: false },
          { id: 'tf-6', title: 'Deploy ML Models', type: 'exercise', duration: '30 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    icon: '🔥',
    color: 'from-red-500 to-orange-600',
    bgGradient: 'from-red-500/20 to-orange-600/10',
    lessons: 24,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Flexible deep learning framework',
    category: 'Data Science & AI',
    modules: [
      {
        id: 'pt-basics',
        title: 'PyTorch Fundamentals',
        lessons: [
          { id: 'pt-1', title: 'Introduction to PyTorch', type: 'video', duration: '12:00', completed: false },
          { id: 'pt-2', title: 'Tensors & Autograd', type: 'reading', duration: '14 min', completed: false },
          { id: 'pt-3', title: 'Building Neural Networks', type: 'video', duration: '20:00', completed: false },
          { id: 'pt-4', title: 'Training Deep Networks', type: 'video', duration: '22:00', completed: false },
          { id: 'pt-5', title: 'Transformers & NLP', type: 'reading', duration: '16 min', completed: false },
          { id: 'pt-6', title: 'GANs & Creative AI', type: 'exercise', duration: '35 min', completed: false },
        ]
      }
    ]
  },

  // ==================== DATABASE & QUERY ====================
  {
    id: 'sql',
    name: 'SQL',
    icon: '🗃️',
    color: 'from-blue-400 to-indigo-500',
    bgGradient: 'from-blue-400/20 to-indigo-500/10',
    lessons: 22,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Query and manage relational databases',
    category: 'Database',
    modules: [
      {
        id: 'sql-basics',
        title: 'SQL Fundamentals',
        lessons: [
          { id: 'sql-1', title: 'Introduction to Databases', type: 'video', duration: '10:00', completed: false },
          { id: 'sql-2', title: 'SELECT & WHERE', type: 'reading', duration: '8 min', completed: false },
          { id: 'sql-3', title: 'JOINs Deep Dive', type: 'video', duration: '18:00', completed: false },
          { id: 'sql-4', title: 'GROUP BY & Aggregates', type: 'reading', duration: '12 min', completed: false },
          { id: 'sql-5', title: 'Subqueries & CTEs', type: 'video', duration: '16:00', completed: false },
          { id: 'sql-6', title: 'Database Design', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: '🍃',
    color: 'from-emerald-500 to-green-700',
    bgGradient: 'from-emerald-500/20 to-green-700/10',
    lessons: 18,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'NoSQL document database',
    category: 'Database',
    modules: [
      {
        id: 'mongo-basics',
        title: 'MongoDB Essentials',
        lessons: [
          { id: 'mon-1', title: 'Introduction to MongoDB', type: 'video', duration: '10:00', completed: false },
          { id: 'mon-2', title: 'CRUD Operations', type: 'reading', duration: '10 min', completed: false },
          { id: 'mon-3', title: 'Aggregation Pipeline', type: 'video', duration: '16:00', completed: false },
          { id: 'mon-4', title: 'Indexing & Performance', type: 'reading', duration: '12 min', completed: false },
          { id: 'mon-5', title: 'Mongoose ODM (Node.js)', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: '◈',
    color: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-500/20 to-rose-600/10',
    lessons: 16,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Query language for APIs',
    category: 'Database',
    modules: [
      {
        id: 'gql-basics',
        title: 'GraphQL Essentials',
        lessons: [
          { id: 'gql-1', title: 'Introduction to GraphQL', type: 'video', duration: '10:00', completed: false },
          { id: 'gql-2', title: 'Queries & Mutations', type: 'reading', duration: '10 min', completed: false },
          { id: 'gql-3', title: 'Schemas & Resolvers', type: 'video', duration: '16:00', completed: false },
          { id: 'gql-4', title: 'Apollo Server Setup', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },

  // ==================== FUNCTIONAL PROGRAMMING ====================
  {
    id: 'haskell',
    name: 'Haskell',
    icon: 'λ',
    color: 'from-purple-400 to-violet-600',
    bgGradient: 'from-purple-400/20 to-violet-600/10',
    lessons: 22,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Pure functional programming language',
    category: 'Functional Programming',
    modules: [
      {
        id: 'hs-basics',
        title: 'Haskell Fundamentals',
        lessons: [
          { id: 'hs-1', title: 'Introduction to Haskell', type: 'video', duration: '14:00', completed: false },
          { id: 'hs-2', title: 'Types & Type Classes', type: 'reading', duration: '12 min', completed: false },
          { id: 'hs-3', title: 'Pattern Matching', type: 'video', duration: '16:00', completed: false },
          { id: 'hs-4', title: 'Monads & Functors', type: 'video', duration: '22:00', completed: false },
          { id: 'hs-5', title: 'IO in Haskell', type: 'reading', duration: '14 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'elixir',
    name: 'Elixir',
    icon: '🧪',
    color: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-500/20 to-pink-600/10',
    lessons: 20,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Scalable, fault-tolerant applications',
    category: 'Functional Programming',
    modules: [
      {
        id: 'ex-basics',
        title: 'Elixir Fundamentals',
        lessons: [
          { id: 'ex-1', title: 'Introduction to Elixir', type: 'video', duration: '12:00', completed: false },
          { id: 'ex-2', title: 'Pattern Matching & Immutability', type: 'reading', duration: '12 min', completed: false },
          { id: 'ex-3', title: 'Processes & OTP', type: 'video', duration: '20:00', completed: false },
          { id: 'ex-4', title: 'Phoenix Web Framework', type: 'video', duration: '18:00', completed: false },
          { id: 'ex-5', title: 'Real-time Features', type: 'exercise', duration: '30 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'clojure',
    name: 'Clojure',
    icon: '🔮',
    color: 'from-teal-400 to-cyan-600',
    bgGradient: 'from-teal-400/20 to-cyan-600/10',
    lessons: 18,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Lisp dialect for the JVM',
    category: 'Functional Programming',
    modules: [
      {
        id: 'clj-basics',
        title: 'Clojure Fundamentals',
        lessons: [
          { id: 'clj-1', title: 'Introduction to Clojure', type: 'video', duration: '12:00', completed: false },
          { id: 'clj-2', title: 'Data Structures & Functions', type: 'reading', duration: '12 min', completed: false },
          { id: 'clj-3', title: 'Concurrency Primitives', type: 'video', duration: '16:00', completed: false },
          { id: 'clj-4', title: 'Interoperability with Java', type: 'reading', duration: '10 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'erlang',
    name: 'Erlang',
    icon: '☎️',
    color: 'from-amber-500 to-red-600',
    bgGradient: 'from-amber-500/20 to-red-600/10',
    lessons: 16,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Fault-tolerant distributed systems',
    category: 'Functional Programming',
    modules: [
      {
        id: 'erl-basics',
        title: 'Erlang Fundamentals',
        lessons: [
          { id: 'erl-1', title: 'Introduction to Erlang', type: 'video', duration: '12:00', completed: false },
          { id: 'erl-2', title: 'Pattern Matching', type: 'reading', duration: '10 min', completed: false },
          { id: 'erl-3', title: 'Processes & Messaging', type: 'video', duration: '18:00', completed: false },
          { id: 'erl-4', title: 'OTP Behaviors', type: 'reading', duration: '14 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'fsharp',
    name: 'F#',
    icon: '🔷',
    color: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/20 to-indigo-600/10',
    lessons: 16,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Functional-first on .NET',
    category: 'Functional Programming',
    modules: [
      {
        id: 'fs-basics',
        title: 'F# Fundamentals',
        lessons: [
          { id: 'fs-1', title: 'Introduction to F#', type: 'video', duration: '10:00', completed: false },
          { id: 'fs-2', title: 'Values & Functions', type: 'reading', duration: '10 min', completed: false },
          { id: 'fs-3', title: 'Discriminated Unions', type: 'video', duration: '14:00', completed: false },
          { id: 'fs-4', title: 'Computation Expressions', type: 'reading', duration: '12 min', completed: false },
        ]
      }
    ]
  },

  // ==================== GAME DEVELOPMENT ====================
  {
    id: 'csharp',
    name: 'C#',
    icon: '🎵',
    color: 'from-purple-500 to-violet-700',
    bgGradient: 'from-purple-500/20 to-violet-700/10',
    lessons: 30,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Game dev with Unity & .NET ecosystem',
    category: 'Game Development',
    modules: [
      {
        id: 'cs-basics',
        title: 'C# Fundamentals',
        lessons: [
          { id: 'cs-1', title: 'Introduction to C#', type: 'video', duration: '12:00', completed: false },
          { id: 'cs-2', title: 'Variables & Types', type: 'reading', duration: '10 min', completed: false },
          { id: 'cs-3', title: 'OOP in C#', type: 'video', duration: '18:00', completed: false },
          { id: 'cs-4', title: 'LINQ & Collections', type: 'reading', duration: '14 min', completed: false },
          { id: 'cs-5', title: 'Async Programming', type: 'video', duration: '16:00', completed: false },
          { id: 'cs-6', title: 'Unity Game Development', type: 'video', duration: '24:00', completed: false },
        ]
      }
    ]
  },
  {
    id: 'unity',
    name: 'Unity (C#)',
    icon: '🎮',
    color: 'from-slate-300 to-gray-600',
    bgGradient: 'from-slate-300/20 to-gray-600/10',
    lessons: 28,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Build 2D & 3D games with Unity',
    category: 'Game Development',
    modules: [
      {
        id: 'unity-basics',
        title: 'Unity Essentials',
        lessons: [
          { id: 'un-1', title: 'Unity Editor Overview', type: 'video', duration: '14:00', completed: false },
          { id: 'un-2', title: 'GameObjects & Components', type: 'reading', duration: '12 min', completed: false },
          { id: 'un-3', title: 'Physics & Collision', type: 'video', duration: '18:00', completed: false },
          { id: 'un-4', title: 'Scripting Player Movement', type: 'exercise', duration: '30 min', completed: false },
          { id: 'un-5', title: 'UI Systems', type: 'video', duration: '16:00', completed: false },
          { id: 'un-6', title: 'Publishing Your Game', type: 'reading', duration: '10 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'unreal',
    name: 'Unreal Engine (C++)',
    icon: '🕹️',
    color: 'from-blue-600 to-indigo-800',
    bgGradient: 'from-blue-600/20 to-indigo-800/10',
    lessons: 26,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'AAA game development platform',
    category: 'Game Development',
    modules: [
      {
        id: 'ue-basics',
        title: 'Unreal Essentials',
        lessons: [
          { id: 'ue-1', title: 'Unreal Editor Overview', type: 'video', duration: '16:00', completed: false },
          { id: 'ue-2', title: 'Blueprints Visual Scripting', type: 'video', duration: '20:00', completed: false },
          { id: 'ue-3', title: 'C++ for Unreal', type: 'reading', duration: '14 min', completed: false },
          { id: 'ue-4', title: 'Materials & Lighting', type: 'video', duration: '18:00', completed: false },
          { id: 'ue-5', title: 'Building a Game Level', type: 'exercise', duration: '45 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'godot',
    name: 'Godot (GDScript)',
    icon: '🤖',
    color: 'from-blue-400 to-sky-600',
    bgGradient: 'from-blue-400/20 to-sky-600/10',
    lessons: 20,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Free & open-source game engine',
    category: 'Game Development',
    modules: [
      {
        id: 'godot-basics',
        title: 'Godot Essentials',
        lessons: [
          { id: 'gd-1', title: 'Introduction to Godot', type: 'video', duration: '12:00', completed: false },
          { id: 'gd-2', title: 'Nodes & Scenes', type: 'reading', duration: '10 min', completed: false },
          { id: 'gd-3', title: 'GDScript Basics', type: 'video', duration: '16:00', completed: false },
          { id: 'gd-4', title: '2D Game Development', type: 'exercise', duration: '35 min', completed: false },
          { id: 'gd-5', title: '3D Game Development', type: 'video', duration: '20:00', completed: false },
        ]
      }
    ]
  },

  // ==================== SCRIPTING & OTHER ====================
  {
    id: 'bash',
    name: 'Bash/Shell',
    icon: '🖥️',
    color: 'from-gray-400 to-slate-600',
    bgGradient: 'from-gray-400/20 to-slate-600/10',
    lessons: 20,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Command line & shell scripting',
    category: 'Scripting & DevOps',
    modules: [
      {
        id: 'bash-basics',
        title: 'Shell Scripting',
        lessons: [
          { id: 'sh-1', title: 'Terminal Basics', type: 'video', duration: '10:00', completed: false },
          { id: 'sh-2', title: 'File System Navigation', type: 'reading', duration: '8 min', completed: false },
          { id: 'sh-3', title: 'Shell Variables & Scripts', type: 'video', duration: '14:00', completed: false },
          { id: 'sh-4', title: 'Pipes & Redirection', type: 'reading', duration: '10 min', completed: false },
          { id: 'sh-5', title: 'Automation Scripts', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'powershell',
    name: 'PowerShell',
    icon: '💠',
    color: 'from-blue-500 to-indigo-700',
    bgGradient: 'from-blue-500/20 to-indigo-700/10',
    lessons: 18,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Windows automation & administration',
    category: 'Scripting & DevOps',
    modules: [
      {
        id: 'ps-basics',
        title: 'PowerShell Essentials',
        lessons: [
          { id: 'ps-1', title: 'Introduction to PowerShell', type: 'video', duration: '10:00', completed: false },
          { id: 'ps-2', title: 'Cmdlets & Pipelines', type: 'reading', duration: '10 min', completed: false },
          { id: 'ps-3', title: 'Scripting & Automation', type: 'video', duration: '16:00', completed: false },
          { id: 'ps-4', title: 'Active Directory', type: 'exercise', duration: '20 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'python-devops',
    name: 'Python (DevOps)',
    icon: '🐍',
    color: 'from-yellow-400 to-blue-500',
    bgGradient: 'from-yellow-400/20 to-blue-500/10',
    lessons: 18,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Python for automation & DevOps',
    category: 'Scripting & DevOps',
    modules: [
      {
        id: 'pydo-basics',
        title: 'Python for DevOps',
        lessons: [
          { id: 'pydo-1', title: 'Scripting for SysAdmins', type: 'video', duration: '12:00', completed: false },
          { id: 'pydo-2', title: 'Docker with Python', type: 'reading', duration: '12 min', completed: false },
          { id: 'pydo-3', title: 'CI/CD Pipelines', type: 'video', duration: '18:00', completed: false },
          { id: 'pydo-4', title: 'Infrastructure as Code', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'lua',
    name: 'Lua',
    icon: '🌙',
    color: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-500/20 to-indigo-500/10',
    lessons: 14,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Lightweight embedded scripting language',
    category: 'Scripting & DevOps',
    modules: [
      {
        id: 'lua-basics',
        title: 'Lua Fundamentals',
        lessons: [
          { id: 'lua-1', title: 'Introduction to Lua', type: 'video', duration: '10:00', completed: false },
          { id: 'lua-2', title: 'Tables & Metatables', type: 'reading', duration: '10 min', completed: false },
          { id: 'lua-3', title: 'Coroutines', type: 'video', duration: '14:00', completed: false },
          { id: 'lua-4', title: 'Game Modding with Lua', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'perl',
    name: 'Perl',
    icon: '🐪',
    color: 'from-slate-400 to-gray-600',
    bgGradient: 'from-slate-400/20 to-gray-600/10',
    lessons: 16,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Text processing & system administration',
    category: 'Scripting & DevOps',
    modules: [
      {
        id: 'perl-basics',
        title: 'Perl Essentials',
        lessons: [
          { id: 'pl-1', title: 'Introduction to Perl', type: 'video', duration: '10:00', completed: false },
          { id: 'pl-2', title: 'Regular Expressions', type: 'reading', duration: '14 min', completed: false },
          { id: 'pl-3', title: 'File Handling & Parsing', type: 'video', duration: '14:00', completed: false },
          { id: 'pl-4', title: 'CGI & Web Scripts', type: 'exercise', duration: '20 min', completed: false },
        ]
      }
    ]
  },

  // ==================== BLOCKCHAIN ====================
  {
    id: 'solidity',
    name: 'Solidity',
    icon: '⛓️',
    color: 'from-indigo-500 to-purple-700',
    bgGradient: 'from-indigo-500/20 to-purple-700/10',
    lessons: 20,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Smart contract development for Ethereum',
    category: 'Blockchain & Web3',
    modules: [
      {
        id: 'sol-basics',
        title: 'Solidity Fundamentals',
        lessons: [
          { id: 'sol-1', title: 'Blockchain Basics', type: 'video', duration: '12:00', completed: false },
          { id: 'sol-2', title: 'Smart Contract Structure', type: 'reading', duration: '10 min', completed: false },
          { id: 'sol-3', title: 'Data Types & Variables', type: 'video', duration: '14:00', completed: false },
          { id: 'sol-4', title: 'Functions & Modifiers', type: 'reading', duration: '12 min', completed: false },
          { id: 'sol-5', title: 'Building a Token Contract', type: 'exercise', duration: '30 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'rust-web3',
    name: 'Rust (Web3)',
    icon: '🦀',
    color: 'from-orange-400 to-amber-600',
    bgGradient: 'from-orange-400/20 to-amber-600/10',
    lessons: 16,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Solana & blockchain with Rust',
    category: 'Blockchain & Web3',
    modules: [
      {
        id: 'rw3-basics',
        title: 'Rust for Web3',
        lessons: [
          { id: 'rw3-1', title: 'Solana Fundamentals', type: 'video', duration: '14:00', completed: false },
          { id: 'rw3-2', title: 'Writing Solana Programs', type: 'reading', duration: '14 min', completed: false },
          { id: 'rw3-3', title: 'Testing & Deployment', type: 'video', duration: '18:00', completed: false },
          { id: 'rw3-4', title: 'NFT Marketplace Contract', type: 'exercise', duration: '40 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'vyper',
    name: 'Vyper',
    icon: '🐍',
    color: 'from-gray-300 to-slate-500',
    bgGradient: 'from-gray-300/20 to-slate-500/10',
    lessons: 12,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Pythonic smart contract language',
    category: 'Blockchain & Web3',
    modules: [
      {
        id: 'vy-basics',
        title: 'Vyper Fundamentals',
        lessons: [
          { id: 'vy-1', title: 'Introduction to Vyper', type: 'video', duration: '10:00', completed: false },
          { id: 'vy-2', title: 'Contract Structure', type: 'reading', duration: '10 min', completed: false },
          { id: 'vy-3', title: 'Security Best Practices', type: 'video', duration: '16:00', completed: false },
        ]
      }
    ]
  },

  // ==================== OTHER & LEGACY ====================
  {
    id: 'csharp-dotnet',
    name: '.NET / C#',
    icon: '💠',
    color: 'from-purple-500 to-blue-700',
    bgGradient: 'from-purple-500/20 to-blue-700/10',
    lessons: 28,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Cross-platform with .NET ecosystem',
    category: 'Enterprise',
    modules: [
      {
        id: 'dotnet-basics',
        title: '.NET Core Essentials',
        lessons: [
          { id: 'dn-1', title: '.NET Architecture', type: 'video', duration: '12:00', completed: false },
          { id: 'dn-2', title: 'ASP.NET Core', type: 'reading', duration: '12 min', completed: false },
          { id: 'dn-3', title: 'Entity Framework', type: 'video', duration: '18:00', completed: false },
          { id: 'dn-4', title: 'REST APIs with .NET', type: 'video', duration: '16:00', completed: false },
          { id: 'dn-5', title: 'Blazor WebAssembly', type: 'reading', duration: '14 min', completed: false },
          { id: 'dn-6', title: 'Azure Deployment', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'objective-c',
    name: 'Objective-C',
    icon: '🍎',
    color: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-500/20 to-cyan-600/10',
    lessons: 18,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Legacy iOS & macOS development',
    category: 'Mobile Development',
    modules: [
      {
        id: 'objc-basics',
        title: 'Objective-C Essentials',
        lessons: [
          { id: 'objc-1', title: 'Introduction to Objective-C', type: 'video', duration: '12:00', completed: false },
          { id: 'objc-2', title: 'Classes & Messaging', type: 'reading', duration: '12 min', completed: false },
          { id: 'objc-3', title: 'Memory Management', type: 'video', duration: '16:00', completed: false },
          { id: 'objc-4', title: 'UIKit Framework', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'fortran',
    name: 'Fortran',
    icon: '🔢',
    color: 'from-teal-500 to-purple-600',
    bgGradient: 'from-teal-500/20 to-purple-600/10',
    lessons: 14,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'High-performance scientific computing',
    category: 'Scientific Computing',
    modules: [
      {
        id: 'f90-basics',
        title: 'Fortran 90/95',
        lessons: [
          { id: 'f90-1', title: 'Introduction to Fortran', type: 'video', duration: '10:00', completed: false },
          { id: 'f90-2', title: 'Arrays & Loops', type: 'reading', duration: '10 min', completed: false },
          { id: 'f90-3', title: 'Subroutines & Modules', type: 'video', duration: '14:00', completed: false },
          { id: 'f90-4', title: 'Numerical Methods', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'cobol',
    name: 'COBOL',
    icon: '📠',
    color: 'from-slate-400 to-blue-600',
    bgGradient: 'from-slate-400/20 to-blue-600/10',
    lessons: 12,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Legacy business computing language',
    category: 'Enterprise',
    modules: [
      {
        id: 'cob-basics',
        title: 'COBOL Basics',
        lessons: [
          { id: 'cob-1', title: 'Introduction to COBOL', type: 'video', duration: '10:00', completed: false },
          { id: 'cob-2', title: 'Data Division', type: 'reading', duration: '10 min', completed: false },
          { id: 'cob-3', title: 'File Processing', type: 'video', duration: '14:00', completed: false },
        ]
      }
    ]
  },
  {
    id: 'vb',
    name: 'Visual Basic',
    icon: '🖥️',
    color: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/20 to-indigo-600/10',
    lessons: 14,
    completedLessons: 0,
    difficulty: 'beginner',
    description: 'Windows application development',
    category: 'Enterprise',
    modules: [
      {
        id: 'vb-basics',
        title: 'Visual Basic Essentials',
        lessons: [
          { id: 'vb-1', title: 'Introduction to VB.NET', type: 'video', duration: '10:00', completed: false },
          { id: 'vb-2', title: 'Windows Forms', type: 'reading', duration: '10 min', completed: false },
          { id: 'vb-3', title: 'Database Access', type: 'video', duration: '14:00', completed: false },
          { id: 'vb-4', title: 'Building a Desktop App', type: 'exercise', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'nim',
    name: 'Nim',
    icon: '👑',
    color: 'from-yellow-400 to-amber-600',
    bgGradient: 'from-yellow-400/20 to-amber-600/10',
    lessons: 14,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Efficient, expressive, elegant language',
    category: 'General Purpose',
    modules: [
      {
        id: 'nim-basics',
        title: 'Nim Fundamentals',
        lessons: [
          { id: 'nim-1', title: 'Introduction to Nim', type: 'video', duration: '10:00', completed: false },
          { id: 'nim-2', title: 'Types & Control Flow', type: 'reading', duration: '10 min', completed: false },
          { id: 'nim-3', title: 'Metaprogramming', type: 'video', duration: '16:00', completed: false },
          { id: 'nim-4', title: 'Async & Networking', type: 'exercise', duration: '20 min', completed: false },
        ]
      }
    ]
  },
  {
    id: 'crystal',
    name: 'Crystal',
    icon: '💎',
    color: 'from-gray-300 to-slate-600',
    bgGradient: 'from-gray-300/20 to-slate-600/10',
    lessons: 12,
    completedLessons: 0,
    difficulty: 'intermediate',
    description: 'Ruby-like syntax, C-like performance',
    category: 'General Purpose',
    modules: [
      {
        id: 'cr-basics',
        title: 'Crystal Essentials',
        lessons: [
          { id: 'cr-1', title: 'Introduction to Crystal', type: 'video', duration: '10:00', completed: false },
          { id: 'cr-2', title: 'Type System', type: 'reading', duration: '10 min', completed: false },
          { id: 'cr-3', title: 'Concurrency with Fibers', type: 'video', duration: '14:00', completed: false },
        ]
      }
    ]
  },
  {
    id: 'dlang',
    name: 'D',
    icon: '🔷',
    color: 'from-red-500 to-orange-600',
    bgGradient: 'from-red-500/20 to-orange-600/10',
    lessons: 14,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Systems language with C-like syntax',
    category: 'Systems Programming',
    modules: [
      {
        id: 'd-basics',
        title: 'D Language Essentials',
        lessons: [
          { id: 'dl-1', title: 'Introduction to D', type: 'video', duration: '10:00', completed: false },
          { id: 'dl-2', title: 'Templates & Mixins', type: 'reading', duration: '12 min', completed: false },
          { id: 'dl-3', title: 'Memory Safety', type: 'video', duration: '14:00', completed: false },
        ]
      }
    ]
  },
  {
    id: 'ocaml',
    name: 'OCaml',
    icon: '🐫',
    color: 'from-amber-500 to-yellow-600',
    bgGradient: 'from-amber-500/20 to-yellow-600/10',
    lessons: 14,
    completedLessons: 0,
    difficulty: 'advanced',
    description: 'Industrial-strength functional language',
    category: 'Functional Programming',
    modules: [
      {
        id: 'ocaml-basics',
        title: 'OCaml Fundamentals',
        lessons: [
          { id: 'oc-1', title: 'Introduction to OCaml', type: 'video', duration: '12:00', completed: false },
          { id: 'oc-2', title: 'Type Inference', type: 'reading', duration: '10 min', completed: false },
          { id: 'oc-3', title: 'Modules & Functors', type: 'video', duration: '16:00', completed: false },
        ]
      }
    ]
  },
];

const allCategories = [
  'All',
  'Web Development',
  'Mobile Development',
  'Systems Programming',
  'JVM Languages',
  'Data Science & AI',
  'Database',
  'Functional Programming',
  'Game Development',
  'Scripting & DevOps',
  'Blockchain & Web3',
  'Enterprise',
  'General Purpose',
  'Scientific Computing',
];

const categoryIcons: Record<string, React.ReactNode> = {
  'All': <Layers className="w-4 h-4" />,
  'Web Development': <Globe className="w-4 h-4" />,
  'Mobile Development': <Smartphone className="w-4 h-4" />,
  'Systems Programming': <Cpu className="w-4 h-4" />,
  'JVM Languages': <CoffeeIcon className="w-4 h-4" />,
  'Data Science & AI': <BarChart3 className="w-4 h-4" />,
  'Database': <Database className="w-4 h-4" />,
  'Functional Programming': <LambdaIcon className="w-4 h-4" />,
  'Game Development': <Gamepad2 className="w-4 h-4" />,
  'Scripting & DevOps': <Cog className="w-4 h-4" />,
  'Blockchain & Web3': <Shield className="w-4 h-4" />,
  'Enterprise': <Layers className="w-4 h-4" />,
  'General Purpose': <Code className="w-4 h-4" />,
  'Scientific Computing': <Zap className="w-4 h-4" />,
};

function CoffeeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

function LambdaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20 L10 4 L14 14 L20 4" />
    </svg>
  );
}

const lessonContent: Record<string, { title: string; content: string; code?: string }> = {
  'js-5': {
    title: 'Control Flow: If Statements',
    content: `## Understanding If Statements

Control flow is fundamental to programming. It allows your code to make decisions based on conditions.

### The Basic Structure

\`\`\`javascript
if (condition) {
  // code to execute if condition is true
}
\`\`\`

### If-Else

\`\`\`javascript
let age = 18;

if (age >= 18) {
  console.log("You can vote!");
} else {
  console.log("Too young to vote.");
}
\`\`\`

### Multiple Conditions with Else If

\`\`\`javascript
let score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
\`\`\`

### Comparison Operators

| Operator | Meaning |
|----------|---------|
| == | Equal (loose) |
| === | Equal (strict) |
| != | Not equal |
| > | Greater than |
| < | Less than |
| >= | Greater or equal |
| <= | Less or equal |

### Logical Operators

You can combine conditions using:
- **&&** (AND): Both conditions must be true
- **||** (OR): At least one condition must be true
- **!** (NOT): Inverts the condition

\`\`\`javascript
let age = 25;
let hasLicense = true;

if (age >= 18 && hasLicense) {
  console.log("Can drive!");
}

if (age < 13 || age > 65) {
  console.log("Discount available");
}
\`\`\`
`,
    code: `// Example: Grade Calculator
function calculateGrade(score) {
  if (score >= 90) return "A";
  else if (score >= 80) return "B";
  else if (score >= 70) return "C";
  else if (score >= 60) return "D";
  else return "F";
}

console.log(calculateGrade(85)); // "B"
console.log(calculateGrade(92)); // "A"
console.log(calculateGrade(55)); // "F"`,
  },
};

export default function ProgrammingAcademy() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const openLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const closeLesson = () => {
    setSelectedLesson(null);
  };

  const markComplete = (courseId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          const newCompleted = course.completedLessons + 1;
          return {
            ...course,
            completedLessons: newCompleted,
            modules: course.modules.map((mod) => ({
              ...mod,
              lessons: mod.lessons.map((les) =>
                les.id === lessonId ? { ...les, completed: true } : les
              ),
            })),
          };
        }
        return course;
      })
    );
  };

  const filteredCourses = courses.filter((course) => {
    const matchesDifficulty = difficultyFilter === 'all' || course.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-500/20 text-emerald-400';
      case 'intermediate': return 'bg-amber-500/20 text-amber-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const totalProgress = Math.round(
    (courses.reduce((acc, c) => acc + c.completedLessons, 0) /
      courses.reduce((acc, c) => acc + c.lessons, 0)) * 100
  );

  // When selecting a course, find it from the state (not the initial array)
  const handleSelectCourse = (course: Course) => {
    const freshCourse = courses.find(c => c.id === course.id) || course;
    setSelectedCourse(freshCourse);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Programming Academy</h1>
            <p className="text-xs text-slate-400">{courses.length} languages available • videos & reading</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            <span className="text-indigo-400 text-[10px] sm:text-sm font-medium">Overall Progress</span>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">{totalProgress}%</p>
          <div className="mt-1.5 sm:mt-2 h-1.5 sm:h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            <span className="text-emerald-400 text-[10px] sm:text-sm font-medium">Lessons</span>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">
            {courses.reduce((acc, c) => acc + c.completedLessons, 0)}/{courses.reduce((acc, c) => acc + c.lessons, 0)}
          </p>
        </div>
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span className="text-amber-400 text-[10px] sm:text-sm font-medium">Languages</span>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">{courses.length}</p>
        </div>
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
            <span className="text-pink-400 text-[10px] sm:text-sm font-medium">Current Streak</span>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">5 days</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-[140px] sm:min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search languages (e.g., Python, Rust, Swift)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium capitalize transition-all ${
                  difficultyFilter === level
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showFilters ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Filter className="w-4 h-4" />
            Categories
          </button>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-4">
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    categoryFilter === cat
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {categoryIcons[cat]}
                  {cat}
                  {cat !== 'All' && (
                    <span className="text-xs opacity-70">
                      ({courses.filter(c => c.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing {filteredCourses.length} of {courses.length} languages
          {categoryFilter !== 'All' && <span className="text-indigo-400 ml-1">in {categoryFilter}</span>}
        </p>
      </div>

      {/* Course Grid / List */}
      {!selectedCourse ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleSelectCourse(course)}
                className="group bg-[#1E293B] border border-slate-700/50 rounded-2xl p-5 cursor-pointer hover:border-slate-600/50 hover:shadow-xl hover:shadow-black/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                    {course.icon}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{course.name}</h3>
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-slate-700/50 rounded-full text-slate-300">{course.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{course.lessons} lessons</span>
                  <span className="text-slate-400">{course.completedLessons}/{course.lessons}</span>
                </div>
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all`}
                    style={{ width: `${(course.completedLessons / course.lessons) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleSelectCourse(course)}
                className="group bg-[#1E293B] border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:border-slate-600/50 hover:shadow-lg hover:shadow-black/20 transition-all flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center text-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                  {course.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{course.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-700/50 rounded-full text-slate-300">{course.category}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{course.description}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-slate-400">{course.completedLessons}/{course.lessons} lessons</span>
                  <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${course.color} rounded-full`}
                      style={{ width: `${(course.completedLessons / course.lessons) * 100}%` }}
                    />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Course Detail View */
        <div className="space-y-4">
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            ← Back to all courses
          </button>
          
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedCourse.color} flex items-center justify-center text-3xl`}>
                {selectedCourse.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-white">{selectedCourse.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedCourse.difficulty)}`}>
                    {selectedCourse.difficulty}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-slate-700/50 rounded-full text-slate-300">{selectedCourse.category}</span>
                </div>
                <p className="text-slate-400">{selectedCourse.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {selectedCourse.completedLessons}/{selectedCourse.lessons}
                </p>
                <p className="text-sm text-slate-400">lessons completed</p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedCourse.modules.map((module) => (
                <div key={module.id} className="border border-slate-700/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-medium text-white">{module.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{module.lessons.length} lessons</span>
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedModules.includes(module.id) && (
                    <div className="divide-y divide-slate-700/50">
                      {module.lessons.map((lesson) => {
                        const currentCourse = courses.find(c => c.id === selectedCourse.id);
                        const currentLesson = currentCourse?.modules
                          .flatMap(m => m.lessons)
                          .find(l => l.id === lesson.id);
                        const isCompleted = currentLesson?.completed ?? lesson.completed;
                        
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-4 px-5 py-3 hover:bg-slate-800/30 transition-colors cursor-pointer"
                            onClick={() => openLesson({...lesson, completed: isCompleted})}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm ${isCompleted ? 'text-slate-400' : 'text-white'}`}>
                                {lesson.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                                lesson.type === 'video' 
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : lesson.type === 'reading'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {lesson.type === 'video' && <Play className="w-3 h-3" />}
                                {lesson.type === 'reading' && <BookOpen className="w-3 h-3" />}
                                {lesson.type === 'exercise' && <Code className="w-3 h-3" />}
                                {lesson.type}
                              </span>
                              <span className="text-xs text-slate-500">{lesson.duration}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedLesson.title}</h3>
                <p className="text-sm text-slate-400">{selectedCourse?.name} • {selectedLesson.duration}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => markComplete(selectedCourse?.id || '', selectedLesson.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedLesson.completed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {selectedLesson.completed ? '✓ Completed' : 'Mark Complete'}
                </button>
                <button
                  onClick={closeLesson}
                  className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedLesson.type === 'video' ? (
                /* Video Placeholder */
                <div className="aspect-video bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                      <Play className="w-10 h-10 text-indigo-400" />
                    </div>
                    <p className="text-slate-400">Video content would appear here</p>
                    <p className="text-sm text-slate-500">Powered by AI-generated tutorials</p>
                  </div>
                </div>
              ) : null}

              {/* Reading Content */}
              {lessonContent[selectedLesson.id] ? (
                <div className="prose prose-invert prose-slate max-w-none">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-amber-400" />
                      <span className="text-amber-400 font-medium">Lesson Overview</span>
                    </div>
                    <div className="space-y-4">
                      {lessonContent[selectedLesson.id].content.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) {
                          return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.replace('## ', '')}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={i} className="text-lg font-semibold text-slate-200 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('```')) {
                          return null;
                        }
                        if (line.startsWith('| ')) {
                          return <p key={i} className="text-slate-300 font-mono text-sm">{line}</p>;
                        }
                        if (line.trim() === '') {
                          return <div key={i} className="h-2" />;
                        }
                        if (line.startsWith('- ')) {
                          return <p key={i} className="text-slate-300 ml-4">{line}</p>;
                        }
                        return <p key={i} className="text-slate-300">{line}</p>;
                      })}
                    </div>

                    {/* Code Block */}
                    {lessonContent[selectedLesson.id].code && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 rounded-t-xl border border-slate-700">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-300">Example Code</span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(lessonContent[selectedLesson.id]?.code || '');
                              setCodeCopied(true);
                              setTimeout(() => setCodeCopied(false), 2000);
                            }}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                          >
                            {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {codeCopied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <pre className="bg-slate-900 px-4 py-3 rounded-b-xl border-x border-b border-slate-700 overflow-x-auto">
                          <code className="text-emerald-400 font-mono text-sm">
                            {lessonContent[selectedLesson.id].code}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
                  <FileCode className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-300 mb-2">Lesson content coming soon!</p>
                  <p className="text-sm text-slate-500">
                    {selectedLesson.type === 'video' 
                      ? 'AI-generated video content for this lesson is being prepared.'
                      : 'Interactive reading material is being created for you.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
