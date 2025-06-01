export enum CommandName {
  CREATE = "CREATE",
  MOVE = "MOVE",
  DELETE = "DELETE",
  LIST = "LIST",
}

const COMMAND_ARGUMENTS = {
  [CommandName.CREATE]: ["path"] as const,
  [CommandName.MOVE]: ["sourcePath", "targetPath"] as const,
  [CommandName.DELETE]: ["path"] as const,
  [CommandName.LIST]: [] as const,
} as const;

export type CommandArgs<T extends CommandName> = Record<
  (typeof COMMAND_ARGUMENTS)[T][number],
  string
>;

interface Command<T extends CommandName> {
  name: T;
  args: CommandArgs<T>;
}

/**
 * Splits a command string into a name and arguments.
 * @param command The command string to split
 * @returns A tuple containing the command name and arguments
 */
const splitCommandString = (command: string): [CommandName, ...string[]] => {
  const [name, ...args] = command.split(" ");
  return [name as CommandName, ...args];
};

/**
 * Validates a command string.
 * @param command The command string to validate
 * @returns True if the command is valid, false otherwise
 */
export const isCommandValid = (command: string): boolean => {
  const [name, ...args] = splitCommandString(command);

  if (!Object.values(CommandName).includes(name)) return false;

  if (args.length !== COMMAND_ARGUMENTS[name].length) return false;

  if (args.some((arg) => !arg)) return false;

  return true;
};

/**
 * Parses a command string and returns a Command object.
 * @param command The command string to parse
 * @returns The parsed Command object
 */
export const buildCommand = (command: string): Command<CommandName> => {
  const [name, ...args] = splitCommandString(command);

  return {
    name,
    args: args.reduce(
      (acc: CommandArgs<typeof name>, arg, index) => {
        return { ...acc, [COMMAND_ARGUMENTS[name][index]]: arg };
      },
      {} as CommandArgs<typeof name>
    ),
  };
};
