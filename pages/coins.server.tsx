import { Suspense } from "react";

let finished = false;

function List() {
  // throw new Promise((resolve) => null); //Pending 상태
  if (!finished) {
    throw Promise.all([
      new Promise((resolve) => setTimeout(resolve, 5000)),
      //5초간 Pending 상태, 이후 fullfilled.
      new Promise((resolve) => {
        finished = true;
        resolve("");
      }),
    ]);
  } else {
  }
  return <ul>xxxxxxx</ul>;
}

export default function Coins() {
  return (
    <>
      <h1>here is RSC</h1>
      <Suspense fallback="Rendering in the server...">
        <List />
      </Suspense>
    </>
  );
}
