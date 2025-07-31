const BattleLog = ({ logs }) => {
  return (
    <div>
      <h3>Battle Log</h3>
      <div className="battle-log">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default BattleLog;