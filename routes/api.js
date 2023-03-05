const express = require("express");
const config = require("config");
const router = express.Router();
const anime = require("../controllers/anime");

router.get("/ongoing", anime.going);
router.get("/ongoing/:page", anime.going);
router.get("/complete", anime.complete_anime);
router.get("/complete/:page", anime.complete_anime);
router.get("/genre", anime.genre_list);
router.get("/genre/:id", anime.genre_detail);
router.get("/genre/:id/:page", anime.genre_detail);
router.get();

module.exports = router;
