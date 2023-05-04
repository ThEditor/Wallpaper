/*
 * Credits go to @kitsunebishi for providing wallpapers
 */

import { Octokit } from "octokit";
import { config } from "dotenv";
import { createWriteStream, unlinkSync } from "fs";
import { join } from "path";
import axios from "axios";
import { getWallpaper, setWallpaper } from "wallpaper";
config();

const octokit = new Octokit();

const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(createWriteStream(filepath))
      .on("error", reject)
      .once("close", () => resolve(filepath));
  });
};

const run = async () => {
  const repoContent = await octokit.rest.repos.getContent({
    owner: process.env.WALLPAPER_REPO_OWNER,
    repo: process.env.WALLPAPER_REPO,
    path: "images",
  });

  const wallpaper =
    repoContent.data[Math.floor(Math.random() * repoContent.data.length)];

  const downloadPath = join(process.env.DOWNLOAD_PATH, wallpaper.name);
  await downloadImage(wallpaper.download_url, downloadPath);

  const oldWallpaper = await getWallpaper();
  unlinkSync(oldWallpaper);
  await setWallpaper(downloadPath);
};

run();
