import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "../../components/button";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { Product } from "@prisma/client";
import { cls } from "@/libs/client/utils";
import useMutation from "@/libs/client/mutation";
import useUser from "@/libs/client/useUser";
import client from "@/libs/server/client";

interface ProductWithUser extends Product {
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}

interface ISwrProductDetail {
  ok?: boolean;
  detail: ProductWithUser;
  relativeProducts: Product[];
  isLike: boolean;
}
const ItemDetail: NextPage<ISwrProductDetail> = ({
  detail,
  relativeProducts,
  isLike,
}) => {
  const router = useRouter();
  const user = useUser();
  const { id } = router.query;
  const { mutate: unboundMutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ISwrProductDetail>(
    id ? `/api/products/${id}` : null
  );
  const [toggleLike] = useMutation(id ? `/api/products/${id}/fav` : "");
  const onClickLike = () => {
    if (!data) return;
    boundMutate((prev) => prev && { ...prev, isLike: !prev.isLike }, false);
    toggleLike({});
  };
  if (router.isFallback) {
    return <h1>this is Loading page....</h1>;
  }
  return (
    <Layout canGoBack title="제품 상세">
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {detail?.user.name}
              </p>
              <p className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </p>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">{detail?.name}</h1>
            <span className="text-2xl block mt-3 text-gray-900">
              {detail?.price}
            </span>
            <p className=" my-6 text-gray-700">{detail?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                // onClick={onClickLike}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100 ",
                  isLike
                    ? "text-red-400 hover:text-red-500"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                <svg
                  className="h-6 w-6 "
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {relativeProducts?.map((product) => (
              <div key={product.id}>
                <div className="h-56 w-full mb-4 bg-slate-300" />
                <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  {product.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  console.log(ctx?.params?.id);
  const id = ctx?.params?.id;
  if (!id) {
    return {
      props: {},
    };
  }
  const detail = await client.product.findUnique({
    where: {
      id: +id?.toString()!,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = detail?.name.split(" ").map((v) => ({
    name: {
      contains: v,
    },
  }));
  const relativeProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: detail?.id,
        },
      },
    },

    take: 4,
  });
  const isLike = false;
  return {
    props: {
      detail,
      relativeProducts,
      isLike,
    },
  };
};

export default ItemDetail;
