import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

function transformArrayToObject(array) {
  return array.reduce((acc, item) => {
    if (item.uid) {
      acc[item.uid] = item;
    }
    return acc;
  }, {});
}

async function getTalks() {
  const response = await fetch("http://localhost:3000/api/all-articles");

  const articles = await response.json();

  const mappedArticles = articles.map((article) => {
    return {
      date: article.date,
      title: article.title,
      canonical_url: article.canonical_url,
      description: article.description,
      url: article.url,
      image: article.image,
      reading_time: article.reading_time,
      uid: `article_entry_uid_${article.url}`,
      locale: article.locale,
      tags: article.tags,
      created_at: article.date,
      updated_at: article.date,
      created_by: "cs6c7ee2bd00ff9f69",
      updated_by: "cs6c7ee2bd00ff9f69",
      content_type_uid: "article",
      publish_details: [
        {
          environment: "development",
          locale: "en-us",
          time: article.date,
        },
      ],
      ACL: {},
      _version: 1,
      _in_progress: false,
    };
  });

  fs.writeFile(
    `./assets/import-articles/entries/article/en-us.json`,
    JSON.stringify(transformArrayToObject(mappedArticles), null, 2),
    (err) => {
      console.log(`Articles added.`);
      console.log(mappedArticles.length);

      if (err) {
        console.error(err);
      }
    }
  );

  return mappedArticles;
}

getTalks();
