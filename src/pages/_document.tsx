import { Head, Html, Main, NextScript } from 'next/document';

export default function document() {
    return (
        <Html>
            <title>NAM</title>
            <Head>
                <meta name="description" content="Mirrors and shit" />
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:image" content="/hero-image-dark.png" />
                <meta name="theme-color" content="#000" />
                <meta name="twitter:card" content="summary_large_image"></meta>
            </Head>
            <body className="bg-white text-black dark:bg-[#101010] dark:text-white ">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
