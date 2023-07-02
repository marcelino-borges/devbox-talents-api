import log, { logFunctionExportedForTesting } from "./logs";

describe("Logs", () => {
  const logSpyOriginal = jest
    .spyOn(console, "log")
    .mockImplementation(() => {});
  let logSpy = logSpyOriginal;
  const ERROR_STRING = "Test error";
  const WARN_STRING = "Test warn";
  const INFO_STRING = "Test info";
  const SUCCESS_STRING = "Test logConsole";
  const LOG_CONSOLE_STRING = "Test logConsole";

  const expect1Log = (str: string) => {
    expect(logSpy.mock.calls[1][1]).toBe(str);
  };

  const expect4Logs = (str: string) => {
    expect(logSpy.mock.calls[1][1]).toBe(str);
    expect(logSpy.mock.calls[2][1]).toBe(str);
    expect(logSpy.mock.calls[3][1]).toBe(str);
    expect(logSpy.mock.calls[4][1]).toBe(str);
  };

  afterEach(() => {
    logSpy.mockClear();
  });

  describe("Error logs", () => {
    it("log.error with 1 argument", () => {
      log.error(ERROR_STRING);
      expect1Log(ERROR_STRING);
    });

    it("log.error with many argument", () => {
      log.error(ERROR_STRING, ERROR_STRING, ERROR_STRING, ERROR_STRING);
      expect4Logs(ERROR_STRING);
    });
  });

  describe("Warn logs", () => {
    it("log.warn with 1 argument", () => {
      log.warn(WARN_STRING);
      expect1Log(WARN_STRING);
    });

    it("log.warn with many argument", () => {
      log.warn(WARN_STRING, WARN_STRING, WARN_STRING, WARN_STRING);
      expect4Logs(WARN_STRING);
    });
  });

  describe("Info logs", () => {
    it("log.info with 1 argument", () => {
      log.info(INFO_STRING);
      expect1Log(INFO_STRING);
    });

    it("log.info with many argument", () => {
      log.info(INFO_STRING, INFO_STRING, INFO_STRING, INFO_STRING);
      expect4Logs(INFO_STRING);
    });
  });

  describe("Success logs", () => {
    it("log.success with 1 argument", () => {
      log.success(SUCCESS_STRING);
      expect1Log(SUCCESS_STRING);
    });

    it("log.success with many argument", () => {
      log.success(
        SUCCESS_STRING,
        SUCCESS_STRING,
        SUCCESS_STRING,
        SUCCESS_STRING
      );
      expect4Logs(SUCCESS_STRING);
    });
  });

  describe("Function logConsole", () => {
    it("log.logConsole with 1 argument", () => {
      logFunctionExportedForTesting.logConsole(LOG_CONSOLE_STRING);

      log.warn("---------------- CALLS: ", logSpy.mock.calls);

      expect(logSpy.mock.calls[0][1]).toBe(LOG_CONSOLE_STRING);
    });

    it("log.logConsole with many argument", () => {
      logFunctionExportedForTesting.logConsole(
        LOG_CONSOLE_STRING,
        LOG_CONSOLE_STRING
      );

      expect(logSpy.mock.calls[0][1]).toBe(LOG_CONSOLE_STRING);
      expect(logSpy.mock.calls[1][1]).toBe(LOG_CONSOLE_STRING);
    });
  });
});
