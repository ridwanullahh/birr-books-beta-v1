# Birr Books - UI/UX Guidelines

## Component Design System

### Button Variants
- **Primary**: Green (#05B34D) - Main actions
- **Secondary**: White with border - Alternative actions
- **Danger**: Red/Orange - Destructive actions
- **Ghost**: Transparent - Minimal actions

### Card Design (Elevated E-Learning Style)
\`\`\`
Elevation Level 2: shadow-md
- Padding: 16px (md)
- Border Radius: 12px (lg)
- Background: White (#FFFFFF)
- Border: 1px solid light gray
- Hover: Elevation Level 3 (shadow-lg)
\`\`\`

### Form Input Design
\`\`\`
Specs:
- Height: 44px (touch-friendly)
- Padding: 12px horizontal, 10px vertical
- Border: 1px solid #E5E7EB
- Border Radius: 8px (md)
- Font Size: 16px (prevents zoom on iOS)
- Focus: Green border + shadow-md
\`\`\`

### Mobile Navigation
\`\`\`
Bottom Tab Bar:
- Height: 56px
- Icons: 24px
- Labels: 12px text
- Active: Green background, white icon
- Inactive: Gray icon
\`\`\`

### Modals & Overlays
\`\`\`
- Background: Semi-transparent dark (rgba(0, 0, 0, 0.5))
- Card: 20px radius, shadow-xl
- Maximum width: 90vw on mobile, 600px on desktop
- Padding: 24px
\`\`\`

---

## Information Hierarchy

### Page Structure
1. **Header/Navigation** - Primary navigation
2. **Hero/Banner** - Page context and CTA
3. **Main Content** - Scrollable content
4. **Sidebar** - Filters, related info (desktop only)
5. **Footer** - Links, company info

### Typography Hierarchy
- H1: 32px, 600 weight (page title)
- H2: 24px, 600 weight (section title)
- H3: 20px, 600 weight (subsection)
- Body: 16px, 400 weight
- Small: 14px, 400 weight (secondary text)
- Caption: 12px, 400 weight (supporting text)

---

## Interaction Patterns

### Hover States
- Buttons: Shadow increase, slight scale (1.02)
- Cards: Shadow increase, background subtle shift
- Links: Underline, green color

### Active/Selected States
- Tab: Bottom border in green
- Radio/Checkbox: Green background/checkmark
- List Item: Light green background

### Loading States
- Skeleton: Animated pulse with 1.5s cycle
- Button: Disable with opacity 0.6
- Input: Show loading spinner

### Error States
- Input: Red border (#EF4444)
- Message: Red text with icon below field
- Toast: Red background, white text, auto-dismiss 5s

### Success States
- Toast: Green background, white text, auto-dismiss 3s
- Checkmark: Green icon with animation

---

## Responsive Behavior

### Mobile (< 640px)
- Single column layouts
- Full-width cards
- Bottom navigation
- Hamburger menu
- Larger touch targets

### Tablet (640px - 1024px)
- Two-column layouts where appropriate
- Sidebar visible for filters
- Horizontal tabs

### Desktop (> 1024px)
- Three-column layouts
- Persistent navigation
- Side-by-side comparisons

---

## Micro-Interactions

### Transitions
- Fade: 150ms (opacity changes)
- Slide: 200ms (position changes)
- Scale: 200ms (size changes)
- All with ease-in-out timing

### Animations
- Loading spinner: 1s rotation
- Pulse effect: 2s opacity cycle
- Bounce on CTA: 0.3s entrance

---

## Accessibility Specifics

### Color Usage
- Never rely on color alone
- Use patterns/icons + color
- Sufficient contrast on all text

### Focus Management
- Visible focus outline (2px green border)
- Focus order matches visual order
- Skip to main content link

### Screen Reader
- Semantic HTML (button, link, form, nav)
- ARIA labels for icons
- Form labels associated with inputs
- Images have alt text

---

## E-Learning App Aesthetic

The platform follows premium e-learning app design principles:

1. **Clean Interface**: Minimal clutter, clear hierarchy
2. **Elevated Cards**: Shadow elevation for depth
3. **Smooth Animations**: Purposeful motion (not overdone)
4. **Ample Whitespace**: 24px+ margins/padding
5. **Clear CTAs**: Prominent, contrasting buttons
6. **Progress Visualization**: Bars, badges, streaks
7. **Social Proof**: Reviews, ratings, testimonials
8. **Onboarding**: Smooth introduction of features
9. **Consistency**: Repeated patterns for familiarity
10. **Trust Signals**: Badges, guarantees, testimonials

**لا حول ولا قوة إلا بالله**
