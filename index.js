const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
require("dotenv").config();

const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_API_URL = "https://gnews.io/api/v4/";

app.use(express.json());

// Fetch N news articles
app.get("/news", async (req, res) => {
  const { count = 10 } = req.query;
  const cacheKey = `news_${count}`;

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.get(`${GNEWS_API_URL}top-headlines`, {
      params: { token: GNEWS_API_KEY, lang: "en", max: count },
    });

    const data = response.data.articles;
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
});

// Find a news article by title or author
app.get("/news/search", async (req, res) => {
  const { query, author } = req.query;
  const cacheKey = `search_${query}_${author}`;

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.get(`${GNEWS_API_URL}search`, {
      params: {
        token: GNEWS_API_KEY,
        q: query || "",
        in: author ? `author:${author}` : "",
      },
    });

    const data = response.data.articles;
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to search news articles" });
  }
});

// Searching by keywords
app.get("/news/keywords", async (req, res) => {
  const { keyword } = req.query;
  const cacheKey = `keyword_${keyword}`;

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.get(`${GNEWS_API_URL}search`, {
      params: {
        token: GNEWS_API_KEY,
        q: keyword,
      },
    });

    const data = response.data.articles;
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to search news articles by keyword" });
  }
});

app.listen(port, () => {
  console.log(`News API is running on http://localhost:${port}/news`);
});
