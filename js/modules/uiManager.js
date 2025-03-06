class UIManager {
    constructor() {
        this.activeTheme = 'light';
        this.activeTab = null;
        this.tabs = new Map();
        this.splitViewActive = false;
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupTabSystem();
        this.setupSplitView();
        this.setupKeyboardShortcuts();
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
    }

    toggleTheme() {
        const newTheme = this.activeTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.body.classList.remove(`theme-${this.activeTheme}`);
        document.body.classList.add(`theme-${theme}`);
        this.activeTheme = theme;
        localStorage.setItem('theme', theme);
    }

    setupTabSystem() {
        const tabContainer = document.getElementById('tab-container');
        const tabContent = document.getElementById('tab-content');

        if (tabContainer && tabContent) {
            tabContainer.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tabId;
                if (tabId) {
                    this.switchTab(tabId);
                }
            });
        }
    }

    createNewTab(requestData = null) {
        const tabId = 'tab-' + Date.now();
        const tabTitle = requestData?.name || 'New Request';
        
        // Create tab button
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button';
        tabButton.dataset.tabId = tabId;
        tabButton.textContent = tabTitle;

        // Create tab content
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.id = tabId;
        
        // Store tab data
        this.tabs.set(tabId, {
            button: tabButton,
            content: tabContent,
            data: requestData
        });

        // Add to DOM
        document.getElementById('tab-container').appendChild(tabButton);
        document.getElementById('tab-content').appendChild(tabContent);

        this.switchTab(tabId);
        return tabId;
    }

    switchTab(tabId) {
        if (this.activeTab) {
            const currentTab = this.tabs.get(this.activeTab);
            if (currentTab) {
                currentTab.button.classList.remove('active');
                currentTab.content.classList.remove('active');
            }
        }

        const newTab = this.tabs.get(tabId);
        if (newTab) {
            newTab.button.classList.add('active');
            newTab.content.classList.add('active');
            this.activeTab = tabId;
        }
    }

    closeTab(tabId) {
        const tab = this.tabs.get(tabId);
        if (tab) {
            tab.button.remove();
            tab.content.remove();
            this.tabs.delete(tabId);

            if (this.activeTab === tabId) {
                const remainingTabs = Array.from(this.tabs.keys());
                if (remainingTabs.length > 0) {
                    this.switchTab(remainingTabs[0]);
                }
            }
        }
    }

    setupSplitView() {
        const splitViewToggle = document.getElementById('split-view-toggle');
        if (splitViewToggle) {
            splitViewToggle.addEventListener('click', () => this.toggleSplitView());
        }
    }

    toggleSplitView() {
        this.splitViewActive = !this.splitViewActive;
        document.body.classList.toggle('split-view', this.splitViewActive);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + T: New Tab
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.createNewTab();
            }
            
            // Ctrl/Cmd + W: Close Tab
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                e.preventDefault();
                if (this.activeTab) {
                    this.closeTab(this.activeTab);
                }
            }

            // Ctrl/Cmd + B: Toggle Split View
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.toggleSplitView();
            }
        });
    }

    // Method to update request view
    updateRequestView(tabId, requestData) {
        const tab = this.tabs.get(tabId);
        if (tab) {
            // Update tab data
            tab.data = requestData;
            
            // Update tab title if name changed
            if (requestData.name) {
                tab.button.textContent = requestData.name;
            }

            // Additional view updates can be implemented here
        }
    }

    // Method to update response view
    updateResponseView(tabId, responseData) {
        const tab = this.tabs.get(tabId);
        if (tab) {
            const responseContainer = tab.content.querySelector('.response-container');
            if (responseContainer) {
                // Clear previous response
                responseContainer.innerHTML = '';

                // Add response status and metadata
                const metadataDiv = document.createElement('div');
                metadataDiv.className = 'response-metadata';
                metadataDiv.innerHTML = `
                    <div>Status: ${responseData.status}</div>
                    <div>Time: ${responseData.time}ms</div>
                    <div>Size: ${responseData.size}</div>
                `;
                responseContainer.appendChild(metadataDiv);

                // Add formatted response body
                const bodyDiv = document.createElement('div');
                bodyDiv.className = 'response-body';
                try {
                    // Attempt to format JSON
                    const formattedBody = JSON.stringify(JSON.parse(responseData.body), null, 2);
                    bodyDiv.innerHTML = `<pre><code>${formattedBody}</code></pre>`;
                } catch {
                    // Fallback to raw text
                    bodyDiv.innerHTML = `<pre><code>${responseData.body}</code></pre>`;
                }
                responseContainer.appendChild(bodyDiv);
            }
        }
    }
}

// Export the UIManager
export default UIManager; 