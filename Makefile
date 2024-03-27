PKG_ID := $(shell yq e ".id" manifest.yaml)
PKG_VERSION := $(shell yq e ".version" manifest.yaml)
ICON := $(shell yq e ".assets.icon" manifest.yaml)
TS_FILES := $(shell find ./ -name \*.ts)

IMAGES="docker-images"
X64_IMG="$(IMAGES)/x86_64.tar"
A64_IMG="$(IMAGES)/aarch64.tar"


all: verify

verify: $(PKG_ID).s9pk
	start-sdk verify s9pk $(PKG_ID).s9pk

clean:
	rm -rf $(IMAGES)
	rm -f $(PKG_ID).s9pk
	rm -f scripts/*.js

scripts/embassy.js: $(TS_FILES)
	deno bundle scripts/embassy.ts scripts/embassy.js

# images/x86_64.tar: Dockerfile docker_entrypoint.sh assets/utils/*
$(X64_IMG): Dockerfile docker_entrypoint.sh
	mkdir -p $(IMAGES)
	docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/amd64 --build-arg PLATFORM=amd64 -o type=docker,dest=$(X64_IMG) .

# images/aarch64.tar: Dockerfile docker_entrypoint.sh
$(A64_IMG): Dockerfile docker_entrypoint.sh
	mkdir -p $(IMAGES)
	docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/arm64 --build-arg PLATFORM=arm64 -o type=docker,dest=$(A64_IMG) .


$(PKG_ID).s9pk: manifest.yaml instructions.md LICENSE $(ICON) scripts/embassy.js $(X64_IMG) $(A64_IMG)
	start-sdk pack
