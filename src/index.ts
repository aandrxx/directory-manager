import App from "./app";
import { createDirectory } from "./services/directory.service";

const processError = (error: unknown) => {
  if (error instanceof Error) {
    console.error("An error occurred:", error.message);
  } else {
    console.error("An unknown error occurred.");
  }
  process.exit(1);
}

const main = async (): Promise<void> => {
  try {
    const app = new App();
    await app.run();

    process.exit(0);
  } catch (error) {
    processError(error);
  }
};

main().catch((error: unknown) => {
  processError(error);
});
