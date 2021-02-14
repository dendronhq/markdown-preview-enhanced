import { DendronError } from "@dendronhq/common-all";
import { createLogger } from "@dendronhq/common-server";
import * as _ from "lodash";
import { ExtensionContext, OutputChannel, window, workspace } from "vscode";
//import { CONFIG, DENDRON_CHANNEL_NAME } from "./constants";

export type TraceLevel = "debug" | "info" | "warn" | "error" | "fatal";
const levels = ["debug", "info", "warn", "error", "fatal"];
export type LogPayload = Partial<{
  ctx: string;
  err: DendronError;
  msg: string;
  friendly: string;
}>;

export const UNKNOWN_ERROR_MSG = `You found a bug! We didn't think this could happen but you proved us wrong. Please file the bug here -->  https://github.com/dendronhq/dendron/issues/new?assignees=&labels=&template=bug_report.md&title= We will put our best bug exterminators on this right away!`;
const DENDRON_CHANNEL_NAME = "Dendron Preview";

export class Logger {
  static output: OutputChannel | undefined;
  static logger: ReturnType<typeof createLogger> | undefined;
  static logPath?: string;

  static configure(context: ExtensionContext, level: TraceLevel) {
    const ctx = "Logger:configure";
    // fs.ensureDirSync(context.logPath);
    // const logPath = path.join(context.logPath, "dendron.log");
    // if (fs.existsSync(logPath)) {
    //   fs.moveSync(logPath, `${logPath}.old`, { overwrite: true });
    // }
    // fs.ensureFileSync(logPath);
    let log_level: string;
    const conf = workspace.getConfiguration();
    log_level = conf.get<string>("LOG_LEVEL") || "info";
    // setEnv("LOG_DST", logPath);
    // setEnv("LOG_LEVEL", log_level);
    // Logger.logPath = logPath;
    // this.logger = createLogger("dendron", logPath);
    this.level = level;
    Logger.info({ ctx, msg: "exit", log_level });
  }
  private static _level: TraceLevel = "debug";

  static cmpLevel(lvl: TraceLevel): boolean {
    return levels.indexOf(lvl) >= levels.indexOf(Logger.level || "debug");
  }

  /**
   * Is lvl1 >= lvl2
   * @param lvl1
   * @param lvl2
   */
  static cmpLevels(lvl1: TraceLevel, lvl2: TraceLevel): boolean {
    return levels.indexOf(lvl1) >= levels.indexOf(lvl2);
  }

  static get level() {
    return this._level;
  }
  static set level(value: TraceLevel) {
    this._level = value;
    this.output =
      this.output || window.createOutputChannel(DENDRON_CHANNEL_NAME);
  }

  // private static lvl2Method = (lvl: TraceLevel) => {
  //     return {
  //         [NoSilentTraceLevel.Debug]: 'debug',
  //         [NoSilentTraceLevel.Info]: 'info',
  //         [NoSilentTraceLevel.Warn]: 'warn',
  //         [NoSilentTraceLevel.Error]: 'error',
  //         [NoSilentTraceLevel.Fatal]: 'fatal',
  //     }[lvl];
  // }

  static error(msg: LogPayload) {
    Logger.log(msg, "error");
  }

  static info(msg: any, show?: boolean) {
    Logger.log(msg, "info", { show });
  }

  static debug(msg: any) {
    Logger.log(msg, "debug");
  }

  static log = (
    msg: LogPayload,
    lvl: TraceLevel,
    _opts?: { show?: boolean },
  ) => {
    if (Logger.cmpLevel(lvl)) {
      let stringMsg = customStringify(msg);
      Logger.logger && Logger.logger[lvl](msg);
      Logger.output?.appendLine(lvl + ": " + stringMsg);
      // FIXME: disable for now
      const shouldShow = false; // getStage() === "dev" && cleanOpts.show;
      if (shouldShow || Logger.cmpLevels(lvl, "error")) {
        let cleanMsg = stringMsg;
        if (Logger.cmpLevels(lvl, "error")) {
          if (!_.isUndefined(msg?.friendly)) {
            cleanMsg = msg.friendly;
          }
          if (!_.isUndefined(msg?.err?.friendly)) {
            cleanMsg = msg.err!.friendly;
          }
          window.showErrorMessage(cleanMsg);
        } else if (Logger.cmpLevels(lvl, "info")) {
          window.showInformationMessage(cleanMsg);
        }
      }
    }
  };
}

const customStringify = function(v: any) {
  const cache = new Set();
  return JSON.stringify(v, function(_key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        // Circular reference found
        try {
          // If this value does not reference a parent it can be deduped
          return JSON.parse(JSON.stringify(value));
        } catch (err) {
          // discard key if value cannot be deduped
          return;
        }
      }
      // Store value in our set
      cache.add(value);
    }
    return value;
  });
};
