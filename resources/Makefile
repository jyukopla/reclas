export PATH := $(PATH):node_modules/.bin

SOURCES = \
	$(wildcard src/reclastheme/*) \
	src/reclastheme/icons \
	webpack.config.js

all: build

build: clean node_modules $(SOURCES)
	yarn run build

watch: clean node_modules $(SOURCES)
	yarn run watch

clean:
	$(RM) -r theme

###

.PHONY: all build watch clean

node_modules: package.json
	yarn install
	touch node_modules

src/reclastheme/icons: node_modules fontello.json
	fontello-svg --config fontello.json --no-css --verbose \
	  --out src/reclastheme/icons \
	  --fill-colors "black:rgb(0,0,0)|white:rgb(255,255,255)"
	sed -i.bak -E \
	  's|svg height="([^"]+)" width="([^"]+)"|svg viewBox="0 0 \2 \1"|g' \
	  src/reclastheme/icons/*.svg
	rm src/reclastheme/icons/*.svg.bak
