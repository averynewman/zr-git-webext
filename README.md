# Zero Robotics Git browser extension

> A WebExtensions (Chrome and Firefox compatible) extension for using Git with Zero Robotics

By Jonah Newman and Alex Ralston

This project is currently unfinished, and should not be used right now. When finished, it will allows users to select a Git server, then pull code, make and push new commits, perform merges, and view diffs from within the [Zero Robotics](http://zerorobotics.mit.edu) IDE. Currently, it supports cloning repositories and fetching to the editor, but no write operations or diffs.

The UI and state storage are built using ReactJS, Redux, and redux-webext. Interaction with Git servers is done through isomorphic-git, which uses the filesystem provided by lightning-fs to create a local clone of the desired repository.

The project was started by Jonah Newman in 2018 as an attempt to completely rebuild Jonah Weissman's zr-github-crx extension, which was intended to have most of the same functionality but could not switch repositories and thus had to be rebuilt and redistributed repeatedly. The old extension has been deprecated due to compatibility issues, and Jonah Weissman's copy was taken offline, but a fork can be found [here](https://github.com/jonahnewman/zr-github-crx).

In September 2019, Alex Ralston joined the project as a collaborator.

Jonah Weissman has not worked directly on this project, but he first suggested using isomorphic-git for a Zero Robotics Git extension, and provided help and advice in the project's early stages. The [content-scripts folder](https://github.com/jonahnewman/zr-git-webext/tree/master/src/background/content-scripts) contains modified versions of code taken from his original zr-github-crx project.

[MIT](LICENSE) © Jonah Newman
