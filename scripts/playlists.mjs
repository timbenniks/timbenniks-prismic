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

async function getPlaylist(playlist_id, folder) {
  const videos = await fetchAllVideos(playlist_id);
  const mappedVideos = videos.map((video) => {
    return {
      title: video.snippet.title,
      uid: `video-${video.snippet.resourceId.videoId.toLowerCase()}`,
      type: "video",
      lang: "en-gb",
      tags: [folder],
      data: {
        title: video.snippet.title,
        date: video.snippet.publishedAt.split("T")[0],
        description: video.snippet.description,
        image: video.snippet.thumbnails?.maxres?.url,
        videoid: video.snippet.resourceId.videoId,
      },
    };
  });

  console.log(`loaded ${mappedVideos.length} videos for ${folder}`);

  const token = process.env.PRISMIC_TOKEN;
  const url = "https://migration.prismic.io/documents";
  const options = {
    method: "POST",
    headers: {
      repository: "timbenniks-prismic",
      "x-api-key": process.env.PRISMIC_API_KEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // Function to delay execution
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const video of mappedVideos) {
    options.body = JSON.stringify(video);
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
    // Wait for 1.5 seconds before sending the next request
    await delay(1500);
  }

  console.log(`Done importing for ${folder}`);
}

async function executePlaylistFetches() {
  try {
    // - await getPlaylist("UULFbQu3ix36SHZjcD57BK7KUQ", "tim");
    // - await getPlaylist("PLordIU6tK3nVRzSDaRITfSwBwy7N4JzBf", "headless-creator");
    // - await getPlaylist("UULFtNZi1LgSHY1dzSUazplEPg", "mp");
    // - await getPlaylist("PLcoeeDyxakhXjJQe4r2b9JRXKUmbW4XOU", "uniform");
    // - await getPlaylist("PLcoeeDyxakhWEB0yoQXy6OYbl9LbAo4J2", "hygraph");
    // - await getPlaylist("PLcoeeDyxakhWMU9JIKXAQIfwoPwM-TZ93", "live-uniform");
    // - await getPlaylist("PLcoeeDyxakhVM-xWfqWZ6TFpqC1Aw5__N", "misc-streams");
    // - await getPlaylist("PLcoeeDyxakhWoTjzmqTJXvBcov71Am8QG", "live-hygraph");
    // - await getPlaylist(
    //   "PLcoeeDyxakhUdkUvZm8qld1YuInOKOLqT",
    //   "alive-and-kicking"
    // );
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }
}

executePlaylistFetches();
