const revokeToken: Set<string> = new Set();

/**
 * Adds a token to the revoked tokens set.
 * @param {string} token - The token to revoke.
 * @returns {void}
 */
export const addRevokeToken = (token: string): void => {
  revokeToken.add(token);
};

/**
 * Checks if a token is revoked.
 * @param {string} token - The token to check.
 * @returns {boolean} True if the token is revoked, false otherwise.
 */
export const isTokenRevoked = (token: string): boolean => {
  return revokeToken.has(token);
};
