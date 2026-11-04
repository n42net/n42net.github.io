"""Collect the public numbers of all Wacht integrations for the overview page.

Writes ``home-assistant/data.js`` (``window.WACHT_DATA = {...}``) and
``home-assistant/icons/<name>.svg`` next to the overview page. Everything
comes from public GitHub data: the REST API and a shallow clone of each
repository's ``main``. Nothing from a Home Assistant instance, nothing
hand-typed - the hand-written texts live in ``home-assistant/index.html``.

Usage: python tools/build_data.py [--cache DIR]
Token: GITHUB_TOKEN, else ``gh auth token``.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from datetime import UTC, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "home-assistant"
WACHTEN = [
    "streckenwacht",
    "eilwacht",
    "einspeisewacht",
    "tarifwacht",
    "waermewacht",
    "speicherwacht",
]
PLATFORMS = {
    "binary_sensor",
    "button",
    "calendar",
    "event",
    "geo_location",
    "number",
    "sensor",
}
API = "https://api.github.com/"
AUTHOR = "n42net"
# Mitarbeit in fremden Repos, in der Reihenfolge der Seite; True = Co-Maintainer
CONTRIBUTIONS = [
    ("serbanb11/bosch-homecom-hass", False),
    ("serbanb11/homecom_alt", False),
    ("hackwell/homeassistant-anio", True),
    ("mampfes/hacs_waste_collection_schedule", False),
    ("Sturmi77/heatpump-hydraulic-card", False),
    ("volter-labs/volcast-ha-integration", False),
    ("Ralleberg/ha-hrv-card", False),
    ("tronity/homeassistant", False),
    ("AshGSmith/solar-forecast-card", False),
]


def token() -> str | None:
    if os.environ.get("GITHUB_TOKEN"):
        return os.environ["GITHUB_TOKEN"]
    try:
        return subprocess.run(
            ["gh", "auth", "token"], capture_output=True, text=True, check=True
        ).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        return None


TOKEN = token()


def get(path: str, raw: bool = False):
    url = path if path.startswith("http") else API + path
    request = urllib.request.Request(url, headers={"User-Agent": "wacht-overview"})
    if TOKEN and url.startswith(API):
        request.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(request, timeout=30) as response:
        body = response.read().decode()
        return (body, response.headers) if raw else json.loads(body)


def commits(repo: str) -> tuple[int, int, str]:
    """All commits on main: count, how many name Claude as co-author, last date."""
    total, assisted, last, page = 0, 0, "", 1
    while True:
        batch = get(f"repos/{repo}/commits?sha=main&per_page=100&page={page}")
        if not batch:
            return total, assisted, last
        if page == 1:
            last = batch[0]["commit"]["committer"]["date"][:10]
        total += len(batch)
        assisted += sum(
            bool(re.search(r"^Co-Authored-By: Claude", c["commit"]["message"], re.M | re.I))
            for c in batch
        )
        page += 1


def clone(repo: str, target: Path) -> Path:
    if target.exists():
        subprocess.run(["git", "-C", str(target), "fetch", "-q", "--depth", "1", "origin", "main"], check=True)
        subprocess.run(["git", "-C", str(target), "reset", "-q", "--hard", "FETCH_HEAD"], check=True)
    else:
        subprocess.run(
            ["git", "clone", "-q", "--depth", "1", "--branch", "main", f"https://github.com/{repo}.git", str(target)],
            check=True,
        )
    return target


def lines(paths) -> int:
    return sum(len(p.read_text(encoding="utf-8").splitlines()) for p in paths)


def ci_jobs(workflow: Path) -> list[str]:
    jobs, inside = [], False
    for line in workflow.read_text(encoding="utf-8").splitlines():
        if line.startswith("jobs:"):
            inside = True
        elif inside and re.match(r"^  [a-z][\w-]*:\s*$", line):
            jobs.append(line.strip()[:-1])
        elif inside and re.match(r"^\S", line):
            inside = False
    return jobs


def code_facts(name: str, checkout: Path) -> dict:
    component = checkout / "custom_components" / name
    manifest = json.loads((component / "manifest.json").read_text(encoding="utf-8"))
    hacs = json.loads((checkout / "hacs.json").read_text(encoding="utf-8"))
    modules = sorted(component.rglob("*.py"))
    frontend = [
        p for p in (component / "frontend").glob("*.js") if "leaflet" not in p.name
    ] if (component / "frontend").exists() else []
    tests = sorted((checkout / "tests").rglob("test_*.py"))
    test_text = "\n".join(p.read_text(encoding="utf-8") for p in tests)
    services = component / "services.yaml"
    workflows = checkout / ".github" / "workflows"
    shutil.copyfile(checkout / "assets" / "brand" / "svg" / "icon.svg", ROOT / "icons" / f"{name}.svg")
    return {
        "manifest_version": manifest["version"],
        "integration_type": manifest.get("integration_type"),
        "iot_class": manifest.get("iot_class"),
        "requirements": manifest.get("requirements", []),
        "min_ha": hacs.get("homeassistant"),
        "countries": hacs.get("country"),
        "python_lines": lines(modules),
        "python_modules": len(modules),
        "frontend_lines": lines(frontend),
        "test_files": len(tests),
        "test_functions": len(re.findall(r"^\s*(?:async )?def test_", test_text, re.M)),
        "ha_test_files": len([p for p in tests if "ha" in p.relative_to(checkout / "tests").parts[:-1]]),
        "platforms": sorted(p.stem for p in component.glob("*.py") if p.stem in PLATFORMS),
        "services": len(re.findall(r"^[a-z_]+:\s*$", services.read_text(encoding="utf-8"), re.M)) if services.exists() else 0,
        "languages": sorted(p.stem for p in (component / "translations").glob("*.json")),
        "ci_jobs": ci_jobs(workflows / "ci.yml"),
        "workflows": sorted(p.stem for p in workflows.glob("*.yml")),
        "docs": sorted(p.name for p in (checkout / "docs").glob("*.md")),
        "agent_rules": (checkout / "CLAUDE.md").exists(),
        "domain": manifest["domain"],
        "codeowners": manifest.get("codeowners", []),
        "dependencies": manifest.get("dependencies", []),
        "after_dependencies": manifest.get("after_dependencies", []),
        "config_flow": manifest.get("config_flow", False),
    }


def hacs_status(repo: str, default: set[str], open_prs: list[dict]) -> dict:
    if repo.lower() in default:
        return {"state": "default"}
    name = repo.split("/")[0]
    for pr in open_prs:
        if name in pr["title"].lower() or name in pr["body"].lower():
            return {"state": "pending", "pr": pr["number"], "url": pr["html_url"], "since": pr["created_at"][:10]}
    return {"state": "custom"}


def contributions() -> list[dict]:
    """Pull requests by AUTHOR in CONTRIBUTIONS: all, merged, open. One paged search (limit 30/min)."""
    repos = "+".join(f"repo:{repo}" for repo, _ in CONTRIBUTIONS)
    prs, page = [], 1
    while True:
        found = get(f"search/issues?q=is:pr+author:{AUTHOR}+{repos}&per_page=100&page={page}")
        prs += found["items"]
        if len(prs) >= found["total_count"] or not found["items"]:
            break
        page += 1
    result = []
    for repo, maintainer in CONTRIBUTIONS:
        mine = [pr for pr in prs if pr["repository_url"].lower().endswith("/repos/" + repo.lower())]
        result.append({
            "repo": repo,
            "maintainer": maintainer,
            "prs": len(mine),
            "merged": sum(1 for pr in mine if pr["pull_request"].get("merged_at")),
            "open": sum(1 for pr in mine if pr["state"] == "open"),
        })
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", type=Path, help="keep clones here between runs")
    args = parser.parse_args()
    (ROOT / "icons").mkdir(exist_ok=True)
    cache = args.cache or Path(tempfile.mkdtemp(prefix="wacht-"))
    cache.mkdir(parents=True, exist_ok=True)

    default = {r.lower() for r in json.loads(get("https://raw.githubusercontent.com/hacs/default/master/integration", raw=True)[0])}
    open_prs = get(f"search/issues?q=repo:hacs/default+is:pr+is:open+author:{AUTHOR}&per_page=50")["items"]
    open_prs = [{**pr, "body": pr.get("body") or ""} for pr in open_prs]

    wachten = []
    for name in WACHTEN:
        repo = f"{name}/integration"
        info = get(f"repos/{repo}")
        releases = get(f"repos/{repo}/releases?per_page=100")
        first = releases[0] if releases else None
        total, assisted, last_commit = commits(repo)
        entry = {
            "name": name,
            "repo": repo,
            "url": info["html_url"],
            "created": info["created_at"][:10],
            "stars": info["stargazers_count"],
            "open_issues": info["open_issues_count"],
            "license": (info.get("license") or {}).get("spdx_id"),
            "pages": f"https://{name}.github.io/integration/" if info.get("has_pages") else None,
            "commits": total,
            "commits_with_claude": assisted,
            "last_commit": last_commit,
            "releases": len(releases),
            "version": first["tag_name"].lstrip("v") if first else None,
            "released": first["published_at"][:10] if first else None,
            "first_release": releases[-1]["published_at"][:10] if releases else None,
            "hacs": hacs_status(repo, default, open_prs),
        }
        entry.update(code_facts(name, clone(repo, cache / name)))
        wachten.append(entry)
        print(f"{name}: {entry['version']} · {entry['commits']} commits · {entry['test_functions']} tests", file=sys.stderr)

    data = {
        "generated": datetime.now(UTC).strftime("%Y-%m-%dT%H:%MZ"),
        "wachten": wachten,
        "contributions": contributions(),
    }
    (ROOT / "data.js").write_bytes(
        ("window.WACHT_DATA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n").encode()
    )


if __name__ == "__main__":
    main()
