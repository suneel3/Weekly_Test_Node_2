import puppeteer from "puppeteer";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto("https://www.iplt20.com/stats/2024");
    await page.setViewport({ width: 1080, height: 1024 });

    // Function to scrape data for all players
    const scrapePlayerData = async () => {
      // Wait for the table rows to load
      await page.waitForSelector(".statsTable > tbody > tr", {
        timeout: 60000,
      });

      // Extract data from the table
      const playerStats = await page.evaluate(() => {
        const rows = document.querySelectorAll(".statsTable > tbody > tr");

        return Array.from(rows).map((row) => {
          const cols = row.querySelectorAll("td");
          return {
            name: cols[1]?.innerText.trim(),
            runs: parseInt(cols[2]?.innerText.trim() || "0"),
            strikeRate: parseInt(cols[9]?.innerText.trim() || "0"),
            Centuries: parseInt(cols[10]?.innerText.trim() || "0"),
            Fifties: parseInt(cols[11]?.innerText.trim() || "0"),
            Fours: parseInt(cols[12]?.innerText.trim() || "0"),
            ballFaced: parseFloat(cols[8]?.innerText.trim() || "0"),
          };
        });
      });

      return playerStats;
    };

    const playerData = await scrapePlayerData();

    // Resolve the current directory path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Write data to a JSON file
    const filePath = `${__dirname}/data.json`;
    await fs.writeFile(filePath, JSON.stringify(playerData, null, 2));
    console.log(`Data successfully written to ${filePath}`);
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close(); // Close the browser
  }
})();
