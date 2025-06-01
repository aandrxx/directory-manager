import { processArgs } from "./utils/args";
import { closeInterface, readValidatedInput } from "./utils/readline";
import { isCommandValid, buildCommand } from "./services/command.service";
import { testConnection, initDatabase } from "./config/db";
import { commandsMap } from "./mappers/commands.map";

interface AppConfig {
  args: Record<string, string | undefined>;
  mode: "interactive" | "command";
}

export default class App {
  private config: AppConfig;

  constructor() {
    this.config = this.initConfig();
  }

  async run() {
    await this.initializeDatabase();

    switch (this.config.mode) {
      case "interactive":
        return this.runInteractiveMode();
      case "command":
        return this.runCommandMode();
      default:
        throw new Error("Invalid app mode.");
    }
  }

  private async initializeDatabase() {
    const connected = await testConnection();
    if (!connected) {
      throw new Error("Failed to connect to the database");
    }

    await initDatabase();
  }

  private async runInteractiveMode() {
    do {
      const commandString = await readValidatedInput(
        'Enter a command (or "exit" to quit):',
        (commandString) =>
          commandString === "exit" || isCommandValid(commandString),
        "Please enter a valid command."
      );

      if (commandString === "exit") break;

      try {
        await this.executeCommand(commandString);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    } while (true);

    closeInterface();
  }

  private async runCommandMode() {
    const commandString = this.config.args["--command"];
    if (!commandString) throw new Error("No command provided.");

    await this.executeCommand(commandString);
  }

  private initConfig(): AppConfig {
    const args = processArgs(process.argv.slice(2));

    return {
      args,
      mode: Object.values(args).length > 0 ? "command" : "interactive",
    };
  }

  private async executeCommand(commandString: string) {
    const command = buildCommand(commandString);
    const result = await commandsMap[command.name](command.args);
    !!result && console.log(result);
  }
}
