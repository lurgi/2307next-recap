import { readdirSync } from "fs";
import { NextPage } from "next";

const Post: NextPage = () => {
  return <h1>here is Post</h1>;
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

export function getStaticProps() {
  return {
    props: {},
  };
}

export default Post;
