

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditorPanel.css';

const CodeEditorPanel = () => {
  const [code, setCode] = useState('// Type your answer here!');
  // const [language, setLanguage] = useState('javascript');
  // const [framework, setFramework] = useState('React');
  const language = 'javascript';

  return (
    <div className="code-editor-panel">
      <div className="editor-header">
        <div className="selector">
          Selected Language - <span className="tag js">JS</span>
        </div>
        <div className="selector">
          Selected Framework - <span className="tag react">React</span>
        </div>
      </div>
      <div className="editor-body">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value)}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            fontFamily: 'Fira Mono, monospace'
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;
