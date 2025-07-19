# Design System Styles Setup Guide (Figma)

Welcome! This guide will help you set up the **final, exhaustive Styles section** of your Design System page in Figma for the Rakshaayan platform. This is a waterfall project—**no more changes will be made after this**. Follow each step carefully to create a professional, consistent foundation for all UI components and pages.

---

## 1. Overview: What Are Styles?

**Styles** are reusable definitions for colors, text, spacing, effects, and grids. Setting these up first ensures every component and page in your project looks consistent and is easy to update later.

In Figma, you will mainly apply styles to **Rectangles (or shapes)** and **Text**. This guide tells you exactly what to create, what to apply it to, and how to name it.

---

## 2. Text Styles (Typography)
| Style Name         | Font Family           | Size | Weight   | Line Height | Description                | Use On |
|--------------------|----------------------|------|----------|-------------|----------------------------|--------|
| Text/H1            | Inter/Roboto/Arial   | 36   | Bold     | 1.2         | Main page titles           | Text   |
| Text/H2            | Inter/Roboto/Arial   | 28   | Bold     | 1.2         | Section headers            | Text   |
| Text/H3            | Inter/Roboto/Arial   | 22   | SemiBold | 1.2         | Subsection headers         | Text   |
| Text/Body Large    | Inter/Roboto/Arial   | 18   | Regular  | 1.5         | Large body text            | Text   |
| Text/Body          | Inter/Roboto/Arial   | 16   | Regular  | 1.5         | Standard body text         | Text   |
| Text/Body Small    | Inter/Roboto/Arial   | 14   | Regular  | 1.5         | Small text, labels         | Text   |
| Text/Button        | Inter/Roboto/Arial   | 16   | SemiBold | 1.2         | Button text                | Text   |
| Text/Caption       | Inter/Roboto/Arial   | 12   | Regular  | 1.5         | Captions, helper text      | Text   |

---

## 3. Color Styles

### **A. Main Colors (Fill Styles, Apply to Rectangle)**
| Style Name         | Color Code | Description                                      |
|--------------------|------------|--------------------------------------------------|
| Color/Primary      | #2563eb    | Main actions, buttons, links, headers            |
| Color/Secondary    | #22c55e    | Success, confirmations, positive highlights      |
| Color/Accent       | #f59e42    | Warnings, highlights, call-to-action             |
| Color/Error        | #ef4444    | Error backgrounds, error alerts                  |
| Color/Warning      | #f59e42    | Warnings, alerts                                 |
| Color/Info         | #2563eb    | Info alerts, badges                              |
| Color/Success      | #22c55e    | Success alerts, badges                           |
| Color/Disabled     | #cbd5e1    | Disabled states (buttons, etc.)                  |
| Color/Background   | #f9fafb    | App/page background                             |
| Color/Surface      | #ffffff    | Card, modal, surface backgrounds                 |
| Color/Overlay      | #000000 (8-16% opacity) | Modal overlays, tooltips           |

### **B. Text Color Styles (Apply to Text)**
| Style Name         | Color Code | Description                                      |
|--------------------|------------|--------------------------------------------------|
| Color/Text Primary | #1e293b    | Main text color                                  |
| Color/Text Muted   | #64748b    | Secondary/muted text color                       |
| Color/Text Inverse | #ffffff    | Text on dark backgrounds                         |
| Color/Text Error   | #ef4444    | Error text                                       |
| Color/Text Success | #22c55e    | Success text                                     |
| Color/Text Warning | #f59e42    | Warning text                                     |
| Color/Text Disabled| #cbd5e1    | Disabled text                                    |

### **C. Stroke/Border Styles (Apply to Rectangle)**
| Style Name         | Color Code | Description                                      |
|--------------------|------------|--------------------------------------------------|
| Color/Border       | #e5e7eb    | Default borders, dividers                        |
| Color/Border Focus | #2563eb    | Focused input border                             |
| Color/Border Error | #ef4444    | Error input border                               |
| Color/Border Success| #22c55e   | Success input border                             |
| Color/Border Disabled| #cbd5e1  | Disabled input border                            |

---

## 4. Effect Styles (Shadows, Glows, Blurs)
| Style Name      | Effect Type  | Example Settings                        | Description                  | Use On    |
|-----------------|--------------|-----------------------------------------|------------------------------|-----------|
| Shadow/Small    | Drop Shadow  | 0px 1px 4px rgba(0,0,0,0.08)            | Subtle shadow for cards      | Rectangle |
| Shadow/Medium   | Drop Shadow  | 0px 4px 16px rgba(0,0,0,0.12)           | Modals, overlays             | Rectangle |
| Shadow/Large    | Drop Shadow  | 0px 8px 32px rgba(0,0,0,0.16)           | Drawers, popups              | Rectangle |
| Focus/Glow      | Layer Blur   | 0px 0px 8px #2563eb (or similar)        | Focused elements             | Rectangle |
| Overlay/Blur    | Background Blur | 8px blur, 16% black overlay           | Modal overlays               | Rectangle |

---

## 5. Layout Grid Styles
| Name      | Type    | Settings                | Use Case         |
|-----------|---------|-------------------------|------------------|
| Grid/8px  | Grid    | 8px grid                | General spacing  |
| Columns/12| Columns | 12 columns, 80px gutter | Desktop layouts  |
| Columns/4 | Columns | 4 columns, 16px gutter  | Mobile layouts   |

---

## 6. Animation Styles (Document for Devs, not Figma Styles)
Figma does not support animation styles as reusable tokens, but you should document these for developers:
- **Button hover:** 150ms ease-in-out
- **Modal open/close:** 250ms ease
- **Tooltip fade:** 200ms ease
- **Loader spin:** 1s linear infinite

---

## 7. Other Styles (Optional, for completeness)
- **Divider:** 1px solid #e5e7eb (use Border style)
- **Avatar Placeholder:** #cbd5e1 (for user initials, etc.)
- **Focus Ring:** 2px solid #2563eb (for accessibility, use Border Focus)

---

## 8. How to Create Each Style in Figma

### **A. Fill Styles**
- Draw a rectangle, set the Fill color, then create style from Fill.

### **B. Stroke Styles**
- Draw a rectangle, set the Stroke color (no Fill or white Fill), then create style from Stroke.

### **C. Effect Styles**
- Draw a rectangle, add a Drop Shadow or Blur in Effects, then create style from Effect.

### **D. Text Styles**
- Add a text box, set the font, size, weight, and color, then create style from Text.

### **E. Grid Styles**
- Select a frame, set up a layout grid (right panel > Layout grid > “+”), then create style from Layout grid.

---

## 9. Best Practices
- **Be consistent:** Use the exact variable names and sizes above.
- **Use styles for everything:** Don’t use manual colors or fonts—always apply your saved styles.
- **Keep it neat:** Align and space your frames and elements for easy navigation.
- **Accessibility:** Ensure color contrast is good and font sizes are readable.

---

## 10. Final Checklist
- [ ] All text, color, stroke, effect, and grid styles are created and named correctly.
- [ ] Styles are applied to the correct object type (Rectangle or Text).
- [ ] Spacing and grid system is shown and labeled.
- [ ] Icons are imported, made into components, and named.
- [ ] Animation styles are documented for developers.
- [ ] Everything is organized in labeled frames at the top of the page.

---

**Once you finish this Styles section, let your teammate know—they can then start building all components using your styles!**

If you get stuck, search “Figma styles for beginners” on YouTube or ask for help. You’re building the foundation for the whole project—take your time and make it neat! 