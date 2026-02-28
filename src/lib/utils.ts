export function capitalizeWords(str: string) {
  return str
    .toLowerCase()                    
    .replace(/(^|\s)\w/g, letra => letra.toUpperCase());
}