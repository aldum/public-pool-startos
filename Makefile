PACKAGE_ID := public-pool

# Default target
all: ${PACKAGE_ID}.s9pk

check: node_modules package.json
	npm run check

# Build targets
${PACKAGE_ID}.s9pk: check $(shell start-cli s9pk list-ingredients 2> /dev/null)
	start-cli s9pk pack

javascript/index.js: $(shell find startos -name "*.ts") tsconfig.json node_modules package.json
	npm run build

node_modules: package.json package-lock.json
	npm ci

package-lock.json: package.json
	npm i

# Clean target
clean:
	rm -rf ${PACKAGE_ID}.s9pk
	rm -rf javascript
	rm -rf node_modules

# Install target
install: ${PACKAGE_ID}.s9pk
	@if [ ! -f ~/.startos/config.yaml ]; then echo "You must define \"host: http://server-name.local\" in ~/.startos/config.yaml config file first."; exit 1; fi
	@echo "\nInstalling to $$(grep -v '^#' ~/.startos/config.yaml | cut -d'/' -f3) ...\n"
	@[ -f $(PACKAGE_ID).s9pk ] || ( $(MAKE) && echo -e "\nInstalling to $$(grep -v '^#' ~/.startos/config.yaml | cut -d'/' -f3) ...\n" )
	@start-cli package install -s $(PACKAGE_ID).s9pk
