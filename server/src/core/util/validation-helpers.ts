/**
 * Checks whether the arg has exactly the specified keys. That is
 * `keys` should be all the keys that are in `arg`, no more, no less.
 */
export function hasExactlyKeys<T extends object>(
  arg: T,
  keys: (keyof T)[]
): boolean {
  return (
    keys.length === Object.keys(arg).length && keys.every((key) => key in arg)
  );
}

/**
 * returns true if object only has keys from the
 * given list of allowed keys
 * @param arg
 * @param allowedKeys
 */
export function hasOnlyAllowedKeys(arg: any, allowedKeys: string[]) {
  return !Object.keys(arg).some((key) => !allowedKeys.includes(key));
}

/**
 * return true iff `arg` is a number
 * @param arg
 */
export function isNumber(arg: any) {
  return typeof arg === "number";
}
