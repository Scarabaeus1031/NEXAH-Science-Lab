const fs = require('node:fs');
const path = require('node:path');

const source = path.join(__dirname, '..', '35_NEXAH_ORIENTATION_METHOD_POSITION_PAPER_DRAFT_2026-10-12.md');
const preview = path.join(__dirname, 'DRAFTS', 'A0_PAPER_E_WORKING_DRAFT.md');
const manuscript = fs.readFileSync(source);

if (process.argv.includes('--check')) {
  if (!manuscript.equals(fs.readFileSync(preview))) {
    throw new Error('Paper E preview is out of date. Run node build-a0-paper-e-draft.cjs.');
  }
} else {
  fs.writeFileSync(preview, manuscript);
}
