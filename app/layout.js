import { DM_Sans } from "next/font/google";
import "./globals.css";
export const metadata = {
  title: "Google Gemini Token Counter",
  description:
    "A simple tool to count the number of tokens in a given text using google gemini token counter",
  keywords: "gemini, gemini-pro,gemini-pro-latest, token counter, token count",
};

const dmsans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmsans.className} dark:bg-black dark:text-white  text-black bg-white flex flex-col min-h-screen  justify-between`}
      >
        {children}

        <footer className="flex mb-3 text-2xl justify-center w-full">
          Created by&nbsp;
          <a
            href="https://dbanswan.com"
            target="_blank"
            className="bg-orange-600 px-1 text-white flex justify-center items-center gap-x-1 rounded-md"
          >
            @dbanswan{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </footer>
      </body>
    </html>
  );
}
