module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { pageId, token } = req.body;

  try {
    const r = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28"
      }
    });
    const data = await r.json();

    const urls = [];
    for (const block of data.results || []) {
      const type = block.type;
      if (type === "embed" && block.embed?.url) urls.push(block.embed.url);
      if (type === "bookmark" && block.bookmark?.url) urls.push(block.bookmark.url);
      if (type === "link_preview" && block.link_preview?.url) urls.push(block.link_preview.url);
      if (type === "video" && block.video?.external?.url) urls.push(block.video.external.url);
    }

    return res.status(200).json({ urls });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
