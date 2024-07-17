import Navbar from './Navbar';
import Footer from './Footer';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useRouter } from 'next/router';


const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <div style={{ padding: '5px' }}>
        <Navbar />
        <TransitionGroup>
          <CSSTransition
            key={router.route}
            timeout={300}
            classNames="page"
          >
            <div>
              {children}
            </div>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
