# Food Atlas - Design Guidelines

## Design Approach: Reference-Based (Food Discovery & Cultural Learning)

**Primary References**: Tasty (visual recipe discovery) + Airbnb (exploration UX) + Duolingo (learning engagement)

**Design Philosophy**: Create an immersive food exploration experience that balances conversational simplicity with rich visual storytelling. The interface should feel like a personal culinary journey around the world.

---

## Core Design Elements

### A. Color Palette

**Light Mode**
- Primary: 25 85% 45% (vibrant orange-red, food-inspired warmth)
- Secondary: 145 60% 40% (fresh green, ingredient freshness)
- Background: 40 15% 98% (warm cream)
- Surface: 0 0% 100% (pure white cards)
- Text Primary: 20 15% 20% (warm dark brown)
- Text Secondary: 20 10% 45% (muted brown)

**Dark Mode**
- Primary: 25 75% 55% (slightly brighter orange-red)
- Secondary: 145 50% 50% (muted green)
- Background: 20 12% 8% (dark charcoal with warmth)
- Surface: 20 8% 12% (elevated dark surface)
- Text Primary: 40 20% 95% (warm off-white)
- Text Secondary: 40 10% 70% (muted warm gray)

**Accent Colors** (use sparingly for badges/tags)
- Difficulty Easy: 145 55% 50%
- Difficulty Medium: 40 70% 55%
- Difficulty Hard: 0 65% 55%
- Region Tags: 210 45% 50% (cool blue for geographic markers)

### B. Typography

**Font Families** (via Google Fonts CDN)
- Display/Headers: 'Playfair Display' (serif, elegant for food storytelling)
- Body/UI: 'Inter' (sans-serif, clean readability)
- Accent: 'Caveat' (handwritten, for cultural facts/quotes)

**Type Scale**
- Hero Title: text-6xl md:text-7xl font-display font-bold
- Section Headers: text-3xl md:text-4xl font-display font-semibold
- Card Titles: text-xl font-display font-semibold
- Body: text-base font-body
- Small/Meta: text-sm font-body text-secondary

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

**Container Strategy**
- Full-width sections: w-full with inner max-w-7xl mx-auto px-4
- Content sections: max-w-6xl mx-auto
- Chat interface: max-w-3xl mx-auto
- Recipe cards grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

**Vertical Rhythm**
- Section padding: py-16 md:py-24
- Component spacing: space-y-8 to space-y-12
- Card internal padding: p-6

---

## Component Library

### Navigation
- Sticky top navigation with translucent backdrop-blur
- Logo (left): "Food Atlas" with globe icon
- Main nav (center): Explore | Map | My Logs | Saved
- User/Settings (right)
- Mobile: Hamburger menu with slide-out drawer

### Conversational Interface
- Chat container: Centered max-w-3xl with gentle shadow
- User messages: Right-aligned, primary color background, rounded-2xl
- AI responses: Left-aligned, surface color, rounded-2xl with avatar
- Quick action chips: Horizontal scroll pills for shortcuts ("もっと辛く", "15分以内")
- Input: Large rounded-full input with send button, sticky bottom on mobile

### Recipe Candidate Cards
- Card design: Elevated shadow, rounded-xl, overflow-hidden
- Image: Aspect-ratio 4:3, object-cover, with gradient overlay at bottom
- Content overlay: Absolute positioned title, country/region badge, time/difficulty icons
- Hover state: Subtle scale (scale-105) and increased shadow
- Bottom section: Tags as small pills, save/queue action buttons
- Loading state: Shimmer animation skeleton

### Comparison Tray
- Horizontal scroll container at bottom of viewport
- Sticky position, slides up when items added
- Mini cards (compressed version) with key stats
- "Compare" button appears when 2+ items selected

### Recipe Detail Page
- Hero section: Large food image with gradient overlay
- Breadcrumb: Country > Region > Dish name
- Key stats row: Time, Servings (with +/- buttons), Difficulty, Rating
- Ingredients section: Two-column layout (ingredient | quantity + alt)
- Steps section: Numbered large cards with generous spacing
- Nutrition panel: Circular progress indicators for P/F/C ratios
- Action buttons: Save, Queue, "I Made This", Share

### World Map Interface
- Hero: Interactive SVG world map or styled select dropdown (initial MVP)
- Country selection highlights region
- Region cards: Grid of 10 major regions with representative imagery
- Each region card: Background image, name overlay, AI comment preview
- Selected state: Primary border, expanded AI comment below

### Cultural Facts
- Toast notification: Slides from top-right, surface color, rounded-lg
- Icon: 💡 or book icon
- "Learn More" button expands to modal
- Modal: Centered, max-w-2xl, image + text content, source citation at bottom
- Handwritten accent font for quote-style facts

### My Logs (食べた・作った記録)
- List view: Card-based timeline with date headers
- Log entry card: Thumbnail image (left), dish name, date, rating stars, action buttons (right)
- "Made Again" / "Find Similar" quick actions
- Filter chips: By country, by date range, by rating
- Empty state: Friendly illustration with CTA to start logging

### Recent/Saved/Queue Tabs
- Tab navigation: Underline indicator, smooth transition
- Unified card component across all three views
- Quick remove/move actions
- Welcome message: Personalized based on history ("前回はタイでした")

---

## Animations

**Use Sparingly**
- Card hover: scale + shadow (100-200ms ease-out)
- Page transitions: Fade + slight slide (200ms)
- Modal open/close: Scale from center (150ms)
- Toast notifications: Slide-in from right (200ms)
- No auto-playing food animations or carousels

---

## Images

**Hero Section**: Full-width hero on landing page
- Image: Vibrant overhead shot of diverse dishes from multiple cuisines arranged beautifully
- Style: Colorful, appetizing, professional food photography
- Overlay: Dark gradient (bottom to top) for text readability
- Placement: Above fold, 70vh on desktop, 60vh on mobile

**Recipe Cards**: Each card requires food imagery
- Style: Appetizing close-ups, bright lighting, colorful ingredients visible
- Fallback: Use country/region representative dishes
- Source: Placeholder comments for MVP, later integrate food image APIs

**Region Selection Cards**: Background images for each region
- 10 images representing major culinary regions
- Style: Destination-style photos (markets, street food, traditional settings)

**Cultural Facts Modal**: Supporting imagery
- Style: Historical photos, ingredient close-ups, or cultural context images

**My Logs**: User-uploaded photos
- Circular crop for thumbnails
- Full aspect ratio in detail view
- Placeholder: Dish illustration if no photo uploaded

---

## Responsive Behavior

**Mobile-First Considerations**
- Chat interface: Full-width on mobile, centered on desktop
- Recipe cards: Single column on mobile, grid on tablet+
- Map selection: Drawer/modal on mobile, inline on desktop
- Comparison tray: Swipeable horizontal scroll
- Bottom navigation bar on mobile for key actions

**Breakpoints** (Tailwind)
- sm: 640px (small tablet)
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)

---

## Accessibility & Dark Mode

- All interactive elements: Minimum 44px touch targets
- Color contrast: WCAG AA minimum for all text
- Dark mode: Toggle in user menu, system preference detection
- Form inputs: Consistent styling in both modes with proper focus states
- Icons: Use Heroicons via CDN (outline style for navigation, solid for inline actions)

---

## Key UX Patterns

1. **Progressive Disclosure**: Start simple (chat), reveal complexity (comparison, detailed recipes) on demand
2. **Visual Hierarchy**: Food images dominate, metadata supports
3. **Gamification Subtle**: Stars for ratings, completion indicators, streak tracking (future)
4. **Contextual Actions**: Action buttons appear based on state (unsaved → save, saved → view, logged → remake)
5. **Feedback Rich**: Toast notifications for all actions, loading states for AI generation