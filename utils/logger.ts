interface StreamConsole {
  log(...args): void;
  warn(...args): void;
  error(...args): void;
  debug(...args): void;
}

class NodeDefaultConsole implements StreamConsole {
  log(...args) {
    console.log(...args);
  }

  warn(...args) {
    console.warn(...args);
  }

  error(...args) {
    console.error(...args);
  }

  debug(...args) {
    console.log(...args);
  }
}

export class Logger {
  private prefix: string;
  private target: any;
  private severity: number;

  constructor(prefix: string = '', severity = 1, target: StreamConsole = new NodeDefaultConsole()) {
    this.prefix = prefix;
    this.target =  target;
  }

  debug(...args) {
    this.severity <= 0 && this.target.log(this.prefix, ...args);
  }

  log(...args) {
    this.severity <= 1 && this.target.log(this.prefix, ...args);
  }

  warn(...args) {
    this.severity <= 2 && this.target.warn(this.prefix, ...args);
  }

  error(...args) {
    this.severity <= 3 && this.target.error(this.prefix, ...args);
  }

}