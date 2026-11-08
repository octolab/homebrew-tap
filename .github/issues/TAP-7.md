---
code: TAP-7
id: I_kwDOEBQ2ns8AAAABeXC3WQ
databaseId: 6332397401
number: 10
url: https://github.com/octolab/homebrew-tap/issues/10
title: "ci/cd: tag formula updates by tool release"
issueType: Task
labels:
  - "scope: inventory"
  - "type: improvement"
assignees:
  - kamilsk
milestone: null
parent: null
issueFields: {}
state: OPEN
stateReason: null
duplicateOf: null
createdAt: 2026-11-11T16:10:04Z
updatedAt: 2026-11-11T16:12:05Z
lastEditedAt: 2026-11-11T16:12:05Z
closedAt: null
---

# ci/cd: tag formula updates by tool release

## Motivation

octolab/skills marks every publication with a tag `<tool>--v<version>`
(`indexit--v0.4.1`, `maintainer--v0.4.1`): it is easy to see which tool
release a catalog commit holds, to link to it, and to roll back to it.

The tap has no tags at all. goreleaser writes a commit "Brew formula update
for <tool> version <tag>" (75 in the history, from 2020 to v0.4.1 of indexit
and maintainer), and the only way to find the commit of a release is to grep
the log. The same scheme is about to appear in octolab/vanity, see
octomation/vanity#500, so the three catalogs should agree on it.

## PoC

```bash
gh api repos/octolab/skills/tags --jq '.[].name'        # indexit--v0.4.1 …
gh api repos/octolab/homebrew-tap/tags --jq '.[].name'  # nothing
git -C homebrew-tap log --format='%h %s' | grep 'Brew formula update' | head -3
```

## Scope

- Every new formula update by a tool release gets the tag
  `<tool>--<version>` on its tap commit, with the version as goreleaser
  writes it (`indexit--v0.4.1`), the same form as in octolab/skills.
- The tag is created by automation, not by hand, and a rerun of a release
  does not fail on a tag that already exists for the same commit.
- Past formula updates whose commit message names the tool and the version
  are tagged once.

## Acceptance criteria

- [ ] After the next release of indexit or maintainer the tap has the tag
      `<tool>--v<version>` on the formula update commit.
- [ ] Rerunning the release job leaves the tag as it is and passes.
- [ ] `git tag -l '*--v*'` in the tap lists the past releases found in the
      history; ambiguous commits, if any, are named in the PR.
- [ ] The README of the tap mentions the tag scheme.

## Out of scope

- Releases of the tap itself.
- Formulae written by hand without a tool release (the commits that are not
  "Brew formula update for …").
