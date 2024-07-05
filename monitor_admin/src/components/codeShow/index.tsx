import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import './index.less';
import 'prismjs/themes/prism-twilight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';

interface CodeShowIn {
  hightLine?: number;
  start?: number;
  end?: number;
  children: string;
}

export const CodeShow: React.FC<CodeShowIn> = ({ children, hightLine, start = 1, end }) => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      // Setting up the highlight element after Prism processes the lines
      setTimeout(() => {
        Prism.highlightAll();
        const lineNumberElement = preRef.current.querySelector('.line-numbers');
        if (lineNumberElement) {
          console.log('Setting line number start:', start);
          lineNumberElement.setAttribute('style', `counter-reset: linenumber ${start - 1}`);
        }
        const highlightElement = preRef.current.querySelector('.line-highlight');
        if (highlightElement) {
          console.log('Setting highlight element styles');
          const styles = highlightElement.getAttribute('style') || '';
          highlightElement.setAttribute('style', `${styles}; background: rgba(0, 255, 155, 0.3)`);
        }
      }, 10); // Using timeout to ensure Prism's processing is done before setting the style
    }
  }, [children, hightLine, start, end]);

  return (
    <pre ref={preRef} data-line={hightLine ? `${hightLine}` : undefined}>
      <code className="language-javascript line-numbers">{children}</code>
    </pre>
  );
};
