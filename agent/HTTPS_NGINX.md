# HTTPS enforcement runbook (nginx)

**STATUS: NOT APPLIED — runbook for later.** Nothing here has been changed in `nginx.conf`, `docker-compose.yml` or the backend.

## 1. Context (current state)

- `RestroHub-FrontEnd/nginx.conf`: one `server` block, `listen 80;`, `server_name localhost;`. No HTTP->HTTPS redirect, no HSTS. It sets X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, Referrer-Policy (server level, `always`), an SPA fallback in `location /`, and a static-assets regex location with `expires 1y` + `Cache-Control ... immutable`.
- `RestroHub-FrontEnd/Dockerfile`: nginx:1.27-alpine, `EXPOSE 80`, config copied to `/etc/nginx/conf.d/default.conf`.
- `docker-compose.yml`: `frontend` maps `${FRONTEND_PORT:-3000}:80`; `backend` maps `${BACKEND_PORT:-8181}:8181`; `db` maps 5432. No 443 anywhere.
- Backend: port 8181, context path `/restroly`, sets no HSTS, and has **no** `server.forward-headers-strategy` today.
- The frontend nginx does **not** proxy the API. The browser calls the backend directly at `VITE_API_BASE_URL`. So an HTTPS page needs an HTTPS API origin too (otherwise mixed content blocks every call). Both the site and the API (including the `/restroly/ws` WebSocket, which becomes `wss://`) must sit behind TLS.

## 2. Option A (recommended): TLS terminated at a load balancer / reverse proxy

The LB (cloud LB, Caddy, Traefik, host nginx...) holds the certificate and forwards plain HTTP to the containers with `X-Forwarded-Proto`. Route `app.example.com` -> frontend container :80 and `api.example.com` -> backend :8181 (replace with your domains).

Edit `RestroHub-FrontEnd/nginx.conf` (inside `server { ... }`):

```nginx
    # Redirect anything the LB received over plain HTTP.
    # The container healthcheck (wget http://localhost/) sends no X-Forwarded-Proto,
    # so match "http" explicitly instead of "!= https" to avoid redirecting it.
    if ($http_x_forwarded_proto = "http") {
        return 301 https://$host$request_uri;
    }

    add_header Strict-Transport-Security "max-age=300; includeSubDomains" always;
```

Notes:

- The plain form `$http_x_forwarded_proto != "https"` also redirects the Docker healthcheck (no header), making the container unhealthy. Use `= "http"` as above. If you must use `!= "https"`, exempt localhost requests.
- Start with `max-age=300` (5 min). After verifying everything works over HTTPS, raise to `31536000`. Do **not** add `preload` until you are certain every subdomain is HTTPS-only forever.

### Classic bug: `add_header` inheritance

In nginx, a `location` that contains **any** `add_header` discards **all** `add_header` lines inherited from the `server` level. The static-assets block already has `add_header Cache-Control ...`, so JS/CSS/images would silently lose HSTS and the four security headers. Repeat them there:

```nginx
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Strict-Transport-Security "max-age=300; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
    }
```

`location /` (SPA fallback) has no `add_header`, so it inherits the server-level lines and needs no change. Any location added later with its own `add_header` must repeat them too. (Alternative: put the headers in a snippet file and `include` it in the server and in every such location; the Dockerfile would need a COPY for the snippet.)

## 3. Option B: nginx in the frontend container terminates TLS

Replace the single server with two blocks:

```nginx
server {
    listen 80;
    server_name app.example.com;
    # ACME HTTP-01 challenge (certbot webroot) must stay on HTTP
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    server_name app.example.com;

    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    root /usr/share/nginx/html;
    index index.html;

    # ... gzip, security headers, HSTS, location /, static-assets location
    #     and error_page exactly as in section 2 (repeat headers per location) ...
}
```

Certificates (certbot on the host, webroot mode; mount `/var/www/certbot` and `/etc/letsencrypt` into the frontend container):

```bash
sudo certbot certonly --webroot -w /var/www/certbot -d app.example.com
sudo certbot renew --dry-run          # verify auto-renewal
# after renewal: docker compose exec frontend nginx -s reload
```

`docker-compose.yml` changes (frontend service; 443 must be exposed):

```yaml
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/www/certbot:/var/www/certbot:ro
```

Also update the Dockerfile `EXPOSE 80 443` and the HEALTHCHECK (`wget -qO- http://localhost/` will now get a 301; point it at `https://localhost/` with `--no-check-certificate`). The API origin still needs its own TLS (a separate proxy in front of backend :8181, or a `server_name api...` block proxying to `http://backend:8181`, with `Upgrade`/`Connection` headers for `/restroly/ws`).

## 4. Backend and build-time settings

1. Backend property (`RestroHub/src/main/resources/application.properties`, or env `SERVER_FORWARD_HEADERS_STRATEGY=framework` via Spring relaxed binding):

   ```properties
   server.forward-headers-strategy=framework
   ```

   Makes the scheme, redirects and `request.getRemoteAddr()` reflect `X-Forwarded-*` from the proxy. Enable only when the backend is reachable solely through a trusted proxy (otherwise clients can spoof their IP). The proxy must send `X-Forwarded-For` / `X-Forwarded-Proto`.
2. `CORS_ALLOWED_ORIGINS` (feeds `security.cors.allowed-origins`, used by `CorsConfig`) must list the exact `https://` origins, no trailing slash, e.g. `CORS_ALLOWED_ORIGINS=https://app.example.com`. Drop the `http://localhost:*` defaults in production. `docker-compose.yml` passes this var through.
3. Frontend build args (baked in at build time, rebuild required): `VITE_API_BASE_URL=https://api.example.com/restroly` (no trailing slash, no `/api/v1`) and `VITE_SITE_URL=https://app.example.com`.
   Gotcha: the `frontend` service in `docker-compose.yml` currently passes only `VITE_API_BASE_URL` and `VITE_GOOGLE_CLIENT_ID` as build args. Add `VITE_SITE_URL`, `VITE_GA_MEASUREMENT_ID`, `VITE_SPAM_PROTECTION_MODE`, `VITE_TURNSTILE_SITE_KEY` (they exist as Dockerfile ARGs) or they fall back to the Dockerfile defaults (`http://localhost:3000`, ...). Likewise the `backend` service does not forward `SPAM_*` / `TURNSTILE_SECRET_KEY` today.

### Spam protection settings behind HTTPS

`SpamProtectionFilter` rate-limits by `request.getRemoteAddr()`. Behind a proxy that is the proxy's IP unless `server.forward-headers-strategy=framework` is set, so **all users share one bucket** (default 10 requests/min) and legitimate visitors get throttled. Set the forwarded-headers property above before launch.

| Env var (backend) | Property | Default |
|---|---|---|
| `SPAM_PROTECTION_MODE` | `app.spam-protection.mode` | `honeypot` (or `turnstile`) |
| `SPAM_RATE_LIMIT_MAX` | `app.spam-protection.rate-limit.max` | `10` |
| `SPAM_RATE_LIMIT_WINDOW_SECONDS` | `app.spam-protection.rate-limit.window-seconds` | `60` |
| `TURNSTILE_SECRET_KEY` | `app.spam-protection.turnstile.secret` | empty |

Warning: in `turnstile` mode with an empty `TURNSTILE_SECRET_KEY`, every protected request returns 400 (fail-closed). The frontend also needs `VITE_SPAM_PROTECTION_MODE=turnstile` and `VITE_TURNSTILE_SITE_KEY` at build time.

### Analytics / CSP note

No Content-Security-Policy is set today. If one is added later it must allow `https://www.googletagmanager.com`, `https://www.google-analytics.com` (GA4) and `https://challenges.cloudflare.com` (Turnstile), plus the API origin in `connect-src` (and its `wss://` form for `/ws`).

## 5. Google OAuth

In Google Cloud Console -> Credentials -> your OAuth client: add the `https://` frontend origin (`https://app.example.com`) to **Authorized JavaScript origins** (and redirect URIs if used). Keep `VITE_GOOGLE_CLIENT_ID` and backend `GOOGLE_OAUTH_CLIENT_ID` identical. Remove the `http://localhost` origins for production clients.

## 6. Verification checklist

```bash
curl -sI http://app.example.com/            # expect 301 + Location: https://app.example.com/
curl -sI https://app.example.com/           # expect 200 + strict-transport-security
curl -sI https://app.example.com/assets/<any-built-file>.js   # HSTS AND Cache-Control both present (inheritance bug check)
curl -s https://api.example.com/restroly/actuator/health      # {"status":"UP"}
curl -sI -H "Origin: https://app.example.com" https://api.example.com/restroly/api/v1/<public-endpoint> | grep -i access-control
```

- SSL Labs (https://www.ssllabs.com/ssltest/) grade A or better.
- Browser DevTools: no mixed-content warnings, no CORS errors, WebSocket connects over `wss://`.
- Google login and the live order dashboard work.
- Spam limiter: two different client IPs are not throttled together (backend logs show real client IPs).
- After a few stable days, raise HSTS `max-age` to `31536000`.
