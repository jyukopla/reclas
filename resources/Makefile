export PATH := $(PATH):node_modules/.bin

SOURCES = \
	$(wildcard src/reclastheme/*) \
	src/reclastheme/icons \
	webpack.config.js

all: build

build: node_modules $(SOURCES)
	yarn run build

watch: node_modules $(SOURCES)
	yarn run watch

clean:
	$(RM) -r theme .plone

DEPLOY_HOST = jalava.cc.jyu.fi
DEPLOY_HASH = $(shell git rev-parse --short HEAD)$(DIRTY_SOURCES_FLAG)
DEPLOY_PATH = /autowww/sovpa6/static.cc.jyu.fi/plone/reclas-$(DEPLOY_HASH)

# Target site for upload
UPLOAD_URL ?= https://www.jyu.fi/reclas/
UPLOAD_FLAGS ?= --enable

DIRTY_SOURCES_FLAG=$(shell [ -z "$$(git status --untracked-files=no --porcelain $(SOURCES))" ] || echo "-dirty")

deploy: dist/$(DEPLOY_HASH)/reclastheme push-production

dist: dist/$(DEPLOY_HASH)/reclastheme

redist: REDIST=1
redist: dist/$(DEPLOY_HASH)/reclastheme

dist/$(DEPLOY_HASH)/reclastheme: $(SOURCES)
	@[[ -z "$(REDIST)" ]] \
		&& echo "Trying to pull prebuild version, use REDIST=1 or make redist to skip" \
		&& make dist-pull \
		|| DISTPATH=dist/$(DEPLOY_HASH) \
			PUBLICPATH=https://static.cc.jyu.fi/plone/reclas-$(DEPLOY_HASH)/ \
			make build

dist-pull:
ifneq ($(DIRTY_SOURCES_FLAG),)
	$(error "Dirty sources, will not pull")
else
	mkdir -p "dist/$(DEPLOY_HASH)"
	scp -r "$(DEPLOY_HOST):$(DEPLOY_PATH)" "dist/$(DEPLOY_HASH)/reclastheme"
endif

push-production: dist/$(DEPLOY_HASH)/reclastheme
	ssh "$(DEPLOY_HOST)" test ! -d "$(DEPLOY_PATH)" \
		|| (echo "Error: $(DEPLOY_HOST):$(DEPLOY_PATH) already exists"; false)
	scp -r dist/$(DEPLOY_HASH)/reclastheme $(DEPLOY_HOST):$(DEPLOY_PATH)

upload: dist/$(DEPLOY_HASH)/reclastheme
ifndef UPLOAD_URL
	$(error "Missing required var: UPLOAD_URL")
endif
	plonetheme-upload dist/$(DEPLOY_HASH)/reclastheme $(UPLOAD_URL) $(UPLOAD_FLAGS)

upload-custom: dist/$(DEPLOY_HASH)/reclastheme-custom
ifndef UPLOAD_URL
	$(error "Missing required var: UPLOAD_URL")
endif
	plonetheme-upload dist/$(DEPLOY_HASH)/reclastheme-custom $(UPLOAD_URL)

###

.PHONY: all build watch deploy dist upload clean

node_modules: package.json
	yarn install
	touch node_modules

src/reclastheme/icons: node_modules fontello.json
	fontello-svg --config fontello.json --no-css --verbose \
	  --out src/reclastheme/icons \
	  --fill-colors "black:rgb(0,0,0)|white:rgb(255,255,255)|red:rgb(233,80,110)"
	sed -i.bak -E \
	  's|svg height="([^"]+)" width="([^"]+)"|svg viewBox="0 0 \2 \1"|g' \
	  src/reclastheme/icons/*.svg
	rm src/reclastheme/icons/*.svg.bak
