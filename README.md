# Zero Robotics Git browser extension

> A WebExtensions (Chrome and Firefox compatible) extension for using Git with Zero Robotics

By Jonah Newman and Alex Ralston

This project is currently unfinished, and should not be used right now. When finished, it will allows users to select a Git server, then pull code, make and push new commits, perform merges, and view diffs from within the [Zero Robotics](http://zerorobotics.mit.edu) IDE. Currently, it supports cloning repositories and fetching to the editor, but no write operations or diffs.

The UI and state storage are built using ReactJS, Redux, and redux-webext. Interaction with Git servers is done through isomorphic-git, which uses the filesystem provided by lightning-fs to create a local clone of the desired repository. The project is based on [this boilerplate](https://github.com/shopback/react-webextension/boilerplate), though we had to do a lot of package updates and changes to Webpack config files, since the boilerplate is now severely outdated.

The project was started by Jonah Weissman in 2018 as an attempt to completely rebuild his zr-github-crx extension, which had most of the same functionality but could not switch repositories and thus had to be rebuilt and redistributed repeatedly. The old extension has been deprecated due to compatibility issues, and Jonah Weissman's copy was taken offline, but a fork can be found [here](https://github.com/jonahnewman/zr-github-crx). Weissman abandoned this attempt after a few commits, leaving beind only a slightly modified version of the boilerplate with no functionality, which Jonah Newman then picked up and started building on. Jonah Weissman has also provided help and advice at several points during development. The [content-scripts folder](https://github.com/jonahnewman/zr-git-webext/tree/master/src/background/content-scripts) contains modified versions of code taken from his original zr-github-crx project.

In September 2019, Alex Ralston joined the project, and has collaborated with Jonah on functionality developed since around October, as he first had to familiarize himself with the codebase and dependencies.

[MIT](LICENSE) © Jonah Newman
