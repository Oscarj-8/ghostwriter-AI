import React from 'react'

const Footer = () => {
  return (
    <footer className="text-center py-12 text-neutral-700 text-xs border-t border-white/5">
      &copy; {new Date().getFullYear()} Ghostwriter AI. Integrated with Supabase
      Auth & SSR.
    </footer>
  );
}

export default Footer;