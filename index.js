const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const { convertArrayToCSV } = require("convert-array-to-csv");

const main = async (id, count) => {
  const results = [];

  for (let i = 0; i < count; i++) {
    try {
      const res = await axios.get(
        `https://www.superpages.com/charlottesville-va/bpp/advantage-home-contracting-${id}`
      );

      const $ = cheerio.load(res.data);

      const business_name = $(".primary-info h1").text();
      const category = $(".primary-category").text();
      const address = $(".address").text();
      const phone_number = $(".phone.desktop-only").text();

      const data = {
        id,
        business_name,
        phone_number,
        category,
        address,
      };

      if (business_name && phone_number) {
        results.push(data);

        const csv = await convertArrayToCSV(results);

        fs.writeFile("./data.csv", csv, () => {});
        console.log(
          `${i}: Successfully scraped ${id}, business name is ${business_name}`
        );
      } else {
        console.log(`${i}: No data for this Id`);
      }
    } catch (e) {
      console.log(`${i}: Error scraping page ${id}`);
    }

    id++;
  }
};

main(548359657, 50000);
