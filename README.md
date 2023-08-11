# GUI Web

> code name: `gui-web-vue`.

A web (frontend) built with Vue.js(v3).

## Framework used

- Vue.js 3.3
- Vue Router 4.2
- Pinia 2.1
- Ant Design Vue 3.2
- Font Awesome for Vue (icon set) 3.0

## Environment (dependency)

> this frontend project assume it is served behind a nginx like (http proxy),
> and the proxy should also routing corresponding http requests to 
> backend (api/services).

- HTML/JavaScript
- service:
  - auth-service@1.0.x (service = auth-service via http proxy)
  - people-service@1.0.x (service = people-service via http proxy)
  - product-service@1.0.x (service = product-service via http proxy)

## Development Setup

- npm (node.js v18)

## Configuration

> this project use vue cli based environment config,
> the config file is defined in `/.env`, `/.env.development`, `/.env.production`.
> for description and spec of config, refer to `env.d.ts`.

## Debugging

```
# debug web will be served at: http://localhost:5173/
npm start
```

## Testing

- vitest (Mocha style)
```
npm test
```

## Building

```sh
# build to output folder `dist`
npm run build
```

## Running (production mode)

- after building, serve by this:

```sh
npm run preview
```

- Entry points

> http://localhost:4173/

# Docker support

## building docker image

- after building the app (npm), run this:

```sh
docker build -t gui-web-vue:1.2 .
```
