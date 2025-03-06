import { RequestManager } from './modules/requestManager.js';

class App {
    constructor() {
        // Wait for DOM content to be loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            // Even if DOM is loaded, wait for next frame to ensure template is ready
            requestAnimationFrame(() => this.initialize());
        }
    }

    initialize() {
        console.log('App initializing...');
        
        // Initialize theme
        this.initializeTheme();

        // Initialize request manager
        this.initializeRequestManager();

        console.log('App initialization complete');
    }

    initializeTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('theme-dark');
                document.body.classList.toggle('theme-light');
            });
        }
    }

    initializeRequestManager() {
        console.log('Initializing RequestManager...');
        const tabContainer = document.getElementById('tab-container');
        const tabContent = document.getElementById('tab-content');
        
        if (!tabContainer || !tabContent) {
            console.error('Could not find tab-container or tab-content elements');
            return;
        }

        // Create initial tab button
        const tabId = 'tab-' + Date.now();
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button active';
        tabButton.textContent = 'New Request';
        tabButton.dataset.tabId = tabId;
        tabContainer.appendChild(tabButton);

        // Create tab content container
        const tabContentDiv = document.createElement('div');
        tabContentDiv.className = 'tab-content-container active';
        tabContentDiv.id = tabId;
        tabContent.appendChild(tabContentDiv);

        // Create request manager immediately
        this.requestManager = new RequestManager(tabContentDiv);
    }
}

// Create app instance
new App(); 