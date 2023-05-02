export function truncateString(str, n){
    return (str.length > n) ? str.slice(0, n) + '...' : str;
  };