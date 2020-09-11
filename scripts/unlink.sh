VERSION=$1

yarn unlink @dendronhq/mume
echo "installing $VERSION"
yarn add --force @dendronhq/mume@$VERSION
