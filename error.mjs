/*
 * Purpose: Provides a consistent way of handling API errors.
 *
 * Details: This module provides functionality for both server-side and browsers.
 */

/*
 * Purpose: Wraps any content given in an error wrapper.
 */
function setError(content) {
  return { error: content };
}

/*
 * Purpose: Recognizes any error wrappers.
 */
function isError(obj) {
  return obj.error;
}

export { setError, isError };
