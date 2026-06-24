# StudyAI Design System

## Premium Dark Navy Academic Theme

### Color Palette
- **Primary Background**: `#0a0e27` - Deep navy foundation
- **Secondary Background**: `#151e3a` - Card layers
- **Accent Gold**: `#fbbf24` - Primary interactive and highlight color
- **Foreground**: `#f1f5f9` - Clean, readable text
- **Muted Text**: `#cbd5e1` - Secondary information
- **Border**: `#1e3a5f` - Subtle depth

### Typography
- **Display Font**: Playfair Display (serif) - Elegant headlines and branding
- **Body Font**: Geist Sans - Clean, modern interface text
- **Mono Font**: Geist Mono - Code and technical elements

## Animation Suite

### Core Animations
1. **slideUp** (600ms) - Elements fade in while moving up 24px
2. **slideDown** (600ms) - Elements fade in while moving down 24px
3. **slideIn** (600ms) - Elements fade in from left, 24px offset
4. **scaleIn** (500ms) - Elements scale from 95% with cubic-bezier easing
5. **fadeIn** (600ms) - Simple opacity transition
6. **float** (3s) - Subtle up/down floating motion
7. **glow** (2s) - Pulsing shadow effect with inset glow
8. **shimmer** (3s) - Gradient sweep animation

### Animation Classes
- `.animate-slideUp` - Main page entrance animation
- `.animate-scaleIn` - Card hover states and modals
- `.animate-glow` - Interactive elements and focus states
- `.animate-float` - Decorative elements
- `.animate-shimmer` - Loading and premium effects

## Component Patterns

### Cards
- Backdrop blur with `backdrop-blur-2xl`
- Subtle borders with `border-border/30` (30% opacity)
- Gradient overlays on hover using `from-accent/10 to-transparent`
- Smooth transitions with `transition-smooth` class
- Shadow elevation: `hover:shadow-lg hover:shadow-accent/20`

### Buttons
- Gradient backgrounds: `from-accent to-yellow-300`
- Enhanced shadows: `shadow-lg shadow-accent/30`
- Hover amplification: `hover:shadow-xl hover:shadow-accent/50`
- Smooth interaction: `transition-smooth`

### Hero Sections
- Gradient backgrounds: `from-accent/5 to-transparent`
- Floating blur elements: `w-80 h-80 bg-accent/5 rounded-full blur-3xl`
- Staggered animations with `animationDelay` style prop
- Text balance for better readability

### Navigation
- `backdrop-blur-2xl` for premium glass effect
- `bg-background/40` for subtle darkening
- Gradient logo: `bg-clip-text text-transparent`
- Border: `border-border/10` (10% opacity)

## Interactive States

### Hover Effects
- Border color change: `hover:border-accent/50`
- Shadow elevation: `hover:shadow-xl`
- Icon scale: `group-hover:scale-110`
- Text color shift: `group-hover:text-accent`
- Translate on interaction: `group-hover:translate-x-2`

### Focus States
- Ring style: `focus:ring-2 focus:ring-accent`
- Shadow glow: `focus:shadow-lg focus:shadow-accent/30`

## Spacing Scale
- Compact: 4px (1 unit)
- Standard: 8px (2 units)
- Medium: 16px (4 units)
- Large: 24px (6 units)
- Extra Large: 32px (8 units)
- 2XL: 48px (12 units)

## Responsive Design
- **Mobile**: Full-width, single column
- **Tablet (md)**: 2-column grid for most sections
- **Desktop (lg)**: 3-5 column grid layouts
- **Extra Large (xl)**: Maximum width of 7xl container

## Premium Effects

### Glass Morphism
```css
backdrop-filter: blur(16px);
background: rgba(21, 30, 58, 0.5);
border: 1px solid rgba(30, 58, 95, 0.3);
```

### Gradient Text
```css
background: linear-gradient(135deg, #fbbf24 0%, #fbbf24 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Floating Elements
- Used for decorative blur circles
- Positioning: `absolute inset-0 -z-10`
- Sizes: 96-100px for large, 48-64px for medium
- Opacity: `opacity-30` to `opacity-50`

## Performance Optimizations
- Staggered animations with delays prevent jank
- GPU-accelerated properties: `transform`, `opacity`
- Backdrop blur on static elements only
- `will-change` applied carefully to animated elements

## Accessibility
- Color contrast ratio: 7.1:1 minimum
- Focus indicators always visible
- Animations respect `prefers-reduced-motion`
- Semantic HTML with ARIA labels
- Icon-only buttons include aria-label
