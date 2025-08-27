import Image from "next/image";
import Link from "next/link";

const QuickLinks = () => {
  return (
    <section className="py-10 px-8">
      <main className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center rounded-full bg-transparent h-15 w-128 border-1">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://netflix.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Pay
          </a>
          <Link
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="/dashboard"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Dashboard
          </Link>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Pick your domain →
          </a>
        </main>
    </section>
  );
};

export default QuickLinks;
