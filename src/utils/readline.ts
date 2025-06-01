import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Closes the readline interface
 */
export const closeInterface = (): void => {
  rl.close();
};

/**
 * Reads input from the user
 * @param question The question to display to the user
 * @returns A promise that resolves with the user's input
 */
const readInput = async (
  question: string
): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(`${question} `, (answer) => {
      resolve(answer);
    });
  });
};

/**
 * Reads validated input from the user
 * @param question The question to display to the user
 * @param validator A function that validates the input
 * @param errorMessage The error message to display if validation fails
 * @returns A promise that resolves with the validated user input
 */
export const readValidatedInput = async (
  question: string,
  validator: (input: string) => boolean,
  errorMessage: string = 'Invalid input. Please try again.'
): Promise<string> => {
  let input: string;
  let isValid = false;

  do {
    input = await readInput(question);
    isValid = validator(input);

    if (!isValid) {
      console.log(errorMessage);
    }
  } while (!isValid);

  return input;
};
