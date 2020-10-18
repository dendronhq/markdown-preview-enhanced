VERSION=0.12.0

yarn unlink @dendronhq/mume
echo "installing $VERSION"
yarn add --force @dendronhq/mume@$VERSION
