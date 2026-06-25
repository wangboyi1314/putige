interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  price: string;
  badge?: string;
}

export function FeatureCard({
  title,
  subtitle,
  description,
  href,
  icon,
  color,
  price,
  badge,
}: FeatureCardProps) {
  return (
    <a
      href={href}
      className={`group relative overflow-hidden rounded-2xl glass-panel bg-gradient-to-br ${color} p-5 transition-all hover:border-amber-400/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30`}
    >
      {badge && (
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/30 border border-amber-400/25 text-amber-200/80 text-[10px]">
          {badge}
        </span>
      )}
      <span className="text-2xl font-serif text-amber-300/90 mb-2 block">{icon}</span>
      <h3 className="text-amber-50 font-serif text-lg tracking-wide mb-0.5">{title}</h3>
      <p className="text-amber-200/45 text-[11px] tracking-wider mb-2">{subtitle}</p>
      <p className="text-amber-100/55 text-sm leading-relaxed mb-3 line-clamp-2">{description}</p>
      <p className="text-amber-400/60 text-xs">{price}</p>
    </a>
  );
}
