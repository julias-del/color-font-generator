# CanvasSync — Design System Palette & Typography Generator

CanvasSync is a high-performance, responsive design playground built for product managers, UI/UX engineers, and SaaS developers. It bridges the gap between color theory and typography, allowing you to instantly explore cohesive design tokens (5 colors + Heading font + Body font) and visualize them instantly in real-world layouts.

Inspired by the quick interaction loops of tools like Coolors.co, CanvasSync expands the concept by integrating a dynamic font pairing engine, plain-English mathematical color harmony spaces, cross-viewport fluidity tracking, and direct integration with Google's Gemini AI.

---

## 🚀 Key Features

### ⚡ Frictionless Randomization
* Press the **Spacebar** anywhere on your desktop screen to instantly cycle a random color palette combined with optimized typography pairings.
* **Slot-Level Locking:** Click the lock icon on any color column to anchor it. Locked columns are ignored during spacebar cycles or harmony calculations.

### 🎨 Seed Color Anchor & Simplified Harmonies
* Input any valid hex code directly into the **Main Color** sidebar component to anchor Slot 1.
* Select a mathematical generation method simplified with user-friendly descriptions:
  * **Analogous:** Curates harmonious neighbor colors on the color wheel.
  * **Complementary:** Targets high-contrast opposites for striking calls-to-action.
  * **Triadic:** Produces a vibrant, bold triad triangle distribution.
  * **Monochromatic:** Computes subtle varying lightness levels of the exact same color hue.

### 🔤 Dynamic Typography & Font Pairing
* Integrates seamlessly with the **Google Fonts API** to asynchronously download and repaint headings and body copy layout elements.
* Curates popular structural pairing fonts (e.g., *Inter*, *Playfair Display*, *Space Grotesk*, *Syne*, *Plus Jakarta Sans*).
* Includes a global **Lock Fonts** toggle to protect your typography pairing selections while you iterate color schemes.

### 🎛️ Premium Workspace Interactions
* **High-Contrast White UI Pills:** Color management cards are styled with solid white backgrounds and deep shadows to guarantee absolute text legibility regardless of the randomized parent background color.
* **Drag-and-Drop Reordering:** Move columns around natively using responsive HTML5 Drag & Drop handlers to test side-by-side contrasts.
* **Granular Post-Generation Editors:** Tapping the slider icon drops an inline configuration dock exposing exact HEX typing text-boxes, live standard HTML pickers, and HSL range sliders.

### 📱 Unified Responsive Layout Breakpoint (< 1230px)
* The workspace features a custom-engineered viewport breakpoint set at exactly **`1230px`**.
* Once the browser pixel width passes below `1230px`, the interface instantly maps to a unified tablet/mobile view: columns stack smoothly as vertical rows, the sidebar turns into a sliding bottom-scrim drawer, and touch gestures (such as swiping left/right) can be used to cycle themes.

---

## 🛠️ Project Architecture

CanvasSync is written entirely in self-contained vanilla web architectures for optimal performance and effortless portability:

* **Markup & UI:** HTML5 structure utility styled dynamically via **Tailwind CSS**.
* **Iconography:** **FontAwesome Icons (v6.4.0)** for interface visual markers.
* **Logic Engine:** Vanilla JavaScript ES6+ managing color conversion matrices ($HEX \leftrightarrow HSL$), luminance tracking ($WCAG\ 2.1$), drag-state events, and streaming API endpoints.

---

## 🤖 Gemini AI Brand Architect Integration

CanvasSync houses a production-ready client side integration with **Gemini 2.5 Flash** models to parse contextually aware design tokens.

### How It Works:
1. Write any atmospheric description or business prompt (e.g., *"A premium, high-trust digital banking application with subtle neon cyber aesthetics"*).
2. Tapping **Generate Theme with AI** triggers a secure asynchronous call.
3. The platform responds with structural keys containing a matching 5-color hex array, optimized heading/body pairings, a contextual tagline, and a brief conceptual overview.
4. **Exponential Backoff Core:** Built with built-in retry mechanics ($1s, 2s, 4s, 8s, 16s$), the button mitigates network rate-limiting or congestion gracefully.

---

## 📦 Quick Setup Instructions

To load CanvasSync into your local editor (e.g., Visual Studio Code):

1. Clone or download the source code files (`index.html`) into a workspace directory.
2. Ensure you add an image asset named `favicon.png` in the root folder to satisfy the browser asset link.
3. Launch the application using a live compilation handler (like VS Code **Live Server** extension) or simply double-click `index.html` to run directly inside your browser sandbox.

### Production Tokens Export Format
Tapping the global **Export** action button opens an overlapping clipboard drawer formatting your active variables into three separate enterprise tokens:
* **CSS Custom Variables:** Ready to inject directly inside a public `:root` sheet.
* **Tailwind Config Extensions:** Formatted as a modular export block to drop straight inside a `tailwind.config.js` theme file.
* **Raw JSON Assets:** Compliant with industry token schemas for cross-platform styling sync.

---

## 📝 License & Open Source
Distributed under the MIT License. Feel free to fork, expand, or port into standard components for React, Vue 3, or Next.js architectures.