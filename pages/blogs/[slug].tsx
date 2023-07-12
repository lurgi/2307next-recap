import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import { unified } from "unified";

const Post: NextPage<{ post: string }> = ({ post }) => {
  return (
    <div
      className="blog-post-content"
      dangerouslySetInnerHTML={{ __html: post }}
    ></div>
  );
};

export function getStaticPaths() {
  const files = readdirSync("./posts").map((title) => {
    const [name, _] = title.split(".");
    return { params: { slug: name } };
  });
  return {
    paths: files,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params!;
  const file = matter.read(`./posts/${slug}.md`);
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(file.content);
  return {
    props: {
      post: value,
    },
  };
};

export default Post;
