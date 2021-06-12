MUME_VERSION=`cat ../dendron-mume/package.json | jq -r '.["version"]'`
ENGINE_VERSION=`cat ../dendron/meta.json | jq -r '.["@dendronhq/engine-server"]'`
COMMON_ALL_VERSION=`cat ../dendron/meta.json | jq -r '.["@dendronhq/common-all"]'`
COMMON_SERVER_VERSION=`cat ../dendron/meta.json | jq -r '.["@dendronhq/common-server"]'`

yarn unlink @dendronhq/mume  @dendronhq/engine-server @dendronhq/common-all @dendronhq/common-server
yarn add --force @dendronhq/mume@$MUME_VERSION @dendronhq/engine-server@$ENGINE_VERSION @dendronhq/common-all@$COMMON_ALL_VERSION @dendronhq/common-server@$COMMON_SERVER_VERSION
