import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class ActionError extends Error {
  constructor(
    message: string,
    options: { code: 500 | 400 | 404 | 401 | 403 | 409 | 422 | 429 | 503 },
  ) {
    super(message);
    (this.name = "ActionError"), (this.cause = options.code);
  }
}

export function firstLetterToUpperCase(firstName: string, lastName: string) {
  if (!firstName[0] || !lastName[0]) return;
  const firstLetter = firstName[0].toLocaleUpperCase();
  const lastLetter = lastName[0].toLocaleUpperCase();

  return firstLetter + lastLetter;
}
