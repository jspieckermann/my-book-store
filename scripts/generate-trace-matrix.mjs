#!/usr/bin/env node
// Regenerates openspec/trace-matrix.md from openspec/specs/**/spec.md and the
// `// covers:` comments in e2e/**/*.spec.ts. Never hand-edit the output file —
// run `npm run trace` instead. See openspec/changes/add-e2e-trace-matrix/design.md.

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SPECS_DIR = 'openspec/specs';
const E2E_DIR = 'e2e';
const OUTPUT_PATH = 'openspec/trace-matrix.md';

const REQUIREMENT_RE = /^### Requirement: (.+)$/;
const SCENARIO_RE = /^#### Scenario: (.+)$/;
const COVERS_RE = /^\s*\/\/\s*covers:\s*(.+?)\s*>\s*(.+?)\s*>\s*(.+?)\s*$/;
const TEST_RE = /^\s*test\s*\(\s*['"`](.+?)['"`]/;

function tripleKey(capability, requirement, scenario) {
  return `${capability}\u0000${requirement}\u0000${scenario}`;
}

function parseSpecs() {
  const capabilities = [];
  const byTriple = new Map();
  for (const capDir of readdirSync(SPECS_DIR).sort()) {
    const specPath = join(SPECS_DIR, capDir, 'spec.md');
    let stat;
    try {
      stat = statSync(specPath);
    } catch {
      continue;
    }
    if (!stat.isFile()) continue;

    const lines = readFileSync(specPath, 'utf8').split('\n');
    const requirements = [];
    let currentReq = null;
    for (const line of lines) {
      const reqMatch = line.match(REQUIREMENT_RE);
      if (reqMatch) {
        currentReq = { name: reqMatch[1].trim(), scenarios: [] };
        requirements.push(currentReq);
        continue;
      }
      const scenMatch = line.match(SCENARIO_RE);
      if (scenMatch && currentReq) {
        const scenarioName = scenMatch[1].trim();
        currentReq.scenarios.push({ name: scenarioName, coveredBy: [] });
        byTriple.set(tripleKey(capDir, currentReq.name, scenarioName), {
          capability: capDir,
          requirement: currentReq.name,
          scenario: scenarioName,
        });
      }
    }
    capabilities.push({ name: capDir, requirements });
  }
  return { capabilities, byTriple };
}

function listE2eFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listE2eFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.spec.ts')) {
      results.push(full);
    }
  }
  return results;
}

function parseE2eCoverage() {
  const references = [];
  for (const filePath of listE2eFiles(E2E_DIR)) {
    const lines = readFileSync(filePath, 'utf8').split('\n');
    let pendingCovers = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const coversMatch = line.match(COVERS_RE);
      if (coversMatch) {
        pendingCovers.push({
          capability: coversMatch[1].trim(),
          requirement: coversMatch[2].trim(),
          scenario: coversMatch[3].trim(),
          line: i + 1,
        });
        continue;
      }
      const testMatch = line.match(TEST_RE);
      if (testMatch && pendingCovers.length > 0) {
        const testDescription = testMatch[1];
        const location = `${relative('.', filePath).split(sep).join('/')}:${i + 1}`;
        for (const covers of pendingCovers) {
          references.push({ ...covers, testDescription, location });
        }
        pendingCovers = [];
        continue;
      }
      // A non-covers, non-test, non-blank line breaks the "immediately preceding" chain.
      if (pendingCovers.length > 0 && line.trim() !== '') {
        pendingCovers = [];
      }
    }
  }
  return references;
}

function main() {
  const { capabilities, byTriple } = parseSpecs();
  const references = parseE2eCoverage();

  const unresolved = [];
  for (const ref of references) {
    const key = tripleKey(ref.capability, ref.requirement, ref.scenario);
    const target = byTriple.get(key);
    if (!target) {
      unresolved.push(ref);
      continue;
    }
    const capability = capabilities.find((c) => c.name === ref.capability);
    const requirement = capability.requirements.find((r) => r.name === ref.requirement);
    const scenario = requirement.scenarios.find((s) => s.name === ref.scenario);
    scenario.coveredBy.push({ testDescription: ref.testDescription, location: ref.location });
  }

  if (unresolved.length > 0) {
    console.error(`✗ ${unresolved.length} // covers: reference(s) did not resolve to a real scenario:\n`);
    for (const ref of unresolved) {
      console.error(`  ${ref.location}: covers: ${ref.capability} > ${ref.requirement} > ${ref.scenario}`);
    }
    console.error('\nFix the capability/requirement/scenario text to match openspec/specs/**/spec.md exactly.');
    process.exit(1);
  }

  let totalScenarios = 0;
  let totalCovered = 0;
  const summaryRows = [];
  const sections = [];

  for (const capability of capabilities) {
    let capScenarios = 0;
    let capCovered = 0;
    const reqBlocks = [];

    for (const requirement of capability.requirements) {
      const scenarioRows = requirement.scenarios.map((scenario) => {
        capScenarios++;
        if (scenario.coveredBy.length > 0) capCovered++;
        const coveredByText =
          scenario.coveredBy.length > 0
            ? scenario.coveredBy.map((c) => `"${c.testDescription}" (${c.location})`).join('<br>')
            : 'Not covered';
        return `| ${scenario.name} | ${coveredByText} |`;
      });
      reqBlocks.push(
        [`### Requirement: ${requirement.name}`, '', '| Scenario | Covered By |', '| --- | --- |', ...scenarioRows].join(
          '\n',
        ),
      );
    }

    totalScenarios += capScenarios;
    totalCovered += capCovered;
    const capPercent = capScenarios > 0 ? Math.round((capCovered / capScenarios) * 100) : 100;
    summaryRows.push(
      `| ${capability.name} | ${capability.requirements.length} | ${capScenarios} | ${capCovered} | ${capPercent}% |`,
    );

    sections.push(`## ${capability.name}\n\n${reqBlocks.join('\n\n')}`);
  }

  const totalPercent = totalScenarios > 0 ? Math.round((totalCovered / totalScenarios) * 100) : 100;

  const header = [
    '# Trace Matrix',
    '',
    'Auto-generated by `npm run trace` — do not hand-edit. See `openspec/changes/archive/*/add-e2e-trace-matrix/design.md` for how this is produced.',
    '',
    '## Summary',
    '',
    '| Capability | Requirements | Scenarios | Covered | Coverage |',
    '| --- | --- | --- | --- | --- |',
    ...summaryRows,
    `| **Total** | **${capabilities.reduce((n, c) => n + c.requirements.length, 0)}** | **${totalScenarios}** | **${totalCovered}** | **${totalPercent}%** |`,
  ].join('\n');

  const output = `${header}\n\n${sections.join('\n\n')}\n`;

  writeFileSync(OUTPUT_PATH, output);
  console.log(`✓ Wrote ${OUTPUT_PATH} — ${totalCovered}/${totalScenarios} scenarios covered (${totalPercent}%)`);
}

main();
