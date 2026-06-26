export type RuntimeEnv = Record<string, string | undefined>;

export function envGet(key: string, env?: RuntimeEnv): string | undefined {
  const fromBinding = env?.[key];
  if (fromBinding !== undefined && fromBinding !== "") return fromBinding;
  return process.env[key];
}
