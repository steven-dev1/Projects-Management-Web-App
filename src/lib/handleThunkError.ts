export function handleThunkError(err: unknown, fallback = "Error inesperado"): string {
  return err instanceof Error ? err.message : fallback;
}