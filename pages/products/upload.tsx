import type { NextPage } from "next";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/mutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Product } from "@prisma/client";

interface IProductForm {
  name: string;
  price: string;
  description: string;
}

interface IUploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const { register, handleSubmit } = useForm<IProductForm>();
  const [upLoadProduct, { isLoading, data, error }] =
    useMutation<IUploadProductMutation>("/api/products");
  const onValid = (data: IProductForm) => {
    if (isLoading) return;
    upLoadProduct(data);
  };
  const router = useRouter();
  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Upload Product">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <div>
          <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input className="hidden" type="file" />
          </label>
        </div>
        <Input
          register={register("name", {
            required: true,
          })}
          label="Name"
          type="text"
        />
        <Input
          register={register("price", {
            required: true,
          })}
          label="Price"
          placeholder="0.00"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", {
            required: true,
          })}
          name="description"
          label="Description"
        />
        <Button text={isLoading ? "Loading..." : "Upload item"} />
      </form>
    </Layout>
  );
};

export default Upload;
