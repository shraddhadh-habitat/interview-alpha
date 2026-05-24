// InterviewAlpha Theme Constants
export const BRAND_GRADIENT = 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)';
export const LISTEN_GRADIENT = 'linear-gradient(135deg, #c084fc 0%, #a78bfa 35%, #d4a017 75%, #f5c842 100%)';

export const gradientText = {
  background: BRAND_GRADIENT,
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
  fontWeight: 700,
};

export const gradientBg = {
  background: BRAND_GRADIENT,
  color: '#ffffff',
  border: 'none',
};

export const gradientButton = {
  ...gradientBg,
  borderRadius: '10px',
  fontWeight: 600,
  padding: '10px 20px',
  cursor: 'pointer',
  display: 'inline-block' as const,
};
