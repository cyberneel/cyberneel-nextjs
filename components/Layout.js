import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500/30">
      {/* Background Grid - Tinkerer Aesthetic */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07]" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
             backgroundSize: '32px 32px' 
           }} 
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={router.asPath}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
