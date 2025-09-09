import { ReadAll } from "@/src/libs/sheets";

async function main() {
  const data = await ReadAll();
  console.log(data);
}

main();
