import Document, { Head, Html, Main, NextScript } from "next/document";

export default function MyDocument() {
  return (
    <Html lang="ko">
      <Head lang="ko">
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// class CustomDocument extends Document {
//   render(): JSX.Element {
//     return (
//       <Html>
//         <Head lang="ko">
//           <link
//             href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
//             rel="stylesheet"
//           ></link>
//         </Head>
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }

// // export default CustomDocument;
