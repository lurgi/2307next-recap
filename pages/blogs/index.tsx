import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface IPosts {
  text: string[];
  url: string;
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
      <ul>
        {posts.map((post, i) => (
          <li key={i} className="py-2">
            <Link href={`/blogs/${post.url}`}>{post.data.title}</Link>
          </li>
        ))}
      </ul>
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
    const url = post.split(".")[0];
    return { text, data, url };
  });
  return {
    props: {
      posts,
    },
  };
}

export default Blog;
