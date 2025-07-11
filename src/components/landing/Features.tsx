import { motion } from 'framer-motion';
import { Share2, Code, Lock, Globe, Terminal, Sparkles } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Code className="h-10 w-10 text-blue-600" />,
      title: "Syntax Highlighting",
      description: "Support for 100+ programming languages with beautiful highlighting"
    },
    {
      icon: <Terminal className="h-10 w-10 text-blue-600" />,
      title: "Code Execution",
      description: "Run your code directly in the browser for JavaScript, Python, and more"
    },
    {
      icon: <Share2 className="h-10 w-10 text-blue-600" />,
      title: "Instant Sharing",
      description: "Share your snippets with a simple link that never expires"
    },
    {
      icon: <Lock className="h-10 w-10 text-blue-600" />,
      title: "Private Snippets",
      description: "Keep your code private or share it with the world - you decide"
    },
    {
      icon: <Sparkles className="h-10 w-10 text-blue-600" />,
      title: "Organization",
      description: "Tag, categorize, and search your snippets to find them quickly"
    },
    {
      icon: <Globe className="h-10 w-10 text-blue-600" />,
      title: "Access Anywhere",
      description: "Access your snippets from any device, anywhere in the world"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-50 to-transparent"></div>
      <div className="absolute -left-32 top-1/4 w-64 h-64 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
      <div className="absolute -right-32 bottom-1/4 w-64 h-64 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Everything You Need for Code Snippets
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Powerful features designed for developers who care about productivity
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Decorative corner */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-50 rounded-full transform group-hover:scale-150 transition-transform duration-300"></div>
              
              <div className="relative z-10">
                <div className="mb-5 p-3 bg-blue-50 inline-block rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 