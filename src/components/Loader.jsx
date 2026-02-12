import logoSapta from "@/assets/logo1.webp";

const Loader = ({ progress = 0 }) => {
  return (
    <div className="app-loader" role="status" aria-live="polite" aria-label="Loading">
      <div className="app-loader__inner">
        <div className="app-loader__ring" />
        <img src={logoSapta} alt="Sapta Home Textiles logo" className="app-loader__logo h-15" />
        <p className="app-loader__text">Preparing your cozy experience...</p>
        <div className="app-loader__progress" aria-hidden="true">
          <div className="app-loader__progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="app-loader__percent">{progress}%</p>
      </div>
    </div>
  );
};

export default Loader;
