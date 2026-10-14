import { readdir, readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const directories = ['apps', 'packages', 'docs', 'tests', 'scripts', 'docker'];
const rootFiles = ['README.md', 'CONTRIBUTING.md', 'AGENTS.md', '.env.example', '.env.docker.example', '.gitignore', '.dockerignore', '.nvmrc', 'Dockerfile', 'compose.yaml', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'tsconfig.base.json', 'playwright.config.ts'];
const media = ['deliverables/README.md', 'deliverables/oye-demo-v2.mp4', 'deliverables/oye-demo.vtt', 'deliverables/oye-demo-script.md', 'deliverables/oye-demo-poster.jpg'];
const excluded = new Set(['node_modules', 'dist', '.git', '.data', 'test-results', 'playwright-report', '__pycache__', 'coverage', '.cache', '.pnpm-store']);
const paths = [];
async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    if (excluded.has(entry.name) || entry.name === '.DS_Store' || entry.name.startsWith('.env') || /\.(?:log|tmp|tsbuildinfo|pyc|pyo)$/.test(entry.name) || /\.sqlite(?:-(?:shm|wal))?$/.test(entry.name) || entry.isSymbolicLink()) continue;
    const file = join(folder, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.isFile()) paths.push(file);
  }
}
for (const folder of directories) await walk(join(root, folder));
for (const file of [...rootFiles, ...media]) paths.push(join(root, file));

const entries = [];
for (const file of [...new Set(paths)].sort()) {
  const name = relative(root, file).split(sep).join('/');
  const bytes = await readFile(file);
  if (bytes.length > 32 * 1024 * 1024) throw new Error('Source entry exceeds package bound: ' + name);
  if (!/\.(png|jpe?g|webp|mp4|mp3|woff2?|ttf|ico)$/i.test(name)) {
    const content = bytes.toString('utf8');
    if (/sk-(?:or-v1-|proj-)?[A-Za-z0-9_-]{24,}/.test(content) || /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content)) throw new Error('Potential credential in source file: ' + name);
  }
  entries.push({ name, bytes });
}
const manifest = { format: 1, name: 'oye', defaultProvider: 'openai', packageManager: 'pnpm@12.11.2', excluded: ['credentials', 'saved learner data', 'dependencies', 'build outputs', 'Git metadata'], files: entries.map(({name,bytes}) => ({path:name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')})) };
entries.push({name:'SOURCE-MANIFEST.json',bytes:Buffer.from(JSON.stringify(manifest,null,2)+'\n')});
entries.sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0);

// A standard UTF-8 ZIP, implemented with Node built-ins so packaging needs no
// additional CLI or library. Fixed ZIP timestamps keep equal inputs reproducible.
const table = Uint32Array.from({length:256},(_,n)=>{let v=n;for(let i=0;i<8;i++)v=v&1?0xedb88320^(v>>>1):v>>>1;return v>>>0;});
const crc32 = bytes => {let crc=0xffffffff;for(const byte of bytes)crc=table[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;};
const chunks=[];const central=[];let offset=0;
for(const entry of entries){
  const name=Buffer.from('oye/'+entry.name);const compressed=deflateRawSync(entry.bytes,{level:6});
  const method=compressed.length<entry.bytes.length?8:0;const data=method===8?compressed:entry.bytes;const crc=crc32(entry.bytes);
  const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6);local.writeUInt16LE(method,8);local.writeUInt16LE((46<<9)|(1<<5)|1,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(data.length,18);local.writeUInt32LE(entry.bytes.length,22);local.writeUInt16LE(name.length,26);
  chunks.push(local,name,data);
  const record=Buffer.alloc(46);record.writeUInt32LE(0x02014b50,0);record.writeUInt16LE(20,4);record.writeUInt16LE(20,6);record.writeUInt16LE(0x800,8);record.writeUInt16LE(method,10);record.writeUInt16LE((46<<9)|(1<<5)|1,14);record.writeUInt32LE(crc,16);record.writeUInt32LE(data.length,20);record.writeUInt32LE(entry.bytes.length,24);record.writeUInt16LE(name.length,28);record.writeUInt32LE(offset,42);central.push(record,name);
  offset+=local.length+name.length+data.length;
}
const directory=Buffer.concat(central);const end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
const archive=Buffer.concat([...chunks,directory,end]);const output=join(root,'deliverables');await mkdir(output,{recursive:true});
await writeFile(join(output,'oye-source.zip.tmp'),archive);await rename(join(output,'oye-source.zip.tmp'),join(output,'oye-source.zip'));
const checksum=createHash('sha256').update(archive).digest('hex');await writeFile(join(output,'oye-source.zip.sha256'),checksum+'  oye-source.zip\n');
console.log(JSON.stringify({archive:'deliverables/oye-source.zip',entries:entries.length,bytes:archive.length,defaultProvider:'openai',checksum}));
