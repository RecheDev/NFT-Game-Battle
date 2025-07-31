const ErrorCard = ({ title, message, additionalInfo }) => {
  return (
    <div className="card">
      <div className="error">
        <h3>{title}</h3>
        <p>{message}</p>
        {additionalInfo && <p>{additionalInfo}</p>}
      </div>
    </div>
  );
};

export default ErrorCard;
