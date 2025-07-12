# 🎧 JamGalaxy Music Platform

**JamGalaxy** is a web-based music streaming platform built with Vue.js. It allows users to listen to music, manage playlists, and interact with audio content through an intuitive user interface.

## 🌐 Live Demo

You can try the demo version at: [jamgalaxy.singularitynet](https://jamgalaxy.singularitynet.dev/)

---

## 🗂 Project Structure

### Root Directory

- **`public/`**: Static assets accessible directly by the browser.

- **`packages/customized-tone/`**: A customized version of [Tone.js](https://tonejs.github.io/), used for audio playback and synthesis.

- **Configuration Files**:
    - `.eslintrc.js`: ESLint configuration for code quality.
    - `.prettierrc.js`: Prettier configuration for code formatting.
    - `babel.config.js`: Babel transpilation settings.
    - `tsconfig.json`: TypeScript configuration.
    - `vue.config.js`: Vue CLI project settings.

---

### `src/` — Main Application Source

- **`assets/`**: Static assets like images, fonts, and global styles.

- **`components/`**: Reusable Vue.js components used across views.

- **`views/`**: Top-level pages/routes of the application.

- **`router/`**: Vue Router configuration and route definitions.

- **`store/`**: Vuex store modules for managing application state.

- **`audioeditor/`** — Audio Editor Module:
    - **`audiomodel/`**: Audio data models used in the editor.
    - **`components/`**: UI components specific to the audio editor.
    - **`composable/`**: Reusable logic hooks for managing audio state.
    - **`data/`**: Static configuration and constants for the editor.
    - **`store/modules/`**: Vuex modules related to the audio editor’s state.
    - **`visualmodel/`**: Visual data models for waveform and timeline rendering.
    - **`AudioEditor.vue`**: The main entry component for the audio editor.

---

## ⚙️ Application Features

JamGalaxy offers the following functionality:

- 🎧 **Music Playback**: Users can stream and control music using a built-in audio player.

- 📂 **Playlist Management**: Create, edit, and delete custom playlists.

- 🔍 **Track Search**: Search by title, artist, or genre.

- 👤 **User Profiles**: Register, log in, and manage personal information.

- 📊 **Listening Statistics**: View data on popular tracks and personal preferences.

- ⚙️ **User Settings**: Customize playback and interface preferences.

- 🎛️ **Audio Editor**: A built-in audio editor that allows users to visualize and manipulate audio tracks with waveform rendering and timeline editing.

---

## 🛠️ Development Setup

### Prerequisites
- Node.js **20.x** or higher (recommended **20.12.2 LTS**)

## 🚀 Installation & Development

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Jam-Galaxy/jamgalaxy-frontend.git
```

### 2. Go to project

```bash
cd jamgalaxy-frontend
```

### 3. Checkout to the Development branch

```bash
git checkout development
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run in Development Mode

```bash
npm run serve
```

### 6. Build for Production

```bash
npm run build
```

### 7. Code Linting

```bash
npm run lint
```

### 8. Storybook

Run the component library in Storybook:

```bash
npm run storybook
```

Add new stories alongside components using the `*.stories.tsx` pattern. See
`src/packages/ui/atoms/ExampleButton/ExampleButton.stories.tsx` for a minimal
example.