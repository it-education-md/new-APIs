# News API

This is a simple Node.js API that interacts with the GNews API to fetch news articles. The API includes caching to prevent redundant requests.

## Features

- Fetch N news articles.
  `GET /news?count=N`
- Search news articles by title, author, or keywords.
  `GET /news/search?query=your_query&author=author_name`
  `GET /news/keywords?keyword=your_keyword`
- Caching to improve performance.

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file and add your GNews API key:

```env
GNEWS_API_KEY=your_gnews_api_key_here
```
