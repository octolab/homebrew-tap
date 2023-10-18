#!/usr/bin/env bash

set -euo pipefail

@error() { echo "${@}" >&2; }
@fatal() { @error "${@}" && exit 1; }

brew install octolab/tap/sparkle

expected="$(
  gh repo view withsparkle/service \
    --json latestRelease --jq .latestRelease.tagName
)"
obtained="v$(sparkle version | sed -n 2p | awk -F: '{print $2}' | tr -d ' ')"

[ "${obtained}" == "${expected}" ] || @fatal "expected ${expected}, obtained ${obtained}"
