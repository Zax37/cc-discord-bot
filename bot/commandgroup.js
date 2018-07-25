class CommandGroup {
  constructor() {
    this.commands = [];
  }

  add(command, aliases) {
    this.commands.push({ command, aliases });
  }

  parse(command) {
    let ret = false;
    this.commands.some(cmd => cmd.aliases.some(alias => {
      if (command === alias) {
        ret = cmd;
        return true;
      }
    }));
    return ret;
  }
}

module.exports = CommandGroup;
