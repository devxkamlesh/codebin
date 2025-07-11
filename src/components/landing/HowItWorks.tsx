import { motion } from 'framer-motion';
import { ClipboardEdit, Save, Share } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <ClipboardEdit className="h-8 w-8 text-white" />,
      title: "Paste Code",
      description: "Paste your code snippet into the editor with automatic language detection"
    },
    {
      icon: <Save className="h-8 w-8 text-white" />,
      title: "Save Snippet",
      description: "Click save to store your code securely in our database"
    },
    {
      icon: <Share className="h-8 w-8 text-white" />,
      title: "Share Link",
      description: "Share the generated link with anyone who needs to see your code"
    }
  ];

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Get started in seconds with these simple steps
          </motion.p>
        </div>
        
        <motion.div 
          className="flex flex-col md:flex-row gap-8 justify-between max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + (i * 0.2) }}
            >
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-4 relative">
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {i + 1}
                </div>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
          <motion.div
            className="inline-block p-4 bg-blue-100 rounded-lg border border-blue-200 text-blue-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="font-medium">No account required for basic sharing. Sign up for more features!</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 