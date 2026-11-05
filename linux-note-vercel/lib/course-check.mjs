import assert from 'node:assert/strict';
import {missions,initialFor,passed} from './course.mjs';
import {run,saveFile,pathOf,seed} from './engine.mjs';
let failures=[];for(const m of missions){let s=initialFor(m);for(const st of m.steps){let closed=false;const cmd=st.answer;if(typeof cmd==='object'){s=saveFile(s,pathOf(s,cmd.path),cmd.content);closed=true}else if(cmd===':q!'){s.last={out:'',code:0};closed=true}else s=run(s,cmd);if(!passed(s,st,typeof cmd==='string'?cmd:'vi',closed)){failures.push({id:m.id,title:m.title,cmd,last:s.last,expect:st.expect});break}}}
console.log(JSON.stringify({missions:missions.length,steps:missions.reduce((n,m)=>n+m.steps.length,0),failures},null,2));
assert.equal(failures.length,0);
let s=seed();s=run(s,'mkdir test');s=run(s,'echo "first" > test/a.txt');s=run(s,'echo second >> test/a.txt');s=run(s,'cat test/a.txt | grep second | wc -l');assert.equal(s.last.out,'1\n');s=run(s,'cp -r test copy');s=run(s,'rm -r test');assert.equal(s.fs['/home/student/copy/a.txt'].content,'first\nsecond\n');s=run(s,'cd missing');assert.equal(s.last.code,1);assert.equal(s.cwd,'/home/student');s=run(s,'echo "unterminated');assert.equal(s.last.code,1);s=run(s,'chmod 000 copy/a.txt');s=run(s,'cat copy/a.txt');assert.equal(s.last.code,1);s=run(s,'echo x > /etc/passwd');assert.equal(s.last.code,1);console.log('Filesystem, pipelines, permissions and error paths passed.');
