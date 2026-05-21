import React from 'react';

const HeroBackground = () => {
  React.useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes ia-drift {
        0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
        50% { transform: translate(-50%, -50%) translateY(-6px); }
      }
      @keyframes ia-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @keyframes ia-float {
        0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
        25% { transform: translate(-50%, -50%) translate(4px, -3px); }
        50% { transform: translate(-50%, -50%) translate(-2px, -6px); }
        75% { transform: translate(-50%, -50%) translate(-4px, 2px); }
      }
      @media (prefers-reduced-motion: reduce) {
        [data-animated] { animation: none !important; }
      }
    `;
    document.head.appendChild(styleEl);
    console.log('[HeroBackground] Keyframes injected into document head');
    return () => {
      document.head.removeChild(styleEl);
      console.log('[HeroBackground] Keyframes removed');
    };
  }, []);

  const cols = 14;
  const rows = 6;
  const shapes = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      const isFilled = [
        // Row 0: scattered fills
        2,3,4,8,9,10,11,
        // Row 1: center cluster
        18,19,20,21,25,27,
        // Row 2: sparse
        31,32,
        // Row 3: very sparse
        44,
        // Row 4-5: mostly empty
      ].includes(index);

      const shapeType = index % 7 === 0 ? 'triangle' : index % 5 === 0 ? 'square' : 'circle';

      const animType = Math.random();
      let animation = 'none';
      let animationDelay = '0s';
      let isAnimated = false;

      if (animType < 0.08) {
        animation = 'ia-drift 7s ease-in-out infinite';
        animationDelay = (Math.random() * 5).toFixed(1) + 's';
        isAnimated = true;
      } else if (animType < 0.14) {
        animation = 'ia-pulse 5s ease-in-out infinite';
        animationDelay = (Math.random() * 5).toFixed(1) + 's';
        isAnimated = true;
      } else if (animType < 0.20) {
        animation = 'ia-float 10s ease-in-out infinite';
        animationDelay = (Math.random() * 5).toFixed(1) + 's';
        isAnimated = true;
      }

      shapes.push({
        row, col, index,
        filled: isFilled,
        type: shapeType,
        animation,
        animationDelay,
        isAnimated,
      });
    }
  }

  const animatedShapes = shapes.filter(s => s.isAnimated);
  console.log('[HeroBackground] Animated shapes:', animatedShapes.length, 'out of', shapes.length);
  if (animatedShapes.length > 0) {
    console.log('[HeroBackground] Sample animated shape:', animatedShapes[0]);
  }

  const animatedCount = shapes.filter(s => s.animation !== 'none').length;
  console.log('HeroBackground rendering, shapes:', shapes.length, 'animated:', animatedCount);

  const visibleShapes = shapes.filter(s => !(s.col < 6 && s.row > 1 && s.row < 5));
  console.log('Total shapes:', shapes.length, 'Visible:', visibleShapes.length);

  const renderShape = (shape) => {
    const size = 32;
    const gapX = 100 / cols;
    const gapY = 100 / rows;
    const x = shape.col * gapX + gapX / 2;
    const y = shape.row * gapY + gapY / 2;
    const color = shape.filled ? '#FDCD34' : 'rgba(0,0,0,0.12)';
    // All shapes visible, no text occlusion

    const style = {
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      animation: shape.animation,
      animationDelay: shape.animationDelay,
    };

    if (shape.type === 'circle') {
      return (
        <div
          key={shape.index}
          data-animated={shape.isAnimated ? 'true' : undefined}
          style={{
            ...style,
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: shape.filled ? color : 'transparent',
            border: shape.filled ? 'none' : '2px solid rgba(0,0,0,0.12)',
          }}
        />
      );
    }

    if (shape.type === 'square') {
      return (
        <div
          key={shape.index}
          data-animated={shape.isAnimated ? 'true' : undefined}
          style={{
            ...style,
            width: size - 4,
            height: size - 4,
            borderRadius: 3,
            backgroundColor: shape.filled ? color : 'transparent',
            border: shape.filled ? 'none' : '2px solid rgba(0,0,0,0.12)',
          }}
        />
      );
    }

    if (shape.type === 'triangle') {
      if (shape.filled) {
        return (
          <div
            key={shape.index}
            data-animated={shape.isAnimated ? 'true' : undefined}
            style={{
              ...style,
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
            }}
          />
        );
      } else {
        return (
          <svg
            key={shape.index}
            width={size}
            height={size}
            viewBox="0 0 28 28"
            data-animated={shape.isAnimated ? 'true' : undefined}
            style={{...style}}
          >
            <polygon points="14,2 26,26 2,26" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5"/>
          </svg>
        );
      }
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {shapes.map(renderShape)}
    </div>
  );
};

export default HeroBackground;
