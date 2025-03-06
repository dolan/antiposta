import { KeyValueEditor } from './keyValueEditor.js';
import { TabManager } from './tabManager.js';

export class RequestManager {
    constructor(container) {
        console.log('Creating RequestManager...', { container });
        this.container = container;
        this.initialize();
    }

    initialize() {
        this.createNewRequest();
    }

    createNewRequest() {
        console.log('Creating new request...');
        // Clone the request template
        const template = document.getElementById('request-template');
        console.log('Template found:', { template });
        if (!template) {
            console.error('Could not find request template');
            return;
        }

        // Clone the template content and get the request panel
        const clone = template.content.cloneNode(true);
        const requestPanel = clone.querySelector('.request-panel');
        console.log('Request panel found:', { requestPanel });
        if (!requestPanel) {
            console.error('Could not find request panel in template');
            return;
        }

        // Clear any existing content and append the new panel
        console.log('Container before clear:', this.container.innerHTML);
        this.container.innerHTML = '';
        this.container.appendChild(requestPanel);
        console.log('Container after append:', this.container.innerHTML);

        // Store editors for this request panel
        requestPanel.editors = {};

        // Initialize key-value editors first
        console.log('Initializing key-value editors...');
        this.initializeKeyValueEditors(requestPanel);

        // Initialize request functionality
        console.log('Initializing request handlers...');
        this.initializeRequestHandlers(requestPanel);

        // Initialize tabs last, since it will trigger a tab switch
        console.log('Initializing tab manager...');
        const tabManager = new TabManager(requestPanel);
    }

    initializeKeyValueEditors(requestPanel) {
        console.log('Initializing key-value editors...');
        
        // Headers editor
        const headersContainer = requestPanel.querySelector('.headers-tab .key-value-editor');
        if (!headersContainer) {
            console.error('Could not find headers key-value-editor');
            return;
        }

        // Ensure the headers tab is active initially
        const headersTab = requestPanel.querySelector('.headers-tab');
        if (headersTab) {
            headersTab.classList.add('active');
        }
        const headersButton = requestPanel.querySelector('.tab-btn[data-tab="headers"]');
        if (headersButton) {
            headersButton.classList.add('active');
        }

        // Ensure the key-value-list in headers tab has at least one non-template row
        const headersList = headersContainer.querySelector('.key-value-list');
        if (headersList) {
            const existingRows = headersList.querySelectorAll('.key-value-row:not(.template)');
            console.log('Headers tab existing rows:', existingRows.length);
            
            // If no existing rows, create one directly
            if (existingRows.length === 0) {
                console.log('No existing rows in headers tab, creating one directly');
                const newRow = document.createElement('div');
                newRow.className = 'key-value-row';
                newRow.innerHTML = `
                    <input type="text" class="key-input" placeholder="Key">
                    <input type="text" class="value-input" placeholder="Value">
                    <button class="delete-row-btn" title="Remove row">×</button>
                `;
                headersList.appendChild(newRow);
            }
        }

        // Initialize editors
        requestPanel.editors.headers = new KeyValueEditor(headersContainer);

        // Params editor
        const paramsContainer = requestPanel.querySelector('.params-tab .key-value-editor');
        if (paramsContainer) {
            requestPanel.editors.params = new KeyValueEditor(paramsContainer);
        }

        // Form editor (for body)
        const formContainer = requestPanel.querySelector('.form-editor .key-value-editor');
        if (formContainer) {
            requestPanel.editors.form = new KeyValueEditor(formContainer);
        }

        // Show initial body type
        const bodyTypeSelect = requestPanel.querySelector('.body-type');
        if (bodyTypeSelect) {
            bodyTypeSelect.addEventListener('change', (e) => {
                this.handleBodyTypeChange(requestPanel, e.target.value);
            });
            this.handleBodyTypeChange(requestPanel, bodyTypeSelect.value);
        }
    }

    handleBodyTypeChange(requestPanel, selectedType) {
        const bodyEditors = requestPanel.querySelectorAll('.body-editor');
        bodyEditors.forEach(editor => {
            editor.classList.add('hidden');
        });

        if (selectedType !== 'none') {
            const selectedEditor = requestPanel.querySelector(`.${selectedType}-editor`);
            if (selectedEditor) {
                selectedEditor.classList.remove('hidden');
                // If it's a form editor, make sure it's initialized
                if (selectedType === 'form' && !requestPanel.editors.form) {
                    const formContainer = selectedEditor.querySelector('.key-value-editor');
                    if (formContainer) {
                        requestPanel.editors.form = new KeyValueEditor(formContainer);
                    }
                }
            }
        }
    }

    initializeRequestHandlers(requestPanel) {
        const urlInput = requestPanel.querySelector('.request-url');
        const methodSelect = requestPanel.querySelector('.http-method');
        const sendButton = requestPanel.querySelector('.send-request');

        if (!urlInput || !methodSelect || !sendButton) {
            console.error('Could not find required request elements');
            return;
        }

        sendButton.addEventListener('click', () => this.sendRequest(requestPanel));
    }

    async sendRequest(requestPanel) {
        const url = requestPanel.querySelector('.request-url').value;
        const method = requestPanel.querySelector('.http-method').value;

        if (!url) {
            console.error('URL is required');
            return;
        }

        try {
            const headers = this.getHeaders(requestPanel);
            const params = this.getQueryParams(requestPanel);
            const body = this.getRequestBody(requestPanel);

            // Build URL with query parameters
            const urlWithParams = new URL(url);
            Object.entries(params).forEach(([key, value]) => {
                urlWithParams.searchParams.append(key, value);
            });

            // Send request
            const response = await fetch(urlWithParams.toString(), {
                method,
                headers,
                body: method !== 'GET' && method !== 'HEAD' ? body : undefined
            });

            // Update response UI
            this.updateResponseUI(requestPanel, response);
        } catch (error) {
            console.error('Request failed:', error);
            this.showError(requestPanel, error);
        }
    }

    getKeyValuePairs(editor) {
        return editor.getData();
    }

    getHeaders(requestPanel) {
        return this.getKeyValuePairs(requestPanel.editors.headers);
    }

    getQueryParams(requestPanel) {
        return this.getKeyValuePairs(requestPanel.editors.params);
    }

    getRequestBody(requestPanel) {
        const bodyType = requestPanel.querySelector('.body-type').value;
        
        if (bodyType === 'none') {
            return null;
        }

        if (bodyType === 'json') {
            const jsonText = requestPanel.querySelector('.json-input').value.trim();
            try {
                return jsonText ? JSON.parse(jsonText) : null;
            } catch (error) {
                throw new Error('Invalid JSON in request body');
            }
        }

        if (bodyType === 'form') {
            const formData = new FormData();
            const formValues = this.getKeyValuePairs(requestPanel.editors.form);
            for (const [key, value] of Object.entries(formValues)) {
                formData.append(key, value);
            }
            return formData;
        }

        if (bodyType === 'text') {
            return requestPanel.querySelector('.text-input').value;
        }

        return null;
    }

    async updateResponseUI(requestPanel, response) {
        const statusDiv = requestPanel.querySelector('.response-container .status');
        const responseBody = requestPanel.querySelector('.response-container .response-body');
        const responseHeaders = requestPanel.querySelector('.response-container .response-headers');

        if (!statusDiv || !responseBody || !responseHeaders) {
            console.error('Could not find response UI elements');
            return;
        }

        // Update status
        statusDiv.textContent = `${response.status} ${response.statusText}`;
        statusDiv.className = 'status ' + (response.ok ? 'success' : 'error');

        // Update headers
        const headersList = Array.from(response.headers.entries())
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        responseHeaders.innerHTML = `<pre><code>${headersList}</code></pre>`;

        try {
            // Try to parse as JSON first
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const json = await response.json();
                responseBody.innerHTML = `<pre><code>${JSON.stringify(json, null, 2)}</code></pre>`;
            } else {
                // Fallback to text
                const text = await response.text();
                responseBody.innerHTML = `<pre><code>${text}</code></pre>`;
            }
        } catch (error) {
            console.error('Error parsing response:', error);
            responseBody.innerHTML = `<pre><code class="error">Error parsing response: ${error.message}</code></pre>`;
        }
    }

    showError(requestPanel, error) {
        const statusDiv = requestPanel.querySelector('.response-container .status');
        const responseBody = requestPanel.querySelector('.response-container .response-body');

        if (statusDiv) {
            statusDiv.textContent = 'Error';
            statusDiv.className = 'status error';
        }

        if (responseBody) {
            responseBody.innerHTML = `<pre><code class="error">${error.message}</code></pre>`;
        }
    }
} 