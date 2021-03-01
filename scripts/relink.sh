MUME_VERSION=`cat ../dendron-mume/package.json | jq -r '.["version"]'`
ENGINE_VERSION=`cat ../dendron/meta.json | jq -r '.["@dendronhq/engine-server"]'`

yarn unlink @dendronhq/mume
yarn unlink @dendronhq/engine-server
yarn add --force @dendronhq/mume@$MUME_VERSION @dendronhq/engine-server@$ENGINE_VERSION
