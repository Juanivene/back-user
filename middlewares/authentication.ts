import { IncomingMessage, ServerResponse } from "http";
import { verify, type JwtPayload } from "jsonwebtoken";
import { isTokenRevoked } from "../models";
import { config } from "../config";

/**
 * Extends the IncomingMessage interface to include an optional user property.
 */
export interface AuthenticatedRequest extends IncomingMessage {
  /**
   * The decoded JWT payload or string representing the authenticated user.
   */
  user?: JwtPayload | string;
}

/**
 * Middleware to authenticate a JWT token from the request headers.
 * @param {AuthenticatedRequest} req - The incoming HTTP request.
 * @param {ServerResponse} res - The outgoing HTTP response.
 * @returns {Promise<boolean>} A promise that resolves to true if the token is valid, false otherwise.
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: ServerResponse
): Promise<boolean> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // ["bearer"], ["adsbabdua21u912jbcsa"]

  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Unauthorizated" }));
    return false;
  }

  if (isTokenRevoked(token)) {
    res.statusCode = 403;
    res.end(JSON.stringify({ message: "Forbidden" }));
    return false;
  }

  try {
    const decoded = verify(token, config.jwtSecret);
    req.user = decoded;
    return true;
  } catch (_err) {
    res.statusCode = 403;
    res.end(JSON.stringify({ message: "Forbidden" }));
    return false;
  }
};
