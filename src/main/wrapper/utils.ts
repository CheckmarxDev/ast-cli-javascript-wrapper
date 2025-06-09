export function  getTrimmedMapValue(map: Map<string, string>, targetKey: string): string | undefined {
  const entries = Array.from(map.entries());

  for (const [key, value] of entries) {
    if (key.trim() === targetKey) {
      return value.trim();
    }
  }

  return undefined;
}