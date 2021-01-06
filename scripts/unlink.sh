MUME_VERSION=`cat ../dendron-mume/package.json | jq -r '.["version"]'`
ENGINE_VERSION=`cat ../dendron/meta.json | jq -r '.["@dendronhq/engine-server"]'`

yarn unlink @dendronhq/mume
yarn unlink @dendronhq/engine-server
echo "installing mume $MUME_VERSION"
yarn add --force @dendronhq/mume@$VERSION_MUME
echo "installing engine $ENGINE_VERSION"
yarn add --force @dendronhq/engine-server@$VERSION_SERVER