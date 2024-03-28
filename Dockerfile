FROM sethforprivacy/public-pool:0859c58 AS backend
FROM sethforprivacy/public-pool-ui:db286e5 AS frontend
FROM node:18.16.1-bookworm-slim AS runner

USER root
# arm64 or amd64
ARG PLATFORM
# aarch64 or x86_64
ARG ARCH

RUN DEBIAN_FRONTEND=noninteractive apt update && \
  apt install -y --no-install-recommends \
  libstdc++6 yq caddy

# backend
COPY --from=backend public-pool /opt/public-pool
COPY ./assets/.env.template /root/
# frontend
COPY --from=frontend /var/www/html /var/www/html
COPY ./assets/Caddyfile.template /root/

COPY ./docker_entrypoint.sh /usr/local/bin/

RUN chmod a+x /usr/local/bin/*.sh

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
# CMD ["/bin/bash"]
