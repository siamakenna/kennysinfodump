"""Content invariants using structured HTML/CSV parsing, without browser packages."""
import csv
import hashlib
import json
import subprocess
from html.parser import HTMLParser
from pathlib import Path


class Portfolio(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.gems = []
        self.tables = []
        self.current_table = None
        self.cell = None
        self.caption = False
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "data-secret" in attrs:
            self.gems.append((attrs.get("aria-label"), attrs["data-secret"]))
        if tag == "table":
            self.current_table = {"caption": "", "values": []}
        if self.current_table is not None:
            if tag == "caption":
                self.caption = True
            if tag == "td":
                self.cell = ""

    def handle_data(self, data):
        if self.caption:
            self.current_table["caption"] += data
        if self.cell is not None:
            self.cell += data

    def handle_endtag(self, tag):
        if tag == "caption":
            self.caption = False
        if tag == "td" and self.cell is not None:
            self.current_table["values"].append(self.cell.strip())
            self.cell = None
        if tag == "table":
            self.tables.append(self.current_table)
            self.current_table = None


current = Portfolio(Path("index.html").read_text())
original = Portfolio(subprocess.check_output(["git", "show", "cbc46d6:index.html"], text=True))
assert len(current.gems) == 7
assert current.gems == original.gems, "Existing gem names/messages changed"
poster = Path("assets/sdab-poster-thumb.jpg").read_bytes()
assert poster == subprocess.check_output(["git", "show", "cbc46d6:assets/sdab-poster-thumb.jpg"])
with Path("assets/strict_comparator_primary_2026-09-12.csv").open() as source:
    rows = list(csv.DictReader(source))
assert len(rows) == 9
assert all(r["n_total_queries"] == "1079" and r["n_evaluable_queries"] == "180" for r in rows)
primary = next(t for t in current.tables if t["caption"].startswith("Primary strict"))
chosen = [0, 1, 2, 3, 7, 8]
assert primary["values"] == [f'{float(rows[i]["mAP"]):.6f}' for i in chosen]
earlier = next(t for t in current.tables if "supplied August" in t["caption"])
assert earlier["values"] == ["0.157", "0.009", "0.033", "0.243", "0.013", "0.063", "0.721", "0.040", "0.081", "0.788", "0.034", "0.111"]
print(json.dumps({"gems": "seven original labels/messages preserved", "poster": "byte-identical to baseline", "strict_table": "all six values match local versioned CSV", "earlier_table": "all 12 displayed values match supplied figure transcription", "poster_sha256": hashlib.sha256(poster).hexdigest()}, indent=2))
