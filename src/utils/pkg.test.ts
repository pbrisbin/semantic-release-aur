import fs from "fs";

import { updatePKGBUILDVersion } from "./pkg";

describe("updatePKGBUILDVersion", () => {
  it("updates pkgver and resets pkgrel", () => {
    fs.writeFileSync(
      "PKGBUILD",
      [
        "# shellcheck disable=SC2034",
        "# shellcheck disable=SC2154",
        "# Author: Patrick Brisbin <pbrisbin@gmail.com>",
        "pkgname=downgrade",
        "pkgver=11.4.4",
        "pkgrel=2",
        'pkgdesc="Bash script for downgrading one or more packages to a version in your cache or the A.L.A."',
        "arch=('any')",
        'url="https://github.com/archlinux-downgrade/$pkgname"',
        "license=('GPL')",
        "backup=(etc/xdg/downgrade/downgrade.conf)",
        'source=("downgrade-v$pkgver.tar.gz::https://github.com/archlinux-downgrade/$pkgname/archive/v$pkgver.tar.gz")',
        "depends=('pacman-contrib' 'fzf') # pacsort",
        "optdepends=('sudo: for installation via sudo')",
        "",
        "package() {",
        '  cd "$pkgname-$pkgver" || exit 1',
        "",
        '  make DESTDIR="$pkgdir" PREFIX=/usr install',
        "}",
        "md5sums=('0107411748ab87763a712b8d3989c5fe')",
      ].join("\n"),
    );

    try {
      updatePKGBUILDVersion("1.2.0");

      const updated = fs.readFileSync("PKGBUILD", "utf-8");

      expect(updated.split("\n").find((l) => l.startsWith("pkgver"))).toBe(
        "pkgver=1.2.0",
      );

      expect(updated.split("\n").find((l) => l.startsWith("pkgrel"))).toBe(
        "pkgrel=1",
      );
    } finally {
      fs.unlinkSync("PKGBUILD");
    }
  });
});
