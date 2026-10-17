# 🚀 AMONG US: The Bhopal Protocol
### IIIT Bhopal x SPARK • Web Mission 01

An interactive, responsive, laptop-first promotional website for the official **Among Us Inter-College LAN & Online Championship**, presented by **SPARK** (The Technical & Creative Society of IIIT Bhopal).

---

## 🌟 Mission Overview & Theme

Built in accordance with **"The Web Task Guide: From Idea to Live Website"** (Web Mission 01), this landing page promotes an upcoming campus gaming tournament with high visual fidelity, interactive playable mini-tasks, sound effects, an authentic Skeld deck map crossover with IIIT Bhopal locations, and a downloadable custom crewmate access pass.

---

## 🎨 Visual Identity & Palette

Strictly adheres to the specifications from **Page 3 ("Customize Your Spaceship")**:

| Role / Element | Hex Code | Swatch Preview |
|---|---|---|
| **Impostor Red** | `#F45858` | Primary accent, Emergency Button, critical calls to action |
| **Starship Peach** | `#FFE5D1` | Subtitles, warm highlights, text accents |
| **Crewmate Yellow** | `#FFD166` | Badges, card chips, tournament prize highlights |
| **Task Green** | `#8DD982` | Progress bars, success badges, verified indicators |
| **Electric Cyan** | `#67C9F5` | Visor glares, interactive buttons, terminal nodes |
| **Cosmic Purple** | `#B8A5F5` | Secondary terminals, floating crewmate colors |

### 🔤 Typography Samples
- **Headings**: `Space Grotesk` (Bold 700/800) – High-impact, space-age, retro-futuristic game aesthetic.
- **Body & UI**: `Inter` (Medium 500/600) – High readability, clear contrast, accessible web standard.
- **Accents**: `Press Start 2P` – Authentic 8-bit game console indicators.

---

## 🕹️ Interactive Features & Mechanics

1. **🚨 Emergency Meeting System & Alarm**:
   - 3D tactile Emergency Red Button in the hero section and fixed floating dock.
   - Triggers Web Audio API synthesized two-tone emergency siren.
   - Screen flashes with red emergency alert overlay.
   - Opens the Emergency Meeting voting modal where cadets can interrogate and vote on suspects (Red, Blue, Green, Yellow).

2. **🎮 3 Playable In-Browser Ship Tasks**:
   - **Admin Card Swipe**: Interactive card swipe with drag physics and speed detection (`TOO FAST!`, `TOO SLOW!`, or `ACCEPTED!`).
   - **Electrical Wiring**: Click matching color terminals (Red, Blue, Yellow, Pink) with dynamic canvas bezier wire drawing and electrical spark sound effects.
   - **Reactor Calibrator**: Timing challenge with spinning dial where you must click when aligned with the yellow sensor for 3 consecutive stages.
   - **Global Ship Integrity Tracker**: Completing tasks updates the campus-wide repair progress bar, unlocking secret tournament VIP codes upon 100% completion!

3. **🗺️ The Bhopal Skeld Tactical Map**:
   - Interactive SVG campus crossover:
     - **Cafeteria** (Canteen & Strategy Tables)
     - **Admin** (SAC Wing & Verification Desk)
     - **Electrical** (CC3 High-Speed Gigabit LAN Rigs)
     - **MedBay** (Infirmary & Holographic Scan)
     - **Reactor** (Main Auditorium Championship Stage)
     - **Secret Vents**: Clickable easter eggs with authentic vent whoosh SFX!

4. **🧑‍🚀 Crewmate Suit Designer & Pass Generator**:
   - Customize suit color (11 classic Among Us shades).
   - Equip headgear: *Sticky Note DUM*, *Mini Crewmate*, *Viking Horns*, *Party Cone*, *Sprout*, *Halo*, *Detective Fedora*.
   - Live real-time SVG vector rendering.
   - **Instant Download**: Renders a high-resolution 650x380 access pass with barcode, clearance level, and metadata directly onto an HTML5 canvas and downloads as PNG!

5. **📝 Full Tournament Registration**:
   - Solo Crewmate vs. Squad Leader mode toggle.
   - Input validation with Among Us themed error prompts.
   - Issues a confirmed boarding pass with unique ticket ID (e.g., `SUS-849201`) saved locally in `localStorage`.
   - Includes printable boarding pass button.

6. **🎵 Built-in Web Audio API Synthesizer**:
   - 100% self-contained sound effects (no missing external audio files or slow network buffers).
   - Emergency siren, task success chords, electric zaps, vent swooshes, and button clicks.
   - One-click mute/unmute button with state persistence in `localStorage`.

---

## 💻 How to Run Locally

You can run this website instantly using Python's built-in web server:

1. Open PowerShell or your terminal.
2. Navigate to the project directory:
   ```powershell
   cd C:\Users\USER\.gemini\antigravity\scratch\iiit-bhopal-among-us
   ```
3. Start the local server:
   ```powershell
   & "C:\Users\USER\AppData\Local\Python\pythoncore-3.14-64\python.exe" -m http.server 8000
   ```
4. Open your browser and visit:
   ```
   http://localhost:8000
   ```

---

## 🌐 Deployment to GitHub & Vercel (Page 6 Guide)

Following **Page 6 ("From Hangar to Orbit")**:

### 1. Initialize Git Repository
```powershell
& "C:\Users\USER\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe" init
& "C:\Users\USER\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe" add .
& "C:\Users\USER\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe" commit -m "feat: complete Among Us promotional web app for IIIT Bhopal (SPARK Mission 01)"
```

### 2. Push to GitHub
Create a new public repository on [GitHub](https://github.com/new) named `iiit-bhopal-among-us`, then run:
```powershell
& "C:\Users\USER\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe" remote add origin https://github.com/YOUR_USERNAME/iiit-bhopal-among-us.git
& "C:\Users\USER\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe" branch -M main
& "C:\Users\USER\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe" push -u origin main
```

### 3. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com).
2. Click **Add New Project** → Select your `iiit-bhopal-among-us` GitHub repo.
3. Keep default settings (Static site, Root Directory `./`).
4. Click **Deploy**. Your site will be live on `https://iiit-bhopal-among-us.vercel.app` in under 30 seconds!

---

## 🛡️ Pre-Launch Checklist (Page 7 Compliance)

- [x] **Buttons and links work**: All navigation anchors, sound controls, task buttons, and modal triggers function smoothly.
- [x] **Text readable**: High-contrast ratios checked using Space Grotesk and Inter fonts against deep space backgrounds.
- [x] **Fits laptop first & phone screens**: Fully responsive grid adapting from ultra-wide desktops down to mobile phones.
- [x] **Images & Vectors load**: 100% self-contained scalable vector SVGs and HTML5 canvas renders (zero broken links).
- [x] **Animations don't obstruct**: Micro-interactions and floating astronauts remain subtle and performance-friendly.
- [x] **No layout overflow**: Tested with `overflow-x: hidden` and proper box-sizing.
- [x] **Zero secrets exposed**: Clean static frontend, no API tokens or credentials in source.

---

### 🏆 Organized with ❤️ by SPARK Technical Society, IIIT Bhopal
*Tag SPARK with your first creation!*
