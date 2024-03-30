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

COPY ./assets/* /root/
COPY --from=backend public-pool /opt/public-pool
COPY --from=frontend /var/www/html /var/www/html

COPY ./docker_entrypoint.sh /usr/local/bin/

RUN chmod a+x /usr/local/bin/*.sh

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
