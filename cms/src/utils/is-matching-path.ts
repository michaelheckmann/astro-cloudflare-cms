/**
 * Checks if a given test path matches a specified pattern.
 *
 * The function compares the directory structure, file base name, and file extension
 * of the pattern and test path. The base name of the file in the pattern can optionally
 * have a numeric suffix in the test path.
 *
 * @param pattern - The pattern path to match against. It can include directories and a file name with an extension.
 * @param testPath - The path to be tested against the pattern.
 * @returns `true` if the test path matches the pattern, `false` otherwise.
 */
export const isMatchingPath = (pattern: string, testPath: string): boolean => {
  // Split both paths into components
  const patternParts = pattern.split("/");
  const testParts = testPath.split("/");

  // If path depth is different, return false
  if (patternParts.length !== testParts.length) {
    return false;
  }

  // Get the filenames (last parts)
  const patternFile = patternParts[patternParts.length - 1];
  const testFile = testParts[testParts.length - 1];

  // Split filenames into base and extension
  const [patternBase, patternExt] = patternFile.split(".");
  const [testBase, testExt] = testFile.split(".");

  // Check if extensions match
  if (patternExt !== testExt) {
    return false;
  }

  // Check if directories match (if any)
  for (let i = 0; i < patternParts.length - 1; i++) {
    if (patternParts[i] !== testParts[i]) {
      return false;
    }
  }

  // Create regex pattern for base name with optional number suffix
  const regexPattern = `^${patternBase}(-\\d+)?$`;

  return new RegExp(regexPattern).test(testBase);
};
