const assert=require('node:assert/strict');
const{profileSimilarity:score,rankCandidates,compatiblePosition}=require('../docs/similarity.js');
const stats={minutes:900,goals:10,xg:8,xa:6,recoveries:50,tackles:20,cbi:40,saves:100,goals_conceded:20};
const p=(overrides={},group='FWD',name='Player')=>({group,name,stats:{...stats,...overrides}});
let result=score(p(),p());
assert.equal(result.overall.score,100);assert.equal(result.offensive.score,100);assert.equal(result.defensive.score,100);
const double=Object.fromEntries(Object.entries(stats).map(([k,v])=>[k,k==='minutes'?v:v*2]));
assert.equal(score(p(),p(double)).overall.score,50);assert.equal(score(p(double),p()).overall.score,50);
assert.equal(score(p(),p({...double,minutes:1800})).overall.score,100);
const defenceDouble={recoveries:100,tackles:40,cbi:80};
assert.equal(score(p(),p(defenceDouble)).overall.score,85);
assert.equal(score(p({},'MID'),p(defenceDouble,'MID')).overall.score,75);
assert.equal(score(p({},'DEF'),p(defenceDouble,'DEF')).overall.score,65);
assert.equal(score(p({},'GK'),p({},'GK')).overall.score,100);
assert.equal(score(p({},'GK'),p({},'GK')).offensive.score,null);
assert.equal(score(p({},'GK'),p()).overall.score,null);
assert.equal(score(p(),p({minutes:899})).overall.score,null);
result=score(p(),p({xa:null}));assert.equal(result.offensive.score,100);assert.equal(result.offensive.used,2);assert.equal(result.offensive.total,3);
result=score(p(),p({recoveries:null,tackles:null}));assert.equal(result.defensive.score,null);assert.equal(result.overall.score,null);
const zero={goals:0,xg:0,xa:0,recoveries:0,tackles:0,cbi:0};
assert.equal(score(p(zero),p(zero)).overall.score,null);
assert.equal(score(p(),p(zero)).overall.score,0);
result=score(p({goals:0}),p({goals:0}));assert.equal(result.offensive.used,2);assert.equal(result.offensive.score,100);
assert.equal(score(p(),p({goals:-1,xg:null})).offensive.score,null);
for(const group of ['DEF','MID','GK']){
 assert.equal(compatiblePosition(p(),p({},group)),false);
 assert.equal(score(p(),p({},group)).overall.score,null);
 assert.equal(rankCandidates(p(),[p({},group)]).length,0);
}
assert.equal(compatiblePosition(p({},'FWD','Dennis Bergkamp'),{...p({},'MID'),role:'AM'}),true);
assert.equal(compatiblePosition(p({},'FWD','Thierry Henry'),{...p({},'MID'),role:'AM'}),false);
const candidates=Array.from({length:12},(_,i)=>p({goals:10+i,xg:8+i,xa:6+i},'FWD','Candidate '+i));
const ranked=rankCandidates(p(),candidates);
assert.equal(ranked.length,7);assert.equal(ranked[0].player.name,'Candidate 0');
assert.ok(ranked.every((r,i)=>i===0||ranked[i-1].similarity.overall.value>=r.similarity.overall.value));
assert.equal(rankCandidates(p(),candidates.slice(0,3)).length,3);
assert.equal(rankCandidates(p(),[]).length,0);
assert.throws(()=>rankCandidates(p(),candidates,'unknown'));
assert.equal(candidates.length,12); // Ranking must not mutate the input universe.
const d=require('../docs/arsenal-data.json');
for(const original of d.historical){
 for(const candidate of d.external.slice(0,30)){
  const s=score(original,candidate);
  for(const key of ['overall','offensive','defensive'])assert.ok(s[key].score===null||(s[key].score>=0&&s[key].score<=100));
 }
}
console.log('profile_v2: role weights, attack/defence, GK, missing data, zeroes, normalization and top-seven ranking passed.');
