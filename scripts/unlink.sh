VERSION_MUME=0.13.0
VERSION_SERVER="0.14.2-alpha.2"

yarn unlink @dendronhq/mume
yarn unlink @dendronhq/engine-server
echo "installing $VERSION_MUME"
yarn add --force @dendronhq/mume@$VERSION_MUME
echo "installing $VERSION_MUME"
yarn add --force @dendronhq/engine-server@$VERSION_SERVER