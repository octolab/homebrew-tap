---
id: 6
database_id: 1838282150
node_id: I_kwDOEBQ2ns5tkfWm
status: closed
title: "ci/cd: check installation process"
labels: ["type: feature","scope: inventory","impact: high","effort: hard"]
url: https://github.com/octolab/homebrew-tap/issues/6
created_at: 2023-08-06T17:18:35Z
updated_at: 2023-10-18T13:30:09Z
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
