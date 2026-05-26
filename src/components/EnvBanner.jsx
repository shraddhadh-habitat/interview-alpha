export default function EnvBanner() {
  const env = import.meta.env.VITE_APP_ENV || 'production';
  if (env === 'production') return null; // hide on prod

  const bannerStyle = env === 'staging'
    ? {
        background: 'linear-gradient(135deg, #f97316, #ef4444)',  // orange-red for staging
        label: '⚠️ STAGING ENVIRONMENT — Not live'
      }
    : {
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',  // green for local
        label: '🛠 LOCAL DEVELOPMENT'
      };

  return (
    <div style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      zIndex: 99999,
      background: bannerStyle.background,
      color: '#ffffff',
      textAlign: 'center',
      padding: '6px',
      fontSize: '0.78rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {bannerStyle.label}
    </div>
  );
}
