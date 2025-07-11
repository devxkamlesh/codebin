import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "CodeBin has completely changed how our team shares code snippets. It's so much faster than our previous solution.",
      author: "Sarah Johnson",
      role: "Senior Developer at TechCorp",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      quote: "I use CodeBin every day to share solutions with my students. The syntax highlighting makes explaining code so much easier.",
      author: "Michael Chen",
      role: "Computer Science Professor",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg"
    },
    {
      quote: "The simplicity is what makes CodeBin stand out. No unnecessary features, just what you need to share code quickly.",
      author: "Emma Rodriguez",
      role: "Frontend Developer",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What People Are Saying
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Trusted by thousands of developers around the world
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              className="bg-blue-50 rounded-xl p-6 border border-blue-100 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="absolute top-6 right-6 text-blue-200">
                <Quote className="h-10 w-10" />
              </div>
              <p className="text-gray-700 mb-6 relative z-10">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 