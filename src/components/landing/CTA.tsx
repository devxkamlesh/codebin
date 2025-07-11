import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Sparkles } from 'lucide-react';

export default function CTA() {
  const { currentUser } = useAuth();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 z-10 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
      </div>
      
      {/* Code symbols decoration */}
      <div className="absolute inset-0 z-10 overflow-hidden text-white text-opacity-5 select-none pointer-events-none">
        <div className="absolute -top-10 left-10 text-8xl font-mono">{`{}`}</div>
        <div className="absolute top-1/3 right-10 text-8xl font-mono">{`</>`}</div>
        <div className="absolute bottom-10 left-1/4 text-8xl font-mono">{`()`}</div>
        <div className="absolute top-1/2 left-1/2 text-8xl font-mono transform -translate-x-1/2">{`=>`}</div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="inline-flex items-center rounded-full bg-blue-500 bg-opacity-20 px-4 py-1.5 mb-6 border border-blue-400 border-opacity-30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4 text-blue-200 mr-2" />
            <span className="text-sm text-blue-100 font-medium">Join thousands of developers</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Ready to simplify your <br className="hidden md:block" />
            code sharing workflow?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join thousands of developers who use CodeBin to share their code snippets every day. 
            No more messy emails or chat screenshots.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link 
              to={currentUser ? "/new" : "/login"} 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors text-lg shadow-xl shadow-blue-900/20 group"
            >
              {currentUser ? "Create Your Snippet" : "Get Started for Free"}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/explore" 
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 bg-opacity-30 text-white font-medium rounded-lg hover:bg-opacity-40 transition-colors text-lg border border-blue-400 border-opacity-30"
            >
              <Code className="mr-2 h-5 w-5" />
              Explore Snippets
            </Link>
          </motion.div>
          
          <motion.p 
            className="mt-6 text-sm text-blue-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            No credit card required. Start sharing code in seconds.
          </motion.p>
        </div>
      </div>
    </section>
  );
} 