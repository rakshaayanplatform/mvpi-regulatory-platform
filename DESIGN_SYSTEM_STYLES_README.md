# Rakshaayan Platform - Complete Figma Design Guide (Zero to Hero)

## Table of Contents
1. [Getting Started with Figma](#getting-started-with-figma)
2. [Design System Setup](#design-system-setup)
3. [Buttons - Complete Creation Guide](#buttons---complete-creation-guide)
4. [Inputs & Forms - Complete Creation Guide](#inputs--forms---complete-creation-guide)
5. [Cards - Complete Creation Guide](#cards---complete-creation-guide)
6. [Modals - Complete Creation Guide](#modals---complete-creation-guide)
7. [Alerts & Badges - Complete Creation Guide](#alerts--badges---complete-creation-guide)
8. [Tables - Complete Creation Guide](#tables---complete-creation-guide)
9. [Navigation - Complete Creation Guide](#navigation---complete-creation-guide)
10. [Avatars & Icons - Complete Creation Guide](#avatars--icons---complete-creation-guide)
11. [Dropdowns & Menus - Complete Creation Guide](#dropdowns--menus---complete-creation-guide)
12. [Loaders & Progress - Complete Creation Guide](#loaders--progress---complete-creation-guide)
13. [Notifications & Toasts - Complete Creation Guide](#notifications--toasts---complete-creation-guide)
14. [Chatbot Widget - Complete Creation Guide](#chatbot-widget---complete-creation-guide)
15. [Miscellaneous - Complete Creation Guide](#miscellaneous---complete-creation-guide)
16. [Prototyping Guide](#prototyping-guide)
17. [Component Library Management](#component-library-management)
18. [COMPLETE PLATFORM PAGES LIST](#complete-platform-pages-list)
19. [TECHNICAL IMPLEMENTATION NOTES](#technical-implementation-notes)
20. [NEXT STEPS](#next-steps)

---

## Getting Started with Figma

### What is Figma?
Figma is a web-based design tool that allows you to create user interfaces, prototypes, and design systems. Think of it like Photoshop but specifically for designing websites and apps.

### Basic Figma Interface
1. **Canvas**: The main white area where you design
2. **Toolbar**: Top bar with tools (Frame, Rectangle, Text, etc.)
3. **Properties Panel**: Right side panel for styling
4. **Layers Panel**: Left side panel showing your design structure
5. **Assets Panel**: Bottom panel for components and styles

### Essential Keyboard Shortcuts
- **F**: Frame tool
- **R**: Rectangle tool
- **T**: Text tool
- **V**: Move tool (default)
- **Ctrl/Cmd + C**: Copy
- **Ctrl/Cmd + V**: Paste
- **Ctrl/Cmd + D**: Duplicate
- **Shift + A**: Auto Layout

---

## Design System Setup

### Step 1: Create Color Styles
1. **Open Figma** and create a new file
2. **Create a new page** called "Design System"
3. **Draw rectangles** (R key) for each color and create styles:
   - **Color/Primary**: #2563eb
   - **Color/Secondary**: #22c55e
   - **Color/Accent**: #f59e42
   - **Color/Error**: #ef4444
   - **Color/Warning**: #f59e42
   - **Color/Info**: #2563eb
   - **Color/Success**: #22c55e
   - **Color/Disabled**: #cbd5e1
   - **Color/Background**: #f9fafb
   - **Color/Surface**: #ffffff
   - **Color/Overlay**: #000000 (8-16% opacity)

4. **Select each rectangle** and in the Properties panel:
   - Click the 4 dots next to Fill color
   - Click "Create style"
   - Name it exactly as shown above (e.g., "Color/Primary")

### Step 2: Create Text Styles
1. **Add text** (T key) with different sizes and create styles:
   - **Text/H1**: 36px, Bold (700), 1.125 line height (40.5px)
   - **Text/H2**: 28px, Bold (700), 1.143 line height (32px)
   - **Text/H3**: 22px, SemiBold (600), 1.182 line height (26px)
   - **Text/Body Large**: 18px, Regular (400), 1.333 line height (24px)
   - **Text/Body**: 16px, Regular (400), 1.5 line height (24px)
   - **Text/Body Small**: 14px, Regular (400), 1.429 line height (20px)
   - **Text/Button**: 16px, SemiBold (600), 1.25 line height (20px)
   - **Text/Caption**: 12px, Regular (400), 1.333 line height (16px)

2. **Select each text** and create styles:
   - Click the 4 dots next to font
   - Click "Create style"
   - Name it exactly as shown above (e.g., "Text/H1")

### Step 3: Create Components Page
1. **Add new page** called "Components"
2. **Create frames** (F key) for each component type:
   - Buttons
   - Inputs & Forms
   - Cards
   - Modals
   - Alerts & Badges
   - Tables
   - Navigation
   - Avatars & Icons
   - Dropdowns & Menus
   - Loaders & Progress
   - Notifications & Toasts
   - Chatbot Widget
   - Miscellaneous

---

## Component Variants and Properties - Complete Guide

### Understanding Component Variants in Figma

**What are Component Variants?**
Component variants are different versions of the same component that share the same base design but have different properties (like states, sizes, types). Think of them as different "flavors" of the same component.

**Why Use Variants?**
- **Organization**: Keep related components together
- **Consistency**: Maintain design system standards
- **Efficiency**: Easier to manage and update
- **Prototyping**: Better interaction flows

### Step-by-Step Variant Creation Process

#### Step 1: Create Your Base Component

**1.1 Design the Base Component**
1. **Create your component** (button, input, card, etc.)
2. **Apply all styling** (colors, typography, spacing)
3. **Use Auto Layout** for proper spacing
4. **Create the component** (Ctrl/Cmd + Alt + K)

**1.2 Name Your Component**
- Use consistent naming: `ComponentType/Variant/Size`
- Example: `Button/Primary/Large`, `Input/Text/Medium`

#### Step 2: Set Up Variant Properties

**2.1 Access Variant Properties**
1. **Select your component**
2. **In Properties panel**, find "Variant Properties" section
3. **Click the "+" button** to add a new property

**2.2 Add Property Types**
Create these common property types:

**Property 1: Type**
- **Property Name**: "Type"
- **Property Type**: "Variant"
- **Default Value**: "Primary" (or your main type)
- **Possible Values**: Primary, Secondary, Tertiary, etc.

**Property 2: State**
- **Property Name**: "State"
- **Property Type**: "Variant"
- **Default Value**: "Default"
- **Possible Values**: Default, Hover, Focus, Active, Disabled, Loading, Error, Success

**Property 3: Size**
- **Property Name**: "Size"
- **Property Type**: "Variant"
- **Default Value**: "Medium"
- **Possible Values**: Small, Medium, Large, Extra Large

**Property 4: Validation** (for inputs)
- **Property Name**: "Validation"
- **Property Type**: "Variant"
- **Default Value**: "None"
- **Possible Values**: None, Valid, Invalid, Required

#### Step 3: Create Variants

**3.1 Add Your First Variant**
1. **Select your base component**
2. **Right-click** and select "Add Variant"
3. **In Properties panel**, you'll see your variant properties
4. **Set the property values** for this variant

**3.2 Example: Creating Button Variants**

**Primary Button - Hover State:**
1. **Add variant** to your button
2. **Set properties**:
   - Type: "Primary"
   - State: "Hover"
   - Size: "Large"
3. **Change styling**:
   - Darker background color
   - Add shadow effect
   - Scale slightly (1.02x)

**Secondary Button - Default State:**
1. **Add variant** to your button
2. **Set properties**:
   - Type: "Secondary"
   - State: "Default"
   - Size: "Large"
3. **Change styling**:
   - Different background color
   - Different text color
   - Keep same dimensions

**3.3 Create All Necessary Variants**
For a complete button component, create these variants:

**Type Variants:**
- Primary (blue background)
- Secondary (green background)
- Tertiary (outline style)

**State Variants:**
- Default (normal state)
- Hover (mouse over)
- Focus (keyboard focus)
- Active (pressed)
- Disabled (not interactive)
- Loading (with spinner)

**Size Variants:**
- Small (120x36px)
- Medium (140x42px)
- Large (160x48px)

#### Step 4: Organize Your Variants

**4.1 Use Auto Layout for Organization**
1. **Select all your variants**
2. **Right-click** and select "Add Auto Layout"
3. **Set direction** to "Horizontal" or "Vertical"
4. **Set spacing** to 16px or 24px
5. **Align items** properly

**4.2 Add Labels and Documentation**
1. **Add text labels** above each group
2. **Use consistent naming**: "Primary Buttons", "Secondary Buttons"
3. **Add descriptions** for complex variants

#### Step 5: Test Your Variants

**5.1 Check Variant Properties**
1. **Select any variant**
2. **In Properties panel**, verify all properties are set correctly
3. **Make sure** no properties are missing or incorrect

**5.2 Test in Different Contexts**
1. **Use variants** in different frames
2. **Test interactions** between variants
3. **Verify** all styling is consistent

### Advanced Variant Techniques

#### Boolean Properties
**What are Boolean Properties?**
Boolean properties are true/false properties that can be toggled on/off.

**Example: Button with Icon**
1. **Add Boolean Property**: "Has Icon"
2. **Default Value**: false
3. **Create variants**:
   - Has Icon: true (shows icon)
   - Has Icon: false (no icon)

#### Instance Properties
**What are Instance Properties?**
Instance properties allow you to change text, colors, or other values without creating new variants.

**Example: Button Text**
1. **Add Instance Property**: "Text"
2. **Property Type**: "Text"
3. **Default Value**: "Submit"
4. **Users can change** the text without creating new variants

#### Component Properties
**What are Component Properties?**
Component properties allow you to swap out entire components within a variant.

**Example: Button with Different Icons**
1. **Add Component Property**: "Icon"
2. **Property Type**: "Component"
3. **Default Value**: None
4. **Users can swap** different icons

### Best Practices for Variants

#### 1. Naming Conventions
- **Use consistent naming**: `Component/Type/State/Size`
- **Be descriptive**: `Button/Primary/Hover/Large`
- **Use proper capitalization**: Start with capital letters

#### 2. Property Organization
- **Group related properties**: Type, State, Size
- **Use logical order**: Most important first
- **Keep it simple**: Don't over-complicate with too many properties

#### 3. Variant Management
- **Create all necessary variants**: Don't skip important states
- **Test thoroughly**: Make sure all variants work correctly
- **Document usage**: Add notes about when to use each variant

#### 4. Performance Considerations
- **Limit variant count**: Too many variants can slow down Figma
- **Use instance properties**: For simple text/color changes
- **Group related variants**: Keep similar variants together

### Common Variant Patterns

#### Button Component Pattern
```
Button Component
├── Type: Primary, Secondary, Tertiary
├── State: Default, Hover, Focus, Active, Disabled, Loading
└── Size: Small, Medium, Large
```

#### Input Component Pattern
```
Input Component
├── Type: Text, Textarea, Select, Password
├── State: Default, Focus, Error, Success, Disabled
├── Size: Small, Medium, Large
└── Validation: None, Valid, Invalid, Required
```

#### Card Component Pattern
```
Card Component
├── Type: Default, Interactive, Stats, Image
├── State: Default, Hover, Focus, Selected
└── Size: Small, Medium, Large
```

### Troubleshooting Variants

#### Issue: Variants Not Working
- **Check property names**: Make sure they match exactly
- **Verify property types**: Should be "Variant" type
- **Check default values**: Ensure they're set correctly

#### Issue: Too Many Variants
- **Use instance properties**: For simple text/color changes
- **Combine similar variants**: If they're very similar
- **Use component properties**: For swapping entire elements

#### Issue: Variants Not Updating
- **Check component hierarchy**: Make sure you're editing the right component
- **Verify connections**: Ensure variants are properly connected
- **Test in context**: Check how variants work in actual use

### Variant Documentation

#### Document Your Variants
1. **Add descriptions** to each variant
2. **Include usage examples**
3. **Document when to use each variant**
4. **Add accessibility notes**

#### Share Variants with Team
1. **Publish your component library**
2. **Add version notes**
3. **Communicate changes**
4. **Provide training materials**

---

## Buttons - Complete Creation Guide

### Understanding Components and Variants in Figma

**What is a Component?**
- A component is a reusable design element (like a button, input, card)
- Once created, you can use it multiple times throughout your design
- Changes to the main component automatically update all instances

**What are Variants?**
- Variants are different versions of the same component (like different states or types)
- Examples: Button states (Default, Hover, Disabled) or Button types (Primary, Secondary)
- Variants help organize related components and make them easier to manage

**Variant Properties Explained:**
- **Type**: Different styles (Primary, Secondary, Tertiary)
- **State**: Different interactions (Default, Hover, Focus, Disabled, Loading)
- **Size**: Different dimensions (Small, Medium, Large)

### Step-by-Step Button Creation with Variants

#### Step 1: Create the Base Button Component

**1.1 Create the Button Shape**
1. **Select Frame tool** (F key) or Rectangle tool (R key)
2. **Draw a rectangle** on the canvas
3. **In Properties panel**, set exact dimensions:
   - Width: 160px
   - Height: 48px
4. **Apply styling**:
   - Fill: **Color/Primary** style (#2563eb)
   - Border Radius: 8px (top right corner of Properties panel)
   - Stroke: None

**1.2 Add Text**
1. **Select Text tool** (T key)
2. **Click inside the button** and type "Submit"
3. **Select the text** and in Properties panel:
   - Apply **Text/Button** style (16px, SemiBold, 1.2 line height)
   - Color: **Color/Text Inverse** (white text on colored backgrounds)
   - Text Align: Center

**1.3 Center Text in Button**
1. **Select both** the button rectangle and text
2. **Right-click** and select "Add Auto Layout"
3. **In Properties panel** (Auto Layout section):
   - Direction: Horizontal
   - Alignment: Center
   - Padding: 16px (all sides)

**1.4 Create the Main Component**
1. **Select the entire button** (rectangle + text)
2. **Right-click** and select "Create Component" (or Ctrl/Cmd + Alt + K)
3. **Name it**: "Button/Primary/Large"
4. **You'll see a purple diamond icon** indicating it's now a component

#### Step 2: Create Variant Properties

**2.1 Set Up Variant Properties**
1. **Select your button component**
2. **In the Properties panel**, find the "Variant Properties" section
3. **Click the "+" button** to add a new property
4. **Add these properties one by one**:

   **Property 1: Type**
   - Property Name: "Type"
   - Property Type: "Variant"
   - Default Value: "Primary"

   **Property 2: State**
   - Property Name: "State"
   - Property Type: "Variant"
   - Default Value: "Default"

   **Property 3: Size**
   - Property Name: "Size"
   - Property Type: "Variant"
   - Default Value: "Large"

#### Step 3: Create State Variants (Default, Hover, Focus, Disabled, Loading)

**3.1 Create Hover State Variant**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **In Properties panel**, you'll see the variant properties
4. **Set the properties**:
   - Type: "Primary"
   - State: "Hover"
   - Size: "Large"
5. **Change the styling**:
   - Fill: Darker blue (#1d4ed8) - or create a hover variant of Color/Primary
   - Add shadow effect: **Shadow/Small** style (0px 1px 4px rgba(0,0,0,0.08))

**3.2 Create Focus State Variant**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **Set the properties**:
   - Type: "Primary"
   - State: "Focus"
   - Size: "Large"
4. **Change the styling**:
   - Add focus ring: 2px solid #2563eb
   - Keep original fill color

**3.3 Create Disabled State Variant**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **Set the properties**:
   - Type: "Primary"
   - State: "Disabled"
   - Size: "Large"
4. **Change the styling**:
   - Fill: **Color/Disabled** style (#cbd5e1)
   - Text color: **Color/Text Disabled** style (#64748b)
   - Opacity: 50%

**3.4 Create Loading State Variant**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **Set the properties**:
   - Type: "Primary"
   - State: "Loading"
   - Size: "Large"
4. **Add loading spinner**:
   - Draw a circle (24x24px) next to the text
   - Remove fill, add stroke (2px, white)
   - Position it to the left of the text
   - Use Auto Layout to space them properly

#### Step 4: Create Type Variants (Primary, Secondary, Tertiary)

**4.1 Create Secondary Type Variant**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **Set the properties**:
   - Type: "Secondary"
   - State: "Default"
   - Size: "Large"
4. **Change the styling**:
   - Fill: **Color/Secondary** style (#22c55e)
   - Text: "Cancel"
   - Keep all other properties the same

**4.2 Create Tertiary Type Variant**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **Set the properties**:
   - Type: "Tertiary"
   - State: "Default"
   - Size: "Large"
4. **Change the styling**:
   - Fill: Transparent
   - Stroke: **Color/Border** style (#e5e7eb)
   - Text color: **Color/Text Primary** style (#1e293b)
   - Text: "Back"

#### Step 5: Create Size Variants (Small, Medium, Large)

**5.1 Create Small Size Variant**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **Set the properties**:
   - Type: "Primary"
   - State: "Default"
   - Size: "Small"
4. **Change the dimensions**:
   - Width: 120px
   - Height: 36px
   - Padding: 12px (all sides)
   - Text: "Add"

**5.2 Create Medium Size Variant**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **Set the properties**:
   - Type: "Primary"
   - State: "Default"
   - Size: "Medium"
4. **Change the dimensions**:
   - Width: 140px
   - Height: 42px
   - Padding: 14px (all sides)
   - Text: "Save"

#### Step 6: Create All Combinations

**6.1 Complete the Variant Matrix**
You need to create variants for all combinations:
- Primary + Default + Small/Medium/Large
- Primary + Hover + Small/Medium/Large
- Primary + Focus + Small/Medium/Large
- Primary + Disabled + Small/Medium/Large
- Primary + Loading + Small/Medium/Large
- Secondary + Default + Small/Medium/Large
- Secondary + Hover + Small/Medium/Large
- Secondary + Focus + Small/Medium/Large
- Secondary + Disabled + Small/Medium/Large
- Secondary + Loading + Small/Medium/Large
- Tertiary + Default + Small/Medium/Large
- Tertiary + Hover + Small/Medium/Large
- Tertiary + Focus + Small/Medium/Large
- Tertiary + Disabled + Small/Medium/Large

**6.2 Quick Method to Create All Variants**
1. **Select your main component**
2. **Right-click** and select "Add Variant" multiple times
3. **For each variant**, set the appropriate properties
4. **Use the Properties panel** to quickly change Type, State, and Size values

#### Step 7: Organize Your Button Component

**7.1 Create a Button Frame**
1. **Create a new frame** (F key) called "Buttons"
2. **Place all your button variants** in this frame
3. **Add Auto Layout** to the frame for neat organization
4. **Set spacing** to 16px between buttons

**7.2 Add Labels**
1. **Add text labels** above each group of buttons
2. **Use Text/H3 style** for section headers
3. **Label groups**: "Primary Buttons", "Secondary Buttons", "Tertiary Buttons"

### Button Component Specifications

**Final Button Component Structure:**
```
Button Component
├── Type Variants: Primary, Secondary, Tertiary
├── State Variants: Default, Hover, Focus, Disabled, Loading
└── Size Variants: Small (120x36px), Medium (140x42px), Large (160x48px)
```

**Total Variants:** 15 variants (3 types × 5 states × 1 size, but you can expand to 45 if you create all size combinations)

#### Step 2: Create Button Variants (States)

**2.1 Create Hover State**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **In Properties panel**, set Variant property:
   - Property: "State"
   - Value: "Hover"
4. **Change the fill color** to a darker blue (#1d4ed8) - or create a hover variant of Color/Primary
5. **Add hover effect**:
   - Select the rectangle
   - In Properties panel, add Effect
   - Apply **Shadow/Small** style (0px 1px 4px rgba(0,0,0,0.08))

**2.2 Create Disabled State**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **Set Variant property**:
   - Property: "State"
   - Value: "Disabled"
4. **Change styling**:
   - Fill: **Color/Disabled** style (#cbd5e1)
   - Text color: **Color/Text Disabled** style (#cbd5e1)
   - Opacity: 50%

**2.3 Create Loading State**
1. **Select your button component**
2. **Right-click** and select "Add Variant"
3. **Set Variant property**:
   - Property: "State"
   - Value: "Loading"
4. **Add loading spinner**:
   - Draw a circle (24x24px)
   - Remove fill, add stroke (2px, white)
   - Add rotation animation (we'll do this in prototyping)

#### Step 3: Create Small Primary Button (120x36px)

**3.1 Duplicate and Resize**
1. **Select your large button component**
2. **Duplicate** (Ctrl/Cmd + D)
3. **Resize** to 120x36px
4. **Change text** to "Add"
5. **Adjust padding** to 12px
6. **Rename component** to "Button/Primary/Small"

#### Step 4: Create Secondary Button

**4.1 Create Secondary Variant**
1. **Select your primary button**
2. **Right-click** and select "Add Variant"
3. **Set Variant property**:
   - Property: "Type"
   - Value: "Secondary"
4. **Change styling**:
   - Fill: Secondary Green (#22c55e)
   - Text: "Cancel"

#### Step 5: Create All Button Sizes

**5.1 Complete Button Set**
Create these variants:
- Button/Primary/Large (160x48px) - "Submit"
- Button/Primary/Small (120x36px) - "Add"
- Button/Secondary/Large (160x48px) - "Cancel"
- Button/Secondary/Small (120x36px) - "Back"

**5.2 Organize in Frame**
1. **Create a frame** called "Buttons"
2. **Place all button variants** in the frame
3. **Add Auto Layout** to the frame for neat organization
4. **Add labels** for each button type

### Button Specifications Summary

---

## Inputs & Forms - Complete Creation Guide

### Understanding Input Components and Variants

**Input Component Types:**
- **Text Input**: Single line text entry
- **Textarea**: Multi-line text entry
- **Select/Dropdown**: Choose from options
- **Checkbox**: Binary choice
- **Radio Button**: Single choice from group
- **Switch/Toggle**: On/Off state
- **File Upload**: File selection
- **Date Picker**: Date selection

**Input Variant Properties:**
- **Type**: Text, Textarea, Select, Checkbox, Radio, Switch, File, Date
- **State**: Default, Focus, Error, Success, Disabled
- **Size**: Small, Medium, Large
- **Validation**: Valid, Invalid, Required

### Step-by-Step Text Input Creation with Variants

#### Step 1: Create the Base Text Input Component

**1.1 Create Input Container**
1. **Select Rectangle tool** (R key)
2. **Draw a rectangle** on the canvas
3. **Set dimensions** in Properties panel:
   - Width: 360px
   - Height: 48px
4. **Apply styling**:
   - Fill: **Color/Surface** style (#ffffff)
   - Stroke: **Color/Border** style (#e5e7eb)
   - Stroke Width: 1px
   - Border Radius: 8px

**1.2 Add Placeholder Text**
1. **Select Text tool** (T key)
2. **Click inside the input** and type "Enter your name"
3. **Style the text**:
   - Apply **Text/Body** style (16px, Regular, 1.5 line height)
   - Color: **Color/Text Muted** style (#64748b)

**1.3 Position Text**
1. **Select both** rectangle and text
2. **Right-click** and select "Add Auto Layout"
3. **Set Auto Layout properties**:
   - Direction: Horizontal
   - Alignment: Left
   - Padding: 16px (left), 16px (right), 12px (top), 12px (bottom)

**1.4 Create the Main Component**
1. **Select the entire input** (rectangle + text)
2. **Right-click** and select "Create Component"
3. **Name it**: "Input/Text/Large"

#### Step 2: Set Up Variant Properties

**2.1 Add Variant Properties**
1. **Select your input component**
2. **In Properties panel**, find "Variant Properties"
3. **Click "+" to add properties**:

   **Property 1: Type**
   - Property Name: "Type"
   - Property Type: "Variant"
   - Default Value: "Text"

   **Property 2: State**
   - Property Name: "State"
   - Property Type: "Variant"
   - Default Value: "Default"

   **Property 3: Size**
   - Property Name: "Size"
   - Property Type: "Variant"
   - Default Value: "Large"

   **Property 4: Validation**
   - Property Name: "Validation"
   - Property Type: "Variant"
   - Default Value: "None"

#### Step 3: Create State Variants

**3.1 Create Focus State Variant**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set properties**:
   - Type: "Text"
   - State: "Focus"
   - Size: "Large"
   - Validation: "None"
4. **Change styling**:
   - Stroke: **Color/Border Focus** style (#2563eb)
   - Stroke Width: 2px
   - Text color: **Color/Text Primary** style (#1e293b)

**3.2 Create Error State Variant**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set properties**:
   - Type: "Text"
   - State: "Error"
   - Size: "Large"
   - Validation: "Invalid"
4. **Change styling**:
   - Stroke: **Color/Border Error** style (#ef4444)
   - Stroke Width: 1px
5. **Add error message**:
   - Add text below input: "This field is required"
   - Apply **Text/Body Small** style (14px, Regular, 1.5 line height)
   - Color: **Color/Text Error** style (#ef4444)

**3.3 Create Success State Variant**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set properties**:
   - Type: "Text"
   - State: "Success"
   - Size: "Large"
   - Validation: "Valid"
4. **Change styling**:
   - Stroke: **Color/Border Success** style (#22c55e)
   - Stroke Width: 1px
5. **Add success icon**:
   - Add checkmark icon (✓) on the right side
   - Color: **Color/Success** style (#22c55e)

**3.4 Create Disabled State Variant**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set properties**:
   - Type: "Text"
   - State: "Disabled"
   - Size: "Large"
   - Validation: "None"
4. **Change styling**:
   - Fill: **Color/Background** style (#f9fafb)
   - Stroke: **Color/Border** style (#e5e7eb)
   - Text color: **Color/Text Disabled** style (#cbd5e1)

#### Step 4: Create Size Variants

**4.1 Create Medium Size Variant**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set properties**:
   - Type: "Text"
   - State: "Default"
   - Size: "Medium"
   - Validation: "None"
4. **Change dimensions**:
   - Width: 280px
   - Height: 40px
   - Padding: 12px (all sides)
   - Placeholder: "Search..."

**4.2 Create Small Size Variant**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set properties**:
   - Type: "Text"
   - State: "Default"
   - Size: "Small"
   - Validation: "None"
4. **Change dimensions**:
   - Width: 200px
   - Height: 32px
   - Padding: 8px (all sides)
   - Placeholder: "Filter..."

#### Step 5: Create Different Input Types

**5.1 Create Textarea Variant**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set properties**:
   - Type: "Textarea"
   - State: "Default"
   - Size: "Large"
   - Validation: "None"
4. **Change styling**:
   - Height: 120px (taller for multi-line)
   - Add multiple lines of placeholder text
   - Resize text area appropriately

**5.2 Create Select/Dropdown Variant**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set properties**:
   - Type: "Select"
   - State: "Default"
   - Size: "Large"
   - Validation: "None"
4. **Add dropdown elements**:
   - Add arrow icon (▼) on the right
   - Change placeholder to "Select option"
   - Add dropdown menu below (for open state)

**5.3 Create Password Input Variant**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set properties**:
   - Type: "Password"
   - State: "Default"
   - Size: "Large"
   - Validation: "None"
4. **Add password elements**:
   - Change placeholder to "Enter password"
   - Add eye icon (👁️) on the right for show/hide
   - Use dots (••••••) for password text

#### Step 6: Create Checkbox Component

**6.1 Create Base Checkbox**
1. **Select Rectangle tool** (R key)
2. **Draw a square** (24x24px)
3. **Apply styling**:
   - Fill: **Color/Surface** style (#ffffff)
   - Stroke: **Color/Border** style (#e5e7eb)
   - Stroke Width: 1px
   - Border Radius: 4px
4. **Create component** and name it "Input/Checkbox"

**6.2 Add Checkbox Variants**
1. **Add variant properties**:
   - State: Default, Checked, Disabled
   - Size: Small (20x20px), Medium (24x24px), Large (28x28px)
2. **Create Checked state**:
   - Add checkmark icon (✓) inside
   - Fill: **Color/Primary** style (#2563eb)
   - Stroke: **Color/Primary** style (#2563eb)
3. **Create Disabled state**:
   - Fill: **Color/Background** style (#f9fafb)
   - Stroke: **Color/Border** style (#d1d5db)

#### Step 7: Create Radio Button Component

**7.1 Create Base Radio Button**
1. **Select Ellipse tool** (O key)
2. **Draw a circle** (24x24px)
3. **Apply styling**:
   - Fill: **Color/Surface** style (#ffffff)
   - Stroke: **Color/Border** style (#e5e7eb)
   - Stroke Width: 1px
4. **Create component** and name it "Input/Radio"

**7.2 Add Radio Button Variants**
1. **Add variant properties**:
   - State: Default, Selected, Disabled
   - Size: Small (20x20px), Medium (24x24px), Large (28x28px)
2. **Create Selected state**:
   - Add inner circle (12x12px) inside
   - Fill: **Color/Primary** style (#2563eb)
3. **Create Disabled state**:
   - Fill: **Color/Background** style (#f9fafb)
   - Stroke: **Color/Border** style (#d1d5db)

#### Step 8: Create Switch/Toggle Component

**8.1 Create Base Switch**
1. **Draw rectangle** (48x24px) for track
2. **Apply styling**:
   - Fill: **Color/Disabled** style (#cbd5e1)
   - Border Radius: 12px
3. **Add handle**:
   - Draw circle (20x20px)
   - Position on left side
   - Fill: **Color/Surface** style (#ffffff)
   - Add **Shadow/Small** style
4. **Create component** and name it "Input/Switch"

**8.2 Add Switch Variants**
1. **Add variant properties**:
   - State: Off, On, Disabled
   - Size: Small (40x20px), Medium (48x24px), Large (56x28px)
2. **Create On state**:
   - Track fill: **Color/Primary** style (#2563eb)
   - Move handle to right side
3. **Create Disabled state**:
   - Track fill: **Color/Background** style (#f9fafb)
   - Handle opacity: 50%

### Input Component Specifications

**Final Input Component Structure:**
```
Input Components
├── Text Input
│   ├── Type: Text, Textarea, Select, Password
│   ├── State: Default, Focus, Error, Success, Disabled
│   └── Size: Small, Medium, Large
├── Checkbox
│   ├── State: Default, Checked, Disabled
│   └── Size: Small, Medium, Large
├── Radio Button
│   ├── State: Default, Selected, Disabled
│   └── Size: Small, Medium, Large
└── Switch
    ├── State: Off, On, Disabled
    └── Size: Small, Medium, Large
```

#### Step 2: Create Input States (Variants)

**2.1 Focus State**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set Variant property**:
   - Property: "State"
   - Value: "Focus"
4. **Change styling**:
   - Stroke: **Color/Border Focus** style (#2563eb)
   - Stroke Width: 2px
5. **Change text color** to **Color/Text Primary** style (#1e293b)

**2.2 Error State**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set Variant property**:
   - Property: "State"
   - Value: "Error"
4. **Change styling**:
   - Stroke: **Color/Border Error** style (#ef4444)
   - Stroke Width: 1px
5. **Add error text**:
   - Add text below input: "This field is required"
   - Apply **Text/Body Small** style (14px, Regular, 1.5 line height)
   - Color: **Color/Text Error** style (#ef4444)

**2.3 Disabled State**
1. **Select your input component**
2. **Right-click** and select "Add Variant"
3. **Set Variant property**:
   - Property: "State"
   - Value: "Disabled"
4. **Change styling**:
   - Fill: **Color/Background** style (#f9fafb)
   - Stroke: **Color/Border** style (#e5e7eb)
   - Text color: **Color/Text Disabled** style (#cbd5e1)

#### Step 3: Create Small Text Input (240x36px)

**3.1 Duplicate and Resize**
1. **Select your large input component**
2. **Duplicate** (Ctrl/Cmd + D)
3. **Resize** to 240x36px
4. **Change placeholder** to "Search..."
5. **Adjust padding** to 12px
6. **Rename component** to "Input/Text/Small"

#### Step 4: Create Checkbox (24x24px)

**4.1 Create Checkbox Shape**
1. **Select Rectangle tool** (R key)
2. **Draw a square** (24x24px)
3. **Apply styling**:
   - Fill: **Color/Surface** style (#ffffff)
   - Stroke: **Color/Border** style (#e5e7eb)
   - Stroke Width: 1px
   - Border Radius: 4px

**4.2 Create Checked State**
1. **Select the checkbox**
2. **Right-click** and select "Create Component"
3. **Add Variant** for checked state
4. **Set Variant property**:
   - Property: "State"
   - Value: "Checked"
5. **Add checkmark**:
   - Draw a checkmark icon (✓) or use an icon
   - Color: **Color/Primary** style (#2563eb)
   - Size: 16x16px

**4.3 Create Disabled State**
1. **Add another variant**
2. **Set Variant property**:
   - Property: "State"
   - Value: "Disabled"
3. **Change styling**:
   - Fill: Background Gray (#f9fafb)
   - Stroke: Light gray (#d1d5db)

#### Step 5: Create Radio Button (24x24px)

**5.1 Create Radio Shape**
1. **Select Ellipse tool** (O key)
2. **Draw a circle** (24x24px)
3. **Apply styling**:
   - Fill: **Color/Surface** style (#ffffff)
   - Stroke: **Color/Border** style (#e5e7eb)
   - Stroke Width: 1px

**5.2 Create Selected State**
1. **Create component** and add variant
2. **Set Variant property**:
   - Property: "State"
   - Value: "Selected"
3. **Add inner circle**:
   - Draw smaller circle (12x12px) inside
   - Fill: **Color/Primary** style (#2563eb)

#### Step 6: Create Dropdown (240x48px)

**6.1 Create Dropdown Container**
1. **Draw rectangle** (240x48px)
2. **Apply styling**:
   - Fill: **Color/Surface** style (#ffffff)
   - Stroke: **Color/Border** style (#e5e7eb)
   - Border Radius: 8px

**6.2 Add Content**
1. **Add placeholder text**: "Select option"
2. **Add arrow icon** (▼) on the right
3. **Use Auto Layout** with space between text and arrow

**6.3 Create Open State**
1. **Add variant** for "Open" state
2. **Add dropdown menu** below:
   - Rectangle with options
   - Shadow effect
   - Border radius: 8px

#### Step 7: Create File Uploader (320x120px)

**7.1 Create Upload Area**
1. **Draw rectangle** (320x120px)
2. **Apply styling**:
   - Fill: **Color/Background** style (#f9fafb)
   - Stroke: **Color/Border** style (#e5e7eb)
   - Stroke Width: 2px
   - Stroke Style: Dashed
   - Border Radius: 8px

**7.2 Add Content**
1. **Add upload icon** (cloud with arrow)
2. **Add text**: "Drag and drop files here"
3. **Add subtitle**: "or click to browse"
4. **Use Auto Layout** to center content

**7.3 Create Drag Over State**
1. **Add variant** for "Drag Over"
2. **Change styling**:
   - Fill: Light blue (#dbeafe) - or create a hover variant of Color/Background
   - Stroke: **Color/Primary** style (#2563eb)

#### Step 8: Create Switch/Toggle (48x24px)

**8.1 Create Switch Track**
1. **Draw rectangle** (48x24px)
2. **Apply styling**:
   - Fill: **Color/Disabled** style (#cbd5e1)
   - Border Radius: 12px

**8.2 Create Switch Handle**
1. **Draw circle** (20x20px)
2. **Position** on the left side
3. **Apply styling**:
   - Fill: **Color/Surface** style (#ffffff)
   - Apply **Shadow/Small** style (0px 1px 4px rgba(0,0,0,0.08))

**8.3 Create On State**
1. **Add variant** for "On" state
2. **Change track color** to **Color/Primary** style (#2563eb)
3. **Move handle** to the right side

#### Step 9: Create Calendar (320x360px)

**9.1 Create Calendar Container**
1. **Draw rectangle** (320x360px)
2. **Apply styling**:
   - Fill: **Color/Surface** style (#ffffff)
   - Stroke: **Color/Border** style (#e5e7eb)
   - Border Radius: 8px
   - Apply **Shadow/Medium** style (0px 4px 16px rgba(0,0,0,0.12))

**9.2 Add Header**
1. **Add month/year text**: "December 2024"
2. **Add navigation arrows** (← →)
3. **Add day labels**: "Sun Mon Tue Wed Thu Fri Sat"

**9.3 Add Date Grid**
1. **Create 7x6 grid** of date cells
2. **Each cell**: 40x40px
3. **Add numbers** 1-31
4. **Style current date** differently

### Input Specifications Summary

---

## Cards - Complete Creation Guide

### Step-by-Step Card Creation

#### Step 1: Create Default Card (320x180px)

**1.1 Create Card Container**
1. **Select Rectangle tool** (R key)
2. **Draw a rectangle** on the canvas
3. **Set dimensions** in Properties panel:
   - Width: 320px
   - Height: 180px
4. **Apply styling**:
   - Fill: **Color/Surface** style (#ffffff)
   - Stroke: None
   - Border Radius: 16px

**1.2 Add Shadow Effect**
1. **Select the card rectangle**
2. **In Properties panel**, click "Effects" (bottom section)
3. **Click the "+" button** to add effect
4. **Select "Drop Shadow"**
5. **Apply Shadow/Small style**:
   - Apply **Shadow/Small** style (0px 1px 4px rgba(0,0,0,0.08))

**1.3 Add Card Content**
1. **Add title text**: "Card Title"
   - Apply **Text/H3** style (22px, SemiBold, 1.2 line height)
   - Color: **Color/Text Primary** style (#1e293b)
2. **Add body text**: "This is a sample card with some content to demonstrate the layout and styling."
   - Apply **Text/Body Small** style (14px, Regular, 1.5 line height)
   - Color: **Color/Text Muted** style (#64748b)

**1.4 Organize Content with Auto Layout**
1. **Select all elements** (rectangle + title + body text)
2. **Right-click** and select "Add Auto Layout"
3. **Set Auto Layout properties**:
   - Direction: Vertical
   - Alignment: Left
   - Padding: 16px (all sides)
   - Spacing: 8px (between title and body)

**1.5 Create Component**
1. **Select the entire card** (container + content)
2. **Right-click** and select "Create Component"
3. **Name it**: "Card/Default"

#### Step 2: Create Card Variants

**2.1 Create Hover State**
1. **Select your card component**
2. **Right-click** and select "Add Variant"
3. **Set Variant property**:
   - Property: "State"
   - Value: "Hover"
4. **Enhance shadow**:
   - Increase blur to 16px
   - Increase opacity to 12%
5. **Add subtle scale effect** (we'll animate this in prototyping)

**2.2 Create Interactive Card**
1. **Add another variant**
2. **Set Variant property**:
   - Property: "Type"
   - Value: "Interactive"
3. **Add cursor pointer** (we'll set this in prototyping)
4. **Add focus ring** for accessibility

#### Step 3: Create Different Card Types

**3.1 Create Image Card**
1. **Duplicate** your default card
2. **Add image placeholder** (160x120px) at the top
3. **Adjust content** to fit below image
4. **Rename component** to "Card/With Image"

**3.2 Create Action Card**
1. **Duplicate** your default card
2. **Add button** at the bottom
3. **Adjust spacing** to accommodate button
4. **Rename component** to "Card/With Action"

**3.3 Create Stats Card**
1. **Create new card** with different layout
2. **Add large number** (e.g., "1,234")
3. **Add label** below number
4. **Add icon** or trend indicator
5. **Rename component** to "Card/Stats"

### Card Specifications Summary

---

## Modals

### Default Modal
- **Dimensions**: 480x320px
- **Background**: White
- **Shadow**: Prominent drop shadow
- **Border Radius**: 16px
- **Content**: Title, body text, close button (top right)
- **Close Button**: 24x24px, "×" symbol

---

## Alerts & Badges

### Alerts
- **Dimensions**: 320x56px
- **Success Alert**: Green background (#22c55e), white text
- **Error Alert**: Red background (#ef4444), white text
- **Warning Alert**: Orange background (#f97316), white text
- **Info Alert**: Blue background (#3b82f6), white text
- **Border Radius**: 8px
- **Content**: Icon + message text

### Badges/Tags
- **Dimensions**: 64x24px
- **Text**: "Active", "Pending", "Completed", "Draft"
- **Border Radius**: 12px
- **Colors**: Various status colors
- **Font Size**: Small

---

## Tables

### Table Row
- **Dimensions**: 100% width x 48px
- **Border**: Light border at bottom
- **Sample Columns**: Name, Status, Date, Actions
- **Background**: White
- **Hover State**: Light gray background

---

## Navigation

### Navbar
- **Dimensions**: 100% width x 64px
- **Background**: Blue (#2563eb)
- **Text**: White
- **Content**: Logo, navigation links, user menu
- **Shadow**: Subtle bottom shadow

### Sidebar
- **Dimensions**: 240px wide, full height
- **Background**: White or light gray
- **Content**: Vertical menu items
- **Border**: Right border for separation

### Tabs
- **Dimensions**: 120x40px each
- **Layout**: Horizontal row
- **States**: Active (blue), Inactive (gray)
- **Border**: Bottom border for active tab

### Breadcrumbs
- **Dimensions**: 320x32px
- **Layout**: Horizontal
- **Separator**: ">" symbol
- **Example**: "Home > Dashboard > Reports"

---

## Avatars & Icons

### Avatar
- **Dimensions**: 40x40px
- **Shape**: Circle
- **Content**: User image or initials
- **Border**: Optional subtle border

### Icons
- **Dimensions**: 24x24px
- **Style**: Outline or filled
- **Sources**: Heroicons, Feather Icons
- **Colors**: Inherit from parent or specific colors

---

## Dropdowns & Menus

### Dropdown
- **Dimensions**: 240x48px
- **Arrow Icon**: Required
- **Sample Options**: "Option 1", "Option 2", "Option 3"
- **States**: Default, Open, Disabled

### Menu
- **Dimensions**: 240px wide, variable height
- **Layout**: Vertical list
- **Items**: Menu options with icons/text
- **Hover State**: Light background

---

## Loaders & Progress

### Loader/Spinner
- **Dimensions**: 32x32px
- **Style**: Circular spinner or dots
- **Animation**: Rotating or pulsing
- **Color**: Blue (#2563eb)

### Progress Bar
- **Dimensions**: 320x16px
- **Background**: Light gray
- **Fill**: Blue (#2563eb)
- **Border Radius**: 8px
- **Text**: Optional percentage

### Stepper
- **Dimensions**: 320x48px
- **Elements**: Circles with numbers/steps
- **Connectors**: Lines between steps
- **States**: Completed, Current, Pending

---

## Notifications & Toasts

### Toast
- **Dimensions**: 320x56px
- **Background**: Colored based on type
- **Text**: White
- **Close Icon**: 16x16px "×" symbol
- **Border Radius**: 8px
- **Types**: Success, Error, Warning, Info

---

## Chatbot Widget

### Widget Container
- **Dimensions**: 320x480px
- **Background**: White
- **Border Radius**: 16px
- **Shadow**: Drop shadow
- **Header**: Title "Chat Support"
- **Message Area**: Scrollable chat messages
- **Input Area**: Text input at bottom
- **Send Button**: 32x32px

---

## Miscellaneous

### Pagination
- **Dimensions**: 320x48px
- **Elements**: Previous/Next arrows, page numbers
- **Active State**: Blue background
- **Inactive State**: Gray text

### Tooltip
- **Dimensions**: 200x40px
- **Background**: Dark gray
- **Text**: White
- **Border Radius**: 6px
- **Arrow**: Pointing to trigger element

### Divider
- **Dimensions**: 100% width x 2px
- **Color**: Gray (#e5e7eb)
- **Style**: Horizontal line

### Accordion
- **Header**: 320x48px
- **Content**: Expandable area
- **Icon**: Chevron down/up
- **States**: Collapsed, Expanded

### Slider
- **Dimensions**: 320x32px
- **Track**: Gray background
- **Handle**: 20x20px circle
- **Fill**: Blue progress
- **Border Radius**: 16px

### Map Widget
- **Dimensions**: 480x320px
- **Background**: Light gray placeholder
- **Border**: 1px solid #e5e7eb
- **Border Radius**: 8px
- **Content**: "Map placeholder" text

### FileUploader
- **Dimensions**: 320x120px
- **Border**: 2px dashed #e5e7eb
- **Border Radius**: 8px
- **Text**: "Drag and drop files here"
- **Icon**: Upload icon
- **States**: Default, Drag Over, Uploading

---

## Design System Styles Reference

### Color Styles (Apply to Rectangles)
- **Color/Primary**: #2563eb (Main actions, buttons, links, headers)
- **Color/Secondary**: #22c55e (Success, confirmations, positive highlights)
- **Color/Accent**: #f59e42 (Warnings, highlights, call-to-action)
- **Color/Error**: #ef4444 (Error backgrounds, error alerts)
- **Color/Warning**: #f59e42 (Warnings, alerts)
- **Color/Info**: #2563eb (Info alerts, badges)
- **Color/Success**: #22c55e (Success alerts, badges)
- **Color/Disabled**: #cbd5e1 (Disabled states)
- **Color/Background**: #f9fafb (App/page background)
- **Color/Surface**: #ffffff (Card, modal, surface backgrounds)
- **Color/Overlay**: #000000 (8-16% opacity for modal overlays)

### Text Color Styles (Apply to Text)
- **Color/Text Primary**: #1e293b (Main text color)
- **Color/Text Muted**: #64748b (Secondary/muted text color)
- **Color/Text Inverse**: #ffffff (Text on dark backgrounds)
- **Color/Text Error**: #ef4444 (Error text)
- **Color/Text Success**: #22c55e (Success text)
- **Color/Text Warning**: #f59e42 (Warning text)
- **Color/Text Disabled**: #cbd5e1 (Disabled text)

### Border Styles (Apply to Rectangles)
- **Color/Border**: #e5e7eb (Default borders, dividers)
- **Color/Border Focus**: #2563eb (Focused input border)
- **Color/Border Error**: #ef4444 (Error input border)
- **Color/Border Success**: #22c55e (Success input border)
- **Color/Border Disabled**: #cbd5e1 (Disabled input border)

### Text Styles (Apply to Text)
- **Text/H1**: 36px, Bold, 1.125 line height (40.5px) - Main page titles
- **Text/H2**: 28px, Bold, 1.143 line height (32px) - Section headers
- **Text/H3**: 22px, SemiBold, 1.182 line height (26px) - Subsection headers
- **Text/Body Large**: 18px, Regular, 1.333 line height (24px) - Large body text
- **Text/Body**: 16px, Regular, 1.5 line height (24px) - Standard body text
- **Text/Body Small**: 14px, Regular, 1.429 line height (20px) - Small text, labels
- **Text/Button**: 16px, SemiBold, 1.25 line height (20px) - Button text
- **Text/Caption**: 12px, Regular, 1.333 line height (16px) - Captions, helper text

### Effect Styles (Apply to Rectangles)
- **Shadow/Small**: 0px 1px 4px rgba(0,0,0,0.08) (Subtle shadow for cards)
- **Shadow/Medium**: 0px 4px 16px rgba(0,0,0,0.12) (Modals, overlays)
- **Shadow/Large**: 0px 8px 32px rgba(0,0,0,0.16) (Drawers, popups)
- **Focus/Glow**: 0px 0px 8px #2563eb (Focused elements)
- **Overlay/Blur**: 8px blur, 16% black overlay (Modal overlays)

---

## Typography Guidelines

### Typographic Scale System

**Why These Line Heights Work:**
Our typography follows a **modular scale** based on 8px grid system, ensuring consistent vertical rhythm:

**Heading Scale (Tighter line heights for impact):**
- **H1 (36px)**: 1.125 line height = 40.5px (fits 8px grid: 5 × 8px = 40px)
- **H2 (28px)**: 1.143 line height = 32px (fits 8px grid: 4 × 8px = 32px)
- **H3 (22px)**: 1.182 line height = 26px (fits 8px grid: 3.25 × 8px = 26px)

**Body Text Scale (More readable line heights):**
- **Body Large (18px)**: 1.333 line height = 24px (fits 8px grid: 3 × 8px = 24px)
- **Body (16px)**: 1.5 line height = 24px (fits 8px grid: 3 × 8px = 24px)
- **Body Small (14px)**: 1.429 line height = 20px (fits 8px grid: 2.5 × 8px = 20px)

**UI Elements:**
- **Button (16px)**: 1.25 line height = 20px (compact for UI)
- **Caption (12px)**: 1.333 line height = 16px (fits 8px grid: 2 × 8px = 16px)

### Text Style Usage
- **Text/H1**: Use for main page titles and hero sections
- **Text/H2**: Use for major section headers
- **Text/H3**: Use for subsection headers and card titles
- **Text/Body Large**: Use for important body text and descriptions
- **Text/Body**: Use for standard paragraph text and content
- **Text/Body Small**: Use for labels, captions, and secondary information
- **Text/Button**: Use specifically for button text
- **Text/Caption**: Use for helper text, footnotes, and small labels

### Font Specifications
- **Font Family**: Inter (primary), Roboto (fallback), Arial (system fallback)
- **Line Heights**: Follows modular scale based on 8px grid
- **Font Weights**: Bold (700), SemiBold (600), Regular (400)
- **Vertical Rhythm**: All line heights align to 8px grid for consistent spacing

---

## Spacing System

### Grid
- **Base Unit**: 8px
- **Spacing Scale**: 8px, 16px, 24px, 32px, 48px, 64px

### Padding/Margins
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px
- **Extra Large**: 32px

---

## Accessibility Guidelines

### Contrast Ratios
- **Normal Text**: 4.5:1 minimum
- **Large Text**: 3:1 minimum
- **UI Components**: 3:1 minimum

### Focus States
- **Visible Focus**: Blue outline (#2563eb)
- **Focus Ring**: 2px solid
- **Keyboard Navigation**: All interactive elements

### Screen Reader Support
- **Alt Text**: All images and icons
- **ARIA Labels**: Complex components
- **Semantic HTML**: Proper heading structure

---

## Component Naming Convention

### Format
`ComponentType/Variant/Size`

### Examples
- `Button/Primary/Large`
- `Input/Text/Small`
- `Card/Default`
- `Alert/Success`
- `Modal/Default`

---

## File Organization

### Figma Structure
```
Components Page
├── Buttons
├── Inputs & Forms
├── Cards
├── Modals
├── Alerts & Badges
├── Tables
├── Navigation
├── Avatars & Icons
├── Dropdowns & Menus
├── Loaders & Progress
├── Notifications & Toasts
├── Chatbot Widget
└── Miscellaneous
```

### Component Library
- Create components in Figma
- Use Auto Layout for responsive design
- Maintain consistent spacing (8px grid)
- Include all states and variants
- Test accessibility and usability

---

## Prototyping Guide - Complete Step-by-Step Instructions

### Understanding Figma Prototyping

**What is Prototyping?**
Prototyping in Figma allows you to create interactive versions of your designs. Users can click, hover, and interact with your components to see how they behave in real-time.

**Key Prototyping Concepts:**
- **Frames**: Individual screens or states of your design
- **Connections**: Links between frames that create user flows
- **Triggers**: User actions that start interactions (click, hover, drag, etc.)
- **Actions**: What happens when triggers occur (navigate, overlay, smart animate)
- **Animations**: How transitions happen between states

### Step 1: Set Up Prototyping Environment

**1.1 Switch to Prototype Mode**
1. **Click the "Prototype" tab** in the top right of Figma
2. **Your canvas will show** blue connection lines and interaction points
3. **The Properties panel** will change to show prototyping options

**1.2 Understanding Prototype Interface**
- **Blue dots**: Interaction points (click, hover, etc.) on the right side of frames
- **Blue lines**: Connections between screens/states
- **Properties panel**: Shows interaction settings and animation options
- **Prototype panel**: Shows all connections and interactions

**1.3 Create Your First Frame**
1. **Select Frame tool** (F key)
2. **Draw a frame** (e.g., 1440x900px for desktop)
3. **Add some content** (buttons, inputs, text)
4. **This will be your starting screen**

### Step 2: Create Button Interactions Step-by-Step

**2.1 Set Up Button States**
1. **Create your button component** with variants (Default, Hover, Focus, Disabled)
2. **Place the Default variant** in your main frame
3. **Create a new frame** for the Hover state
4. **Place the Hover variant** in the new frame

**2.2 Add Click Interaction**
1. **Select your button** in the main frame
2. **Click the blue "+" icon** that appears on the right side
3. **Drag the connection line** to the target frame
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Select your target frame
   - **Animation**: "Smart Animate"
   - **Duration**: 300ms
   - **Easing**: "Ease Out"

**2.3 Add Hover Interaction**
1. **Select your button** in the main frame
2. **Click the blue "+" icon** again
3. **Drag to the Hover state frame**
4. **In Properties panel**, set:
   - **Trigger**: "While Hovering"
   - **Action**: "Navigate to"
   - **Destination**: Hover state frame
   - **Animation**: "Smart Animate"
   - **Duration**: 200ms
   - **Easing**: "Ease Out"

**2.4 Add Mouse Leave Interaction**
1. **Select the button** in the Hover state frame
2. **Click the blue "+" icon**
3. **Drag back to the main frame**
4. **In Properties panel**, set:
   - **Trigger**: "Mouse Leave"
   - **Action**: "Navigate to"
   - **Destination**: Main frame
   - **Animation**: "Smart Animate"
   - **Duration**: 200ms
   - **Easing**: "Ease Out"

### Step 3: Create Input Field Interactions

**3.1 Set Up Input States**
1. **Create input component** with variants (Default, Focus, Error, Success)
2. **Place Default variant** in main frame
3. **Create separate frames** for Focus, Error, and Success states

**3.2 Add Focus Interaction**
1. **Select your input** in the main frame
2. **Click the blue "+" icon**
3. **Drag to Focus state frame**
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Focus state frame
   - **Animation**: "Smart Animate"
   - **Duration**: 150ms

**3.3 Add Blur Interaction**
1. **Select input** in Focus state frame
2. **Click the blue "+" icon**
3. **Drag to Default state frame**
4. **In Properties panel**, set:
   - **Trigger**: "Mouse Leave"
   - **Action**: "Navigate to"
   - **Destination**: Default state frame
   - **Animation**: "Smart Animate"
   - **Duration**: 150ms

**3.4 Add Error State Trigger**
1. **Create a "Submit" button** in your form
2. **Select the submit button**
3. **Click the blue "+" icon**
4. **Drag to Error state frame**
5. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Error state frame
   - **Animation**: "Smart Animate"
   - **Duration**: 300ms

### Step 4: Create Modal Interactions

**4.1 Set Up Modal Frame**
1. **Create a new frame** for your modal (e.g., 480x320px)
2. **Add modal content** (title, body, close button)
3. **Position modal** in the center of the screen
4. **Add background overlay** (semi-transparent black)

**4.2 Add Modal Open Interaction**
1. **Select the button** that opens the modal
2. **Click the blue "+" icon**
3. **Drag to the modal frame**
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Overlay"
   - **Destination**: Modal frame
   - **Background**: "Dimmed"
   - **Animation**: "Smart Animate"
   - **Duration**: 300ms

**4.3 Add Modal Close Interaction**
1. **Select the close button** (×) in the modal
2. **Click the blue "+" icon**
3. **Drag to the main frame**
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Main frame
   - **Animation**: "Smart Animate"
   - **Duration**: 300ms

**4.4 Add Overlay Click to Close**
1. **Select the background overlay** in modal frame
2. **Click the blue "+" icon**
3. **Drag to the main frame**
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Main frame
   - **Animation**: "Smart Animate"

### Step 5: Create Dropdown Interactions

**5.1 Set Up Dropdown States**
1. **Create dropdown component** with variants (Closed, Open)
2. **Place Closed variant** in main frame
3. **Create new frame** for Open state
4. **Add dropdown menu** in the Open state

**5.2 Add Dropdown Open Interaction**
1. **Select dropdown** in Closed state
2. **Click the blue "+" icon**
3. **Drag to Open state frame**
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Open state frame
   - **Animation**: "Smart Animate"
   - **Duration**: 200ms

**5.3 Add Dropdown Close Interaction**
1. **Select dropdown** in Open state
2. **Click the blue "+" icon**
3. **Drag to Closed state frame**
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Closed state frame
   - **Animation**: "Smart Animate"
   - **Duration**: 200ms

### Step 6: Create Form Validation Interactions

**6.1 Set Up Form States**
1. **Create main form frame** with inputs and submit button
2. **Create error state frame** with error messages
3. **Create success state frame** with success message

**6.2 Add Form Validation Logic**
1. **Select submit button** in main form
2. **Click the blue "+" icon**
3. **Drag to error state frame**
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Error state frame
   - **Animation**: "Smart Animate"

**6.3 Add Success State**
1. **Create a "Try Again" button** in error state
2. **Select the button**
3. **Click the blue "+" icon**
4. **Drag to main form frame**
5. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Main form frame

### Step 7: Create Loading States

**7.1 Set Up Loading Animation**
1. **Create loading spinner** (circle with stroke)
2. **Select the spinner**
3. **In Properties panel**, find "Smart Animate"
4. **Set animation properties**:
   - **Duration**: 1000ms
   - **Easing**: "Linear"
   - **Direction**: "Clockwise"

**7.2 Add Loading State Transition**
1. **Select button** that triggers loading
2. **Click the blue "+" icon**
3. **Drag to loading state frame**
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Loading state frame
   - **Delay**: 0ms

### Step 8: Create Page Navigation

**8.1 Set Up Multiple Pages**
1. **Create separate frames** for each page (Home, About, Contact)
2. **Add navigation menu** to each page
3. **Ensure consistent navigation** across all pages

**8.2 Add Navigation Links**
1. **Select navigation items** in each page
2. **Click the blue "+" icon** for each
3. **Drag to respective page frames**
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Target page frame
   - **Animation**: "Smart Animate"

**8.3 Add Back Navigation**
1. **Select back buttons** in each page
2. **Click the blue "+" icon**
3. **Drag to previous page frame**
4. **In Properties panel**, set:
   - **Trigger**: "On Click"
   - **Action**: "Navigate to"
   - **Destination**: Previous page frame

### Step 9: Advanced Prototyping Techniques

**9.1 Conditional Logic with Overlays**
1. **Use overlays** for conditional content
2. **Create multiple frames** for different states
3. **Use smart animate** for smooth transitions

**9.2 Micro-interactions**
1. **Add hover effects** to all interactive elements
2. **Use scale animations** for buttons (1.02x on hover)
3. **Add color transitions** for state changes

**9.3 Accessibility Features**
1. **Add focus states** for keyboard navigation
2. **Use proper contrast** ratios
3. **Include screen reader** considerations

### Step 10: Test Your Prototype

**10.1 Enter Presentation Mode**
1. **Click the "Play" button** in the top right
2. **Your prototype will open** in a new window
3. **Test all interactions** by clicking and hovering
4. **Use keyboard navigation** to test accessibility

**10.2 Share Your Prototype**
1. **Click "Share"** in the top right
2. **Copy the link** to share with others
3. **Set permissions** (can view, can edit, etc.)
4. **Add comments** for feedback

### Prototyping Best Practices

**1. Organize Your Frames**
- Use clear naming conventions
- Group related frames together
- Use consistent frame sizes

**2. Plan Your User Flow**
- Map out all possible user paths
- Consider edge cases and error states
- Test the complete user journey

**3. Use Smart Animate**
- Enable smart animate for smooth transitions
- Use consistent animation durations
- Choose appropriate easing functions

**4. Test Thoroughly**
- Test all interactions multiple times
- Check on different devices
- Get feedback from users

### Common Prototyping Issues and Solutions

**Issue: Interactions Not Working**
- **Solution**: Check if frames are properly connected
- **Solution**: Verify trigger settings are correct
- **Solution**: Ensure destination frames exist

**Issue: Animations Not Smooth**
- **Solution**: Enable Smart Animate
- **Solution**: Use consistent frame sizes
- **Solution**: Adjust animation duration and easing

**Issue: Prototype Too Slow**
- **Solution**: Reduce number of effects
- **Solution**: Optimize image sizes
- **Solution**: Use efficient animations

---

## Component Library Management

### Organizing Your Components

**1. Create Component Library**
1. **Create a new page** called "Component Library"
2. **Organize components** by type
3. **Use consistent naming** conventions
4. **Add descriptions** for each component

**2. Publish Components**
1. **Select components** you want to publish
2. **Right-click** and select "Publish"
3. **Add version notes**
4. **Click "Publish"**

**3. Share Library**
1. **Click "Share"** in the top right
2. **Set permissions** for team members
3. **Share the link** with your team

### Best Practices

**1. Naming Conventions**
- Use consistent naming: `Component/Type/Size`
- Include state information: `Button/Primary/Large/Hover`
- Use descriptive names: `Input/Text/Email/Error`

**2. Organization**
- Group related components together
- Use frames to organize components
- Add labels and descriptions

**3. Documentation**
- Add usage notes for each component
- Document interaction patterns
- Include accessibility guidelines

**4. Version Control**
- Publish updates regularly
- Add version notes
- Communicate changes to team

---

## COMPLETE PLATFORM PAGES LIST

### 🏠 **LANDING & AUTHENTICATION PAGES**
1. **Landing Page** - Main platform introduction
2. **Login Page** - User authentication
3. **Register Page** - New user registration
4. **Forgot Password** - Password recovery
5. **Email Verification** - Account verification
6. **404 Error Page** - Page not found
7. **Maintenance Page** - System maintenance

### 👤 **PATIENT PORTAL PAGES**
8. **Patient Dashboard** - Main patient overview
9. **Patient Profile** - Personal information management
10. **Report Adverse Event** - Submit adverse event reports
11. **My Reports** - View submitted reports
12. **Report Status** - Track report progress
13. **Patient Settings** - Account preferences
14. **Patient Help Center** - Support and guidance

### 🏥 **HEALTHCARE PROFESSIONAL PORTAL**
15. **HCP Dashboard** - Professional overview
16. **HCP Profile** - Professional credentials
17. **Submit Report** - Create adverse event reports
18. **My Submissions** - View submitted reports
19. **Report Management** - Manage and edit reports
20. **Patient Records** - View patient history
21. **HCP Settings** - Professional preferences
22. **HCP Help Center** - Professional support

### 🏭 **MANUFACTURER PORTAL**
23. **Manufacturer Dashboard** - Company overview
24. **Company Profile** - Company information
25. **Product Management** - Manage medical devices
26. **Adverse Event Monitoring** - Monitor reports
27. **Report Analysis** - Analyze adverse events
28. **Compliance Dashboard** - Regulatory compliance
29. **Manufacturer Settings** - Company preferences
30. **Manufacturer Help Center** - Company support

### 🏛️ **GOVERNMENT REGULATORY PORTAL**
31. **Regulatory Dashboard** - Government overview
32. **Regulatory Profile** - Agency information
33. **Report Review** - Review submitted reports
34. **Compliance Monitoring** - Monitor manufacturers
35. **Analytics Dashboard** - Regulatory analytics
36. **Policy Management** - Manage regulations
37. **Regulatory Settings** - Agency preferences
38. **Regulatory Help Center** - Government support

### 🏥 **HOSPITAL PORTAL**
39. **Hospital Dashboard** - Hospital overview
40. **Hospital Profile** - Hospital information
41. **Staff Management** - Manage healthcare staff
42. **Report Management** - Hospital reports
43. **Device Inventory** - Medical device tracking
44. **Hospital Settings** - Hospital preferences
45. **Hospital Help Center** - Hospital support

### 📰 **MEDIA PORTAL**
46. **Media Dashboard** - Media overview
47. **Media Profile** - Media organization info
48. **Public Reports** - Access public data
49. **News Management** - Manage news content
50. **Media Settings** - Media preferences
51. **Media Help Center** - Media support

### 👥 **COORDINATOR PORTAL**
52. **Coordinator Dashboard** - System overview
53. **Coordinator Profile** - Coordinator information
54. **System Management** - Platform administration
55. **User Management** - Manage all users
56. **Report Coordination** - Coordinate reports
57. **System Analytics** - Platform analytics
58. **Coordinator Settings** - System preferences
59. **Coordinator Help Center** - System support

### 🔧 **ADMIN PORTAL**
60. **Admin Dashboard** - Administrative overview
61. **Admin Profile** - Administrator information
62. **User Administration** - Manage all users
63. **System Configuration** - Platform settings
64. **Security Management** - Security settings
65. **Backup & Recovery** - Data management
66. **Admin Settings** - Administrative preferences
67. **Admin Help Center** - Administrative support

### 📊 **ANALYTICS & REPORTING PAGES**
68. **Analytics Dashboard** - Main analytics view
69. **Report Analytics** - Report statistics
70. **Trend Analysis** - Identify trends
71. **Geographic Analysis** - Location-based data
72. **Device Analysis** - Device-specific data
73. **Export Reports** - Data export functionality
74. **Custom Reports** - Create custom reports

### 🔍 **SEARCH & DISCOVERY PAGES**
75. **Global Search** - Search across platform
76. **Advanced Search** - Detailed search filters
77. **Search Results** - Display search results
78. **Saved Searches** - Manage saved searches
79. **Search History** - View search history

### 📱 **MOBILE RESPONSIVE PAGES**
80. **Mobile Dashboard** - Mobile-optimized dashboard
81. **Mobile Navigation** - Mobile navigation menu
82. **Mobile Forms** - Mobile-optimized forms
83. **Mobile Reports** - Mobile report viewing

### 🎨 **DESIGN SYSTEM PAGES**
84. **Component Library** - All UI components
85. **Design Tokens** - Colors, typography, spacing
86. **Icon Library** - All platform icons
87. **Pattern Library** - Common UI patterns

### 📄 **CONTENT PAGES**
88. **About Us** - Platform information
89. **Privacy Policy** - Privacy information
90. **Terms of Service** - Legal terms
91. **Contact Us** - Contact information
92. **FAQ** - Frequently asked questions
93. **Support** - Technical support
94. **Documentation** - User documentation

### 🔔 **NOTIFICATION PAGES**
95. **Notifications Center** - All notifications
96. **Email Notifications** - Email settings
97. **Push Notifications** - Push notification settings
98. **Alert Management** - Manage alerts

### ⚙️ **SETTINGS PAGES**
99. **Account Settings** - General account settings
100. **Security Settings** - Security preferences
101. **Notification Settings** - Notification preferences
102. **Privacy Settings** - Privacy preferences
103. **Language Settings** - Language preferences
104. **Accessibility Settings** - Accessibility options

---

## **PAGE CATEGORIZATION BY PRIORITY**

### **🔥 HIGH PRIORITY (MVP - First 2 weeks)**
1. Landing Page
2. Login/Register Pages
3. Patient Dashboard
4. Report Adverse Event
5. Patient Profile
6. HCP Dashboard
7. Submit Report
8. Admin Dashboard
9. Basic Analytics
10. 404 Error Page

### **⚡ MEDIUM PRIORITY (Phase 2 - Weeks 3-4)**
11. Manufacturer Dashboard
12. Regulatory Dashboard
13. Hospital Dashboard
14. Report Management
15. Analytics Dashboard
16. Search Functionality
17. Settings Pages
18. Help Centers

### **📈 LOW PRIORITY (Phase 3 - Future)**
19. Media Portal
20. Advanced Analytics
21. Mobile-specific pages
22. Advanced features
23. Content pages
24. Notification systems

---

## **TECHNICAL IMPLEMENTATION NOTES**

### **Page Structure:**
- **Layout**: Consistent header, sidebar, footer
- **Navigation**: Role-based navigation menus
- **Responsive**: Mobile-first design
- **Accessibility**: WCAG 2.1 AA compliant

### **Component Mapping:**
- **Use ShadCN components** for consistency
- **Custom components** for platform-specific features
- **Responsive design** for all screen sizes
- **Loading states** for all data operations

### **Development Phases:**
1. **Phase 1**: Core authentication and basic pages
2. **Phase 2**: Role-specific dashboards and forms
3. **Phase 3**: Advanced features and analytics
4. **Phase 4**: Mobile optimization and polish

---

## **NEXT STEPS:**

1. **Start with High Priority pages** (1-10)
2. **Use ShadCN components** for rapid development
3. **Create consistent layouts** across all pages
4. **Implement role-based access control**
5. **Add responsive design** from the start
6. **Test accessibility** throughout development

**Total Pages: 104 pages**
**MVP Pages: 10 pages**
**Phase 1: 20 pages**
**Full Platform: 104 pages** 