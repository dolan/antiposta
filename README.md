# Antiposta - API Testing Tool

Antiposta is a lightweight, open-source API testing tool built around cURL functionality. It provides a modern, intuitive interface for testing APIs while maintaining complete local control over your data.

## Features

- 🔒 **Local-First**: All data stored locally - no cloud sync, no login required
- 📋 **Request Management**: Full support for all HTTP methods
- 🔄 **Environment Variables**: Switch between different environments easily
- 📱 **Responsive Design**: Works on desktop and tablet devices
- ⌨️ **Keyboard Shortcuts**: Efficient workflow with keyboard controls

## No need to install anything, just run it
Use it on [Github Pages](https://dolan.github.io/antiposta/index.html)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/dolan/antiposta.git
cd antiposta 
```

2. The whole project is one file:
   - Simply open `index.html` in your web browser

## Using the Application

### Making Requests

1. Configure your request:
   - Select HTTP method (GET, POST, PUT, etc.)
   - Enter the request URL
   - Add headers, parameters, or body data using the respective tabs
   - Click 'Send' or press `Ctrl/Cmd + Enter` to execute

2. Export as cURL:
   - Click the '📋 cURL' button or press `Ctrl/Cmd + K`
   - The command is automatically copied to your clipboard
   - Perfect for sharing requests or using in scripts

### Environment Management

1. Create environments for different contexts (dev, staging, prod):
   - Click 'Manage Environments' button
   - Add environment variables
   - Set variable values for each environment

2. Use environment variables in requests:
   - Reference variables using `{{variableName}}` syntax
   - Switch environments using the environment selector
   - Variables are automatically replaced when sending requests

### Request History

- Every successful request is automatically saved to history
- View recent requests in the History panel in the sidebar
- Click any history item to restore the complete request
- History is stored locally and persists between sessions
- The 20 most recent requests are kept

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Send Request | `Ctrl/Cmd + Enter` |
| Focus URL Bar | `Ctrl/Cmd + L` |
| Copy as cURL | `Ctrl/Cmd + K` |
| Show Help | `F1` |
| Close Modals | `Escape` |

## Local Storage

Antiposta stores all data locally in your browser:
- Environment configurations and variables
- Request history (20 most recent requests)
- UI preferences

No data is ever sent to external servers, ensuring complete privacy and control over your API testing data.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions:
1. Check the [Issues](https://github.com/yourusername/curlgui/issues) page
2. Create a new issue with detailed information about your problem
3. Include steps to reproduce, expected behavior, and actual behavior

## Acknowledgments

- Built with vanilla JavaScript, HTML, and CSS
- Inspired by popular API testing tools while focusing on privacy and local control
- Icons provided by [Feather Icons](https://feathericons.com/)

# Antiposta Test Server

This is a simple Python HTTP server designed to test the Antiposta API testing tool. The server echoes back information about the request and responds with the appropriate content type based on the request.

## Features

- Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- Content negotiation based on Accept header or request Content-Type
- Responds with appropriate format (JSON, HTML, XML, or plain text)
- CORS enabled for testing from any origin
- Echoes back all request details (headers, parameters, body, etc.)
- Handles different body formats (JSON, form data, XML, plain text)

## Requirements

- Python 3.6 or higher

## Usage

1. Start the server:

```bash
python test_server.py [port]
```

The default port is 8000 if not specified.

2. Use Antiposta to send requests to the server:

```
http://localhost:8000/any/path/you/want
```

## Testing Different Content Types

### JSON

Send a request with Content-Type: application/json or Accept: application/json header to get a JSON response.

Example in Antiposta:
- Set the URL to: http://localhost:8000/api/test
- Add a header: Content-Type: application/json
- Set the body type to JSON and add some JSON content:
```json
{
  "name": "Test User",
  "email": "test@example.com"
}
```

### HTML

Send a request with Accept: text/html header to get an HTML response.

Example in Antiposta:
- Set the URL to: http://localhost:8000/page
- Add a header: Accept: text/html

### XML

Send a request with Content-Type: application/xml or Accept: application/xml header to get an XML response.

Example in Antiposta:
- Set the URL to: http://localhost:8000/api/xml
- Add a header: Accept: application/xml

### Form Data

Send a request with Content-Type: application/x-www-form-urlencoded or multipart/form-data to test form submissions.

Example in Antiposta:
- Set the URL to: http://localhost:8000/submit-form
- Set the body type to Form Data
- Add key-value pairs for your form fields

## Query Parameters

You can add query parameters to test URL parameter handling:

Example:
```
http://localhost:8000/search?q=test&page=1
```

## Response

The server will respond with details about your request, including:

- HTTP method used
- Request path
- HTTP version
- All request headers
- Query parameters
- Request body (if any)
- Client IP address
- Timestamp
- Server name

This makes it easy to verify that your Antiposta client is correctly sending the request as intended.

---

<details>
<summary><strong>📋 Changelog</strong> <em>(click to expand)</em></summary>

## Recent Updates

### v1.1.0 - Productivity Boost (Latest)
*Focus: Essential workflow features for daily use*

**🎯 New Features:**
- **cURL Export**: Generate cURL commands from any request
  - Click the '📋 cURL' button or press `Ctrl/Cmd + K`
  - Automatic clipboard copy with visual feedback
  - Includes all headers, parameters, body, and resolved environment variables
- **Keyboard Shortcuts**: Speed up your workflow
  - `Ctrl/Cmd + Enter` - Send request
  - `Ctrl/Cmd + L` - Focus and select URL bar
  - `Ctrl/Cmd + K` - Copy as cURL command
  - `F1` - Show help
  - `Escape` - Close any open modal
- **Automatic Request History**: Never lose a working request
  - Every successful request automatically saved
  - Click any history item to restore complete request state
  - Smart deduplication (same method + URL)
  - 20 most recent requests kept locally

**📚 Documentation:**
- Enhanced help system with new topics for cURL export and history
- Updated keyboard shortcuts in help overlay
- Contextual help that adapts to current tab

### v1.0.0 - Initial Release
*Focus: Core API testing with environment support*

**🏗️ Core Features:**
- Full HTTP method support (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- Request configuration: headers, URL parameters, request body (JSON, form data, text)
- Response viewing with automatic JSON formatting
- Environment variable system with `{{variable}}` syntax
- OAuth2 authentication support (client credentials and password flows)
- Comprehensive help system
- Dark theme UI optimized for developer workflows

**🔒 Privacy & Local Control:**
- 100% local operation - no data sent to external servers
- No login required - start testing immediately
- All data stored in browser localStorage
- Complete control over your API testing environment

</details> 