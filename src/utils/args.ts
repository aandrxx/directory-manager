const SUPPORTED_ARGS = ["--command"];

/**
 * Validates the command-line arguments
 * @param args The command-line arguments
 * @returns True if the arguments are valid, throws an error otherwise
 */
export const validateArgs = (args: string[]): [boolean, string | undefined] => {
  if (args.length === 0) return [true, undefined];

  if (args.length > 1) return [false, "Too many arguments."];

  const [arg, value] = args[0].split("=");

  if (!SUPPORTED_ARGS.includes(arg) || value === undefined)
    return [false, "Invalid argument."];

  return [true, undefined];
};

type Args = Record<typeof SUPPORTED_ARGS[number], string | undefined>;

/**
 * Processes the command-line arguments
 * @param args The command-line arguments
 * @returns The processed arguments
 */
export const processArgs = (args: string[]): Args => {
  const [isValid, errorText] = validateArgs(args);
  if (!isValid) throw new Error(errorText);

  return args.reduce((acc: Args, arg) => {
    const [argName, value = undefined] = arg.split("=");
    return { ...acc, [argName]: value };
  }, {});
};
