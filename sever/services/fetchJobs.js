// services/fetchJobs.js
import axios from "axios";
import xml2js from "xml2js";

const FEED_URL =
  "https://jobicy.com/?feed=job_feed";

const fetchJobs = async () => {
  try {
    console.log("🌐 Fetching XML feed...");

    const { data } = await axios.get(FEED_URL);

    console.log("🔧 Parsing XML...");
    const result = await xml2js.parseStringPromise(data, {
      explicitArray: true,
      mergeAttrs: true,
    });

    const jobs = result?.rss?.channel?.[0]?.item || [];

    if (!Array.isArray(jobs)) {
      console.warn("⚠️ Jobs data is not an array");
      return [];
    }

    return jobs; // ✅ ONLY return data
  } catch (err) {
    console.error("❌ FetchJobs error:", err.message);
    return [];
  }
};

export default fetchJobs;
