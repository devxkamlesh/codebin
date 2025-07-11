import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Clipboard, ArrowRight, Code, ChevronRight } from 'lucide-react';

export default function Hero() {
  const { currentUser } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-20 md:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-32 right-1/4 w-80 h-80 rounded-full bg-indigo-100 opacity-40 blur-3xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600 mb-6 border border-blue-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              New: Code execution in browser
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Store & Share Code <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Snippets</span> Instantly
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              The simplest way to save, organize, and share your code snippets with the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to={currentUser ? "/new" : "/login"} 
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              
              <Link 
                to="/explore" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-800 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Explore Snippets
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. Free for personal use.
            </p>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Code editor mockup */}
              <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
                {/* Editor header */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">snippet.js</span>
                    <Code className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Clipboard className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Code content */}
                <div className="p-4 overflow-hidden font-mono text-sm leading-relaxed">
                  <pre className="text-gray-300">
                    <code>
                      <span className="text-blue-400">function</span> <span className="text-yellow-300">createSnippet</span><span className="text-gray-400">(</span><span className="text-orange-300">code</span><span className="text-gray-400">)</span> <span className="text-gray-400">{'{'}</span>
                      {'\n'}  <span className="text-blue-400">const</span> <span className="text-green-300">snippet</span> <span className="text-gray-400">=</span> <span className="text-gray-400">{'{'}</span>
                      {'\n'}    <span className="text-purple-300">id</span><span className="text-gray-400">:</span> <span className="text-blue-400">generateId</span><span className="text-gray-400">()</span><span className="text-gray-400">,</span>
                      {'\n'}    <span className="text-purple-300">code</span><span className="text-gray-400">:</span> <span className="text-orange-300">code</span><span className="text-gray-400">,</span>
                      {'\n'}    <span className="text-purple-300">language</span><span className="text-gray-400">:</span> <span className="text-green-300">'javascript'</span><span className="text-gray-400">,</span>
                      {'\n'}    <span className="text-purple-300">created</span><span className="text-gray-400">:</span> <span className="text-blue-400">new</span> <span className="text-yellow-300">Date</span><span className="text-gray-400">()</span><span className="text-gray-400">,</span>
                      {'\n'}    <span className="text-purple-300">expiresIn</span><span className="text-gray-400">:</span> <span className="text-green-300">'never'</span>
                      {'\n'}  <span className="text-gray-400">{'}'}</span><span className="text-gray-400">;</span>
                      {'\n'}
                      {'\n'}  <span className="text-green-400">// Save to database</span>
                      {'\n'}  <span className="text-blue-400">await</span> <span className="text-blue-400">db</span><span className="text-gray-400">.</span><span className="text-yellow-300">snippets</span><span className="text-gray-400">.</span><span className="text-blue-400">save</span><span className="text-gray-400">(</span><span className="text-green-300">snippet</span><span className="text-gray-400">)</span><span className="text-gray-400">;</span>
                      {'\n'}
                      {'\n'}  <span className="text-blue-400">return</span> <span className="text-gray-400">{'{'}</span>
                      {'\n'}    <span className="text-purple-300">url</span><span className="text-gray-400">:</span> <span className="text-green-300">{"`https://codebin.io/\${snippet.id}`"}</span><span className="text-gray-400">,</span>
                      {'\n'}    <span className="text-purple-300">snippet</span>
                      {'\n'}  <span className="text-gray-400">{'}'}</span><span className="text-gray-400">;</span>
                      {'\n'}<span className="text-gray-400">{'}'}</span>
                    </code>
                  </pre>
                </div>
                
                {/* Status bar */}
                <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
                  <div>JavaScript</div>
                  <div>Lines: 16</div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600 rounded-lg opacity-20 blur-xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-600 rounded-full opacity-10 blur-xl"></div>
            </div>
          </motion.div>
        </div>
        
        {/* Trusted by section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm font-medium text-gray-500 mb-6">TRUSTED BY DEVELOPERS FROM</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" alt="Google" className="h-6 object-contain grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" alt="Microsoft" className="h-6 object-contain grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Meta-Logo.svg/2560px-Meta-Logo.svg.png" alt="Meta" className="h-6 object-contain grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/2560px-Amazon_Web_Services_Logo.svg.png" alt="AWS" className="h-6 object-contain grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/GitHub_Mark.png/640px-GitHub_Mark.png" alt="GitHub" className="h-6 object-contain grayscale" />
          </div>
        </motion.div>
      </div>
    </section>
  );
} 