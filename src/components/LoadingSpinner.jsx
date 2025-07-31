const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="card">
      <div className="loading">
        <div className="spinner"></div>
        {message}
      </div>
    </div>
  );
};

export default LoadingSpinner;