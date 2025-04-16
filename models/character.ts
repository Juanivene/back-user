import { minLength, object, pipe, string, type InferInput } from "valibot";

export const characterSchema = object({
  name: pipe(string(), minLength(3)),
  lastName: pipe(string(), minLength(3)),
});

export type Character = InferInput<typeof characterSchema> & { id: number };

const characters: Map<number, Character> = new Map();

/**
 * Retrieves all characters from the collection.
 * @returns {Character[]} An array of all characters.
 */
export const getAllCharacters = (): Character[] => {
  return Array.from(characters.values());
};

/**
 * Retrieves a character by its ID.
 * @param {number} id - The ID of the character to retrieve.
 * @returns {Character | undefined} The character if found, otherwise undefined.
 */
export const getCharacterById = (id: number): Character | undefined => {
  return characters.get(id);
};

/**
 * Adds a new character to the collection.
 * @param {Character} character - The character to add.
 * @returns {Character} The newly added character with a generated ID.
 */
export const addCharacter = (character: Character): Character => {
  const newCharacter = {
    ...character,
    id: new Date().getTime(),
  };
  characters.set(newCharacter.id, newCharacter);

  return newCharacter;
};

/**
 * Updates an existing character by its ID.
 * @param {number} id - The ID of the character to update.
 * @param {Character} updatedCharacter - The updated character data.
 * @returns {Character | undefined} The updated character if successful, otherwise undefined.
 */
export const uppdateCharacter = (
  id: number,
  updatedCharacter: Character
): Character | undefined => {
  if (!characters.has(id)) {
    console.error("Character id not found");
    return undefined;
  }

  characters.set(id, updatedCharacter);
  return updatedCharacter;
};

/**
 * Deletes a character by its ID.
 * @param {number} id - The ID of the character to delete.
 * @returns {boolean} True if the character was deleted, false if not found.
 */
export const deleteCharacter = (id: number): boolean => {
  if (!characters.has(id)) {
    console.error("Character with id ", id, " not found");
    return false;
  }

  characters.delete(id);
  return true;
};
