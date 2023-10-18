#!/usr/bin/env bash

set -euo pipefail

@error() { echo "${@}" >&2; }
@fatal() { @error "${@}" && exit 1; }

exit 0

brew install octolab/tap/godownloader

expected="$(
  gh repo view kamilsk/godownloader \
    --json latestRelease --jq .latestRelease.tagName
)"
obtained="v$(godownloader --version 2>&1 | awk -F, '{print $1}')"

[ "${obtained}" == "${expected}" ] || @fatal "expected ${expected}, obtained ${obtained}"
