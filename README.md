# ZoneHub - Static Gaming Platform

A modern gaming platform built with Next.js, TypeScript, and JSON-based data storage. Designed for static deployment on GitHub Pages.

## Features

- **Static Site Generation**: Fully static site that can be deployed to GitHub Pages
- **JSON Database**: File-based data storage with articles, games, and reviews
- **Modern UI**: Built with Shadcn/ui components and Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful responsive layouts
- **Gaming Content**: Game library, news articles, and user reviews
- **No Authentication Required**: Simplified for static deployment

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/your-username/zonehub.git
cd zonehub
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

5. **Export static files**
```bash
npm run export
```

## Data Management

### JSON Database Structure

The application uses JSON files for data storage:

- `data/articles.json` - News articles and blog posts
- `data/games.json` - Game library
- `data/reviews.json` - Game reviews

### Adding Content

#### Adding a New Article

Edit `data/articles.json`:

```json
{
  "id": "unique-article-id",
  "title": "Article Title",
  "slug": "article-slug",
  "summary": "Brief summary",
  "content": "<p>HTML content</p>",
  "cover_image": "https://placekitten.com/800/400",
  "category": "Gaming",
  "tags": ["tag1", "tag2"],
  "is_featured": true,
  "publish_date": "2024-01-15T10:00:00Z",
  "status": "published",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z",
  "views": 0,
  "comments_count": 0,
  "likes": 0
}
```

#### Adding a New Game

Edit `data/games.json`:

```json
{
  "id": "unique-game-id",
  "title": "Game Title",
  "developer": "Developer Name",
  "publisher": "Publisher Name",
  "release_date": "DD/MM/YYYY",
  "description": "Game description",
  "platform": ["ps5", "pc"],
  "genre": ["action", "adventure"],
  "rating": 4.5,
  "downloads": 1000000,
  "status": "published",
  "featured": true,
  "image": "https://placekitten.com/800/600",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Images

The project uses placeholder images from [PlaceKitten](https://placekitten.com/). You can replace these with actual images by:

1. Adding images to `public/images/games/` or `public/images/news/`
2. Updating the image URLs in the JSON files

## Deployment to GitHub Pages

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as the source

2. **Create GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Push to main branch**
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Your site will be available at `https://your-username.github.io/zonehub/`

## Project Structure

```
zonehub/
├── app/                    # Next.js app directory
│   ├── news/              # News pages
│   ├── games/             # Games pages
│   └── api/               # API routes (for development)
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── news/             # News-specific components
│   └── games/            # Games-specific components
├── data/                 # JSON database files
│   ├── articles.json
│   ├── games.json
│   └── reviews.json
├── lib/                  # Utility libraries
│   └── json-db.ts       # JSON database utilities
├── public/               # Static assets
│   └── images/          # Images for games and news
└── styles/              # Global styles
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Data Storage**: JSON files
- **Deployment**: GitHub Pages (Static Export)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Add your content to the appropriate JSON files
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.