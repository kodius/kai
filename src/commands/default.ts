import { intro, select, isCancel } from "@clack/prompts";
import { readConfig } from "../services/config.js";
import { installCommand } from "./install.js";
import { updateCommand } from "./update.js";

export async function defaultCommand(): Promise<void> {
  const config = await readConfig();

  if (!config) {
    return installCommand();
  }

  intro("kai");

  const action = await select({
    message: "kai is already configured. What would you like to do?",
    options: [
      {
        value: "install" as const,
        label: "Install additional instruction sets",
      },
      {
        value: "update" as const,
        label: "Update existing instruction sets",
      },
    ],
  });

  if (isCancel(action)) {
    process.exit(0);
  }

  if (action === "install") {
    return installCommand();
  }

  return updateCommand();
}
