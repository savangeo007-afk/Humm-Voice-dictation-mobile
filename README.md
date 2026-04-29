# Humm Voice Dictation Mobile - Implemented Screens Reference

This document lists the screens currently implemented in code, including:
- screen order/flow
- buttons and actions
- major UI components used
- spacing/padding on each screen
- code references (file + line ranges)

## Spacing Scale Used Across Screens

Defined in `src/theme/index.ts`:
- `xs = 4`
- `sm = 8`
- `md = 12`
- `lg = 16`
- `xl = 24`
- `xxl = 32`
- `xxxl = 48`

Reference: `src/theme/index.ts` (lines 31-39).

---

## 1) Actual Screen Order

### A. App launch and onboarding flow order

1. `Splash`
2. `GetStarted`
3. `AboutYou`
4. `LanguageHub`
5. `SarvamIntro`
6. `Auth`
7. `PermissionsConsent`
8. `Welcome`
9. `MainApp`

Code references:
- Route types (declared order): `src/navigation/types.ts` (lines 10-24)
- Onboarding completion routing from splash: `src/screens/SplashScreen.tsx` (lines 10-15)
- Per-screen onboarding step progress (`StepIndicator` current step):
  - `GetStarted`: `currentStep={0}` at `src/screens/onboarding/GetStartedScreen.tsx` (line 15)
  - `AboutYou`: `currentStep={1}` at `src/screens/onboarding/AboutYouScreen.tsx` (line 27)
  - `LanguageHub`: `currentStep={2}` at `src/screens/onboarding/LanguageHubScreen.tsx` (line 152)
  - `SarvamIntro`: `currentStep={3}` at `src/screens/onboarding/SarvamIntroScreen.tsx` (line 49)
  - `Auth`: `currentStep={4}` at `src/screens/onboarding/AuthScreen.tsx` (line 65)
  - `PermissionsConsent`: `currentStep={5}` at `src/screens/onboarding/PermissionsConsentScreen.tsx` (line 106)
  - `Welcome`: `currentStep={6}` at `src/screens/onboarding/WelcomeScreen.tsx` (line 34)

### B. Main app tab order (Floating Pill)

1. **Home**
2. **Dictionary** (your requested secondary key screen)
3. **Contexts**
4. **Settings**

Code references:
- Tab order: `src/components/FloatingPill.tsx` (lines 17-22)
- Main content switch mapping: `src/screens/MainAppScreen.tsx` (lines 21-30)

### C. Settings sub-screen order (from Settings Hub menu)

1. `PersonalDetails`
2. `SarvamConfig`
3. `BYOKHub`
4. `Billing`

Code reference: `src/screens/SettingsHubScreen.tsx` (lines 16-21).

---

## 2) Screen-by-Screen UI, Buttons, and Spacing

## 2.1 Splash (`src/screens/SplashScreen.tsx`)

**Buttons**
- None.

**UI Components**
- `View`, `StatusBar`, `HummLogo`.

**Spacing / layout**
- Full-screen centered content: `flex:1`, `alignItems:'center'`, `justifyContent:'center'`.
- No explicit padding on this screen.
- Reference: lines 29-35.

---

## 2.2 Get Started (`src/screens/onboarding/GetStartedScreen.tsx`)

**Buttons**
- `Continue` -> navigates to `AboutYou` (lines 23-27).

**UI Components**
- `StepIndicator`, `HummLogo`, `MorphicButton`, `SafeAreaView`, `StatusBar`.

**Spacing / layout**
- Container: `paddingHorizontal: xl (24)` (line 37).
- Header: `paddingTop: lg (16)` (line 40).
- Footer: `paddingBottom: xxl (32)` (line 48).
- Logo area centered via `flex:1`, `justifyContent:'center'`, `alignItems:'center'` (lines 43-45).

---

## 2.3 About You (`src/screens/onboarding/AboutYouScreen.tsx`)

**Buttons**
- `Back` -> `navigation.goBack()` (lines 61-65).
- `Continue` -> `LanguageHub` with `{name, age}` (lines 68-74), disabled unless name exists.

**UI Components**
- `StepIndicator`, two `MorphicInput` fields (`Your Name`, `Your Age`), `ScrollView`, two `MorphicButton`s.

**Spacing / layout**
- Container: `paddingHorizontal: xl (24)` (line 87).
- Header top: `lg (16)` (line 90).
- Scroll content: `paddingTop: xxl (32)`, `paddingBottom: xl (24)` (lines 96-97).
- Subtitle bottom spacing: `xxl (32)` (line 109).
- Each input block bottom: `xl (24)` (line 112).
- Footer bottom: `xxl (32)` (line 115).
- Button row gap: `md (12)` (line 119).
- Button width ratio: back `flex:1`, next `flex:2` (lines 121-126).

---

## 2.4 Language Hub (`src/screens/onboarding/LanguageHubScreen.tsx`)

**Buttons**
- `Back` -> previous screen (lines 191-195).
- `Continue` -> `SarvamIntro` with `{name, age, languages}` (lines 198-208), disabled until at least one language selected.
- Language chips are pressable selections via `LanguageChip` (lines 172-178).

**UI Components**
- `StepIndicator`, title/subtitle, `MorphicInput` search, `ScrollView` language chip grid, selected-count text, footer action row.

**Spacing / layout**
- Container: `paddingHorizontal: xl (24)` (line 221).
- Header top: `lg (16)` (line 224).
- Title top: `xxl (32)`; title bottom: `sm (8)` (lines 230-231).
- Subtitle bottom: `lg (16)` (line 237).
- Search block bottom: `lg (16)` (line 240).
- Chip grid gap: `sm (8)` and bottom padding `lg (16)` (lines 248-249).
- Selected-count vertical padding: `sm (8)` (line 256).
- Footer bottom: `xxl (32)` (line 259).
- Button row gap: `md (12)` (line 263), with `flex 1:2` split (lines 265-269).

---

## 2.5 Sarvam Intro (`src/screens/onboarding/SarvamIntroScreen.tsx`)

**Buttons**
- `Back` -> previous screen (lines 95-99).
- `Continue` -> `Auth` (line 105).

**UI Components**
- `StepIndicator`, `MorphicCard` hero, description text, mapped feature rows with icons, footer buttons.

**Spacing / layout**
- Container: `paddingHorizontal: xl (24)` (line 118).
- Header top: `lg (16)` (line 121).
- Scroll content: top `xxl (32)`, bottom `xl (24)` (lines 127-128).
- Hero card: vertical padding `xxxl (48)`, bottom margin `xxl (32)` (lines 133-134).
- Description bottom margin: `xxl (32)` (line 147).
- Feature list gap: `lg (16)` (line 150).
- Feature row gap: `lg (16)` (line 155).
- Feature title bottom: `xs (4)` (line 174).
- Footer bottom: `xxl (32)` (line 183).
- Button row gap: `md (12)` and `flex 1:2` split (lines 187, 189-193).

---

## 2.6 Auth (`src/screens/onboarding/AuthScreen.tsx`)

**Buttons**
- `Continue with Google` -> `handleGoogleSignIn` (lines 90-95) -> on success navigates to `PermissionsConsent` (lines 39-42).
- `Skip for now` -> `PermissionsConsent` (line 57).

**UI Components**
- `StepIndicator`, `HummLogo`, title/subtitle, optional loader/error text, two `MorphicButton`s.

**Spacing / layout**
- Container: `paddingHorizontal: xl (24)` (line 114).
- Header top: `lg (16)` (line 117).
- Logo bottom margin: `xxl (32)` (line 125).
- Title bottom margin: `sm (8)` (line 131).
- Footer bottom: `xxl (32)` (line 141).
- Loader and error bottom margin: `lg (16)` (lines 144, 151).
- Skip button top margin: `md (12)` (line 154).

---

## 2.7 Permissions Consent (`src/screens/onboarding/PermissionsConsentScreen.tsx`)

**Buttons**
- `Enable` (per permission card) (lines 147-152).
- `Configure All` (lines 162-166).
- Footer row: `Back`, `Skip`, `Next` (lines 170-188).

**UI Components**
- `StepIndicator`, title/subtitle, scrollable list of permission `MorphicCard`s, icon states (`CheckCircle`), footer action buttons.

**Spacing / layout**
- Container: `paddingHorizontal: xl (24)` (line 200).
- Header top: `lg (16)` (line 203).
- Title top margin: `xxl (32)`; bottom `sm (8)` (lines 209-210).
- Subtitle bottom margin: `xl (24)` (line 216).
- Scroll content card gap: `md (12)`, bottom padding `lg (16)` (lines 222-223).
- Permission card internal padding: `lg (16)` (line 226).
- Permission row gap: `md (12)` (line 231).
- Footer bottom: `xxl (32)` with footer gap `md (12)` (lines 262-263).
- Footer button row gap: `md (12)` (line 267).

---

## 2.8 Welcome (`src/screens/onboarding/WelcomeScreen.tsx`)

**Buttons**
- `Let's Go` -> marks onboarding complete and resets to `MainApp` (lines 21-26, 65-69).

**UI Components**
- `StepIndicator`, success `CheckCircle`, title/subtitle, `MorphicCard` summary.

**Spacing / layout**
- Container: `paddingHorizontal: xl (24)` (line 79).
- Header top: `lg (16)` (line 82).
- Success icon bottom margin: `xxl (32)` (line 90).
- Title bottom margin: `sm (8)` (line 97).
- Subtitle bottom margin: `xxxl (48)` (line 104).
- Summary card padding: `xl (24)` (line 109).
- Summary row vertical padding: `sm (8)` (line 115).
- Divider vertical margin: `sm (8)` (line 130).
- Footer bottom: `xxl (32)` (line 133).

---

## 2.9 Main App Container (`src/screens/MainAppScreen.tsx`)

**Buttons**
- Tab buttons are in `FloatingPill`.

**UI Components**
- `SafeAreaView`, dynamic content area (`Home`, `Dictionary`, `Contexts`, `Settings`), `FloatingPill`.

**Spacing / layout**
- Container full screen, no explicit padding in this file.
- `FloatingPill` is absolutely positioned `bottom: 32` (`src/components/FloatingPill.tsx`, line 90).

---

## 2.10 Home (Primary Key Screen) (`src/screens/HomeScreen.tsx`)

**Buttons / interactions**
- Transcription copy action (`Clipboard.setString`) handled by card callbacks (lines 24-26, 132-138).
- Retry/delete actions exposed via `TranscriptionCard` callbacks (lines 28-37, 132-138).

**UI Components**
- `HummLogo`, 4 `StatChip`s (`Total Words`, `Apps`, `WPM`, `Languages`), status indicator, transcription section, `MorphicCard` empty state.

**Spacing / layout**
- Scroll content: `paddingHorizontal: xl (24)`, `paddingTop: lg (16)` (lines 154-155).
- Stats grid top margin: `xl (24)` and gap `sm (8)` (lines 158-159).
- Stats row gap: `sm (8)` (line 163).
- Status row top margin `lg (16)`, vertical padding `sm (8)`, gap `sm (8)` (lines 171-173).
- Section top margin `xxl (32)` (line 186).
- Section title bottom margin `lg (16)` (line 192).
- Empty card vertical padding `xxxl (48)` (line 196).
- Empty content gap `lg (16)` (line 200).
- Bottom spacer height `100` (line 217).

---

## 2.11 Custom Dictionary (Secondary Key Screen) (`src/screens/CustomDictionaryScreen.tsx`)

**Buttons**
- Header: `Add Word` (lines 90-95).
- Bottom sheet: `Save` (lines 138-142).
- Delete sheet: `Cancel` and `Delete` (lines 154-164).
- Per-entry edit/delete comes from `DictionaryCard` props (lines 106-111).

**UI Components**
- Header title/subtitle, add button, dictionary list or empty message, two `MorphicBottomSheet` modals, two `MorphicInput`s for wrong/correct words.

**Spacing / layout**
- Scroll content: horizontal `xl (24)`, top `lg (16)` (lines 180-181).
- Header bottom margin: `xxl (32)` (line 187).
- Header text right margin: `lg (16)` (line 191).
- Title bottom margin: `xs (4)` (line 197).
- Empty state vertical padding: `xxxl (48)` (line 205).
- Bottom spacer: height `100` (line 215).
- Sheet title bottom: `xl (24)` (line 221).
- Sheet input block gap: `lg (16)` and bottom margin `xl (24)` (lines 224-225).
- Delete text bottom margin: `xl (24)` (line 231).
- Delete actions gap: `md (12)` (line 237).

---

## 2.12 Personal Contexts (`src/screens/PersonalContextsScreen.tsx`)

**Buttons**
- Header: `Add Context` (lines 90-95).
- Bottom sheet: `Save` (lines 139-143).
- Delete sheet: `Cancel`, `Delete` (lines 155-165).
- Per-entry edit/delete from `ContextCard` callbacks (lines 106-111).

**UI Components**
- Same structural pattern as Custom Dictionary, but fields are trigger phrase + snippet.

**Spacing / layout**
- Scroll content: horizontal `xl (24)`, top `lg (16)` (lines 181-182).
- Header bottom margin: `xxl (32)` (line 188).
- Header text right margin: `lg (16)` (line 192).
- Title bottom margin: `xs (4)` (line 198).
- Empty state vertical padding: `xxxl (48)` (line 206).
- Bottom spacer: height `100` (line 217).
- Sheet title bottom margin: `xl (24)` (line 223).
- Sheet inputs gap `lg (16)` and bottom margin `xl (24)` (lines 226-227).
- Delete actions gap: `md (12)` (line 239).

---

## 2.13 Settings Hub (`src/screens/SettingsHubScreen.tsx`)

**Buttons**
- Menu card press targets:
  - `Personal Details`
  - `Sarvam Configuration`
  - `BYOK Hub`
  - `Billing & Subscriptions`
  (lines 16-21, 42-55)
- `Privacy Mode` switch (`MorphicSwitch`) (lines 69-72).

**UI Components**
- Title, menu list of pressable `MorphicCard`s, icon containers, chevrons, privacy card + custom switch.

**Spacing / layout**
- Scroll content: horizontal `xl (24)`, top `lg (16)` (lines 88-89).
- Title bottom margin: `xxl (32)` (line 95).
- Menu list gap: `md (12)` (line 98).
- Menu card padding: vertical `lg (16)`, horizontal `lg (16)` (lines 101-102).
- Menu left row gap: `lg (16)` (line 112).
- Privacy section top margin: `xxxl (48)` (line 128).
- Privacy card padding: vertical `lg (16)`, horizontal `lg (16)` (lines 131-132).
- Privacy text right margin: `lg (16)` (line 141).
- Bottom spacer: height `100` (line 156).

---

## 2.14 Personal Details (`src/screens/settings/PersonalDetailsScreen.tsx`)

**Buttons**
- Back icon button (`Pressable`) (lines 42-47).
- No explicit save button (auto-save via `useAutoSave`) (lines 19-33).

**UI Components**
- Header with back + title, two `MorphicInput`s (name/age), optional language chips section.

**Spacing / layout**
- Scroll content: horizontal `xl (24)`, top `lg (16)` (lines 93-94).
- Header gap `lg (16)`, bottom margin `xxl (32)` (lines 99-100).
- Form field gap: `xl (24)` (line 116).
- Languages section top margin: `xxl (32)` (line 119).
- Languages label bottom margin: `md (12)` (line 125).
- Chips gap: `sm (8)` (line 130).
- Chip padding: vertical `sm (8)`, horizontal `lg (16)` (lines 135-136).

---

## 2.15 Sarvam Configuration (`src/screens/settings/SarvamConfigScreen.tsx`)

**Buttons**
- Back icon button (lines 34-39).
- If free plan: `Upgrade to Premium` -> `Billing` (lines 99-102).

**UI Components**
- Header, hero logo `MorphicCard`, conditional premium/free sections, feature list rows, disclaimer text.

**Spacing / layout**
- Scroll content: horizontal `xl (24)`, top `lg (16)`, bottom `xxxl (48)` (lines 123-125).
- Header gap `lg (16)`, bottom margin `xxl (32)` (lines 130-131).
- Logo card vertical padding `xxl (32)`, bottom margin `xxl (32)` (lines 148-149).
- Premium section gap `lg (16)` (line 163).
- Free section gap `xl (24)` (line 198).
- Feature list gap `md (12)` and row gap `md (12)` (lines 212, 217).
- Disclaimer top margin `xxxl (48)` (line 238).

---

## 2.16 BYOK Hub (`src/screens/settings/BYOKHubScreen.tsx`)

**Buttons**
- Back icon button (lines 42-47).
- Optional `Clear Key` button when key is present (lines 78-83).

**UI Components**
- Header/title/subtitle, explanation `MorphicCard`, secure `MorphicInput`, key status badge.

**Spacing / layout**
- Scroll content: horizontal `xl (24)`, top `lg (16)` (lines 100-101).
- Header gap `lg (16)`, bottom margin `xxl (32)` (lines 106-107).
- Subtitle top margin `2` (line 126).
- Explanation card bottom margin `xxl (32)` (line 129).
- Input section bottom margin `xl (24)` (line 138).
- Status badge: vertical padding `sm (8)`, horizontal `lg (16)`, row gap `sm (8)` (lines 148, 151-152).

---

## 2.17 Billing & Subscriptions (`src/screens/settings/BillingScreen.tsx`)

**Buttons**
- Back icon button (lines 42-47).
- Premium state: `Manage Subscription` (lines 77-81).
- Free state: `Upgrade to Premium` (lines 130-133).

**UI Components**
- Header, plan status cards, detail rows with dividers, feature comparison table (free vs premium).

**Spacing / layout**
- Scroll content: horizontal `xl (24)`, top `lg (16)`, bottom `xxxl (48)` (lines 150-152).
- Header gap `lg (16)`, bottom margin `xxl (32)` (lines 157-158).
- Premium section gap `xl (24)` (line 175).
- Plan card vertical padding `xxl (32)` (line 179).
- Plan badge vertical padding `sm (8)`, horizontal `xl (24)`, bottom margin `md (12)` (lines 184-186).
- Detail row vertical padding `md (12)` (line 205).
- Free section gap `xl (24)` (line 222).
- Free plan card vertical padding `xxl (32)` (line 225).
- Comparison header/row padding vertical `md (12)`, horizontal `lg (16)` (lines 250-251, 257-258).

---

## 3) Key Screen Formatting (Requested)

1. **Home page (primary)** -> implemented as `HomeContent` and rendered when active tab is `home`.
   - References: `src/screens/MainAppScreen.tsx` (lines 22-23), `src/screens/HomeScreen.tsx`.

2. **Secondary: Custom Dictionary** -> implemented as `CustomDictionaryContent` and rendered when active tab is `dictionary`.
   - References: `src/screens/MainAppScreen.tsx` (lines 24-25), `src/screens/CustomDictionaryScreen.tsx`.

3. **Then Personal Contexts**
   - References: `src/screens/MainAppScreen.tsx` (lines 26-27), `src/screens/PersonalContextsScreen.tsx`.

4. **Then Settings Hub**
   - References: `src/screens/MainAppScreen.tsx` (lines 28-29), `src/screens/SettingsHubScreen.tsx`.

---

## 4) Note on Navigation Implementation Status

`src/navigation/types.ts` and all screen components are implemented, but there is currently no dedicated stack navigator file in `src/navigation/` wiring all screens together. The onboarding and settings route usage is already present inside screen `navigation.navigate(...)` calls and route typings.

