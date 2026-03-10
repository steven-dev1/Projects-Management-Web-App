export function capitalizeWords(str: string) {
  return str
    .toLowerCase()                    
    .replace(/(^|\s)\w/g, letra => letra.toUpperCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetcher = (...args: any) => fetch(args).then(res => res.json())