import "../styles/LoadingOverlay.css";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="logo-container">
        <img
          src="/assets/logo-tourgether.svg"
          alt="Tourgether Logo"
          className="logo base"
        />
        <img
          src="/assets/logo-tourgether-purlple.svg"
          alt="Tourgether Logo Colored"
          className="logo overlay"
        />
      </div>
    </div>
  );
};

export default LoadingOverlay;
