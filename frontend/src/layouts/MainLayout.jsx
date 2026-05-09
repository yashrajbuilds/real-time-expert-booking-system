import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-ink-950 text-white">
      <div className="absolute inset-0 -z-10 bg-hero-gradient" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(25,179,148,0.20),transparent_35%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-radial-grid bg-[length:24px_24px] opacity-25" />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
