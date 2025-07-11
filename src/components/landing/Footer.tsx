import { Link } from 'react-router-dom';
import { Code, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 rounded-md p-1">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">CodeBin</span>
            </Link>
            <p className="text-gray-400 mb-4">
              The simplest way to store, copy, and share your code snippets.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/devxkamlesh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/devxkamlesh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/in/devxkamlesh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/new" className="text-gray-400 hover:text-white transition-colors">Create Snippet</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} CodeBin. All rights reserved.</p>
          <p className="flex items-center mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by Kamlesh Choudhary <span className="ml-1 text-gray-500">(@devxkamlesh)</span>
          </p>
        </div>
      </div>
    </footer>
  );
} 