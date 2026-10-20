---
code: TAP-2
id: I_kwDOEBQ2ns4_R5PS
databaseId: 1061655506
number: 2
url: https://github.com/octolab/homebrew-tap/issues/2
title: "broken formulas"
issueType: null
labels: []
assignees:
  - kamilsk
milestone: null
parent: null
issueFields: {}
state: CLOSED
stateReason: COMPLETED
duplicateOf: null
createdAt: 2021-11-23T19:54:15Z
updatedAt: 2022-05-28T20:28:20Z
lastEditedAt: null
closedAt: 2022-05-28T20:28:20Z
---

# broken formulas

```
Error: Invalid formula: /opt/homebrew/Library/Taps/octolab/homebrew-tap/Formula/maintainer.rb
formulae require at least a URL
Error: Cannot tap octolab/tap: invalid syntax in tap!
Tapping octolab/tap has failed!
```

<!-- 2022-05-28T20:28Z https://github.com/octolab/homebrew-tap/issues/2#issuecomment-1140325326
fixed by supporting arm: https://github.com/octomation/maintainer/blob/af46d826f7c070347b26fa46efee6dbdee4f8be3/.goreleaser.yml#L51-L53
-->
