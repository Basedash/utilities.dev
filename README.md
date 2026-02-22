# utilities.dev

A collection of essential developer tools for everyday coding tasks. Simple, fast, and free online utilities made by the team at [Basedash](https://www.basedash.com?ref=utilities.dev).

## 🛠️ Example Utilities

### Base64 Encoding
- Encode and decode text using Base64 encoding
- Perfect for handling binary data in text format
- Copy results to clipboard
- Real-time conversion
- **Access**: `/base64-encoding`

### JSON Formatter
- Format, prettify, and validate JSON data
- Minify JSON for production use
- Syntax error detection with detailed messages
- Size and statistics display
- **Access**: `/json-formatter`

### Regex Tester
- Test regular expressions with real-time matching
- Support for all regex flags (global, case-insensitive, multiline, etc.)
- Match highlighting and detailed results
- Capture group analysis
- **Access**: `/regex-tester`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm

### Installation

```bash
git clone git@github.com:Basedash/utilities.dev.git
cd utilities.dev
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
pnpm build
pnpm start
```

### Utility Index Scripts

```bash
pnpm gen:utilities      # one-time index generation
pnpm watch:utilities    # watch manifests and regenerate
```

## ➕ Adding a New Utility

1. Create a route directory: `app/your-utility-slug/`
2. Add these files:
   - `page.tsx`
   - `layout.tsx`
   - `utils.ts`
   - `utils.test.ts`
   - `manifest.ts`
3. Export the utility metadata from `manifest.ts` (title, description, tags, icon, etc.)
4. `pnpm dev` picks it up automatically in homepage search + sitemap

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Package Manager**: pnpm

## 📱 Features

- **Search**: Find utilities quickly with real-time search
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode**: Automatic theme switching
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Performance**: Optimized for speed and lighthouse scores

## 🔎 SEO Setup

- Root and utility pages now use dynamic Open Graph and Twitter images.
- OG image route: `/api/og` (root) and `/api/og?utility=<slug>` (utility-specific).
- Structured data (JSON-LD) is added for the website and each utility page.
- Sitemap and robots are generated from utility manifests.

Set a production URL for correct canonical and OG links:

```bash
NEXT_PUBLIC_SITE_URL=https://utilities.dev
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new utilities
- Improve existing tools
- Fix bugs
- Enhance documentation
