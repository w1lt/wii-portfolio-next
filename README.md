# Wii Portfolio - Next.js

A portfolio website themed like the Wii menu, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎮 Wii menu-inspired design with animated channels
- 🌓 Dark/Light theme toggle
- 📱 Mobile fallback page
- 🎵 Spotify integration (displays currently playing or last played track)
- ⚡ Framer Motion animations
- 🎨 Custom CSS animations (gridlines, diagonal scroll, spin)
- 💼 Experience timeline with animated SVG path
- 🚀 Projects showcase
- 📄 Resume viewer with download option

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Tabler Icons React

## Prerequisites

- Node.js >= 20.9.0
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wii-portfolio-next
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Spotify API credentials (optional, but required for Spotify page to work)

```bash
cp .env.local.example .env.local
```

## Spotify Setup (Optional)

To enable Spotify integration:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Get your Client ID and Client Secret
4. Generate a refresh token using the Spotify OAuth flow
5. Add these to your `.env.local` file:
   - `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`
   - `NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET`
   - `NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN`

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

Build for production:

```bash
npm run build
```

## Start Production Server

```bash
npm start
```

## Project Structure

```
wii-portfolio-next/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Start screen / Landing page
│   ├── home/              # Channel selection page
│   ├── experience/        # Experience page
│   ├── projects/          # Projects showcase
│   ├── spotify/           # Spotify integration
│   ├── resume/            # Resume viewer
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── pages/            # Page components
│   ├── ChannelComponent.tsx
│   ├── HomeFooter.tsx
│   ├── StartScreen.tsx
│   └── MobileFallback.tsx
├── contexts/             # React contexts
│   ├── ThemeContext.tsx
│   └── SoundContext.tsx
├── data/                 # Static data
│   └── links.ts         # Channel links
├── utils/               # Utility functions
│   └── spotify.ts       # Spotify API integration
├── public/              # Static assets
└── app/globals.css      # Global styles and animations
```

## Key Features

### Navigation
- **Start Screen**: Health warning screen (like Wii)
- **Home Page**: Grid of animated channels
- **Content Pages**: Swipeable pages with navigation arrows
- **Keyboard Navigation**: ESC to go home, arrow keys planned

### Animations
- Channel hover effects with parallax
- Zoom transitions between pages
- Sliding page transitions
- Rotating Spotify album art with 3D tilt
- Animated experience timeline

### Responsive Design
- Desktop-optimized experience
- Mobile fallback with essential links
- Adaptive grid layouts

## Customization

### Adding New Channels
Edit `data/links.ts`:

```typescript
{
  name: "channel-name",
  icon: "🎨",
  route: "/channel-route",
  gradient: "from-color-800 via-color-900 to-black",
}
```

Then create a new page in `app/channel-route/page.tsx`.

### Modifying Theme Colors
Edit Tailwind configuration in `app/globals.css` or add custom colors to the `@layer` directives.

## Notes

- The Vite version of this portfolio is in the adjacent `wii-portfolio-vite` folder (left untouched as requested)
- Sounds are currently disabled in the SoundContext
- The project uses the latest Tailwind CSS v4 with CSS-based configuration

## License

MIT

## Author

Will Whitehead
- LinkedIn: [willwhitehead122](https://www.linkedin.com/in/willwhitehead122/)
- GitHub: [w1lt](https://github.com/w1lt)
