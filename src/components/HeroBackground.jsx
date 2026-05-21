import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const HeroBackground = () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const shapes = useMemo(() => {
    const items = [];
    const gridCols = 12;
    const gridRows = 8;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const x = (col / gridCols) * 100;
        const y = (row / gridRows) * 100;
        const type = ['circle', 'square', 'triangle'][(row * gridCols + col) % 3];
        const isAnimated = Math.random() < 0.15;
        const isYellow = Math.random() < 0.12;
        const isNearCenter = (x > 20 && x < 80 && y > 25 && y < 75);

        items.push({
          id: `${row}-${col}`,
          x: x + (Math.random() * 4 - 2),
          y: y + (Math.random() * 4 - 2),
          type,
          size: 4 + Math.random() * 6,
          opacity: isNearCenter ? 0.06 : 0.12,
          isAnimated: isAnimated && !prefersReduced,
          color: isYellow && !isNearCenter ? '#FDCD34' : '#E8E6E1',
          animDelay: Math.random() * 8,
          animDuration: 6 + Math.random() * 8,
        });
      }
    }
    return items;
  }, []);

  const renderShape = (shape) => {
    const baseStyle = {
      position: 'absolute',
      left: `${shape.x}%`,
      top: `${shape.y}%`,
    };

    const animProps = shape.isAnimated ? {
      animate: {
        x: [0, (Math.random() - 0.5) * 5, 0],
        y: [0, (Math.random() - 0.5) * 4, 0],
        opacity: [shape.opacity, shape.opacity * 1.5, shape.opacity],
      },
      transition: {
        duration: shape.animDuration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: shape.animDelay,
      }
    } : {};

    if (shape.type === 'circle') {
      return (
        <motion.div
          key={shape.id}
          style={{
            ...baseStyle,
            width: shape.size,
            height: shape.size,
            borderRadius: '50%',
            backgroundColor: shape.color,
            opacity: shape.opacity,
          }}
          {...animProps}
        />
      );
    }

    if (shape.type === 'square') {
      return (
        <motion.div
          key={shape.id}
          style={{
            ...baseStyle,
            width: shape.size,
            height: shape.size,
            borderRadius: 1,
            backgroundColor: shape.color,
            opacity: shape.opacity,
          }}
          {...animProps}
        />
      );
    }

    if (shape.type === 'triangle') {
      return (
        <motion.div
          key={shape.id}
          style={{
            ...baseStyle,
            width: 0,
            height: 0,
            borderLeft: `${shape.size/2}px solid transparent`,
            borderRight: `${shape.size/2}px solid transparent`,
            borderBottom: `${shape.size}px solid ${shape.color}`,
            opacity: shape.opacity,
            backgroundColor: 'transparent',
          }}
          {...animProps}
        />
      );
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
