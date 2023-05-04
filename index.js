/*
 * Credits go to @kitsunebishi for providing wallpapers
 */

import { Octokit } from "octokit";
import { config } from "dotenv";
config();

const octokit = new Octokit();

const run = async () => {
  const repoContent = await octokit.rest.repos.getContent({
    owner: process.env.WALLPAPER_REPO_OWNER,
    repo: process.env.WALLPAPER_REPO,
    path: "images",
  });
  const wallpaper =
    repoContent.data[Math.floor(Math.random() * repoContent.data.length)];
  console.log(wallpaper);
};

run();
