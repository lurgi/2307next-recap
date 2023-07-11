import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";

interface IPosts {
  text: string[];
  data: {
    title: string;
    date: string;
  };
}

const Blog: NextPage<{ posts: IPosts[] }> = ({ posts }) => {
  console.log(posts);
  return (
    <div>
      <h1>here is blog session</h1>
    </div>
  );
};

export function getStaticProps() {
  const posts = readdirSync("./posts").map((post) => {
    const content = readFileSync(`./posts/${post}`, "utf-8");
    const text = matter(content)
      .content.replaceAll("\r", "")
      .split("\n")
      .filter((v) => v !== "");
    const data = matter(content).data;
    return { text, data };
  });
  return {
    props: {
      posts,
    },
  };
}

export default Blog;
