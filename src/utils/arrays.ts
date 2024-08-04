/**
 * Shifts the items in an array by one position to the right.
 * @param array - The array to shift.
 * @returns A new array with the items shifted by one position.
 * @template T - The type of elements in the array.
 */
export function shiftArrayItemsByOne<T>(array: T[]): T[] {
  if (array.length <= 1) {
    return array;
  }

  const lastItem = array[array.length - 1];
  const allOtherItems = array.slice(0, -1);

  return [lastItem, ...allOtherItems];
}

/**
 * Insert items into array at specific index, immutably
 * https://stackoverflow.com/a/38181008/15063835
 */
export const insertAtArrayIndex = (
  arr: unknown[],
  index: number,
  ...newItems: unknown[]
) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted items
  ...newItems,
  // part of the array after the specified index
  ...arr.slice(index),
];
