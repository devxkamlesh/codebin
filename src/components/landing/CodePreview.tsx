import { motion } from 'framer-motion';
import { Code, Clipboard, Check } from 'lucide-react';
import { useState } from 'react';

export default function CodePreview() {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`// A simple React component example
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;`);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Beautiful Code Presentation
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Your code deserves to look good. CodeBin provides beautiful syntax highlighting for over 100 programming languages, making your snippets easy to read and understand.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Automatic language detection",
                "Line numbers for easy reference",
                "Copy button for quick sharing",
                "Light and dark themes available",
                "Mobile-friendly responsive design"
              ].map((feature, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <span className="inline-block mr-2 bg-blue-100 p-1 rounded-full text-blue-600">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.66674 10.1147L12.7947 3.98599L13.7381 4.92866L6.66674 12L2.42407 7.75733L3.36674 6.81466L6.66674 10.1147Z" fill="currentColor" />
                    </svg>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Counter.jsx</span>
                </div>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors py-1 px-2 rounded hover:bg-gray-100"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="text-xs font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      <span className="text-xs font-medium">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-sm text-gray-800 overflow-x-auto bg-white">
                <code>{`// A simple React component example
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;`}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 