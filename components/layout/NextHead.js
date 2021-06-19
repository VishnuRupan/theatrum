import Head from "next/head";

const NextHead = ({ title, desc, year }) => {
  return (
    <Head>
      <title>
        Theatrum - {title} {year}
      </title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={desc} />
    </Head>
  );
};

export default NextHead;
