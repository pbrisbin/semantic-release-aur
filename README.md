# semantic-release-aur

[semantic-release][] plugin to publish an [AUR][] package.

[semantic-release]: https://semantic-release.gitbook.io/semantic-release/
[aur]: https://aur.archlinux.org

## Requirements

1. Package exists already on AUR
1. Release is run on an Arch Linux system. For GitHub Actions, that means
   running in an Arch Linux docker image.

   ```yaml
   # TODO: show example
   ```

> [!NOTE]
>
> The use case we support is running semantic-release in the source repository
> that is being packaged, not in the AUR package repository itself.

## Steps

| Step               | Description                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `verifyConditions` | verify the environment variable `SSH_PRIVATE_KEY` is set and tools like `makepkg` are available   |
| `prepare`          | Configure SSH, clone the AUR repository, update version in the `PKGBUILD`, and print a `git diff` |
| `publish`          | Update pkg checksums, `SRCINFO`, commit and push (unless prerelease)                              |

## Environment variables

| Variable          | Description                                                    | Required |
| ----------------- | -------------------------------------------------------------- | -------- |
| `SSH_PRIVATE_KEY` | Private key with push access to the AUR package repository     | true     |

## Install

TODO

## GitHub Actions

```yaml
- id: release
  uses: cycjimmy/semantic-release-action@v4
  with:
    extra_plugins: |
      git+https://github.com/pbrisbin/semantic-release-aur.git#main
  env:
    GITHUB_TOKEN: ${{ github.token }}
    SSH_PRIVATE_KEY: ${{ secrets.AUR_SSH_PRIVATE_KEY }}
```

## Usage

The plugin can be configured in the [semantic-release configuration
file][semantic-release-config]:

[semantic-release-config]: https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "semantic-release-aur",
      {
        "tempDirectory": "/tmp",
        "packageName": "my-package",
        "pushPrerelease": false
      }
    ]
  ]
}
```

## Configuration

All options are optional.

### _tempDirectory_

**Default**: `os.tmpdir()`, e.g. `/tmp`

Override the OS default directory. The AUR repository is cloned at
`{tempDirectory}/{packageName}`.

### _packageName_

**Default**: `path.basename(process.cwd())`

The name of the AUR package.

### _pushPrerelease_

**Default**: `false`

Whether or not to push when releasing from a prerelease branch.

---

[LICENSE](./LICENSE)
