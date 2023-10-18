#!/usr/bin/env bash

set -euo pipefail

@error() { echo "${@}" >&2; }
@fatal() { @error "${@}" && exit 1; }

exit 0

brew install octolab/tap/maintainer

expected="$(
  gh repo view octomation/maintainer \
    --json latestRelease --jq .latestRelease.tagName
)"
obtained="v$(maintainer version | sed -n 2p | awk -F: '{print $2}' | tr -d ' ')"

[ "${obtained}" == "${expected}" ] || @fatal "expected ${expected}, obtained ${obtained}"
