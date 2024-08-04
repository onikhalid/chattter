/**
 * Returns whether a value is either a string or an array of strings.
 * @param value - The value to check.
 * @returns True if the value is a string or an array of strings, false otherwise.
 */
export function isStringOrArrayOfStrings(
  value: unknown
): value is string | string[] {
  return (
    typeof value === 'string' ||
    (Array.isArray(value) && value.every(item => typeof item === 'string'))
  );
}

/**
 * @param string A string in lower or upper case to be converted to title case.
 * @returns The input string formatted to title case.
 * KPONGETTE becomes Kpongette
 * https://stackoverflow.com/a/196991/15063835
 */
export function convertToTitleCase(string: string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * @param string First string in a sentence is capitalized
 * @returns The input string formatted to title case.
 * basically edmund@gmail.com becomes Edmund@gmail.com
 * https://stackoverflow.com/a/196991/15063835
 */
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @param string A string (in kebab or snake case) to be converted to title case.
 * @returns The input string formatted to title case.
 * transactions__today-tomorrow becomes Transactions Today Tomorrow
 * https://stackoverflow.com/a/64489760/15063835
 */
export function convertKebabAndSnakeToTitleCase(string: string | undefined) {
  if (!string) {
    return '';
  }

  // Remove hyphens and underscores
  const formattedString = string
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());

  return convertToTitleCase(formattedString);
}

/**
 * @param string A user's (full, first or last) name.
 * @returns The intials of the user.
 */
export const getInitials = (string: string) => {
  const names = string.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }

  return initials;
};

/**
 * @param string The original heading of the page.
 * @returns The acronym to represent the page name or the original page name.
 */
export const getPageInitials = (string: string) => {
  const names = string.split(' ');

  if (names.length === 1) {
    return string;
  }

  let initials = '';

  for (const name of names) {
    initials += name.substring(0, 1).toUpperCase();
  }

  return initials;
};
