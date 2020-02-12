# Zero Robotics Git browser extension

> A WebExtensions (Chrome and Firefox compatible) extension for using Git with Zero Robotics

By Jonah Newman and Alex Ralston

This project is currently unfinished, and should not be used right now. When finished, it will allows users to select a Git server, then pull code, make and push new commits, perform merges, and view diffs from within the [Zero Robotics](http://zerorobotics.mit.edu) IDE. Currently, it supports cloning repositories, fetching to the editor, and committing/pushing changes, but no merges or diffs.

The UI and state storage are built using ReactJS, Redux, and redux-webext. Interaction with Git servers is done through isomorphic-git, which uses the filesystem provided by lightning-fs to create a local clone of the desired repository. The project is based on [this boilerplate](https://github.com/shopback/react-webextension/boilerplate), though we had to do a lot of package updates and changes to Webpack config files, since the boilerplate is now severely outdated.


##Contributors/History
The project was started by Jonah Weissman in 2018 as an attempt to completely rebuild his zr-github-crx extension, which had most of the same functionality but could not switch repositories and thus had to be rebuilt and redistributed repeatedly. The old extension has been deprecated due to compatibility issues, and Jonah Weissman's copy was taken offline, but a fork can be found [here](https://github.com/jonahnewman/zr-github-crx). Weissman abandoned this attempt after a few commits, leaving beind only a slightly modified version of the boilerplate with no functionality.

Jonah Newman then picked up and started building on the project, and has since then been its principal author, though Jonah Weissman has provided help and advice at several points during development. The [injected-scripts folder](https://github.com/jonahnewman/zr-git-webext/tree/master/src/background/injected-scripts) contains modified versions of code taken from his original zr-github-crx project.

Ben Lepsch briefly provided assistance from March to June of 2019. Due to some nonoptimal workflow decisions related to sharing a laptop, a number of the commits authored by him were actually written by Jonah Newman.

Alex Ralston joined the project in September 2019. As he first had to familiarize himself with the codebase and dependencies, he fully began contributing in October.

[MIT](LICENSE) © Jonah Newman
