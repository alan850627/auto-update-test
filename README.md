# auto-update-test

just testing this with electron builder and such

## Problems with nuts-github

If a github `release` is edited and re-released, `/update/${os}/${appVersion}/RELEASES` becomes empty.
Drafting a new release and releasing a new version will cache the `RELEASES` file correctly again.


## Double Package.json

Make sure to `npm i` in both the main directory and in `/app` to get all the node modules.
