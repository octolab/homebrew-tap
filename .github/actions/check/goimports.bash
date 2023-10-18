#!/usr/bin/env bash

set -euo pipefail

@error() { echo "${@}" >&2; }
@fatal() { @error "${@}" && exit 1; }

brew install octolab/tap/goimports

expected="$(
  gh repo view kamilsk/go-tools \
    --json latestRelease --jq .latestRelease.tagName
)"
obtained="v$({ goimports -version 2>/dev/null || true; } | awk -F, '{print $1}')"

[ "${obtained}" == "${expected}" ] || @fatal "expected ${expected}, obtained ${obtained}"
