import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    title: (title) => title ? `${title} - Boudoir Bags` : `Boudoir Bags`,
    resolve: (name) =>
/**
 * Resolves a page component by name.
 *
 * @param {string} name - The name of the page component to resolve.
 *
 * @returns {function} - A function that imports the page component.
 */
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
