PACKAGE_ID := $(shell sed -n -r -e "s/\s*id\s*:\s*['\"](.+)['\"],/\1/ p" startos/manifest.ts)

.PHONY: all clean install build-js

all: check-deps check-init deps ${PACKAGE_ID}.s9pk
	@echo " Done!"
	@echo " Filesize:$(shell du -h $(PACKAGE_ID).s9pk) is ready"

check-deps:
	@if ! command -v start-cli > /dev/null; then \
		echo "Error: start-cli not found. Please install it first."; \
		exit 1; \
	fi

check-init:
	@if [ ! -f ~/.startos/developer.key.pem ]; then \
		start-cli init; \
	fi

deps: node_modules build-js

build-js: javascript/index.js

check-ts: node_modules package.json
	npm run check

${PACKAGE_ID}.s9pk: check-ts build-js
	$(eval INGREDIENTS := $(shell start-cli s9pk list-ingredients))
	start-cli s9pk pack

javascript/index.js: $(shell find startos -name "*.ts") tsconfig.json node_modules package.json
	npm run build

node_modules: package.json package-lock.json
	npm ci

package-lock.json: package.json
	npm i

clean:
	rm -rf ${PACKAGE_ID}.s9pk
	rm -rf javascript
	rm -rf node_modules

install: ${PACKAGE_ID}.s9pk
	@if [ ! -f ~/.startos/config.yaml ]; then echo "You must define \"host: http://server-name.local\" in ~/.startos/config.yaml config file first."; exit 1; fi
	@echo -e "\nInstalling to $$(grep -v '^#' ~/.startos/config.yaml | cut -d'/' -f3) ...\n"
	@start-cli package install -s $(PACKAGE_ID).s9pk
