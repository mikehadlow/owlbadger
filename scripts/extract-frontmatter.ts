import { parse } from "smol-toml";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const POSTS_DIR = join(import.meta.dir, "..", "content", "posts");

async function extractFrontmatter() {
  const files = await readdir(POSTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const results = await Promise.all(
    mdFiles.map(async (filename) => {
      const content = await readFile(join(POSTS_DIR, filename), "utf-8");
      const match = content.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+/);

      if (!match) {
        return { filename, frontmatter: null };
      }

      const frontmatter = parse(match[1]);
      return { filename, frontmatter };
    })
  );

  console.log(JSON.stringify(results, null, 2));
}

extractFrontmatter();
