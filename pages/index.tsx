import type { NextPage } from "next";
import FloatingButton from "../components/floating-button";
import Item from "../components/item";
import Layout from "../components/layout";
import useUser from "@/libs/client/useUser";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import client from "@/libs/server/client";
import { Suspense } from "react";

interface ProductWithFavs extends Product {
  _count: {
    favs: number;
  };
}

interface ISwrResponse {
  ok?: boolean;
  products: ProductWithFavs[];
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<ISwrResponse>("/api/products");
  return (
    <Layout title="홈" hasTabBar>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            comments={1}
            hearts={product?._count?.favs}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

//ISR
// export async function getStaticProps() {
//   console.log("Revalidate!");
//   const products = await client.product.findMany({
//     include: {
//       _count: {
//         select: {
//           favs: true,
//         },
//       },
//     },
//   });
//   return {
//     props: {
//       products: JSON.parse(JSON.stringify(products)),
//     },
//   };
// }

// const Page: NextPage<{ products: ProductWithFavs[] }> = ({ products }) => {
//   console.log(products);
//   return (
//     <SWRConfig
//       value={{
//         suspense: true,
//       }}
//     >
//       <Suspense fallback={<span>LoadConfig...</span>}>
//         <Home />
//       </Suspense>
//     </SWRConfig>
//   );
// };

// export async function getServerSideProps() {
//   const products = await client.product.findMany({});
//   return {
//     props: {
//       products: JSON.parse(JSON.stringify(products)),
//     },
//   };
// }

export default Home;
