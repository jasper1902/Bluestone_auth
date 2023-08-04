import fs from "fs";
import path from "path";

export const logger = (userAccount: {
  id: string;
  email: string;
  username: string;
}) => {
  const loginTime = new Date();

  const logFilePath = path.join(__dirname, "..", "logs", "login_history.json");

  const logData = {
    userId: userAccount.id,
    email: userAccount.email,
    username: userAccount.username,
    loginTime: loginTime.toISOString(),
  };

  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading login history:", err);
      return;
    }

    let logArray = [];

    try {
      const parsedData = JSON.parse(data);
      if (parsedData && parsedData.logs && Array.isArray(parsedData.logs)) {
        logArray = parsedData.logs;
      }
    } catch (parseError) {
      console.error("Error parsing login history JSON:", parseError);
    }

    logArray.push(logData);

    const updatedLogData = {
      logs: logArray,
    };

    fs.writeFile(
      logFilePath,
      JSON.stringify(updatedLogData, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing login history:", writeErr);
        }
      }
    );
  });
};
