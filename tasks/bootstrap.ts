if (Deno.args.length === 0) {
  console.error("Usage: deno task run-sample <sample>");
  Deno.exit(1);
}

const sample = Deno.args[0];

const cmd = new Deno.Command(Deno.execPath(), {
  args: ["run", "-A", "--env", `tasks/${sample}.ts`],
});
const { code } = await cmd.spawn().output();
Deno.exit(code);
