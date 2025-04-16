import { compare, hash } from "bcrypt";
import {
  email,
  minLength,
  object,
  pipe,
  string,
  type InferInput,
} from "valibot";

const emailSchema = pipe(string(), email());
const passwordSchema = pipe(string(), minLength(6));

export const authSchema = object({
  email: emailSchema,
  password: passwordSchema,
});

export enum role {
  "ADMIN" = "admin",
  "USER" = "user",
}

export type User = InferInput<typeof authSchema> & {
  id: number;
  role: "admin" | "user";
  refreshToken?: string;
};

const users: Map<string, User> = new Map();

/**-
 * Create a new user wih the given email and password
 * The password is hashed before storing
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<User>} - The created user
 */
export const createUser = async (
  email: string,
  password: string
): Promise<User> => {
  const hashedPassword = await hash(password, 10);

  const newUser: User = {
    id: Date.now(),
    email,
    password: hashedPassword,
    role: role.USER,
  };
  users.set(email, newUser);
  return newUser;
};

/**
 * Find a user by their given email.
 *
 * @param {string} email - The email of the user to find-.
 * @return {User | undefined} - The user if found, otherwise undefined.
 */
export const findUserByEmail = (email: string): User | undefined => {
  return users.get(email);
};

/**Validates a user´s password
 * @param {User} user - The user whose password is to be validated.
 * @param {string} password - The password to validate.
 * @returns {Promise<boolean>} - True if the password is valid, false otherwise.
 */
export const validatePassword = async (
  user: User,
  password: string
): Promise<boolean> => {
  return compare(password, user.password);
};

/**
 * Revoke token
 *
 * @param {string} email - The email of the user whose token is to be revoked.
 * @return {boolean} - True if the token was revoked, false otherwise.
 */
export const revokeUserToken = (email: string): boolean => {
  const foundUser = users.get(email); // Busca al usuario en el Map por su email.
  if (!foundUser) return false; // Si no encuentra al usuario, devuelve false.

  users.set(email, { ...foundUser, refreshToken: undefined });
  // Si encuentra al usuario, crea una nueva entrada en el Map con los mismos datos del usuario,
  // pero con el campo refreshToken establecido como undefined (es decir, lo elimina).

  return true; // Devuelve true indicando que el token fue revocado exitosamente.
};

