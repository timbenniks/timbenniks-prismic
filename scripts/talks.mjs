import dotenv from "dotenv";

dotenv.config();

async function getTalks() {
  const response = await fetch(process.env.HYGRAPH_ENDPOINT, {
    method: "post",
    body: JSON.stringify({
      query: `
          query Talks($first: Int!) {
            talks(first: $first, orderBy: date_DESC) {
              conference
              talk
              location
              date
              id
              link
            }
          }
          `,
      variables: {
        first: 150,
      },
    }),
  });

  const { data } = await response.json();

  const mappedTalks = data.talks.map((talk) => {
    return {
      title: `${talk.talk} at ${talk.conference}`,
      uid: `talk-${talk.id}`,
      type: "talk",
      lang: "en-gb",
      data: {
        date: talk.date,
        talk: talk.talk,
        conference: talk.conference,
        location: talk.location,
        link: {
          link_type: "Web",
          url: talk.link,
        },
      },
    };
  });

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

  for (const talk of mappedTalks) {
    options.body = JSON.stringify(talk);
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
    // Wait for 1 second before sending the next request
    await delay(1000);
  }
}

getTalks();
