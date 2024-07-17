import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/router';


const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <div style={{ padding: '5px' }}>
        <Navbar />
            <div>
              {children}
            </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
