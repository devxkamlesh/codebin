import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Loader2, Play, Terminal, ExternalLink, Info } from 'lucide-react';

// Define supported languages
export const SUPPORTED_LANGUAGES = ['javascript', 'python', 'ruby', 'html', 'css'];

interface CodeRunnerProps {
  code: string;
  language: string;
}

export default function CodeRunner({ code, language }: CodeRunnerProps) {
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [rubyLoaded, setRubyLoaded] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState(true);

  // Load language runtimes when needed
  useEffect(() => {
    if (language === 'python' && !pyodideLoaded) {
      loadPyodide();
    }
    if (language === 'ruby' && !rubyLoaded) {
      loadRuby();
    }
  }, [language, pyodideLoaded, rubyLoaded]);

  // Hide instructions after first run
  useEffect(() => {
    if (output || error || htmlPreview) {
      setShowInstructions(false);
    }
  }, [output, error, htmlPreview]);

  // Load Pyodide (Python)
  const loadPyodide = async () => {
    if (window.pyodide) {
      setPyodideLoaded(true);
      return;
    }

    try {
      setIsLoading(true);
      // Load Pyodide script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
      script.async = true;
      script.onload = async () => {
        try {
          // @ts-ignore - Pyodide global is loaded by the script
          window.pyodide = await window.loadPyodide();
          setPyodideLoaded(true);
        } catch (err) {
          console.error('Error loading Pyodide:', err);
          setError('Failed to load Python runtime. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      script.onerror = () => {
        setError('Failed to load Python runtime. Please try again later.');
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error('Error loading Pyodide script:', err);
      setError('Failed to load Python runtime. Please try again later.');
      setIsLoading(false);
    }
  };

  // Load Ruby.wasm
  const loadRuby = async () => {
    if (window.ruby) {
      setRubyLoaded(true);
      return;
    }

    try {
      setIsLoading(true);
      // Load Ruby.wasm script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/ruby-head-wasm-wasi@2.2.0/dist/browser.script.iife.js';
      script.async = true;
      script.onload = async () => {
        try {
          // @ts-ignore - Ruby global is loaded by the script
          window.ruby = await window.RubyWasm.loadRuby();
          setRubyLoaded(true);
        } catch (err) {
          console.error('Error loading Ruby.wasm:', err);
          setError('Failed to load Ruby runtime. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      script.onerror = () => {
        setError('Failed to load Ruby runtime. Please try again later.');
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error('Error loading Ruby.wasm script:', err);
      setError('Failed to load Ruby runtime. Please try again later.');
      setIsLoading(false);
    }
  };

  // Run JavaScript code
  const runJavaScript = async (jsCode: string) => {
    try {
      // Create a sandbox iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Capture console output
      const logs: string[] = [];
      
      // Override console methods in the iframe
      if (iframe.contentWindow) {
        const originalConsole = { ...(iframe.contentWindow as any).console };
        
        (iframe.contentWindow as any).console.log = (...args: any[]) => {
          originalConsole.log(...args);
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '));
        };
        
        (iframe.contentWindow as any).console.error = (...args: any[]) => {
          originalConsole.error(...args);
          logs.push(`Error: ${args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ')}`);
        };
        
        (iframe.contentWindow as any).console.warn = (...args: any[]) => {
          originalConsole.warn(...args);
          logs.push(`Warning: ${args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ')}`);
        };
        
        // Execute the code with a timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Execution timed out (5s)')), 5000);
        });
        
        const executionPromise = new Promise<void>((resolve) => {
          try {
            // Create a function from the code and execute it
            const fn = new (iframe.contentWindow as any).Function(jsCode);
            fn();
            resolve();
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            resolve();
          }
        });
        
        await Promise.race([executionPromise, timeoutPromise]);
        setOutput(logs.join('\n'));
      }
      
      // Clean up
      document.body.removeChild(iframe);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  // Run Python code using Pyodide
  const runPython = async (pythonCode: string) => {
    try {
      if (!window.pyodide) {
        setError('Python runtime is not loaded. Please try again.');
        return;
      }

      // Redirect stdout to capture output
      let output = '';
      window.pyodide.setStdout({
        write: (text: string) => {
          output += text;
        }
      });

      // Run the Python code
      await window.pyodide.runPythonAsync(pythonCode);
      setOutput(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  // Run Ruby code using Ruby.wasm
  const runRuby = async (rubyCode: string) => {
    try {
      if (!window.ruby) {
        setError('Ruby runtime is not loaded. Please try again.');
        return;
      }

      // Capture stdout
      let output = '';
      window.ruby.vm.printStdout = (text: string) => {
        output += text + '\n';
      };
      window.ruby.vm.printStderr = (text: string) => {
        output += 'Error: ' + text + '\n';
      };

      // Run the Ruby code
      window.ruby.eval(rubyCode);
      setOutput(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  // Run HTML code in an iframe
  const runHtml = (htmlCode: string) => {
    try {
      // Sanitize HTML (basic)
      const sanitizedHtml = htmlCode
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- Scripts not allowed -->');
      
      // Create a complete HTML document with Tailwind CSS
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { 
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                line-height: 1.5;
                padding: 1rem;
              }
            </style>
          </head>
          <body>
            ${sanitizedHtml}
          </body>
        </html>
      `;
      
      setHtmlPreview(fullHtml);
      setOutput('HTML preview rendered successfully. Tailwind CSS is enabled.');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  // Run CSS code by creating an HTML preview with the CSS applied
  const runCss = (cssCode: string) => {
    try {
      // Create a sample HTML page with the CSS applied and Tailwind
      const htmlWithCss = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              ${cssCode}
            </style>
          </head>
          <body>
            <h1>CSS Preview</h1>
            <p>This is a paragraph to demonstrate text styling.</p>
            <div class="container">
              <div class="box">Box 1</div>
              <div class="box">Box 2</div>
              <div class="box">Box 3</div>
            </div>
            <button>Button Example</button>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
              <li>List item 3</li>
            </ul>
            <a href="#">Link Example</a>
          </body>
        </html>
      `;
      
      setHtmlPreview(htmlWithCss);
      setOutput('CSS preview rendered successfully. Tailwind CSS is enabled.');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');
    setHtmlPreview('');
    
    const normalizedLanguage = language.toLowerCase();
    
    try {
      switch (normalizedLanguage) {
        case 'javascript':
        case 'js':
          await runJavaScript(code);
          break;
        case 'python':
        case 'py':
          if (!pyodideLoaded) {
            await loadPyodide();
          }
          await runPython(code);
          break;
        case 'ruby':
        case 'rb':
          if (!rubyLoaded) {
            await loadRuby();
          }
          await runRuby(code);
          break;
        case 'html':
          runHtml(code);
          break;
        case 'css':
          runCss(code);
          break;
        default:
          setError(`Running ${language} code is not supported yet.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsRunning(false);
    }
  };

  // Open HTML/CSS preview in a new tab
  const openInNewTab = () => {
    if (!htmlPreview) return;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlPreview);
      newWindow.document.close();
    }
  };

  const isLanguageSupported = SUPPORTED_LANGUAGES.includes(language.toLowerCase());
  const canOpenInNewTab = ['html', 'css'].includes(language.toLowerCase()) && htmlPreview;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Button
          onClick={handleRunCode}
          disabled={isRunning || isLoading || !isLanguageSupported}
          className="flex items-center gap-2"
        >
          {isRunning || isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isLoading ? 'Loading Runtime...' : 'Running...'}</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Run Code</span>
            </>
          )}
        </Button>

        {canOpenInNewTab && (
          <Button
            onClick={openInNewTab}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open in New Tab</span>
          </Button>
        )}
      </div>
      
      {showInstructions && isLanguageSupported && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">How to use the code runner:</p>
            <ol className="list-decimal list-inside mt-1 space-y-1 pl-1">
              <li>Click the "Run Code" button above to execute your code</li>
              <li>Results will appear below the button</li>
              {['html', 'css'].includes(language.toLowerCase()) && (
                <li>For HTML/CSS, you can use "Open in New Tab" for a fullscreen view</li>
              )}
              {['javascript', 'js'].includes(language.toLowerCase()) && (
                <li>For JavaScript, use console.log() to see output</li>
              )}
            </ol>
          </div>
        </div>
      )}
      
      {!isLanguageSupported && (
        <p className="text-amber-600 text-sm mt-2">
          <Terminal className="h-4 w-4 inline mr-1" />
          Running {language} code is not supported. Supported languages: {SUPPORTED_LANGUAGES.join(', ')}.
        </p>
      )}
      
      {htmlPreview && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-medium text-sm flex justify-between items-center">
            <span>{language.toLowerCase() === 'css' ? 'CSS Preview' : 'HTML Preview'}</span>
            <span className="text-xs text-gray-500">(Scripts are disabled for security)</span>
          </div>
          <div className="border-t p-0 bg-white">
            <iframe
              srcDoc={htmlPreview}
              title="Preview"
              className="w-full min-h-[300px] border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}
      
      {(output || error) && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-medium text-sm">Output</div>
          <div className="p-4 max-h-96 overflow-y-auto bg-gray-50">
            {error ? (
              <pre className="text-red-600 text-sm whitespace-pre-wrap font-mono">{error}</pre>
            ) : (
              <pre className="text-green-700 text-sm whitespace-pre-wrap font-mono">{output}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Add TypeScript declarations for global objects
declare global {
  interface Window {
    loadPyodide?: () => Promise<any>;
    pyodide?: {
      runPythonAsync: (code: string) => Promise<any>;
      setStdout: (options: { write: (text: string) => void }) => void;
    };
    ruby?: {
      eval: (code: string) => any;
      vm: {
        printStdout: (text: string) => void;
        printStderr: (text: string) => void;
      };
    };
    RubyWasm?: {
      loadRuby: () => Promise<any>;
    };
  }
} 