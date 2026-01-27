import { stringify } from "smol-toml";
import { readFile, writeFile, access } from "fs/promises";
import { join } from "path";

const POSTS_DIR = join(import.meta.dir, "..", "content", "posts");

interface FrontmatterEntry {
  filename: string;
  frontmatter: Record<string, unknown> | null;
}

async function readInput(): Promise<FrontmatterEntry[]> {
  const args = process.argv.slice(2);

  let jsonString: string;
  if (args.length > 0) {
    // Read from file argument
    jsonString = await readFile(args[0], "utf-8");
  } else {
    // Read from stdin
    jsonString = await Bun.stdin.text();
  }

  return JSON.parse(jsonString);
}

async function fileExists(filepath: string): Promise<boolean> {
  try {
    await access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function updateFrontmatter() {
  const entries = await readInput();

  let modifiedCount = 0;
  let skippedCount = 0;

  for (const entry of entries) {
    const { filename, frontmatter } = entry;

    if (!frontmatter) {
      console.log(`[SKIP] ${filename}: null frontmatter in input`);
      skippedCount++;
      continue;
    }

    const filepath = join(POSTS_DIR, filename);

    if (!(await fileExists(filepath))) {
      console.log(`[SKIP] ${filename}: file not found`);
      skippedCount++;
      continue;
    }

    const content = await readFile(filepath, "utf-8");
    const match = content.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+/);

    if (!match) {
      console.log(`[SKIP] ${filename}: no frontmatter block found`);
      skippedCount++;
      continue;
    }

    const newFrontmatter = stringify(frontmatter);
    const newContent = content.replace(
      /^\+\+\+\r?\n[\s\S]*?\r?\n\+\+\+/,
      `+++\n${newFrontmatter}+++`
    );

    await writeFile(filepath, newContent, "utf-8");
    console.log(`[MODIFIED] ${filename}`);
    modifiedCount++;
  }

  console.log(`\nSummary:`);
  console.log(`  Modified: ${modifiedCount} files`);
  console.log(`  Skipped: ${skippedCount} files`);
}

updateFrontmatter();
