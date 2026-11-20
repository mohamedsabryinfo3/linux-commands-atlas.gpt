const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const dataSource = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
const dataJson = JSON.parse(fs.readFileSync(path.join(root, 'data.json'), 'utf8'));
const context = { window: {} };
vm.runInNewContext(dataSource, context, { filename: 'data.js' });
const data = context.window.LINUX_DATA;

assert(data, 'window.LINUX_DATA should exist');
assert.equal(data.core.length, 48, 'Core memorization count changed unexpectedly');
assert.equal(data.advancedGroups.reduce((n, g) => n + g.commands.length, 0), 174, 'Advanced reference count mismatch');
assert.equal(data.modules.length, 20, 'Expected 20 learning modules');
assert.equal(data.modules.reduce((n, m) => n + m.topics.length, 0), 204, 'Expected 204 module topics');
assert.equal(data.labs.length, 8, 'Expected 8 labs');
assert.equal(data.distroAtlas.length, 10, 'Expected 10 read-only distro profiles');
assert.equal(dataJson.distroAtlas.length, 10, 'JSON distro library mismatch');
assert(data.distroAtlas.every(x => x.links.length > 0 && /^https:\/\//.test(x.links[0][1])), 'Each distro profile needs official links');
assert(data.distroAtlas.every(x => x.command && x.commandNote && x.relationship && x.why), 'A distro profile is missing key explanation fields');
assert(html.includes('id="view-families"'), 'Distribution Explorer view is missing');
assert(html.includes('data-view="families"'), 'Distribution Explorer navigation is missing');
assert(app.includes("if(view==='families') renderDistroAtlas()"), 'Distribution Explorer route handler is missing');
assert(app.includes("$('#familySearch').addEventListener('input',renderDistroAtlas)"), 'Distribution search is missing');
assert(html.includes('لا تدخل في تقدمك'), 'Read-only progress note is missing');

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
assert.equal(duplicates.length, 0, `Duplicate HTML IDs: ${duplicates.join(', ')}`);

console.log('VALIDATION PASSED');
console.log(`Core commands: ${data.core.length}`);
console.log(`Advanced reference entries: ${data.advancedGroups.reduce((n, g) => n + g.commands.length, 0)}`);
console.log(`Learning modules/topics: ${data.modules.length}/${data.modules.reduce((n, m) => n + m.topics.length, 0)}`);
console.log(`Labs: ${data.labs.length}`);
console.log(`Read-only distro profiles: ${data.distroAtlas.length}`);
console.log('Unique HTML IDs: ' + ids.length);
