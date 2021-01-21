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
