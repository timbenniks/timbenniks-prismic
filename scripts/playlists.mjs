import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function fetchAllVideos(playlist_id, pageToken = null) {
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.append("part", "snippet");
  url.searchParams.append("playlistId", playlist_id);
  url.searchParams.append("maxResults", "50");
  url.searchParams.append("key", process.env.YOUTUBE_KEY);

  if (pageToken) {
    url.searchParams.append("pageToken", pageToken);
  }

  const response = await fetch(url);
  const result = await response.json();
  const videos = result.items;
  const nextPageToken = result.nextPageToken;

  if (nextPageToken) {
    const nextPageVideos = await fetchAllVideos(playlist_id, nextPageToken);
    videos.push(...nextPageVideos);
  }

  return videos;
}

function transformArrayToObject(array) {
  return array.reduce((acc, item) => {
    if (item.uid) {
      acc[item.uid] = item;
    }
    return acc;
  }, {});
}

async function getPlaylist(playlist_id, folder) {
  const videos = await fetchAllVideos(playlist_id);
  const mappedVideos = videos.map((video) => {
    return {
      date: video.snippet.publishedAt,
      title: video.snippet.title,
      description: video.snippet.description,
      image: video.snippet.thumbnails?.maxres?.url,
      videoid: video.snippet.resourceId.videoId,
      tags: [folder],
      uid: `video_entry_uid_${video.snippet.resourceId.videoId}`,
      locale: "en-us",
      created_at: video.snippet.publishedAt,
      updated_at: video.snippet.publishedAt,
      created_by: "cs6c7ee2bd00ff9f69",
      updated_by: "cs6c7ee2bd00ff9f69",
      content_type_uid: "video",
      publish_details: [
        {
          environment: "development",
          locale: "en-us",
          time: video.snippet.publishedAt,
        },
      ],
      ACL: {},
      _version: 1,
      _in_progress: false,
    };
  });

  fs.writeFile(
    `./assets/import-videos/entries/video/en-us.json`,
    JSON.stringify(transformArrayToObject(mappedVideos), null, 2),
    (err) => {
      console.log(`Videos for ${folder} added.`);

      if (err) {
        console.error(err);
      }
    }
  );

  return mappedVideos;
}

async function executePlaylistFetches() {
  try {
    // await getPlaylist("PLordIU6tK3nVRzSDaRITfSwBwy7N4JzBf", "headless-creator");
    // await getPlaylist("UULFbQu3ix36SHZjcD57BK7KUQ", "tim");
    // await getPlaylist("UULFtNZi1LgSHY1dzSUazplEPg", "mp");
    // await getPlaylist("PLcoeeDyxakhXjJQe4r2b9JRXKUmbW4XOU", "uniform");
    // await getPlaylist("PLcoeeDyxakhWEB0yoQXy6OYbl9LbAo4J2", "hygraph");
    // await getPlaylist("PLcoeeDyxakhWMU9JIKXAQIfwoPwM-TZ93", "live-uniform");
    // await getPlaylist("PLcoeeDyxakhVM-xWfqWZ6TFpqC1Aw5__N", "misc-streams");
    await getPlaylist("PLcoeeDyxakhWoTjzmqTJXvBcov71Am8QG", "live-hygraph");
    // await getPlaylist(
    //   "PLcoeeDyxakhUdkUvZm8qld1YuInOKOLqT",
    //   "alive-and-kicking"
    // );
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }
}

executePlaylistFetches();
