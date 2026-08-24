import { ReactNode } from "react";

export default function SimplePage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-[820px] px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2.5 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] sm:leading-[1] tracking-[-0.06em] text-[#102a2d]">
        {title}
      </h1>
      <div className="prose-section">{children}</div>
    </main>
  );
}

