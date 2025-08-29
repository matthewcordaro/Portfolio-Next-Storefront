import { Message } from "../types"

/**
 * Logs the provided error to the console and returns a standardized error object.
 *
 * @param error - The error to be handled. Can be of any type.
 * @returns An object containing a `message` property with the error message if the input is an `Error`,
 *          or a generic message if the error type is unknown.
 */
export function renderError(error: unknown): Message {
  console.log(error)
  return {
    message:
      error instanceof Error ? error.message : "an unknown error occurred",
    error: true,
  }
}