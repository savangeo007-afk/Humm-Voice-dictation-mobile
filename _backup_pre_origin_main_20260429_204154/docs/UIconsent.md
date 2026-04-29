Voice Transcription App - UI & UX Specification

1. Design Philosophy: "Elevated Dark Morphic"

Avoid flat design. Every element must have weight and physical presence using inner shadows, glassmorphism, and spring physics. Everything should feel smooth and "expensive," not “Vibe-coded." Transitions must be fluid, with page-to-page sliding that feels like a single continuous experience.

2. Color Palette & Typography

Background: #000000 (Obsidian Black).

Primary Surface: #0A0A0A (Grayish Black).

Secondary Surface: #141414 (Lighter Charcoal).

Border: #1A1A1A (Premium Gray).

Typography:

Headers: Anton (Bold, prominent display).

Body: Inter / Anthropie (Clean Sans Serif).

Iconography: Use professional vector libraries. STRICTLY NO EMOJIS.

3. Home Dashboard: Prominent Stats

Top chips are high-impact Morphic containers using Anton font for digits.

Stat

Color

Font

Visual Note

Total Words

#FF9500 (Orange)

Anton

Large digits, subtle outer glow.

WPM

#34C759 (Green)

Anton

High visibility green.

Streak/Apps

#FFFFFF (White)

Anton

Clean white digits.

4. Navigation & Modals

Floating Nav Bar: A bottom-docked pill shape. Icons use skeuomorphic animations (depth, shadow shifts on press, spring scaling).

Spring Physics: Damping: 18, Stiffness: 120 for all UI interactions.

Morphic Modals: Custom bottom sheets with heavy background blur and curved edges. No standard React Native modals.

Toggles: Custom animated switches that "stretch" (morph) during the transition.

5. Onboarding & Input Elements

Input Boxes: Must feature highly curved corners (minimum 16pt radius).

Style: No tilted shifts or sharp geometric transformations. The look should be organic and soft.

Animations: Transitions between input fields or focus states must be buttery smooth.

Focus State: Subtle glow or border-color shift using withSpring to avoid jarring changes.

6. Android Component Specs

Floating Pill: Vertically stacked 

$$Waveform$$

 -> 

$$Tick$$

 -> 

$$Cross$$

.

Glassmorphism: blurRadius: 20 with a subtle 1px border of #1A1A1A.

Fallback UI: Use the Android Notification Context (tiny retry chips) for failed transcriptions.