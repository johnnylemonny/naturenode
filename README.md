# 🌿 NatureNode

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-3%20Flash-orange)](https://ai.google.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green)](https://vite-pwa-org.netlify.app/)

**NatureNode** is a professional biodiversity research and identification tool. Designed for field researchers and nature enthusiasts, it leverages state-of-the-art AI to transform simple photos into comprehensive ecological dossiers.

![NatureNode Desktop Interface](./photos/desktop3.webp)

## 🌟 Key Features

-   **Botanical Precision UI**: A high-density, research-oriented design system using Tailwind CSS v4 and the OKLCH color model for superior visual clarity.
-   **AI-Driven Identification**: Powered by **Google Gemini 3 Flash** for instant, high-accuracy recognition of plants, animals, insects, and fungi.
-   **Specimen Journal**: A persistent, local history of all your discoveries, allowing you to build your own personal biodiversity database.
-   **📱 PWA & Offline Support**: Fully installable as a Progressive Web App. Designed to work in the field with robust offline capabilities.
-   **🗺️ Manual Location Mapping**: Easily log observation points by town or area name.
-   **📍 Google Maps Integration**: One-click navigation and mapping of find locations directly in Google Maps.
-   **Ecological Insights**: Detailed data on conservation status (IUCN), habitats, native ranges, and protection guidelines for every specimen.
-   **Privacy First**: Your Gemini API key and discovery history are stored safely in your local browser storage—never on a server.

## 🛠️ Tech Stack

-   **Core**: React 19 (App Router patterns) + TypeScript
-   **Build Tool**: Vite 8 (Rolldown)
-   **Styling**: Tailwind CSS v4 + Lucide Icons
-   **PWA**: Vite PWA Plugin + Workbox
-   **AI**: Google Generative AI SDK

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/johnnylemonny/naturenode.git
    cd naturenode
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Launch the lab**:
    ```bash
    pnpm dev
    ```

4.  **Configuration**:
    The application requires a Gemini API key. Obtain a free key from [Google AI Studio](https://aistudio.google.com/app/apikey) and enter it in the app settings.

## 🌍 Vision

NatureNode was built to foster a deeper connection between technology and the natural world. By making biodiversity data accessible and engaging, we aim to inspire conservation efforts and ecological awareness globally.

## 📜 License

MIT

---
*Developed with ❤️ by [John](https://github.com/johnnylemonny).*
