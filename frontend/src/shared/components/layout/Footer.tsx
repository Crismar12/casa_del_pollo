import React from 'react';

export const AppFooter = () => (
  <footer className="text-center text-xs text-gray-400 dark:text-gray-500 py-6 border-t border-gray-100 dark:border-gray-700 px-4">
    <p className="mb-2">
      &copy; {new Date().getFullYear()} El Paraíso del Pollo. Todos los derechos reservados.
    </p>
    <p className="mb-2">Las fotografías mostradas son de carácter ilustrativo.</p>
    <p>
      Desarrollado por{" "}
      <a
        href="https://github.com/Crismar12"
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
      >
        Francis Esculpi
      </a>
      <a
        href="https://www.linkedin.com/in/francis-esculpi-9018752ab/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center ml-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 align-middle"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
    </p>
  </footer>
);
