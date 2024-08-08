async function getTalks() {
  const response = await fetch(
    "https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/clifk2kla052e01ui88kyhe0c/master",
    {
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
    }
  );

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
        link: talk.link,
      },
    };
  });

  console.log("talk", mappedTalks[0]);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoibWFjaGluZTJtYWNoaW5lIiwiZGJpZCI6InRpbWJlbm5pa3MtcHJpc21pYy0zZjFmNGQ3MC03ZmEyLTQzNTctYmI5MS02YTBiMDVjNDViYjVfNSIsImRhdGUiOjE3MjMwMjg0OTUsImRvbWFpbiI6InRpbWJlbm5pa3MtcHJpc21pYyIsImFwcE5hbWUiOiJJbXBvcnQiLCJpYXQiOjE3MjMwMjg0OTV9.sLJtnpGEHVbhPGYGsJd5OlTpkkeKGoHRjIKqs4djhp8";

  const url = "https://migration.prismic.io/documents";
  const options = {
    method: "POST",
    headers: {
      repository: "timbenniks-prismic",
      "x-api-key": "g2DA3EKWvx8uxVYcNFrmT5nJpon1Vi9V4XcOibJD",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(mappedTalks[0]),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("call to prismic happened");
    console.log(options);
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }

  return mappedTalks[0];
}

getTalks();
