from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import time
import sys
import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import email.parser
import io

class TestHTTPRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, content_type='application/json'):
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Server', 'Antiposta-Test-Server/1.0')
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow CORS for testing
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        # Handle preflight CORS requests
        self._set_headers()
        self.wfile.write(b'')
    
    def _parse_multipart(self, content_type, raw_body):
        """Parse multipart/form-data without using the deprecated cgi module"""
        boundary = content_type.split('boundary=')[1].strip()
        if boundary.startswith('"') and boundary.endswith('"'):
            boundary = boundary[1:-1]
        
        # Prepare the multipart data for parsing
        multipart_data = io.BytesIO(raw_body)
        
        # Create a message parser
        parser = email.parser.BytesParser()
        message = parser.parse(multipart_data)
        
        # Extract form data
        form_data = {}
        
        if message.is_multipart():
            for part in message.get_payload():
                # Get field name from Content-Disposition header
                content_disposition = part.get('Content-Disposition', '')
                if 'form-data' in content_disposition and 'name=' in content_disposition:
                    # Extract field name
                    name_parts = content_disposition.split('name=')
                    if len(name_parts) > 1:
                        name = name_parts[1].split(';')[0].strip()
                        if name.startswith('"') and name.endswith('"'):
                            name = name[1:-1]
                        
                        # Get field value
                        value = part.get_payload(decode=True)
                        try:
                            value = value.decode('utf-8')
                        except UnicodeDecodeError:
                            # Keep as bytes if it can't be decoded
                            pass
                        
                        form_data[name] = value
        
        return form_data
    
    def _get_request_data(self):
        # Parse query parameters
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        
        # Get request headers
        headers = {key: value for key, value in self.headers.items()}
        
        # Get client info
        client_address = self.client_address[0]
        
        # Get request body if present
        content_length = int(self.headers.get('Content-Length', 0))
        body = None
        raw_body = b''
        
        if content_length > 0:
            raw_body = self.rfile.read(content_length)
            content_type = self.headers.get('Content-Type', '')
            
            # Parse body based on content type
            if 'application/json' in content_type:
                try:
                    body = json.loads(raw_body.decode('utf-8'))
                except json.JSONDecodeError:
                    body = {'error': 'Invalid JSON'}
            elif 'application/x-www-form-urlencoded' in content_type:
                body = urllib.parse.parse_qs(raw_body.decode('utf-8'))
            elif 'multipart/form-data' in content_type:
                # Use our custom multipart parser instead of cgi
                try:
                    body = self._parse_multipart(content_type, raw_body)
                except Exception as e:
                    body = {'error': f'Failed to parse multipart/form-data: {str(e)}'}
            elif 'application/xml' in content_type or 'text/xml' in content_type:
                try:
                    body = raw_body.decode('utf-8')
                except UnicodeDecodeError:
                    body = {'error': 'Invalid XML encoding'}
            else:
                # Plain text or other format
                try:
                    body = raw_body.decode('utf-8')
                except UnicodeDecodeError:
                    body = {'error': 'Unable to decode body'}
        
        # Build response data
        data = {
            'method': self.command,
            'path': self.path,
            'http_version': self.request_version,
            'headers': headers,
            'client_ip': client_address,
            'query_params': query_params,
            'body': body,
            'timestamp': time.time(),
            'server': 'Antiposta-Test-Server/1.0'
        }
        
        return data, raw_body
    
    def _handle_request(self):
        data, raw_body = self._get_request_data()
        
        # Determine response content type based on Accept header or request Content-Type
        accept_header = self.headers.get('Accept', '')
        content_type_header = self.headers.get('Content-Type', '')
        
        if 'application/json' in accept_header or 'application/json' in content_type_header:
            self._set_headers('application/json')
            response = json.dumps(data, indent=2)
            self.wfile.write(response.encode('utf-8'))
        elif 'text/html' in accept_header:
            self._set_headers('text/html')
            html_response = f"""<!DOCTYPE html>
<html>
<head>
    <title>Antiposta Test Server Response</title>
    <style>
        body {{ font-family: sans-serif; margin: 20px; }}
        h1 {{ color: #333; }}
        pre {{ background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto; }}
        .method {{ color: #0066cc; font-weight: bold; }}
        .path {{ color: #009900; }}
        .header-name {{ color: #cc6600; font-weight: bold; }}
        .header-value {{ color: #333; }}
    </style>
</head>
<body>
    <h1>Request Details</h1>
    <p><span class="method">{data['method']}</span> <span class="path">{data['path']}</span> {data['http_version']}</p>
    <h2>Headers</h2>
    <ul>
        {''.join([f'<li><span class="header-name">{k}:</span> <span class="header-value">{v}</span></li>' for k, v in data['headers'].items()])}
    </ul>
    <h2>Query Parameters</h2>
    <pre>{json.dumps(data['query_params'], indent=2)}</pre>
    <h2>Body</h2>
    <pre>{json.dumps(data['body'], indent=2) if isinstance(data['body'], (dict, list)) else data['body']}</pre>
    <h2>Client Info</h2>
    <p>IP Address: {data['client_ip']}</p>
    <p>Timestamp: {time.ctime(data['timestamp'])}</p>
    <p>Server: {data['server']}</p>
</body>
</html>"""
            self.wfile.write(html_response.encode('utf-8'))
        elif 'application/xml' in accept_header or 'text/xml' in accept_header or 'application/xml' in content_type_header or 'text/xml' in content_type_header:
            self._set_headers('application/xml')
            
            # Create XML response
            root = ET.Element('response')
            
            # Add request info
            request_info = ET.SubElement(root, 'request')
            ET.SubElement(request_info, 'method').text = data['method']
            ET.SubElement(request_info, 'path').text = data['path']
            ET.SubElement(request_info, 'httpVersion').text = data['http_version']
            
            # Add headers
            headers_elem = ET.SubElement(root, 'headers')
            for name, value in data['headers'].items():
                header = ET.SubElement(headers_elem, 'header')
                ET.SubElement(header, 'name').text = name
                ET.SubElement(header, 'value').text = value
            
            # Add query parameters
            params_elem = ET.SubElement(root, 'queryParameters')
            for name, values in data['query_params'].items():
                for value in values:
                    param = ET.SubElement(params_elem, 'parameter')
                    ET.SubElement(param, 'name').text = name
                    ET.SubElement(param, 'value').text = value
            
            # Add body
            body_elem = ET.SubElement(root, 'body')
            if isinstance(data['body'], dict):
                for key, value in data['body'].items():
                    item = ET.SubElement(body_elem, 'item')
                    ET.SubElement(item, 'key').text = key
                    ET.SubElement(item, 'value').text = str(value)
            elif data['body'] is not None:
                body_elem.text = str(data['body'])
            
            # Add client info
            client_info = ET.SubElement(root, 'clientInfo')
            ET.SubElement(client_info, 'ip').text = data['client_ip']
            ET.SubElement(client_info, 'timestamp').text = time.ctime(data['timestamp'])
            ET.SubElement(client_info, 'server').text = data['server']
            
            # Convert to string and pretty print
            xml_str = ET.tostring(root, encoding='utf-8')
            pretty_xml = minidom.parseString(xml_str).toprettyxml(indent="  ")
            
            self.wfile.write(pretty_xml.encode('utf-8'))
        else:
            # Default to plain text
            self._set_headers('text/plain')
            response = f"""
Request Details:
----------------
{data['method']} {data['path']} {data['http_version']}

Headers:
--------
{chr(10).join([f'{k}: {v}' for k, v in data['headers'].items()])}

Query Parameters:
----------------
{json.dumps(data['query_params'], indent=2)}

Body:
-----
{json.dumps(data['body'], indent=2) if isinstance(data['body'], (dict, list)) else data['body']}

Client Info:
-----------
IP Address: {data['client_ip']}
Timestamp: {time.ctime(data['timestamp'])}
Server: {data['server']}
"""
            self.wfile.write(response.encode('utf-8'))
    
    # Handle all HTTP methods
    def do_GET(self):
        self._handle_request()
    
    def do_POST(self):
        self._handle_request()
    
    def do_PUT(self):
        self._handle_request()
    
    def do_DELETE(self):
        self._handle_request()
    
    def do_PATCH(self):
        self._handle_request()
    
    def do_HEAD(self):
        # For HEAD requests, we set headers but don't send a body
        data, _ = self._get_request_data()
        accept_header = self.headers.get('Accept', '')
        content_type_header = self.headers.get('Content-Type', '')
        
        if 'application/json' in accept_header or 'application/json' in content_type_header:
            self._set_headers('application/json')
        elif 'text/html' in accept_header:
            self._set_headers('text/html')
        elif 'application/xml' in accept_header or 'text/xml' in accept_header:
            self._set_headers('application/xml')
        else:
            self._set_headers('text/plain')

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, TestHTTPRequestHandler)
    print(f"Starting Antiposta test server on port {port}...")
    print(f"Server URL: http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()
        print("Server stopped.")

if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port number: {sys.argv[1]}")
            print(f"Using default port: {port}")
    
    run_server(port) 