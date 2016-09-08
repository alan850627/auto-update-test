# auto-update-test

just testing this with electron builder and such

## Problems with nuts-github

If a github `release` is edited and re-released, `/updates/update/${os}/${appVersion}/RELEASES` becomes empty.
Drafting a new release and releasing a new version will cache the `RELEASES` file correctly again.
