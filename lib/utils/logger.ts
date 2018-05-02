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

export enum LogSeverity {
  DEBUG = 0,
  LOG = 1,
  WARNING = 2,
  ERROR = 3,
};

export class Logger {
  private prefix: string;
  private target: any;
  private severity: number;

  constructor(prefix: string = '', severity: LogSeverity = 1, target: StreamConsole = new NodeDefaultConsole()) {
    this.prefix = prefix;
    this.target =  target;
    this.severity = severity;
  }

  debug(...args) {
    this.severity <= LogSeverity.DEBUG && this.target.log(this.prefix, ...args);
  }

  log(...args) {
    this.severity <= LogSeverity.LOG && this.target.log(this.prefix, ...args);
  }

  warn(...args) {
    this.severity <= LogSeverity.WARNING && this.target.warn(this.prefix, ...args);
  }

  error(...args) {
    this.severity <= LogSeverity.ERROR && this.target.error(this.prefix, ...args);
  }

}