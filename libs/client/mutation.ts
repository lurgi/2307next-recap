import { useState } from "react";

interface IuseMutationState<T> {
  isLoading: boolean;
  data?: T;
  error?: any;
}
type UseMuationReturn<T> = [(data: any) => void, IuseMutationState<T>];

export default function useMutation<T = any>(Url: string): UseMuationReturn<T> {
  const [state, setState] = useState<IuseMutationState<T>>({
    isLoading: false,
    data: undefined,
    error: undefined,
  });
  function mutation(data: any) {
    setState((prev) => ({ ...prev, isLoading: true }));
    fetch(Url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      //catch를 써주는 이유는 json()함수에서 오류가 나는지 확인하기 위해서.
      //response에 json이 없을 경우 에러 없이 return된다.
      .then((response) => response.json().catch(() => {}))
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, isLoading: false })));
  }
  return [mutation, { ...state }];
}
