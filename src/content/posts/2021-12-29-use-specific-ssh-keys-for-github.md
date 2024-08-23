---
date: 2021-12-29
title: Multiple GitHub Profiles - Using Specific SSH Keys
image: github-logo.png
categories: github
tags: github
---

If you're like me, you have a personal GitHub account and a work 
one.  Or, maybe you have multiple for some reason.  If you do, 
then you've surely run into the problem of needing to clone
a repository on a device that has the credentials saved for a 
particular profile.  Maybe you're traveling for work and need
to do some changes on a personal repository, and only have your
work laptop with you.  Here is a simple solution to quickly
use a particular SSH key to clone a repository, and it will be
saved for future pushes and pulls.

## Create an SSH Key

First, you will need to generate an SSH key to use for your profile.
Within your [SSH Settings](https://github.com/settings/keys) page
in GitHub, create a new SSH key for the device you are using.
To generate the key, use the following command (which can also
be found on the [GitHub docs page.](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent))

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Input the public key in your GitHub settings, give it a name, and
save it.

## Clone Your Repository With Your New Key

Now that you've given GitHub your new key, let's put it to use.
The following code is thanks to [Wiston Coronell](https://stackoverflow.com/users/971565/wiston-coronell)
on [this StackOverflow answer.](https://stackoverflow.com/a/59074070)

```bash
git clone git@provider.com:userName/projectName.git --config core.sshCommand="ssh -i ~/location/to/private_ssh_key"
```

Once your repository is cloned, any push or pull will use that saved
configuration utilizing your SSH key.  Just be sure to remember
to change your name or email if you have your other profile saved
to the global config.

```bash
git config user.name "Your Name"
git config user.email "youremail@example.com"
```
