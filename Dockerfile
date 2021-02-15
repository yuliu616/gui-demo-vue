FROM nginx:1.19

# suggested mounting point:
# - html public: /usr/src/html
# - nginx config file: /etc/nginx/conf.d/default.conf

ENV PORT=8080

# Bundle app source (static web content)
COPY dist /usr/src/html/

# install config files to nginx, as default site.
COPY nginx-config.conf /etc/nginx/conf.d/default.conf

EXPOSE ${PORT}

HEALTHCHECK --interval=10s --timeout=5s \
  CMD curl -f http://127.0.0.1:${PORT}/index.html || exit 1

# build with this:
# > docker build -t my-html .
