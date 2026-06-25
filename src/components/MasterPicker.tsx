"use client";

import { MASTERS, type Master } from "@/lib/masters";

interface MasterPickerProps {
  value: string;
  onChange: (id: string) => void;
}

export function MasterPicker({ value, onChange }: MasterPickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-amber-300/70 text-sm text-center">请选一位师父为您开示</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MASTERS.map((m) => (
          <MasterCard key={m.id} master={m} selected={value === m.id} onSelect={() => onChange(m.id)} />
        ))}
      </div>
    </div>
  );
}

function MasterCard({
  master,
  selected,
  onSelect,
}: {
  master: Master;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left p-4 rounded-xl border transition-all ${
        selected
          ? "border-amber-400/45 bg-amber-400/10 shadow-md shadow-amber-900/20"
          : "border-amber-400/15 bg-amber-950/20 hover:border-amber-400/30"
      }`}
    >
      <p className="text-amber-200 font-serif">{master.name}</p>
      <p className="text-amber-500/50 text-[10px] mb-2">{master.title}</p>
      <p className="text-amber-400/60 text-[10px] mb-1">{master.style}</p>
      <p className="text-amber-300/45 text-[11px] leading-relaxed">{master.description}</p>
    </button>
  );
}
