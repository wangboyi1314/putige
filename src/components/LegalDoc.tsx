import { MobileNav } from "@/components/MobileNav";

interface LegalDocProps {
  title: string;
  children: React.ReactNode;
}

export function LegalDoc({ title, children }: LegalDocProps) {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-serif text-amber-200 tracking-widest mb-8 text-center">
          {title}
        </h1>
        <div className="glass-panel rounded-xl p-6 sm:p-8 space-y-4 text-amber-200/70 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export { MobileNav };
