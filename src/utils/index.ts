import axios from 'axios';
import * as cheerio from 'cheerio';

export const getPageTitle = async (url: string) => {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    return $('title').text();
  } catch (err) {
    return url;
  }
};
