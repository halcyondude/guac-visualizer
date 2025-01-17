"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import { MoonIcon, SunIcon, Bars3Icon } from "@heroicons/react/24/solid";
import GuacVizThemeContext from "@/store/themeContext";
import Link from "next/link";
import packageJson from "../../package.json";

export default function Header() {
  const { isDarkTheme, toggleThemeHandler } = useContext(GuacVizThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function NavigationLinks() {
    return (
      <>
        <a
          className="block py-1 text-sm text-gray-800 dark:text-stone-300 hover:bg-white dark:hover:bg-black rounded-xl p-3 my-2"
          href="https://github.com/guacsec/guac-visualizer"
          target="blank"
        >
          GitHub
        </a>
        <a
          className="block py-1 text-sm text-gray-800 dark:text-stone-300 hover:bg-white dark:hover:bg-black rounded-xl p-3 my-2"
          href="https://docs.guac.sh/"
          target="blank"
        >
          GUAC Docs
        </a>
        <a
          className="block py-1 text-sm text-gray-800 dark:text-stone-300 hover:bg-white dark:hover:bg-black rounded-xl p-3 my-2"
          href="https://guac.sh/community/"
        >
          Community
        </a>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between bg-stone-200 dark:bg-stone-800 text-zinc-600 px-4 md:px-8 py-4 items-center backdrop-blur-sm w-full font-mono transition-colors duration-500">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex flex-col md:flex-row items-center hover:text-stone-500 dark:hover:text-stone-400 transition-colors duration-500">
              <Image
                className="dark:white-filter transition-all duration-500"
                src="images/icons/guac-logo.svg"
                alt="GUAC Logo"
                width={27}
                height={27}
              />
              <span className="text-gray-400 pl-3 ml-3"> *Experimental </span>
              <h1 className="ml-2 text-2xl dark:text-stone-300 transition-all duration-500">
                GUAC Visualizer{" "}
                <span className="text-sm dark:text-stone-300">
                  v{packageJson.version}
                </span>
              </h1>
            </div>
          </Link>
        </div>
        <div className="hidden md:flex w-1/3 flex-wrap justify-between items-center">
          <div className="flex">
            <NavigationLinks />
          </div>
          <div>
            <button
              className="hover:text-stone-500 dark:hover:text-stone-400 transition-all duration-500"
              type="button"
              onClick={toggleThemeHandler}
            >
              {isDarkTheme ? (
                <SunIcon className="h-8 w-8 text-stone-300 transition-all duration-500" />
              ) : (
                <MoonIcon className="h-8 w-8 text-zinc-600 transition-all duration-500" />
              )}
            </button>
          </div>
        </div>
        <div className="md:hidden">
          <button
            className="hover:text-stone-500 dark:hover:text-stone-400 transition-all duration-500"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Bars3Icon className="h-8 w-8 text-zinc-600 transition-all duration-500" />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="flex flex-col items-end z-50 bg-stone-200 dark:bg-stone-800 text-zinc-600 font-mono transition-colors duration-500">
          <NavigationLinks />
        </div>
      )}
    </>
  );
}
