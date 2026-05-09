import { FaLinkedin, FaGithub, FaFolderOpen } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-white">Real‑Time Expert Session Booking System</p>
            <p className="mt-1 text-xs text-white/60">Built with React, Node.js, Express, MongoDB</p>
          </div>

          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
            <div className="text-sm font-medium text-white">Connect with Me</div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/yashraj-singh-rathore-game-tester-frontend-dev/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                <FaLinkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>

              <a
                href="https://github.com/yashrajbuilds"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="group flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                <FaGithub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>

              <a
                href="https://github.com/yashrajbuilds/real-time-expert-booking-system"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Project repository"
                className="group flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                <FaFolderOpen className="h-5 w-5" />
                <span className="sr-only">Project Repository</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/6 pt-4 text-center text-xs text-white/40">
          <span>© {new Date().getFullYear()} Yashraj Singh Rathore. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
