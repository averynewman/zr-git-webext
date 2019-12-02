# Zero Robotics Git browser extension

> A WebExtensions (Chrome and Firefox compatible) extension for using Git with Zero Robotics

This project is currently unfinished, and should not be used right now. When finished, it will allows users to select a Git server, then pull code, make and push new commits, perform merges, and view diffs from within the [Zero Robotics](http://zerorobotics.mit.edu) IDE. Currently, it supports cloning repositories and fetching to the editor, but no write operations or diffs.

The UI and state storage are built using ReactJS, Redux, and redux-webext. Interaction with Git servers is done through isomorphic-git, which uses the filesystem provided by lighting-fs to create a local clone of the desired repository.

[MIT](LICENSE) © Jonah Newman
