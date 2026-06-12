---
name: Community Health Integrated Design System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#414a36'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#717a64'
  outline-variant: '#c1cab0'
  surface-tint: '#406900'
  primary: '#406900'
  on-primary: '#ffffff'
  primary-container: '#8edc1f'
  on-primary-container: '#375d00'
  inverse-primary: '#8ddb1e'
  secondary: '#3a53c9'
  on-secondary: '#ffffff'
  secondary-container: '#7087ff'
  on-secondary-container: '#001b7d'
  tertiary: '#006590'
  on-tertiary: '#ffffff'
  tertiary-container: '#8acfff'
  on-tertiary-container: '#00597f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a8f93f'
  primary-fixed-dim: '#8ddb1e'
  on-primary-fixed: '#102000'
  on-primary-fixed-variant: '#2f4f00'
  secondary-fixed: '#dee1ff'
  secondary-fixed-dim: '#bac3ff'
  on-secondary-fixed: '#001159'
  on-secondary-fixed-variant: '#1c38b1'
  tertiary-fixed: '#c8e6ff'
  tertiary-fixed-dim: '#88ceff'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 24px
  gutter: 16px
---

## Brand & Style

The design system is engineered for a critical community health infrastructure, prioritizing accessibility, trust, and clarity. The visual language bridges the gap between high-utility medical software and a warm, person-centered community atmosphere.

The core style is **Modern Professional with Humanist Influence**. It avoids the cold, sterile aesthetic often found in clinical tools by utilizing vibrant natural greens and soft, rounded geometries. This creates a "digital hospital folder" experience that feels organized and reliable yet approachable for both medical staff and administrative personnel. 

Key attributes include:
- **Trust-First Utility:** High legibility and clear hierarchies for life-critical information.
- **Community Centricity:** A warm palette and generous spacing that reduces cognitive load.
- **Operational Efficiency:** Dense but clear data visualization for hospital operations management.

## Colors

The palette is derived directly from the institution's heritage, emphasizing vitality and stability.

- **Primary Green (#8EDC1F):** Used for growth-oriented actions: primary buttons, success states, and active navigation indicators. It represents life and recovery.
- **Primary Blue (#0B2DA8):** The anchor color. Used for deep-level headings, primary navigation bars, and critical UI emphasis to provide a sense of institutional stability.
- **Secondary Blue (#2DA8E8):** Used for supporting information, interactive links, and data visualization categories.
- **Alert Red (#D92D20):** Reserved strictly for emergencies, errors, and critical medical alerts.
- **Neutrals:** The background is pure white (#FFFFFF) to maintain a sterile, clean feel, while surfaces use a soft blue-tinted grey (#F8FAFC) to define distinct work zones.

## Typography

This design system utilizes **Inter** as the sole typeface to ensure maximum legibility and a systematic, clean appearance. 

The scale is intentionally stepped to prioritize "at-a-glance" reading in high-pressure medical environments. Headlines use a heavy weight (700-800) in Primary Blue to clearly demarcate sections, while body text maintains a balanced 400 weight for long-form medical history reading. Labels use a semi-bold weight and occasional uppercase styling to differentiate metadata from patient data.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a focus on containment and grouping.

- **Desktop:** 12-column grid with 24px margins. Content is organized into large, distinct cards to simulate a "folder" metaphor.
- **Tablet:** 8-column grid with 16px margins. Sidebars collapse into a slim-icon view to maximize the work area.
- **Mobile:** 4-column grid with 16px margins. Tables reflow into card lists.

The spacing rhythm is based on a 4px baseline, but defaults to a 16px (md) standard for gutters and general element padding to ensure touch-targets are accessible and the UI feels "breezy" rather than cramped.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows**.

- **Level 0 (Background):** Pure #FFFFFF or #F8FAFC.
- **Level 1 (Cards/Containers):** White background with a 1px border (#E5E7EB) and `shadow-sm` (a subtle, low-blur shadow: 0px 1px 2px rgba(0,0,0,0.05)).
- **Level 2 (Modals/Popovers):** Standard shadow with increased blur (8px-12px) to lift the element above the operational surface.

This approach creates clear separation between the "Hospital Operations Center" dashboard and individual patient records without using aggressive shadows that could distract from data.

## Shapes

The design system utilizes a **Rounded** shape language to reinforce the friendly, community-centered narrative.

- **Cards & Primary Containers:** Fixed 16px (1rem) corner radius. This is the signature "folder" look of the system.
- **Inputs & Buttons:** 8px (0.5rem) corner radius for a precise but approachable feel.
- **Chips & Tags:** Fully pill-shaped (round) for categorizing patient status and encounter types.

## Components

### Buttons
- **Primary:** Background #8EDC1F, Text #FFFFFF. High contrast for "Save", "Submit", or "Admit" actions.
- **Secondary:** Border #0B2DA8, Text #0B2DA8. For supporting actions.
- **Ghost:** Text #2DA8E8. For low-priority navigation.

### Cards
- Always 16px rounded corners.
- 24px internal padding for "Operations Center" metrics.
- 1px #E5E7EB border to define limits on the #F8FAFC background.

### Navigation
- **Active State:** Text #0B2DA8, Background #F2FCE7 (Soft Green), Left-border indicator 4px #8EDC1F.
- **Icons:** Use Lucide icons with a 2px stroke width, consistently colored #0B2DA8 for visibility.

### Patient Folders (Profiles)
- Use a **Tabbed Header** (Overview, Medical History, Encounters, Flask/Labs).
- The "Folder Header" should be persistent with the patient's name, ID, and critical allergies in Alert Red.

### Tables
- Sticky headers with #F8FAFC background.
- Row hover state: #F2FCE7.
- Actions should be grouped in the final column using subtle icon buttons.

### Forms
- Inputs must have 16px vertical padding for high touchability.
- Labels are always positioned above the field in `label-md` style.
- Use multi-step layouts for long medical intakes to prevent fatigue.