cd ../dendron-mume/scripts
./unlink.sh
cd ..
git add .
git commit -m "update dependencies"
./scripts/bump.sh

cd dendron-markdown-preview-enhanced
./scripts/unlink.sh
./scripts/bump-and-package.sh
./scripts/install.sh