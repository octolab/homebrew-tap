#!/usr/bin/env bash

set -euo pipefail

@error() { echo "${@}" >&2; }
@fatal() { @error "${@}" && exit 1; }

exit 0

brew install octolab/tap/golangci-lint

expected="$(
  gh repo view kamilsk/golangci-lint \
    --json latestRelease --jq .latestRelease.tagName
)"
obtained="v$(golangci-lint version | awk -F' ' '{print $4}')"

[ "${obtained}" == "${expected}" ] || @fatal "expected ${expected}, obtained ${obtained}"
