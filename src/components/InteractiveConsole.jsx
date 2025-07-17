import React, { useState, useEffect } from 'react';
import "../stylesFolder/InteractiveConsole.css"
const InteractiveConsole = () => {
  const phrases = [
    "print('Hello World!')",
    "function hello() { return 'Hi!' }",
    "while True: learn()",
    "const hack = () => 'You got this!'"
  ];
  
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeWriter = () => {
      const text = phrases[currentPhrase];
      
      if (isDeleting) {
        setCurrentText(text.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentPhrase((currentPhrase + 1) % phrases.length);
          setTimeout(typeWriter, 1000);
          return;
        }
      } else {
        setCurrentText(text.substring(0, currentText.length + 1));
        if (currentText.length === text.length) {
          setIsDeleting(true);
          setTimeout(typeWriter, 2000);
          return;
        }
      }
      
      setTimeout(typeWriter, isDeleting ? 50 : 100);
    };
    
    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, [currentPhrase, currentText, isDeleting]);

  return (
    <div className="console-demo" id="try">
      <div className="console-header">
        <div className="console-dot dot-red"></div>
        <div className="console-dot dot-yellow"></div>
        <div className="console-dot dot-green"></div>
      </div>
      <div className="console-code">
        <div>$ Welcome to CodeForKids!</div>
        <div>$ Start coding by typing below:</div>
        <div>$ {currentText}<span className="cursor">_</span></div>
      </div>
    </div>
  );
};

export default InteractiveConsole;