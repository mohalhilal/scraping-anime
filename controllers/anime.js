const config = require("config");
const cheerio = require("cherio");
const axios = require("axios");

const BaseUrl = config.get("BaseUrl");

const BaseUrlLength = BaseUrl.length;

exports.going = async (req, res) => {
  try {
    let urlOngoing;

    if (req.params.page == undefined) {
      urlOngoing = BaseUrl + config.get("ChildUrl.Ongoing");
    } else {
      id = "page/" + req.params.page;
      urlOngoing = BaseUrl + config.get("ChildUrl.Ongoing") + id;
    }
    const response = await axios.get(urlOngoing);

    const jsonRes = [];
    const anime = [];

    const $ = cheerio.load(response.data);

    const nextPage = $(".pagination > .pagenavix > .next").attr("href");
    const prevPage = $(".pagination > .pagenavix > .prev").attr("href");
    const TotalPage = $(".pagination > .pagenavix > .page-numbers")
      .not(".prev")
      .not(".next")
      .last()
      .text();

    $(".venz > ul")
      .find("li")
      .each((index, element) => {
        const data = {
          title: $(element).find(".detpost > .thumb > a > .thumbz > h2").text(),
          id: $(element)
            .find(".detpost > .thumb > a")
            .attr("href")
            .substring(BaseUrlLength + 6),
          thumb: $(element)
            .find(".detpost > .thumb > a > .thumbz > img")
            .attr("src"),
          episode: $(element).find(".detpost > .epz").text(),
        };

        anime.push(data);
      });

    if (prevPage == undefined) {
      jsonRes.push({
        TotalPage: TotalPage,
        nextPage: nextPage.substring(BaseUrlLength + 19).replace("/", ""),
        data: anime,
      });
    } else if (nextPage == undefined) {
      jsonRes.push({
        TotalPage: TotalPage,
        prevPage: prevPage.substring(BaseUrlLength + 19).replace("/", ""),
        data: anime,
      });
    } else if (prevPage == undefined && nextPage == undefined) {
      jsonRes.push({ TotalPage: TotalPage, data: anime });
    } else {
      jsonRes.push({
        TotalPage: TotalPage,
        prevPage: prevPage.substring(BaseUrlLength + 19).replace("/", ""),
        nextPage: nextPage.substring(BaseUrlLength + 19).replace("/", ""),
        data: anime,
      });
    }

    res.json(jsonRes);
  } catch (error) {
    res.send(error);
  }
};

exports.complete_anime = async (req, res) => {
  try {
    let urlOngoing;
    if (req.params.page == undefined) {
      urlOngoing = BaseUrl + config.get("ChildUrl.Complete");
    } else {
      id = "page/" + req.params.page;
      urlOngoing = BaseUrl + config.get("ChildUrl.Complete") + id;
    }
    const response = await axios.get(urlOngoing);

    const jsonRes = [];
    const anime = [];

    const $ = cheerio.load(response.data);

    const nextPage = $(".pagination > .pagenavix > .next").attr("href");
    const prevPage = $(".pagination > .pagenavix > .prev").attr("href");
    const TotalPage = $(".pagination > .pagenavix > .page-numbers")
      .not(".prev")
      .not(".next")
      .last()
      .text();

    $(".venz > ul")
      .find("li")
      .each((index, element) => {
        const data = {
          title: $(element).find(".detpost > .thumb > a > .thumbz > h2").text(),
          id: $(element)
            .find(".detpost > .thumb > a")
            .attr("href")
            .substring(BaseUrlLength + 6),
          thumb: $(element)
            .find(".detpost > .thumb > a > .thumbz > img")
            .attr("src"),
          episode: $(element).find(".detpost > .epz").text(),
          rating: parseFloat(
            $(element).find(".detpost > .epztipe").text()
          ).toString(),
        };

        anime.push(data);
      });

    if (prevPage == undefined) {
      jsonRes.push({
        TotalPage: TotalPage,
        nextPage: nextPage
          .substring(BaseUrlLength + 19)
          .replace("/", "")
          .slice(0, -1),
        data: anime,
      });
    } else if (nextPage == undefined) {
      jsonRes.push({
        TotalPage: TotalPage,
        prevPage: prevPage
          .substring(BaseUrlLength + 19)
          .replace("/", "")
          .slice(0, -1),
        data: anime,
      });
    } else if (prevPage == undefined && nextPage == undefined) {
      jsonRes.push({ TotalPage: TotalPage, data: anime });
    } else {
      jsonRes.push({
        TotalPage: TotalPage,
        prevPage: prevPage
          .substring(BaseUrlLength + 19)
          .replace("/", "")
          .slice(0, -1),
        nextPage: nextPage
          .substring(BaseUrlLength + 19)
          .replace("/", "")
          .slice(0, -1),
        data: anime,
      });
    }

    res.json(jsonRes);
  } catch (error) {
    res.send(error);
  }
};

exports.genre_list = async (req, res) => {
  try {
    const url = BaseUrl + config.get("ChildUrl.GenreList");

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const genre = [];

    $("#venkonten > .vezone > .venser > .genres > li")
      .find("a")
      .each((index, element) => {
        const data = {
          title: $(element).text(),
          id: $(element).attr("href").substring(8).replace("/", ""),
        };

        genre.push(data);
      });

    res.json(genre);
  } catch (error) {
    res.send(error);
  }
};

exports.genre_detail = async (req, res) => {
  try {
    let url;
    if (req.params.page == undefined) {
      url = BaseUrl + config.get("ChildUrl.Genres") + req.params.id;
    } else {
      page = "/page" + req.params.page;
      url = BaseUrl + config.get("ChildUrl.Genres") + req.params.id + page;
    }

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const jsonRes = [];
    const anime = [];

    $("#venkonten > .vezone > .venser > .page")
      .children("div")
      .not(".rvad")
      .not(".clear")
      .not(".pagination")
      .each((index, element) => {
        const data = {
          title: $(element).find(".col-anime > .col-anime-title").text(),
          id: $(element)
            .find(".col-anime > .col-anime-title > a")
            .attr("href")
            .substring(BaseUrlLength + 6),
          thumb: $(element)
            .find(".col-anime > .col-anime-cover > img")
            .attr("src"),
          rating: parseFloat(
            $(element).find(".col-anime > .col-anime-rating").text()
          ).toString(),
        };

        anime.push(data);
      });

    const nextPage = $(
      "#venkonten > .vezone > .venser > .page > .pagination > .pagipagi > .pagenavix > .next"
    ).attr("href");
    const prevPage = $(
      "#venkonten > .vezone > .venser > .page > .pagination > .pagipagi > .pagenavix > .prev"
    ).attr("href");
    const TotalPage = $(
      "#venkonten > .vezone > .venser > .page > .pagination > .pagipagi > .pagenavix > .page-numbers"
    )
      .not(".prev")
      .not(".next")
      .last()
      .text();

    if (prevPage == undefined) {
      jsonRes.push({
        TotalPage: TotalPage,
        nextPage: nextPage
          .substring(BaseUrlLength + 16)
          .replace("/", "")
          .slice(0, -1),
        data: anime,
      });
    } else if (nextPage == undefined) {
      jsonRes.push({
        TotalPage: TotalPage,
        prevPage: prevPage
          .substring(BaseUrlLength + 16)
          .replace("/", "")
          .slice(0, -1),
        data: anime,
      });
    } else if (prevPage == undefined && nextPage == undefined) {
      jsonRes.push({ TotalPage: TotalPage, data: anime });
    } else {
      jsonRes.push({
        TotalPage: TotalPage,
        prevPage: prevPage
          .substring(BaseUrlLength + 16)
          .replace("/", "")
          .slice(0, -1),
        nextPage: nextPage
          .substring(BaseUrlLength + 16)
          .replace("/", "")
          .slice(0, -1),
        data: anime,
      });
    }

    res.json(jsonRes);
  } catch (error) {
    res.send(error);
  }
};

exports.anime_detail = async (req, res) => {
  const url = BaseUrl + config.get("ChildUrl.Anime") + req.params.id;
  const response = await axios.get(url);

  const $ = cheerio.load(response.data);

  const data_eps = [];
  const data_genre = [];
  const JsonRes = [];

  $(".wowmaskot > #venkonten > .venser > .episodelist")
    .eq(1)
    .find("ul > li")
    .each((index, element) => {
      const data = {
        title: $(element).find("span > a").text(),
        id: $(element)
          .find("span > a")
          .attr("href")
          .substring(BaseUrlLength + 8)
          .replace("/", ""),
        date: $(element).find("span").eq(1).text(),
      };

      data_eps.push(data);
    });

  $(
    ".wowmaskot > #venkonten > .venser > .fotoanime > .infozin > .infozingle > p > span"
  )
    .eq(10)
    .find("a")
    .each((index, element) => {
      const data = {
        genre_link: $(element)
          .attr("href")
          .substring(BaseUrlLength + 7)
          .replace("/", ""),
        genre_name: $(element).text(),
      };
      data_genre.push(data);
    });

  const thumb = $(".wowmaskot > #venkonten > .venser > .fotoanime > img").attr(
    "src"
  );
  const title = $(
    ".wowmaskot > #venkonten > .venser > .fotoanime > .infozin > .infozingle > p > span"
  )
    .eq(0)
    .text()
    .substring(7);

  const status = $(
    ".wowmaskot > #venkonten > .venser > .fotoanime > .infozin > .infozingle > p > span"
  )
    .eq(5)
    .text()
    .substring(8);

  const episode = $(
    ".wowmaskot > #venkonten > .venser > .fotoanime > .infozin > .infozingle > p > span"
  )
    .eq(6)
    .text()
    .substring(14);

  const synopsis = $(
    ".wowmaskot > #venkonten > .venser > .fotoanime > .sinopc > p"
  ).text();

  JsonRes.push({
    title: title,
    thumb: thumb,
    synopsis: synopsis,
    status: status,
    total_episode: episode,
    genre: data_genre,
    list_episode: data_eps.reverse(),
  });

  res.json(JsonRes);
};

exports.episode = async (req, res) => {
  const url = BaseUrl + config.get("ChildUrl.Episode") + req.params.id;
  const response = await axios.get(url);

  let UrlNow = req.protocol + "://" + req.get("host") + "/api/mirror/";

  const $ = cheerio.load(response.data);

  const anime = [];
  const mirror_list = [];
  const p360 = [];
  const p480 = [];
  const p720 = [];

  $(
    ".wowmaskot > #venkonten > .venser > .venutama > #lightsVideo > #embed_holder > .mirrorstream"
  )
    .find(".m360p > li")
    .each((index, element) => {
      const data = {
        host: $(element).text(),
        link: UrlNow + $(element).find("a").attr("data-content"),
      };
      p360.push(data);
    });

  $(
    ".wowmaskot > #venkonten > .venser > .venutama > #lightsVideo > #embed_holder > .mirrorstream"
  )
    .find(".m480p > li")
    .each((index, element) => {
      const data = {
        host: $(element).text(),
        link: UrlNow + $(element).find("a").attr("data-content"),
      };
      p480.push(data);
    });

  $(
    ".wowmaskot > #venkonten > .venser > .venutama > #lightsVideo > #embed_holder > .mirrorstream"
  )
    .find(".m720p > li")
    .each((index, element) => {
      const data = {
        host: $(element).text(),
        link: UrlNow + $(element).find("a").attr("data-content"),
      };
      p720.push(data);
    });

  const link_streaming = $(
    ".wowmaskot > #venkonten > .venser > .venutama > #lightsVideo > #embed_holder > #pembed > .responsive-embed-stream iframe"
  ).attr("src");

  const title = $(
    ".wowmaskot > #venkonten > .venser > .venutama > .posttl"
  ).text();

  let prev_episode = $(
    ".wowmaskot > #venkonten > .venser > .venutama > .prevnext > .flir  > a"
  )
    .filter("[title='Episode Sebelumnya']")
    .attr("href");

  let next_episode = $(
    ".wowmaskot > #venkonten > .venser > .venutama > .prevnext > .flir  > a"
  )
    .filter("[title='Episode Selanjutnya']")
    .attr("href");

  if (prev_episode == undefined) {
    prev_episode = null;
    next_episode = next_episode.substring(BaseUrlLength + 8).replace("/", "");
  } else if (next_episode == undefined) {
    next_episode = null;
    prev_episode = prev_episode.substring(BaseUrlLength + 8).replace("/", "");
  } else if (prev_episode == undefined && next_episode == undefined) {
    prev_episode = null;
    next_episode = null;
  } else {
    prev_episode = prev_episode.substring(BaseUrlLength + 8).replace("/", "");
    next_episode = next_episode.substring(BaseUrlLength + 8).replace("/", "");
  }

  mirror_list.push({
    "360p": p360,
    "480p": p480,
    "720p": p720,
  });

  anime.push({
    title: title,
    link_streaming: link_streaming,
    prev_episode: prev_episode,
    next_episode: next_episode,
    mirror_list: mirror_list,
  });

  res.json(anime);
};

exports.mirror_content = async (req, res) => {
  const content = req.params.content;
  let decrypt = JSON.parse(atob(content));

  const response = await axios.post(
    "https://otakudesu.ltd/wp-admin/admin-ajax.php",
    {
      ...decrypt,
      nonce: "191e7bcf7f",
      action: "2a3505c93b0035d3f455df82bf976b84",
    },
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        origin: "https://otakudesu.ltd",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63",
      },
    }
  );

  const $ = cheerio.load(atob(response.data.data));

  const link = $(".responsive-embed-stream > iframe").attr("src");

  const data = {
    link_mirror: link,
  };

  res.json(data);
};
