import { command } from "commander";

const argvs = new Command();
argvs.options("--mode <mode>", "mode environment", "dev");
argvs.parse();

export default argvs.opts();