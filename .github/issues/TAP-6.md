---
code: TAP-6
id: I_kwDOEBQ2ns5tkfWm
databaseId: 1838282150
number: 6
url: https://github.com/octolab/homebrew-tap/issues/6
title: "ci/cd: check installation process"
issueType: null
labels:
  - "type: feature"
  - "scope: inventory"
  - "impact: high"
  - "effort: hard"
assignees:
  - kamilsk
milestone: null
parent: null
issueFields: {}
state: CLOSED
stateReason: COMPLETED
duplicateOf: null
createdAt: 2023-08-06T17:18:35Z
updatedAt: 2023-10-18T13:30:09Z
lastEditedAt: null
closedAt: 2023-10-18T13:30:08Z
---

# ci/cd: check installation process

**Motivation:** healthcheck.

**Research**

- https://github.com/Homebrew/install
- https://github.com/Homebrew/actions
- https://github.com/nektos/act

**Algorithm**

- if formula has been changed
- run ci workflow
- setup homebrew
- install changed tool
- check it
