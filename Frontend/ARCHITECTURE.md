# Mobile-Responsive Dashboard Architecture

## Component Hierarchy

```
DashboardLayout (Responsive Shell)
├── SidebarProvider (Context)
│   │
│   ├── DesktopNav (≥lg: visible, <lg: hidden)
│   │   └── SidebarContent
│   │       ├── OrionLogo
│   │       ├── Navigation Links
│   │       └── User Section
│   │
│   ├── Main Content Area
│   │   ├── DashboardNavbar (Sticky Top)
│   │   │   ├── Hamburger Button (<lg: visible, ≥lg: hidden)
│   │   │   ├── CompanySwitcher
│   │   │   └── Right Actions
│   │   │
│   │   └── <main> (Page Content)
│   │       └── <Outlet /> (Dashboard Pages)
│   │
│   ├── MobileDrawer (<lg: conditional, ≥lg: hidden)
│   │   ├── Backdrop Overlay
│   │   └── Drawer Panel
│   │       └── SidebarContent
│   │
│   └── MobileTabs (≤sm: visible, >sm: hidden)
│       └── 5 Tab Links
```

## State Flow

```
┌─────────────────────┐
│  SidebarProvider    │  Manages drawer open/close state
└──────────┬──────────┘
           │
           ├─► isOpen: boolean
           ├─► open: () => void
           ├─► close: () => void
           ├─► toggle: () => void
           └─► triggerRef: RefObject
                   │
         ┌─────────┴──────────┐
         │                    │
    ┌────▼─────────┐   ┌──────▼─────────┐
    │ Hamburger    │   │  MobileDrawer  │
    │ (Navbar)     │   │                │
    │ - Sets ref   │   │ - Reads state  │
    │ - Calls      │   │ - Calls close()│
    │   toggle()   │   │ - Shows/hides  │
    └──────────────┘   └────────────────┘
```

## Responsive Behavior

```
┌──────────────────────────────────────────────────────────────┐
│                        VIEWPORT WIDTH                          │
├──────────┬──────────────────┬──────────────────┬──────────────┤
│  320px   │     640px        │     1024px       │   1440px     │
├──────────┼──────────────────┼──────────────────┼──────────────┤
│   sm     │       md         │       lg         │     xl       │
└──────────┴──────────────────┴──────────────────┴──────────────┘

Phone (≤640px):
┌────────────────────────┐
│ [☰] CompanySwitcher   │ ← Navbar
├────────────────────────┤
│                        │
│    Page Content        │
│                        │
├────────────────────────┤
│ [Home][FAQ][Chat]...  │ ← Bottom Tabs
└────────────────────────┘

Tablet (640px-1023px):
┌────────────────────────┐
│ [☰] CompanySwitcher   │ ← Navbar
├────────────────────────┤
│                        │
│    Page Content        │
│                        │
│                        │
└────────────────────────┘

Desktop (≥1024px):
┌──────────┬─────────────────┐
│          │ CompanySwitcher │ ← Navbar
│          ├─────────────────┤
│ Sidebar  │                 │
│ (fixed)  │  Page Content   │
│          │                 │
│          │                 │
└──────────┴─────────────────┘
```

## Event Flow: Opening/Closing Drawer

### Opening Drawer
```
User clicks hamburger
       │
       ▼
toggle() called
       │
       ▼
isOpen = true
       │
       ├─► MobileDrawer renders
       │   ├─► Overlay fades in
       │   ├─► Panel slides in
       │   └─► Focus moved inside
       │
       └─► useLockBodyScroll locks scroll
```

### Closing Drawer (Multiple Triggers)
```
Trigger 1: User clicks overlay
Trigger 2: User presses Escape
Trigger 3: User navigates to new route
Trigger 4: User presses back/forward
       │
       ▼
close() called
       │
       ▼
isOpen = false
       │
       ├─► MobileDrawer animates out
       │   ├─► Panel slides out
       │   └─► Overlay fades out
       │
       ├─► useLockBodyScroll unlocks scroll
       │
       └─► Focus restored to hamburger
```

## Focus Management

### Focus Trap (When Drawer Open)
```
┌─────────────────────────────────────┐
│  MobileDrawer                       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ [X] Close                     │ │  ← Last
│  ├───────────────────────────────┤ │     ▲
│  │ [🏠] Home         ◄────┐      │ │  ← First
│  │ [📚] FAQ Library       │      │ │     │
│  │ [💬] Conversations     │      │ │     │
│  │ [⚡] Escalations       │      │ │     │
│  │ [📊] Analytics  ───────┘      │ │     │
│  │ [⚙️] Settings  ───────┐       │ │     │
│  ├───────────────────────┴──────┤ │     │
│  │ [👤] User Profile            │ │     │
│  └───────────────────────────────┘ │     │
│                                     │     │
└─────────────────────────────────────┘     │
         │                                  │
         └──────── Tab cycle ───────────────┘
              (Shift+Tab reverses)
```

### Focus Restoration
```
Before drawer opens:
  [☰ Hamburger]  ← Focus here
       │
       ▼ (User clicks)
       │
Drawer opens:
  [☰ Hamburger]
       │
  ┌────▼─────────┐
  │  Drawer      │
  │  [First Link]│ ← Focus moved here
  └──────────────┘
       │
       ▼ (User closes)
       │
After drawer closes:
  [☰ Hamburger]  ← Focus restored here
```

## Data Flow: Route Highlighting

```
TanStack Router
       │
       ▼
useRouterState() hook
       │
       ├─► location.pathname
       │
       ├──────────────┬──────────────┐
       │              │              │
       ▼              ▼              ▼
SidebarContent    MobileTabs    (closes drawer)
       │              │
       │              │
       ▼              ▼
 Active styling   aria-current="page"
 (bg-primary)     (text-primary)
```

## Performance Optimizations

1. **Conditional Rendering**
   - `DesktopNav`: `hidden lg:block` (CSS, not JS)
   - `MobileDrawer`: Early return if `!isOpen`
   - `MobileTabs`: `sm:hidden` (CSS, not JS)

2. **Memoization**
   - `SidebarContext` value memoized with `useMemo`
   - Stable callbacks (`open`, `close`, `toggle`)

3. **Event Handlers**
   - Cleanup functions for all event listeners
   - `useEffect` dependencies properly specified

4. **Animations**
   - CSS transitions (GPU accelerated)
   - No JavaScript animation loops

## Accessibility Tree

```
<SidebarProvider>
  │
  ├── <nav aria-label="Primary"> [Desktop]
  │   └── <aside role="navigation">
  │
  ├── <header> [Navbar]
  │   └── <button aria-label="Toggle sidebar"
  │             aria-controls="mobile-sidebar"
  │             aria-expanded={isOpen}>
  │
  ├── <main>
  │   └── Page content
  │
  ├── <aside role="dialog" [Mobile]
  │         aria-modal="true"
  │         id="mobile-sidebar">
  │   └── <nav aria-label="Primary">
  │
  └── <nav aria-label="Bottom"> [Mobile Tabs]
      └── <a aria-current="page"> [Active]
```

## Styling Strategy

### Tailwind Utilities Used
- **Layout:** `fixed`, `sticky`, `flex`, `grid`
- **Sizing:** `w-60`, `w-72`, `h-11`, `h-14`
- **Spacing:** `px-4`, `py-6`, `gap-2`, `space-y-1`
- **Borders:** `border`, `border-t`, `border-r`
- **Colors:** `bg-background`, `text-foreground`, `text-primary`
- **Effects:** `backdrop-blur`, `shadow-xl`
- **Transitions:** `transition-transform`, `duration-200`
- **Responsive:** `lg:block`, `lg:hidden`, `sm:hidden`
- **Focus:** `focus-visible:ring-2`

### No Inline Styles
Exception: `MobileTabs` uses inline style for `env(safe-area-inset-bottom)`
(Required for iOS notched devices)

## Extension Points

### Add Bottom Tab Icon
```tsx
// In MobileTabs.tsx
const TABS = [
  { 
    href: "/dashboard", 
    label: "Home",
    icon: <HomeIcon className="h-5 w-5" /> // Add this
  },
  // ...
];
```

### Add Drawer Animation Variant
```tsx
// In DashboardSidebar.tsx MobileDrawer
className={[
  "fixed inset-y-0 left-0",
  "transition-all duration-300",  // Change duration
  isOpen ? "translate-x-0" : "-translate-x-full",
].join(" ")}
```

### Add Swipe Gesture
```tsx
// In MobileDrawer, add touch handlers
const [touchStart, setTouchStart] = useState(0);

<aside
  onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
  onTouchEnd={(e) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchEnd - touchStart > 100) close(); // Swipe right
  }}
>
```

## Testing Strategy

### Unit Tests (Potential)
- `useLockBodyScroll` → body class added/removed
- `SidebarContext` → state updates correctly
- `getFocusable` → returns correct elements

### Integration Tests (Potential)
- Hamburger click → drawer opens
- Escape key → drawer closes
- Route change → drawer closes
- Overlay click → drawer closes

### E2E Tests (Potential)
- Desktop: sidebar always visible
- Tablet: drawer functional
- Mobile: drawer + tabs functional
- Keyboard navigation works
- Screen reader announces correctly

---

This architecture provides a solid foundation for a production-ready mobile-responsive dashboard. The separation of concerns, clear data flow, and accessibility-first approach make it easy to maintain and extend.
