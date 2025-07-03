/**
 * indicating if all elements of a set are in the b set.
 * temporary substitute of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSubsetOf Please remove this function when the standard Set class method function is available.
 * @param a
 * @param b
 */
export function isSubsetOf<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size > b.size) {
    return false;
  } else {
    for (const aItem of a) {
      if (!b.has(aItem)) {
        return false;
      }
    }
    return true;
  }
}
