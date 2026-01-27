# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

1. Never run `git push`. Only the user is allow to push to origin.

## Project Overview

Owlbadger is a static music and book review blog hosted at owlbadger.com, built with Hugo and styled with Bulma CSS.

## Commands

- **Run locally:** `hugo server` (live reloads on file changes)
- **Build for production:** `hugo --minify`
- **Extract frontmatter:** `bun run scripts/extract-frontmatter.ts` - Outputs JSON array of all post filenames and their parsed TOML frontmatter

Deployment is automated via GitHub Actions on push to `master` - builds and deploys to GitHub Pages.

## Architecture

```
content/posts/     # Markdown review posts (90+ posts)
static/img/        # Cover images for reviews
layouts/           # Hugo templates
  _default/        # baseof.html, single.html, list.html
  index.html       # Homepage with card-based post listing
  partials/        # Reusable template components
themes/owlbadger/  # Custom theme
hugo.toml          # Site configuration
```

## Content Format

Posts use TOML front matter:

```toml
+++
title = "Review Title"
date = 2026-01-24
author = "Mike Hadlow"
[params]
    image = "/img/cover-image.jpg"
    book-author = "Author Name"  # for book reviews
    started = "2026-01-14"
    completed = "2026-01-24"
    tags = ["book", "History"]
+++
```

## Sidebar

The homepage and tag pages display a hierarchical tag sidebar. Tags are organized as a two-level hierarchy based on the `tags` array in post frontmatter:

- **First tag** → parent category (e.g., "book", "music")
- **Remaining tags** → children under that parent (e.g., "History", "Science")

The sidebar is rendered by `layouts/partials/tag-sidebar.html` and links to tag archive pages at `/tags/<tag-name>/`.

## Workflow

1. Add markdown file to `/content/posts/` (filename convention: `YYYY-MM-DD-slug.md`)
2. Add cover image to `/static/img/`
3. Commit and push to `master` - GitHub Actions handles deployment
