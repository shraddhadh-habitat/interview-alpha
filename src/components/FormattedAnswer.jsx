import React from 'react';
import { formatLabeledText } from '../lib/formatText';

export default function FormattedAnswer({ text, style = {} }) {
  if (!text) return null;

  const formatText = (rawText) => {
    let formatted = rawText;

    // First, apply inline label formatting (Pro: Con: Use: etc. onto new lines)
    formatted = formatLabeledText(formatted);

    // Split into paragraphs on double newlines or sentence boundaries before key terms
    const keyTermPattern = /(Before I dive in|For the purpose of this answer|Clarifying questions|Example:|Goal:|Tradeoff:|Trade-off:|Metrics:|Risk:|Success metrics:|V1:|Key insight:|The key thing|I'd start by|What most people miss|The biggest risk|The tradeoff here|First:|Second:|Third:|Step \d|Approach:|Framework:|Why this matters:|Bottom line:|Assumptions:)/g;

    formatted = formatted.replace(keyTermPattern, '\n\n$1');

    // Split numbered items onto new lines
    formatted = formatted.replace(/(\d+\.\s)/g, '\n$1');

    // Split on bullet points
    formatted = formatted.replace(/([-•]\s)/g, '\n$1');

    const paragraphs = formatted.split('\n').filter(p => p.trim().length > 0);

    return paragraphs.map((para, i) => {
      let html = para.trim();

      // Bold text before colons at start of paragraph
      html = html.replace(/^([^:]{3,60}:)/, '<strong>$1</strong>');

      // Bold specific phrases
      html = html.replace(/(Before I dive in[^:]*:)/g, '<em>$1</em>');
      html = html.replace(/(For the purpose of this answer[^.]*\.)/g, '<strong>$1</strong>');
      html = html.replace(/(Key insight:)/g, '<strong>$1</strong>');
      html = html.replace(/(Bottom line:)/g, '<strong>$1</strong>');
      html = html.replace(/(The tradeoff here is)/g, '<strong>$1</strong>');
      html = html.replace(/(What most people miss is)/g, '<strong>$1</strong>');
      html = html.replace(/(The biggest risk is)/g, '<strong>$1</strong>');

      // Determine if this is a numbered item or bullet
      const isNumbered = /^\d+\./.test(html);
      const isBullet = /^[-•]/.test(html);
      const isIndented = isNumbered || isBullet;

      // Determine if this is a clarifying question intro
      const isClarifyingIntro = /Before I dive in/.test(html);

      return (
        <p
          key={i}
          style={{
            marginBottom: isIndented ? 6 : 14,
            marginLeft: isIndented ? 20 : 0,
            lineHeight: 1.75,
            fontSize: 15,
            color: '#1B1B18',
            fontStyle: isClarifyingIntro ? 'italic' : 'normal',
            ...style,
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    });
  };

  return <div>{formatText(text)}</div>;
}
