import fs = require("fs");
import log4js = require("log4js");
import {Level, levels, Logger} from "log4js";

// create the log directory if not yet existing
const path: string = "logs";
if (!fs.existsSync(path)) {
  fs.mkdirSync(path);
}

log4js.configure("log4js.json", {reloadSecs: 300});

const allLevels: Level[] = [
  levels.DEBUG,
  levels.TRACE,
  levels.INFO,
  levels.WARN,
  levels.ERROR,
  levels.FATAL,
  levels.ALL,
];
const loggers: Map<Logger, Level> = new Map<Logger, Level>();

export * from "log4js";

export let logger = log4js.getLogger("default");

export function getLogger(category: string) {
  const categoryLogger: Logger = log4js.getLogger(category);
  loggers.set(categoryLogger, getLevel(categoryLogger));
  return categoryLogger;
}

export function disableLogging() {
  loggers.forEach((val: Level, key: Logger, map: Map<Logger, Level>) => key.setLevel(levels.OFF));
}

export function enableLogging() {
  loggers.forEach((val: Level, key: Logger, map: Map<Logger, Level>) => key.setLevel(val));
}

export function setLevel(category: string, level: string): void {
  const categoryLogger: log4js.Logger = log4js.getLogger(category);
  const savedLevel: log4js.Level = loggers.get(categoryLogger);
  loggers.set(categoryLogger, log4js.levels.toLevel(level, savedLevel));
  categoryLogger.setLevel(level);
  getLevel(categoryLogger);
}

export function getLevel(categoryLogger: Logger): Level {
  let evaluatedLevel: Level = levels.OFF;
  allLevels.forEach((level) => {
    if (categoryLogger.isLevelEnabled(level)) {
      if (evaluatedLevel === levels.OFF) {
        evaluatedLevel = level;
      }
    }
  });
  return evaluatedLevel;
}
