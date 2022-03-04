#!/usr/bin/env python3

from http.server import HTTPServer, SimpleHTTPRequestHandler, HTTPStatus
import ssl
from os import path, system

# Generate private key and self-signed cert if it doesn't exist
if not path.isfile('development.pem'):
  system('/bin/bash -c "openssl req -new -x509 -keyout development.pem -out development.pem -days 365 -nodes -subj /CN=localhost/ -reqexts SAN -extensions SAN -config <(cat /etc/ssl/openssl.cnf <(printf \'[SAN]\nsubjectAltName=DNS:localhost\'))"')

# Start server
httpd = HTTPServer(('0.0.0.0', 8181), SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket, server_side=True, certfile='development.pem')
httpd.serve_forever()
