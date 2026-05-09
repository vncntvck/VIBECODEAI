---
name: Fintjam
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  data-tabular:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system focuses on "Functional Precision." It is built for the Indonesian financial context, prioritizing clarity, trust, and speed of comprehension. The brand personality is institutional yet accessible—devoid of decorative fluff to ensure that financial data remains the sole protagonist.

The visual style is **Minimalist / Corporate Modern**. It utilizes a flat design language with zero gradients, ensuring high legibility and a rigorous professional aesthetic. The interface avoids all photographic elements, relying instead on structured geometry and high-contrast information density to guide the user through complex financial reports.

## Colors
The palette is strictly functional, utilizing high-contrast tones to differentiate data types at a glance.

- **Primary & Secondary:** Deep Navy (#0F172A) provides an authoritative foundation for text and navigation, while Bright Blue (#2563EB) acts as the primary action color.
- **Financial Indicators:** A "Traffic Light" system is used for rapid data scanning. Green (#16A34A) is reserved exclusively for income and positive growth, while Red (#DC2626) signifies expenses and deficits.
- **Neutrals:** A range of slate grays is used for secondary information and structural borders.
- **Contrast:** The system maintains a high contrast ratio against a pure white background to ensure accessibility for dense data tables and charts. No gradients or shadows are permitted; color changes must be distinct and solid.

## Typography
This design system uses **Hanken Grotesk** for its contemporary, sharp terminals and excellent legibility in data-heavy environments. 

- **Numerical Clarity:** For IDR currency values, "Tabular Figures" (tnum) must be enabled to ensure numbers align vertically in lists and tables, facilitating easier comparison.
- **Hierarchy:** Headlines use a tighter letter-spacing and heavier weights to provide clear section anchors. 
- **Scale:** On mobile devices, `headline-lg` should be capped at `24px` to maintain screen real estate for data tables.
- **Labels:** Small labels use a medium or semi-bold weight to ensure they remain legible even at 12px.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid Grid**. On desktop, content is centered within a 1200px container. On mobile, it transitions to a single-column fluid layout.

- **Rhythm:** A 4px baseline grid governs all vertical and horizontal spacing.
- **Lists:** Transactional lists use `16px` (md) padding for vertical separation to ensure touch targets are sufficient without sacrificing density.
- **Information Density:** Charts and data visualizations should utilize the full width of their containers. Gutters are kept tight (16px) to maximize the horizontal space available for IDR currency strings (e.g., "Rp 100.000.000").

## Elevation & Depth
This design system rejects shadows and 3D effects. Depth is achieved through **Tonal Layering** and **Low-Contrast Outlines**.

- **Surfaces:** The primary background is white (#FFFFFF). Secondary sections or containers use a subtle slate-tinted surface (#F8FAFC).
- **Separation:** Boundaries are defined by 1px solid borders using a light neutral (#E2E8F0). 
- **Active States:** Elements that are clickable or "lifted" do not use shadows; instead, they utilize a slightly thicker border or a subtle background color shift to the primary blue at 5% opacity.

## Shapes
Shapes are disciplined and professional. A **Soft (0.25rem)** roundedness is applied to standard components like buttons and input fields to reduce visual tension while maintaining a structural, architectural feel. 

- **Containers:** Large data cards use `0.5rem` (rounded-lg) for clear containment.
- **Data Points:** Markers in charts (line graphs or bar charts) should remain sharp-edged or use minimal rounding to maintain mathematical precision.

## Components
- **Buttons:** Flat, solid fills. Primary buttons use Navy (#0F172A) with white text. Secondary buttons use a 1px border. No gradients or rounded-pill shapes.
- **Lists:** Transaction items feature the category name on the left and the IDR amount on the right. Positive amounts (Income) must use the Green palette; negative amounts (Expenses) must use the Red palette.
- **Input Fields:** 1px solid borders in Slate-200. Focus states use a 2px solid Blue (#2563EB) border. Labels are always visible above the field (no floating placeholders).
- **Charts:** Line and bar charts must use high-contrast solid colors. Lines for "Income" are Green, and "Expenses" are Red. The grid lines within charts should be a very light gray (#F1F5F9).
- **Chips:** Used for transaction categories (e.g., "Transport", "Food"). These are rectangular with soft corners, using a light gray background and dark text. No icons or avatars are included within chips.
- **Data Cards:** Simple white containers with a 1px border. They aggregate high-level metrics like "Total Balance" or "Monthly Savings Rate."