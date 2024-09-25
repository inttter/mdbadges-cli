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
[![CI](https://img.shields.io/github/actions/workflow/status/inttter/mdbadges-cli/test.yml?branch=main&colorA=18181B&colorB=07B0D1&logo=github&logoColor=959DA5&label=CI)][CI Workflow]

# Getting Started

To start using a command, add the `mdb` prefix, followed by the [command name/syntax](#commands).

For example:

```bash
mdb social discord

# Badge found:
# [![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](#)
```

If you want to use a option, such as `--style`, you can run the same command with the option placed after it. 

For example:

```bash
mdb social discord --style plastic

# Badge found:
# [![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white&style=plastic)](#)
```

> [!TIP]
> If you are using Visual Studio Code, install the [Image Preview][] extension. You can hover over the badge link to see a preview of it. See an example [here](https://github.com/inttter/mdbadges-cli/assets/73017070/f39fc296-25c8-4a2a-846a-cf83eff00cc4).

For help information, such as what commands do or what arguments they accept, run `mdb help`. Alternatively, you can read the [documentation][].

# Commands

|   Command                                 |    Description    |     Aliases      | Additional Information |
|-------------------------------------------|-------------------|------------------|------------------------|
`mdb [category] [badgeName]`                | Displays badge from a specific category. | N/A | View all available options on the [documentation][].
`mdb search`                                | Search for badges across any [category](#categories). | `s`, `find`, `lookup` | Select a badge to get the Markdown code for it.
`mdb create`                                | Displays prompts to create your own badge. | `generate` | Both Markdown and HTML versions of your badge are given. For logo colors, only hexadecimal colors are supported.
`mdb random`                                | Displays a random badge. | `r` | Displays the badge in both Markdown and HTML formats.
`mdb copy [category] [badgeName]          ` | Copies a badges' code to the clipboard. | `c` | Supports copying Markdown version, and HTML version via `--html`.
`mdb badges`                                | Opens a link to the badge list in your browser. | `list` |  Opens in your default browser.
`mdb add [category] [badgeName] [fileName]` | Allows you to add a badge to a Markdown file. | None | Supports both Markdown versions of badges, and HTML versions using `--html`. Also works in subdirectories.
`mdb documentation` | Opens a link to the documentation in your browser. | None | Opens in your default browser.
`mdb changelog` | Opens a link to the latest release with it's changelogs in your browser. | `release` |Opens in your default browser.

# Categories

This contains the categories that are currently available, with the names and syntax. The syntax is needed for the `[category]` field of certain commands.

| Name                    | Syntax           |
|-------------------------|------------------|
| App Store               | app-store        |
| Artificial Intelligence | ai               |
| Blog                    | blog             |
| Browser                 | browser          |
| CI                      | ci               |
| Cloud                   | cloud            |
| Code Coverage           | code-coverage    |
| Code Editor             | code-editor      |
| Collaboration           | collaboration    |
| Cryptocurrency          | crypto           |
| Database                | database         |
| Design                  | design           |
| Delivery                | delivery         |
| Documentation           | documentation    |
| Education               | education        |
| Funding                 | funding          |
| Framework               | framework        |
| Game Engine             | game-engine      |
| Gaming Storefront       | game-store       |
| Jobs                    | jobs             |
| Operating System        | os               |
| Package Manager         | package-manager  |
| Payment                 | payment          |
| Programming Language    | programming      |
| Review                  | review           |
| Search Engine           | search-engine    |
| Social Media            | social           |
| Sound                   | sound            |
| Static Site             | static-site      |
| Storage                 | storage          |
| Streaming               | streaming        |
| Terminal                | terminal         |
| Version Control         | version-control  |
| Virtual Reality         | vr               |

# Contributing

If you would like to contribute, please ensure to read the [contributing guidelines][] before you submit a pull request. 

# License 

**©** 2024 · Licensed under the [MIT License][].

<!-- Link Definitions -->

[CI Workflow]: https://github.com/inttter/mdbadges-cli/actions/workflows/publish.yml
[contributing guidelines]: https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md
[documentation]: https://docs.mdbcli.xyz/
[Image Preview]: https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview
[MIT License]: https://github.com/inttter/mdbadges-cli/blob/main/LICENSE/
[npm]: https://www.npmjs.com/package/mdbadges-cli/
[Release Workflow]: https://github.com/inttter/mdbadges-cli/actions/workflows/publish.yml
[Releases]: https://github.com/inttter/mdbadges-cli/releases/latest