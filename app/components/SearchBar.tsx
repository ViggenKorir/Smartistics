"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Sync with URL search parameters
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    setQuery(urlQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("query", query);
      router.push(`/search?${params.toString()}`);
    } else {
      params.delete("query");
      router.push(`/search?${params.toString()}`);
    }
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
    if (pathname === "/search") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("query");
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center bg-white shadow-md rounded-full p-1 transition-all duration-200 ${
        isFocused ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <label htmlFor="search" className="sr-only">
        Search Courses
      </label>
      <div className="relative flex-grow flex items-center">
        <input
          ref={inputRef}
          type="search"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search courses, topics, or instructors..."
          className="w-full p-2 pl-4 pr-8 bg-gray-100 text-gray-800 rounded-full outline-none transition-all duration-200"
          aria-label="Search courses"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Clear search"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="p-2 ml-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
        aria-label="Submit search"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
