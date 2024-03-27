FROM sethforprivacy/public-pool:0859c58 AS backend
FROM mempool/frontend:db286e5 AS frontend
FROM node:18.16.1-bookworm-slim AS runner

USER root
# arm64 or amd64
ARG PLATFORM
# aarch64 or x86_64
ARG ARCH

RUN apt update && \
  apt install -y libstdc++6 yq

COPY --from=backend public-pool /opt/public-pool
COPY ./docker_entrypoint.sh /usr/local/bin/
COPY ./assets/.env.template /root/

RUN chmod a+x /usr/local/bin/*.sh

EXPOSE 3333 3334 8332

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
# CMD ["/bin/bash"]
