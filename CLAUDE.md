# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

1. Never run `git push`. Only the user is allow to push to origin.

## Project Overview

Owlbadger is a static music and book review blog hosted at owlbadger.com, built with Hugo and styled with Bulma CSS.

## Commands

- **Run locally:** `hugo server` (live reloads on file changes)
- **Build for production:** `hugo --minify`

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
    category = "Art"  # or "Music"
    book-author = "Author Name"  # for book reviews
    started = "2026-01-14"
    completed = "2026-01-24"
+++
```

## Workflow

1. Add markdown file to `/content/posts/` (filename convention: `YYYY-MM-DD-slug.md`)
2. Add cover image to `/static/img/`
3. Commit and push to `master` - GitHub Actions handles deployment
