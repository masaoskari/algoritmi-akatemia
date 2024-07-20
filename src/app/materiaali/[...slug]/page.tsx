import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";
import { Excercise } from "@/components/Excercise";
import { CodeEditor } from "@/components/CodeEditor";
import { MDXComponents } from "mdx/types";
import { getContentBySlug, getAllContentSlugs } from "@/lib/mdxUtils";
import rehypeHighlight from "rehype-highlight";

const options = {
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [rehypeHighlight],
  },
};

const components: MDXComponents = {
  Excercise: Excercise,
  CodeEditor: CodeEditor,
};

export default function ContentPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { content } = getContentBySlug(params.slug.join("/"));
  return (
    <div className="prose">
      <MDXRemote
        source={content}
        components={components}
        options={options}
      ></MDXRemote>
    </div>
  );
}
export async function generateStaticParams() {
  const slugs = getAllContentSlugs();
  return slugs.map((slug) => ({ slug: slug.split("/") }));
}
