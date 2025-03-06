export class TabManager {
    constructor(container) {
        this.container = container;
        this.initialize();
    }

    initialize() {
        // Set up tab button click handlers
        const tabButtons = this.container.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button));
        });

        // Don't force switch to first tab - respect the initial active state
        // that was set up by the RequestManager
    }

    switchTab(selectedButton) {
        // Get the tab container (parent of the button groups)
        const tabContainer = selectedButton.closest('.request-tabs, .response-tabs');
        
        // Remove active class from all buttons in this tab group
        const buttons = tabContainer.querySelectorAll('.tab-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to selected button
        selectedButton.classList.add('active');
        
        // Get the tab content container
        const tabContent = tabContainer.querySelector('.tab-content');
        
        // Hide all tab panes
        const panes = tabContent.querySelectorAll('.tab-pane');
        panes.forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Show the selected tab pane
        const targetTab = selectedButton.getAttribute('data-tab');
        const targetPane = tabContent.querySelector(`.${targetTab}-tab`);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    }
} 