import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_PATH = path.join(process.cwd(), "src/content");

function getFilePaths(dir: string): string[] {
  let result: string[] = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      result = result.concat(getFilePaths(path.join(dir, file.name)));
    } else {
      result.push(path.join(dir, file.name));
    }
  }
  return result;
}

export function getAllContentSlugs() {
  const slugs = [];
  for (const filePath of getFilePaths(CONTENT_PATH)) {
    if (path.extname(filePath) === ".mdx") {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      slugs.push(data.slug);
    }
  }
  return slugs;
}

export function getAllContentFrontMatters() {
  const frontMatters: Record<string, string>[] = [];
  for (const filePath of getFilePaths(CONTENT_PATH)) {
    if (path.extname(filePath) === ".mdx") {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      frontMatters.push(data);
    }
  }
  return frontMatters;
}

export function getContentBySlug(slug: string) {
  for (const filePath of getFilePaths(CONTENT_PATH)) {
    if (path.extname(filePath) === ".mdx") {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { content, data } = matter(fileContents);
      console.log("data.slug", data.slug, "slug", slug);
      if (data.slug === slug) {
        return { content, data };
      }
    }
  }
  return { content: "", data: {} };
}
