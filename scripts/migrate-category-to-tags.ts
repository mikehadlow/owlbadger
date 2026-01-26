import { parse, stringify } from "smol-toml";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const POSTS_DIR = join(import.meta.dir, "..", "content", "posts");

interface Frontmatter {
  params?: {
    category?: string;
    tags?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

async function migrateCategoryToTags() {
  const files = await readdir(POSTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  let modifiedCount = 0;
  let skippedCount = 0;

  for (const filename of mdFiles) {
    const filepath = join(POSTS_DIR, filename);
    const content = await readFile(filepath, "utf-8");
    const match = content.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+/);

    if (!match) {
      console.log(`[SKIP] ${filename}: No frontmatter found`);
      skippedCount++;
      continue;
    }

    const frontmatter = parse(match[1]) as Frontmatter;

    if (!frontmatter.params?.category) {
      skippedCount++;
      continue;
    }

    const category = frontmatter.params.category;

    // Initialize tags array if it doesn't exist
    if (!frontmatter.params.tags) {
      frontmatter.params.tags = [];
    }

    // Add category to tags if not already present
    if (!frontmatter.params.tags.includes(category)) {
      frontmatter.params.tags.push(category);
    }

    // Remove category field
    delete frontmatter.params.category;

    // Serialize and replace frontmatter
    const newFrontmatter = stringify(frontmatter);
    const newContent = content.replace(
      /^\+\+\+\r?\n[\s\S]*?\r?\n\+\+\+/,
      `+++\n${newFrontmatter}+++`
    );

    await writeFile(filepath, newContent, "utf-8");
    console.log(`[MODIFIED] ${filename}: Moved category "${category}" to tags`);
    modifiedCount++;
  }

  console.log(`\nSummary:`);
  console.log(`  Modified: ${modifiedCount} files`);
  console.log(`  Skipped: ${skippedCount} files`);
}

migrateCategoryToTags();
