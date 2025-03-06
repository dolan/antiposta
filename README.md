# CurlGUI - API Testing Tool

CurlGUI is a lightweight, open-source API testing tool built around cURL functionality. It provides a modern, intuitive interface for testing APIs while maintaining complete local control over your data.

## Features

- 🔒 **Local-First**: All data stored locally - no cloud sync, no login required
- 📑 **Multi-Tab Interface**: Work with multiple requests simultaneously
- 🌓 **Dark/Light Theme**: Choose your preferred visual theme
- 📋 **Request Management**: Full support for all HTTP methods
- 🗂️ **Collections**: Organize your requests into collections
- 🔄 **Environment Variables**: Switch between different environments easily
- 📱 **Responsive Design**: Works on desktop and tablet devices
- ⌨️ **Keyboard Shortcuts**: Efficient workflow with keyboard controls

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/curlgui.git
cd curlgui
```

2. Open the application:
   - Simply open `index.html` in your web browser
   - Or serve it using a local server:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

## Using the Application

### Making Requests

1. Create a new request tab using:
   - The '+' button in the tab bar
   - Keyboard shortcut: `Ctrl/Cmd + T`

2. Configure your request:
   - Select HTTP method (GET, POST, PUT, etc.)
   - Enter the request URL
   - Add headers, parameters, or body data using the respective tabs
   - Click 'Send' or press `Ctrl/Cmd + Enter` to execute

### Working with Tabs

- **Create New Tab**: `Ctrl/Cmd + T`
- **Close Current Tab**: `Ctrl/Cmd + W`
- **Switch Between Tabs**: Click on tab or use `Ctrl/Cmd + 1-9`
- **Toggle Split View**: `Ctrl/Cmd + B` or click the split view button

### Managing Collections

1. Use the Collections panel in the sidebar to:
   - Create new collections
   - Organize requests into folders
   - Import/export collections
   - Share collections with team members

2. Save requests to collections:
   - Click 'Save' in the request panel
   - Choose an existing collection or create a new one
   - Add a name and description for your request

### Environment Management

1. Create environments for different contexts (dev, staging, prod):
   - Click 'Manage Environments' button
   - Add environment variables
   - Set variable values for each environment

2. Use environment variables in requests:
   - Reference variables using `{{variableName}}` syntax
   - Switch environments using the environment selector
   - Variables are automatically replaced when sending requests

### Theme Customization

- Toggle between light and dark themes using:
  - Theme toggle button in the top-right corner
  - Keyboard shortcut: `Ctrl/Cmd + Shift + T`

### Request History

- View recent requests in the History panel
- Click any history item to restore the request
- History is stored locally and persists between sessions

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Tab | `Ctrl/Cmd + T` |
| Close Tab | `Ctrl/Cmd + W` |
| Send Request | `Ctrl/Cmd + Enter` |
| Save Request | `Ctrl/Cmd + S` |
| Toggle Theme | `Ctrl/Cmd + Shift + T` |
| Toggle Split View | `Ctrl/Cmd + B` |
| Switch Tabs | `Ctrl/Cmd + 1-9` |
| Focus URL Bar | `Ctrl/Cmd + L` |

## Local Storage

CurlGUI stores all data locally in your browser:
- Collections and requests
- Environment configurations
- Request history
- Theme preferences
- UI state and layout

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