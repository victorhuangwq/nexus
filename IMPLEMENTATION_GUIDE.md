# Nexus UI Implementation Guide

This guide provides step-by-step instructions for implementing the minimalist design improvements across the Nexus codebase.

## Phase 1: Foundation Setup (Week 1)

### 1.1 Design Token Integration
```bash
# Import design tokens in theme.ts
import tokens from './design-tokens';
```

Update `src/renderer/theme.ts`:
- Replace hardcoded values with token references
- Ensure all components use centralized tokens
- Add token-based component variants

### 1.2 Background Simplification
Replace current animated background in `App.tsx`:
```tsx
// Remove all MotionBox animated elements (lines 241-282)
// Replace with MinimalistBackground component
import { MinimalistBackground } from './components/examples/MinimalistBackground';

// Wrap main content
<MinimalistBackground>
  <Container>...</Container>
</MinimalistBackground>
```

## Phase 2: Core Components (Week 2)

### 2.1 OmniPrompt Refinement
Update `src/renderer/components/OmniPrompt.tsx`:
```tsx
// Apply new styles from MinimalistOmniPrompt
bg="rgba(255, 255, 255, 0.03)"
backdropFilter="blur(40px)"
border="1px solid rgba(255, 255, 255, 0.06)"
borderRadius="16px"
```

### 2.2 Unify Card Components
Create base card component:
```tsx
// src/renderer/components/base/Card.tsx
import { MinimalistCard } from '../examples/MinimalistCard';
export const Card = MinimalistCard;
```

Update all existing cards:
- WeatherWidget cards
- Layout template cards
- Static component wrappers

### 2.3 Button Standardization
Update button styles in theme:
```tsx
Button: {
  variants: {
    primary: {
      bg: tokens.colors.brand.primaryAlpha,
      color: 'rgba(0, 0, 0, 0.9)',
      borderRadius: tokens.radius.md,
      _hover: {
        bg: tokens.colors.brand.primaryHover,
        transform: 'translateY(-1px)',
      }
    },
    ghost: {
      bg: 'transparent',
      color: tokens.colors.text.tertiary,
      border: `1px solid ${tokens.colors.border.default}`,
      _hover: {
        bg: tokens.colors.canvas.overlay,
        color: tokens.colors.text.secondary,
        borderColor: tokens.colors.border.hover,
      }
    }
  }
}
```

## Phase 3: Component Specific Updates (Week 3)

### 3.1 WeatherWidget Improvements
```tsx
// Remove "Action" placeholder hack (line 114-116)
// Simplify control layout to single row
// Use consistent spacing tokens
```

### 3.2 FloatingInputBar Alignment
```tsx
// Match OmniPrompt styling
bg="rgba(255, 255, 255, 0.03)"
backdropFilter="blur(40px)"
border="1px solid rgba(255, 255, 255, 0.06)"

// Change SearchIcon to ArrowForwardIcon
// Increase padding for better touch targets
```

### 3.3 Typography Updates
Update all text elements:
```tsx
// Hero text (App.tsx line 388)
fontSize="56px" // Down from 6xl
fontWeight="700"

// Body text
fontSize="15px"
color={tokens.colors.text.secondary}
lineHeight="1.6"
```

## Phase 4: Polish & Refinement (Week 4)

### 4.1 Focus States
Implement consistent focus states:
```tsx
_focus={{
  boxShadow: tokens.shadow.focus,
  borderColor: tokens.colors.border.focus,
  outline: 'none',
}}
```

### 4.2 Loading States
Add skeleton screens:
```tsx
// Create LoadingSkeleton component
<Box
  bg={tokens.colors.canvas.raised}
  borderRadius={tokens.radius.lg}
  h="200px"
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.5, repeat: Infinity }}
/>
```

### 4.3 Micro-interactions
Implement subtle hover effects:
```tsx
whileHover={{
  scale: 1.02,
  transition: { duration: 0.2 }
}}
whileTap={{
  scale: 0.98,
  transition: { duration: 0.1 }
}}
```

## Testing Checklist

### Visual Consistency
- [ ] All border radius values match tokens
- [ ] Spacing follows 8px grid system
- [ ] Colors use token references only
- [ ] Glass effects are consistent

### Interaction
- [ ] Focus states are visible and consistent
- [ ] Hover states provide clear feedback
- [ ] Transitions are smooth (200-300ms)
- [ ] Touch targets are minimum 44px

### Performance
- [ ] Remove unnecessary animations
- [ ] Lazy load heavy components
- [ ] Use CSS transforms for animations
- [ ] Test on low-end devices

### Accessibility
- [ ] Color contrast meets WCAG AA
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader labels present
- [ ] Focus order is logical

## Migration Strategy

### Step 1: Create Feature Branch
```bash
git checkout -b design-system-refactor
```

### Step 2: Implement in Isolation
- Create new components alongside existing ones
- Use feature flags to toggle between old/new

### Step 3: Gradual Rollout
1. Start with low-traffic components
2. A/B test major changes
3. Gather user feedback
4. Iterate based on metrics

### Step 4: Cleanup
- Remove old component code
- Update documentation
- Create component library

## Metrics to Track

### Performance
- First Contentful Paint (< 1.5s)
- Time to Interactive (< 3s)
- Cumulative Layout Shift (< 0.1)

### User Engagement
- Task completion rate
- Time to complete tasks
- User satisfaction scores
- Error rates

### Design System
- Component reuse rate
- Design token adoption
- Consistency score
- Accessibility compliance

## Common Pitfalls to Avoid

1. **Over-animating**: Keep animations subtle and purposeful
2. **Inconsistent spacing**: Always use token values
3. **Color proliferation**: Stick to the defined palette
4. **Focus state neglect**: Every interactive element needs clear focus
5. **Performance regression**: Profile before and after changes

## Resources

- Design Tokens: `src/renderer/design-tokens.ts`
- Example Components: `src/renderer/components/examples/`
- Design Philosophy: `DESIGN_PHILOSOPHY.md`
- Improvements Doc: `DESIGN_IMPROVEMENTS.md`

## Next Steps

1. Review and approve design changes with team
2. Create component library documentation
3. Set up visual regression testing
4. Plan user testing sessions
5. Create design system Storybook

Remember: The goal is to create an interface that feels invisible, allowing users to focus on their work, not the tools.