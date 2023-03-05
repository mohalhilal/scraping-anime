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
