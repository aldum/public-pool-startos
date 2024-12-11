PKG_ID := pubpool

# IMAGES="docker-images"
# X64_IMG="$(IMAGES)/x86_64.tar"
# A64_IMG="$(IMAGES)/aarch64.tar"

# Default target
all: ${PACKAGE_ID}.s9pk

# Build targets
${PACKAGE_ID}.s9pk: $(shell start-cli s9pk list-ingredients)
	start-cli s9pk pack

javascript/index.js: $(shell git ls-files startos) tsconfig.json node_modules package.json
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
