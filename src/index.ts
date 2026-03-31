import { Command } from "commander";
import { defaultCommand } from "./commands/default.js";
import { installCommand } from "./commands/install.js";
import { updateCommand } from "./commands/update.js";
import { listCommand } from "./commands/list.js";

const program = new Command();

program
  .name("kai")
  .description("Generate Claude Code instruction files for your project")
  .version("0.1.0")
  .action(defaultCommand);

program
  .command("install")
  .description("Install instruction sets")
  .action(installCommand);

program
  .command("update")
  .description("Update installed instruction sets")
  .action(updateCommand);

program
  .command("list")
  .description("List available instruction sets")
  .action(listCommand);

program.parse();
