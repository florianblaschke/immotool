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
