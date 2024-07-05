<div align="center">
  <img src="https://github.com/inttter/mdbadges-cli/assets/73017070/ef4b96c7-d412-40e1-bf0f-ea86e70b97ef" width="125">

# mdbadges-cli

[![Release](https://img.shields.io/npm/v/mdbadges-cli.svg?style=flat&colorA=18181B&colorB=07B0D1&logo=npm&logoColor=eb6f92)][Releases]
[![NPM Downloads](https://img.shields.io/npm/dw/mdbadges-cli.svg?style=flat&colorA=18181B&colorB=07B0D1&logo=npm&logoColor=eb6f92)][npm]
[![License](https://custom-icon-badges.herokuapp.com/github/license/inttter/mdbadges-cli?logo=law&color=07B0D1&logoColor=eb6f92&labelColor=191724)][MIT License]

</div>

**mdbadges-cli** is an extensive CLI tool to find over 400+ Shields.io badges for your projects without needing to leaving the terminal, with multiple commands for different purposes.

# Installation

```bash
npm install -g mdbadges-cli
```

[![Release Workflow](https://img.shields.io/github/actions/workflow/status/inttter/mdbadges-cli/test.yml?branch=main&colorA=18181B&colorB=07B0D1&logo=github&logoColor=959DA5&label=Release)][Release Workflow]
[![Tests](https://img.shields.io/github/actions/workflow/status/inttter/mdbadges-cli/test.yml?branch=main&colorA=18181B&colorB=07B0D1&logo=github&logoColor=959DA5&label=Tests)][Tests Workflow]

# Getting Started

To start using a command, add the `mdb` prefix, followed by the [command name/syntax](#commands).

For example:

```bash
mdb social discord

# Badge found:
# [![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](#)
```

If you want to use a prefix, such as `--style`, you can run the same command with the prefix after it. 

For example:

```bash
mdb social discord --style plastic

# Badge found:
# [![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white&style=plastic)](#)
```

> [!TIP]
> If you are running mdbadges-cli in Visual Studio Code, try installing the Image Preview [extension][]. You can hover over the badge link to see a preview of it. See an example [here](https://github.com/inttter/mdbadges-cli/assets/73017070/f39fc296-25c8-4a2a-846a-cf83eff00cc4).

For help information, such as what commands do and/or accept, run `mdb help` in the terminal. Alternatively, you can read the [documentation][].

# Commands

|   Command      |    Description    |     Aliases      | Additional Information |
|----------|-----------|---------------------------|--------|
`mdb [category] [badgeName]` | Displays badge from a specific category. | N/A | View all available options on the [documentation][].
`mdb search` | Search for badges across any [category](#categories). | `s`, `find` | Get the badge code directly by selecting a badge that gets found.
`mdb create` | Displays prompts to create your own badge. | `generate` | Both Markdown and HTML versions of your badge are given. For logo colors, only hexadecimal colors (eg. 000, #d8e, #FAF126) are supported.
`mdb random` | Displays a random badge. | `r` | Supports both Markdown and HTML formats.
`mdb copy [category] [badgeName]` | Copies a badges' code to the clipboard. | `c` | Only supports copying Markdown version.
`mdb badges` | Opens a link to the badge list in your browser. | `list` | N/A
`mdb add [category] [badgeName] [fileName]` | Allows you to add a badge to a Markdown file. | N/A | Only supports Markdown versions of badges. Works in subdirectories, as long as the file path is correct.

# Miscellaneous Commands

|   Command      |    Description    |     Aliases      | Additional Information |
|----------|-----------|---------------------------|--------|
`mdb about` | Displays general information about the package. | `abt` | Also shows links to various important places and information like the current amount of badges.
`mdb documentation` | Opens a link to the documentation in your browser. | `docs` | N/A
`mdb changelog` | Opens a link to the latest release with it's changelogs in your browser. | `release` | N/A

# Categories

This contains the categories that are currently available, with the names and syntax. The syntax is needed for the `[category]` field of certain commands.

| Name | Syntax |
|------|--------|
App Store | app-store
Artificial Intelligence | ai
Blog | blog
Browser | browser
Code Coverage | code-coverage
Code Editor | code-editor
Cloud | cloud
Collaboration | collaboration
Crypto | crypto
Database | database
Design | design
Delivery | delivery
Documentation | documentation
Education | education
Funding | funding
Framework | framework
Game Engine | game-engine
Gaming Storefront | game-stores
Jobs | jobs
Office | office
Operating System | os
Package Manager | package-manager
Payment | payment
Programming Language | programming
Restaurant | restaurant
Review | review
Search Engine | search-engine
Social Media | social
Sound | sound
Static Site | static-site
Storage | storage
Video Streaming | video-streaming
Virtual Reality | vr

# Contributing

If you would like to contribute, please ensure to read the [contributing guidelines][] before you submit a pull request. 

# License 

**©** 2024 · Licensed under the [MIT License][]

<!-- Link Definitions -->
[Contributing Guidelines]: https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md
[Documentation]: https://docs.mdbcli.xyz/
[Extension]: https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview
[MIT License]: https://github.com/inttter/mdbadges-cli/blob/main/LICENSE/
[npm]: https://www.npmjs.com/package/mdbadges-cli/
[Release Workflow]: https://github.com/inttter/mdbadges-cli/actions/workflows/publish.yml
[Releases]: https://github.com/inttter/mdbadges-cli/releases/latest
[Tests Workflow]: https://github.com/inttter/mdbadges-cli/actions/workflows/test.yml