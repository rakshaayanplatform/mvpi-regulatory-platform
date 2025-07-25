# Components Page Creation Guide for Rakshaayan Platform (Figma)

Welcome! This guide will help you, step by step, to create a professional, organized, and complete **Components Page** in Figma for the Rakshaayan medical device adverse event reporting platform. No prior design experience is needed—just follow each step carefully!

---

## 1. Getting Started

- **Open Figma** and create or open the shared project file.
- **Add a new page** (bottom left, click the "+" next to Pages). Name it: `Components`.

---

## 2. Organize Your Components Page

### **A. Create Frames for Each Component Type**
Think of frames as "sections" or "folders" for your components. This keeps everything tidy and easy to find.

**Create these frames (use the Frame tool, shortcut: F):**
- Buttons
- Inputs & Forms
- Cards
- Modals
- Alerts & Badges
- Tables
- Navigation (Navbar, Sidebar, Tabs)
- Avatars & Icons
- Dropdowns & Menus
- Loaders & Progress
- Notifications & Toasts
- Chatbot Widget
- Miscellaneous (Pagination, Breadcrumbs, Calendar, FileUploader, etc.)

**How to place:**
- Arrange frames vertically, with some space between each (at least 80px).
- Name each frame exactly as above for clarity.

---

## 3. Add Components to Each Frame

### **A. Buttons**
- Create rectangles for buttons: 160x48px (Primary/Large), 120x36px (Primary/Small), 160x48px (Secondary).
- Add text labels (e.g., "Submit", "Cancel").
- Use the color styles from the Design System (Primary: #2563eb, Secondary: #22c55e).
- Add states: Default, Hover (slightly darker), Disabled (gray), Loading (add a spinner icon).
- Select each button and text, right-click, and choose "Create Component". Name: `Button/Primary/Large`, etc.

### **B. Inputs & Forms**
- Draw rectangles for text inputs: 360x48px (Large), 240x36px (Small).
- Add placeholder text (e.g., "Enter your name").
- Add border (color: #e5e7eb) and rounded corners (8px).
- Add states: Default, Focus (blue border), Error (red border), Disabled (gray text).
- Create checkboxes (24x24px), radios (24x24px), dropdowns (240x48px), file uploader (320x120px), calendar (320x360px), switch/toggle (48x24px).
- Make each as a component and name clearly (e.g., `Input/Text/Large`).

### **C. Cards**
- Draw a rectangle: 320x180px, white background, subtle shadow, 16px border radius.
- Add a title and body text using the text styles.
- Create as a component: `Card/Default`.

### **D. Modals**
- Rectangle: 480x320px, white, shadow, 16px border radius.
- Add a title, body, and close button (top right).
- Create as a component: `Modal/Default`.

### **E. Alerts & Badges**
- Alert: 320x56px, colored background (green for success, red for error, orange for warning, blue for info), white text.
- Badge/Tag: 64x24px, rounded, colored background, short text (e.g., "Active").
- Create as components: `Alert/Success`, `Badge/Status`, etc.

### **F. Tables**
- Table row: 100% width x 48px, light border at bottom.
- Add sample columns (e.g., Name, Status, Date).
- Create as a component: `Table/Row`.

### **G. Navigation**
- Navbar: 100% width x 64px, blue background, white text/logo.
- Sidebar: 240px wide, full height, vertical menu.
- Tabs: 120x40px each, horizontal row.
- Breadcrumbs: 320x32px, horizontal, separated by ">".
- Create each as a component.

### **H. Avatars & Icons**
- Avatar: 40x40px, circle, add a sample user image or initials.
- Icon: 24x24px, use free SVG icons (Heroicons/Feather). Import and make components.

### **I. Dropdowns & Menus**
- Dropdown: 240x48px, arrow icon, sample options.
- Menu: 240x48px, vertical list.
- Create as components.

### **J. Loaders & Progress**
- Loader/Spinner: 32x32px, animated or static.
- Progress bar: 320x16px, blue fill.
- Stepper: 320x48px, circles with numbers/steps.
- Create as components.

### **K. Notifications & Toasts**
- Toast: 320x56px, colored background, white text, close icon.
- Create as a component.

### **L. Chatbot Widget**
- Widget: 320x480px, rounded, header, message area, input at bottom.
- Create as a component.

### **M. Miscellaneous**
- Pagination: 320x48px, numbers/arrows.
- Tooltip: 200x40px, small popup.
- Divider: 100% width x 2px, gray.
- Accordion: 320x48px header, expandable.
- Slider: 320x32px, handle and track.
- Map widget: 480x320px, placeholder map.
- FileUploader: 320x120px, drag-and-drop area.
- Create each as a component.

---

## 4. Best Practices
- **Use Auto Layout** for all components (select, right-click, "Add Auto Layout") for easy resizing and spacing.
- **Use consistent spacing:** 8px grid for all padding/margins.
- **Use color and text styles** from the Design System for all elements.
- **Name everything clearly** (e.g., `Button/Primary/Large`, `Input/Text/Large`).
- **Group similar components** together in their frames.
- **Include all states** (default, hover, disabled, error, loading) for interactive components.
- **Check accessibility:** Good contrast, readable font sizes, focus states.

---

## 5. Final Checklist
- [ ] All components listed above are present and named correctly.
- [ ] Each component uses the correct color and text styles.
- [ ] All states/variants are included.
- [ ] Components are organized in frames by type.
- [ ] Accessibility and sizing are considered.

---

**If you get stuck:**
- Ask for help or look up Figma tutorials on YouTube (search "Figma components for beginners").
- Use the Figma "Assets" panel to drag and reuse your components on other pages.
- Use the "Comments" feature in Figma to ask questions or clarify design decisions.

**You’re building the foundation for the whole project—take your time and make it neat!** 