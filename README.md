# Zero Robotics Git browser extension

> A WebExtensions application for using Git with Zero Robotics

By Avery Newman and Alex Ralston

This project is currently partially finished, and functionality is limited. Its intended purpose is to allow users to select a Git server, then pull code, make and push new commits, perform merges, and view diffs from within the [Zero Robotics](http://zerorobotics.mit.edu) IDE. Currently, it supports cloning repositories, fetching to the editor, and committing/pushing changes, but no merges or diffs, and has only been tested with Chrome.

The UI and state storage are built using ReactJS, Redux, and [redux-webext](https://github.com/ivantsov/redux-webext). Interaction with Git servers is done through isomorphic-git, which uses the filesystem provided by lightning-fs to create a local clone of the desired repository. The project is based on [this boilerplate](https://github.com/shopback/react-webextension/boilerplate), though we had to do a lot of package updates and changes to Webpack config files, since the boilerplate is now severely outdated.

## Contributors/History
The project was started by Jonah Weissman in 2018 as an attempt to completely rebuild his zr-github-crx extension, which had most of the same functionality but could not switch repositories and thus had to be rebuilt and redistributed repeatedly. The old extension has been deprecated due to compatibility issues, and Jonah's copy was taken offline, but a fork can be found [here](https://github.com/averynewman/zr-github-crx). He abandoned this attempt after a few commits, leaving beind a slightly modified version of the boilerplate with no functionality.

Avery Newman (formerly Jonah Newman) then picked up and started building on the project, and has since then been its principal author, though Jonah has provided help and advice at several points during development. The [injected-scripts folder](https://github.com/averynewman/zr-git-webext/tree/master/src/background/injected-scripts) contains modified versions of code taken from his original zr-github-crx project.

Ben Lepsch briefly provided assistance from March to June of 2019.

Alex Ralston joined the project in September 2019. After taking some time to familiarize himself with the codebase and dependencies, he began contributing in October.

[MIT](LICENSE) © Avery Newman
