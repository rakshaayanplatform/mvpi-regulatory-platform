# Figma Guide: Designing Custom Components

This guide provides step-by-step instructions for designing the following custom components in Figma:

- File Uploader
- Breadcrumbs
- Stepper
- Chatbot Widget
- Pagination
- Map Widget

---

## 1. File Uploader

**Goal:** A box where users can drag and drop files or click to upload.

**Steps:**
1. Select the Frame tool (F) and draw a rectangle: **320x120px**.
2. Set the border to **2px dashed** (gray: #e5e7eb), and round the corners to **8px**.
3. Add a text label in the center:  
   `"Drag & drop a file here, or click to select"`
4. Add a simple icon above the text (e.g., upload arrow from Figma’s icon library).
5. Group all elements and name the group: `FileUploader/Default`.
6. (Optional) Create a variant for the "active" state (when dragging a file over):  
   - Change background to light blue (#f0f9ff).
   - Change border color to blue (#2563eb).

---

## 2. Breadcrumbs

**Goal:** Show navigation path, e.g., Home > Dashboard > Settings.

**Steps:**
1. Use the Text tool (T) to type the first breadcrumb, e.g., `"Home"`.
2. Add a right arrow (`>") after each breadcrumb except the last.
3. Continue with `"Dashboard"`, `"Settings"`, etc., separated by arrows.
4. Align all text and arrows horizontally with **8px spacing**.
5. Group all together and name: `Breadcrumbs/Default`.
6. (Optional) Use a lighter color for previous steps, and bold for the current page.

---

## 3. Stepper

**Goal:** Show progress through multiple steps (e.g., Step 1 > Step 2 > Step 3).

**Steps:**
1. Draw a **circle** (32x32px) for each step.
2. Inside each circle, add the step number (1, 2, 3, ...).
3. Use a **filled blue circle** (#2563eb) for completed/current steps, and gray (#e5e7eb) for upcoming steps.
4. Add a label below each circle (e.g., "Info", "Details", "Confirm").
5. Connect circles with a **horizontal line** (2px height, gray).
6. Group all together and name: `Stepper/Default`.
7. (Optional) Create variants for different current steps.

---

## 4. Chatbot Widget

**Goal:** A chat window for user and bot messages.

**Steps:**
1. Draw a **rounded rectangle**: **320x480px**, 16px corner radius, white background, subtle shadow.
2. Add a **header bar** at the top (height: 48px, blue background #2563eb, white text: "Chatbot").
3. Below the header, create a **message area** (leave most of the space empty).
4. Add a few sample message bubbles (rounded rectangles, left for bot, right for user, different colors).
5. At the bottom, add an **input box** (rectangle, 40px height) and a "Send" button.
6. Group all together and name: `ChatbotWidget/Default`.

---

## 5. Pagination

**Goal:** Controls to move between pages (e.g., 1 2 3 >).

**Steps:**
1. Draw a row of **circles or rectangles** (32x32px) for page numbers.
2. Add numbers inside (1, 2, 3, ...).
3. Highlight the current page (filled blue #2563eb, white text).
4. Add left (`<`) and right (`>`) arrows on each side.
5. Space all elements evenly (8px).
6. Group and name: `Pagination/Default`.

---

## 6. Map Widget

**Goal:** A placeholder for a map display.

**Steps:**
1. Draw a **rectangle**: **480x320px**, 16px corner radius.
2. Fill with a light gray (#f3f4f6).
3. Add a "Map" icon or a simple map illustration (can use Figma’s icon library or draw basic shapes).
4. Add a label in the center: `"Map Placeholder"`.
5. Group and name: `MapWidget/Default`.

---

**Tips:**
- Use Figma’s Auto Layout for easy resizing and spacing.
- Name all layers and groups clearly.
- Use consistent colors and fonts from your design system.
- Create variants for different states if needed (e.g., active, disabled).

---

You’re done! These custom components can now be reused across your Figma designs. 