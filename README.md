# oppia.github.io

Main page of the Oppia project on GitHub. This is written as a standalone
Angular application.

## Contributing

Fork and clone this repo, then run

**Python 2:**
```
   python -m SimpleHTTPServer 8181
```

or

**Python 3:**
```
   python -m http.server 8181
```

Then navigate to `localhost:8181` in a browser.

### Project Dashboard

The Oppia Project Dashboard uses the web crypto API, which requires a TLS connection.
To start an HTTPS simple server with a generated self-signed certificate, execute:

```shell
$ python3 start.py
```

Then navigate to `https://localhost:8181/project-dashboard` in a browser.  Note that
you will need to explicitly permit the browser to accept this self-signed certificate.
Chrome won't let you do that, but there's a workaround.  Just click anywhere on the
error page and type `thisisunsafe` and the page will load.

#### Windows

If you are using Windows, you have a few options:

1. You can install a VM or spin up a Docker container with Linux, and run the script
   from there, using a shared volume and forwarding tcp/8181 to the windows host.
2. You can install the Linux subsystem for Windows under Add or remove programs >
   Windows Features.  Then, in the Microsoft Store you can download a linux distribution
   such as Ubuntu.
3. You can install OpenSSL for Windows and manually run this command to generate the
   `development.pem` file:
   ```shell
   $ /bin/bash -c "openssl req -new -x509 -keyout development.pem -out development.pem -days 365 -nodes -subj /CN=localhost/ -reqexts SAN -extensions SAN -config <(cat /etc/ssl/openssl.cnf <(printf '[SAN]\nsubjectAltName=DNS:localhost'))"
   ```
