FROM sethforprivacy/public-pool:0859c58 AS backend
FROM sethforprivacy/public-pool-ui:db286e5 AS frontend
FROM node:18.16.1-bookworm-slim AS runner

USER root
# arm64 or amd64
ARG PLATFORM
# aarch64 or x86_64
ARG ARCH

ADD https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 /usr/local/bin/yq

RUN DEBIAN_FRONTEND=noninteractive apt update && \
  apt install -y --no-install-recommends \
  tini curl netcat-openbsd libstdc++6 \
  caddy \
  && chmod a+x /usr/local/bin/yq

# debug tools
RUN DEBIAN_FRONTEND=noninteractive apt install -y --no-install-recommends \
  vim net-tools procps less

COPY --from=backend public-pool /opt/public-pool
COPY --from=frontend /var/www/html /var/www/html

COPY ./assets/* /root/

COPY ./docker_entrypoint.sh /usr/local/bin/

RUN chmod a+x /usr/local/bin/*.sh

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
