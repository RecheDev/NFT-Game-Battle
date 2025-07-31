// Battle utility functions
export const getHealthPercentage = (current, max) => {
  return Math.max(0, (current / max) * 100);
};

export const getHealthBarClassName = (current, max) => {
  const percentage = getHealthPercentage(current, max);
  return `health-fill ${percentage < 25 ? 'low' : ''}`;
};

export const formatTimestamp = () => {
  return new Date().toLocaleTimeString();
};

export const addBattleLogEntry = (message, prevLogs, maxLogEntries = 10) => {
  const timestamp = formatTimestamp();
  return [...prevLogs, `[${timestamp}] ${message}`].slice(-maxLogEntries);
};
