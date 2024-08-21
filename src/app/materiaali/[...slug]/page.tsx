import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";
import "@/app/globals.css";
import { Excercise } from "@/components/Excercise";
import { MultipleChoiceExercise } from "@/components/MultipleChoiceExercise";
import { CodeEditor } from "@/components/CodeEditor";
import { ExamplePrint } from "@/components/ExamplePrint";
import { MDXComponents } from "mdx/types";
import { getContentBySlug, getAllContentSlugs } from "@/lib/mdxUtils";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [[rehypePrettyCode, { theme: "one-light" }], rehypeKatex],
  },
};

const components: MDXComponents = {
  Harjoitus: Excercise,
  KoodiEditori: CodeEditor,
  EsimerkkiTulostus: ExamplePrint,
  MonivalintaHarjoitus: MultipleChoiceExercise,
};

export default function ContentPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { content } = getContentBySlug(params.slug.join("/"));
  return (
    <div className="prose mx-auto">
      <MDXRemote
        source={content}
        components={components}
        //TODO: Consider removing ts-ignore and fix typing...
        // @ts-ignore
        options={options}
      ></MDXRemote>
    </div>
  );
}
export async function generateStaticParams() {
  const slugs = getAllContentSlugs();
  return slugs.map((slug) => ({ slug: slug.split("/") }));
}
