export class KeyValueEditor {
    constructor(container) {
        console.log('KeyValueEditor constructor called with container:', container);
        this.container = container;
        if (!this.container) {
            console.error('No container provided to KeyValueEditor');
            return;
        }
        this.initialized = false;
        this.initialize();
    }

    initialize() {
        if (this.initialized) return;

        console.log('Initializing KeyValueEditor...', this.container);

        // Get the key-value-list and add button
        this.keyValueList = this.container.querySelector('.key-value-list');
        this.addButton = this.container.querySelector('.add-row-btn');
        
        console.log('Found elements:', {
            keyValueList: this.keyValueList,
            addButton: this.addButton
        });
        
        if (!this.keyValueList || !this.addButton) {
            console.error('Required elements not found in KeyValueEditor container');
            return;
        }

        // Check button visibility
        const buttonStyle = window.getComputedStyle(this.addButton);
        console.log('Add button visibility:', buttonStyle.display, buttonStyle.visibility);

        // Add click handler for the add button
        this.addButton.addEventListener('click', () => this.addRow());

        // Check for existing non-template rows
        const existingRows = this.keyValueList.querySelectorAll('.key-value-row:not(.template)');
        console.log('Existing non-template rows:', existingRows.length);

        // If there are existing rows, make sure they have delete handlers
        if (existingRows.length > 0) {
            console.log('Found existing rows, adding delete handlers');
            existingRows.forEach(row => {
                const deleteBtn = row.querySelector('.delete-row-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => this.deleteRow(row));
                }
            });
        } else {
            // If no existing rows, create a new one directly
            console.log('No existing rows, creating one directly');
            const newRow = document.createElement('div');
            newRow.className = 'key-value-row';
            newRow.innerHTML = `
                <input type="text" class="key-input" placeholder="Key">
                <input type="text" class="value-input" placeholder="Value">
                <button class="delete-row-btn" title="Remove row">×</button>
            `;
            
            // Add delete handler
            const deleteBtn = newRow.querySelector('.delete-row-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteRow(newRow));
            }
            
            // Add to the list
            this.keyValueList.appendChild(newRow);
            console.log('Row added directly to the list');
        }

        // Mark as initialized
        this.initialized = true;

        // Create an observer to watch for visibility changes
        this.setupVisibilityObserver();
    }

    setupVisibilityObserver() {
        // Create a MutationObserver to watch for class changes on parent tab-pane
        const tabPane = this.container.closest('.tab-pane');
        if (tabPane) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const isVisible = tabPane.classList.contains('active');
                        if (isVisible) {
                            this.onBecameVisible();
                        }
                    }
                });
            });

            observer.observe(tabPane, {
                attributes: true,
                attributeFilter: ['class']
            });

            // Initial check
            if (tabPane.classList.contains('active')) {
                this.onBecameVisible();
            }
        }
    }

    onBecameVisible() {
        // Ensure we're initialized when becoming visible
        if (!this.initialized) {
            this.initialize();
        }

        // Make sure we have at least one row
        const nonTemplateRows = this.keyValueList.querySelectorAll('.key-value-row:not(.template)');
        if (nonTemplateRows.length === 0) {
            this.addRow();
        }
    }

    addRow() {
        console.log('Attempting to add a new row...');
        // Clone the template row
        const template = this.container.querySelector('.key-value-row.template');
        if (!template) {
            console.error('Template row not found');
            return;
        }

        const newRow = template.cloneNode(true);
        newRow.classList.remove('template');
        console.log('New row cloned from template:', newRow);
        
        // Clear any values
        newRow.querySelectorAll('input').forEach(input => {
            input.value = '';
            input.removeAttribute('disabled');
        });
        console.log('Inputs cleared in new row.');
        
        // Add delete handler
        const deleteBtn = newRow.querySelector('.delete-row-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteRow(newRow));
            console.log('Delete handler added to new row.');
        }

        // Add to the list
        this.keyValueList.appendChild(newRow);
        console.log('New row added to the list successfully.');

        // Focus the key input of the new row
        const keyInput = newRow.querySelector('.key-input');
        if (keyInput) {
            keyInput.focus();
            console.log('Focus set to key input of new row.');
        }
    }

    deleteRow(row) {
        // Don't delete if it's the last non-template row
        const nonTemplateRows = this.keyValueList.querySelectorAll('.key-value-row:not(.template)');
        if (nonTemplateRows.length <= 1) {
            // Clear the inputs instead of deleting
            row.querySelectorAll('input').forEach(input => input.value = '');
            return;
        }
        
        row.remove();
    }

    getData() {
        const data = {};
        this.keyValueList.querySelectorAll('.key-value-row:not(.template)').forEach(row => {
            const key = row.querySelector('.key-input').value.trim();
            const value = row.querySelector('.value-input').value.trim();
            if (key) {
                data[key] = value;
            }
        });
        return data;
    }

    clear() {
        // Remove all non-template rows except one
        const rows = Array.from(this.keyValueList.querySelectorAll('.key-value-row:not(.template)'));
        rows.forEach(row => row.remove());
        
        // Add a fresh row
        this.addRow();
    }
} 