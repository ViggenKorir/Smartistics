import Image from "next/image";
import Link from "next/link";

const QuickLinks = () => {
  return (
    <section className="py-10 px-4 sm:px-8">
      <main className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap items-center justify-center rounded-2xl bg-transparent w-full max-w-3xl mx-auto border p-4">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={20}
            height={20}
          />
          Payment
        </a>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/dashboard"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={20}
            height={20}
          />
          Distribution
        </Link>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={20}
            height={20}
          />
          Platforms →
        </a>
      </main>
    </section>
  );
};

export default QuickLinks;
