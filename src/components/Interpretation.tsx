interface InterpretationProps {
  content: string;
  loading?: boolean;
}

export function Interpretation({ content, loading }: InterpretationProps) {
  if (loading) {
    return (
      <div className="p-6 rounded-xl border border-amber-800/20 bg-amber-950/10 animate-pulse">
        <div className="h-4 bg-amber-800/20 rounded w-3/4 mb-3" />
        <div className="h-4 bg-amber-800/20 rounded w-full mb-3" />
        <div className="h-4 bg-amber-800/20 rounded w-5/6 mb-3" />
        <div className="h-4 bg-amber-800/20 rounded w-2/3" />
        <p className="text-amber-600/60 text-sm mt-4 text-center">正在研读古籍，为您解读...</p>
      </div>
    );
  }

  const lines = content.split("\n");

  return (
    <div className="p-6 rounded-xl border border-amber-800/20 bg-amber-950/10">
      <div className="prose prose-invert prose-amber max-w-none">
        {lines.map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <h3 key={i} className="text-amber-300 font-serif text-lg mt-4 mb-2 first:mt-0">
                {line.replace("## ", "")}
              </h3>
            );
          }
          if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <p key={i} className="text-amber-200 font-medium my-1">
                {line.replace(/\*\*/g, "")}
              </p>
            );
          }
          if (line.startsWith("> ")) {
            return (
              <blockquote key={i} className="border-l-2 border-amber-700/50 pl-4 text-amber-500/80 italic my-2">
                {line.replace("> ", "")}
              </blockquote>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <li key={i} className="text-amber-300/80 text-sm ml-4 my-0.5">
                {line.replace("- ", "")}
              </li>
            );
          }
          if (line.trim() === "") return <br key={i} />;
          return (
            <p key={i} className="text-amber-200/80 text-sm leading-relaxed my-1">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        })}
      </div>
    </div>
  );
}
