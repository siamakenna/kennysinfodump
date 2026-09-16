import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const out = resolve(process.env.QA_OUTPUT || "/tmp/kenny-portfolio-qa");
const urls = JSON.parse(readFileSync(resolve(out, "external-urls.json"), "utf8"));
const results = [];
for (const url of urls) {
  try {
    const response = execFileSync("curl", ["-sS", "-L", "--max-time", "25", "-o", "/dev/null", "-w", "%{http_code}\n%{url_effective}", url], { encoding: "utf8", timeout: 30000 });
    const [status, finalUrl] = response.trim().split("\n");
    const result = { url, status: Number(status), finalUrl };
    results.push(result);
    console.log(status, url);
  } catch (error) {
    results.push({ url, status: "UNRESOLVED", error: error.message.slice(0, 200) });
    console.log("UNRESOLVED", url);
  }
  writeFileSync(resolve(out, "links.json"), JSON.stringify(results, null, 2));
}
console.log(`${results.length} URLs checked. HTTP reachability is not a content or authentication audit.`);
