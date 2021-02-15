# GUI Web

> code name: `gui-web`.

A web (frontend) built with Vue.js.

## Framework used

- Vue.js 2.6
- Vue Router 3.2
- Vuex 3.6
- Vue CLI 4.5
- Semantic UI 2.4

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

- npm

## Configuration

> this project use vue cli based environment config,
> the config file is defined in `/.env`, `/.env.development`, `/.env.production`.

## Debugging

```
# debug web will be served at: http://127.0.0.1:8080/
npm start
```

## Testing

- mocha test
```
npm run test:unit
```

## Building

```
npm run build
```

## Running (production)

project is compiled as static files, served by html server.

## Entry points

- http://127.0.0.1:8080/

# Docker support

## building docker image

- after building the app (npm), run this:

```sh
docker build -t gui-web-vue:1.0 .
```
