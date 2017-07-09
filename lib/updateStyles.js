const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;

exec(`cd ${path.resolve(__dirname, 'tmp')} && git clone https://github.com/citation-style-language/styles.git`);

const brandNewFiles = [];
const newfiles = [];
const oldFiles = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../src/vendor/citationstyles.php'), {encoding: 'utf-8'})
    .match(/json_decode\('(\[.+\])', true\);/)[1]
    .replace(/(\\')/g, '\'')
);

const files = fs.readdirSync(path.resolve(__dirname, 'tmp/styles/'));

files.forEach(f => {
    if (f.substr(-4) !== '.csl') return;
    const data = fs.readFileSync(path.resolve(__dirname, 'tmp/styles/', f), {encoding: 'utf-8'});
    const label = data.match(/<title>(.+)<\/title>/)[1];
    const value = f.substr(0, f.length - 4);
    newfiles.push({label, value});
    if (!oldFiles.find(g => g.value === value)) brandNewFiles.push(label);
});

const json =
    JSON.stringify(newfiles)
    .replace(/(')/g, '\\$1')
    .replace(/(&amp;)/g, '&');
const contents = `<?php\n$citation_styles = json_decode('${json}', true);\n?>`;

fs.writeFileSync(path.resolve(__dirname, '../src/vendor/citationstyles.php'), contents);
exec(`rm -rf ${path.resolve(__dirname, 'tmp/styles')}`);

brandNewFiles.forEach(f => console.log(f));
