#!/usr/bin/env node

const baseUrl = process.env.BASE_URL ?? "https://macrotrackr.vercel.app";

const checks = [
  {
    name: "Landing page is reachable",
    path: "/",
    expectedStatus: 200,
  },
  {
    name: "Auth page is reachable",
    path: "/auth",
    expectedStatus: 200,
  },
  {
    name: "Protected page redirects without session",
    path: "/today",
    expectedStatus: 200,
    expectedFinalPath: "/auth",
  },
  {
    name: "Dashboard API requires auth",
    path: "/api/dashboard/day?date=2026-03-05",
    expectedStatus: 401,
  },
  {
    name: "Progress API requires auth",
    path: "/api/progress/streak",
    expectedStatus: 401,
  },
  {
    name: "Weight API is deployed",
    path: "/api/weight",
    expectedStatus: 401,
  },
];

function buildUrl(path) {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

function writeLine(text = "") {
  process.stdout.write(`${text}\n`);
}

async function run() {
  let failures = 0;

  writeLine(`Smoke test target: ${baseUrl}`);

  for (const check of checks) {
    const url = buildUrl(check.path);

    try {
      const response = await fetch(url, { redirect: "follow" });
      const finalUrl = new URL(response.url);
      const statusOk = response.status === check.expectedStatus;
      const pathOk = check.expectedFinalPath
        ? finalUrl.pathname === check.expectedFinalPath
        : true;

      const passed = statusOk && pathOk;
      if (!passed) {
        failures += 1;
      }

      const details = [`status=${response.status}`, `finalPath=${finalUrl.pathname}`];
      if (check.expectedFinalPath) {
        details.push(`expectedFinalPath=${check.expectedFinalPath}`);
      }

      writeLine(`${passed ? "PASS" : "FAIL"} - ${check.name} (${details.join(", ")})`);
    } catch (error) {
      failures += 1;
      writeLine(`FAIL - ${check.name} (network error: ${error instanceof Error ? error.message : "unknown"})`);
    }
  }

  writeLine(`\nResult: ${failures === 0 ? "ALL PASS" : `${failures} failure(s)`}`);
  process.exitCode = failures === 0 ? 0 : 1;
}

run();
