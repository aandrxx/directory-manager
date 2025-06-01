import { createDirectory, moveDirectory, deleteDirectory, listDirectory } from "../services/directory.service";
import { CommandArgs, CommandName } from "../services/command.service";
import { mapDirectoriesToTree, mapNodeToString } from "./directories.map";

type CommandHandler = (
  args: CommandArgs<CommandName>
) => Promise<string>;

/**
 * Maps commands to their handlers.
 * @type {Record<CommandName, CommandHandler>}
 */
export const commandsMap: Record<CommandName, CommandHandler> = {
  [CommandName.CREATE]: async (args: CommandArgs<CommandName.CREATE>) => {
    await createDirectory(args.path);
    return "";
  },
  [CommandName.MOVE]: async (args: CommandArgs<CommandName.MOVE>) => {
    await moveDirectory(args.sourcePath, args.targetPath);
    return "";
  },
  [CommandName.DELETE]: async (args: CommandArgs<CommandName.DELETE>) => {
    await deleteDirectory(args.path);
    return "";
  },
  [CommandName.LIST]: async (_args: CommandArgs<CommandName.LIST>) => {
    const directories = await listDirectory();
    const tree = mapDirectoriesToTree(directories);
    
    return tree.map((node) => mapNodeToString(node)).join("\n");
  },
};
