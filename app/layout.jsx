import './globals.css';
import './hero-interior.css';
import './shop.css';
import './refinements.css';
import './collection.css';
import './motion.css';
import './header-location.css';

export const metadata = {
  icons: { icon: '/brand/darlin-icon.svg' },
  title: 'Darlin — Find your next iPhone.',
  description: 'Explore iPhone and the accessories that make it yours at Darlin Phones & Accessories.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
