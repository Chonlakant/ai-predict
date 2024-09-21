(()=>{"use strict";var t={92:(t,e,r)=>{var n=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==r.g)return r.g;throw new Error("unable to locate global object")}();t.exports=e=n.fetch,n.fetch&&(e.default=n.fetch.bind(n)),e.Headers=n.Headers,e.Request=n.Request,e.Response=n.Response}},e={};function r(n){var o=e[n];if(void 0!==o)return o.exports;var i=e[n]={exports:{}};return t[n](i,i.exports,r),i.exports}r.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return r.d(e,{a:e}),e},r.d=(t,e)=>{for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);class n{constructor(t){this.body=t.body,this.queries=t.queries,this.headers=t.headers,this.method=t.method,this.path=t.path,this.secret=t.secret}async json(){return JSON.parse(this.body)}}class o{constructor(t,e){this.status=e?.status??200,this.body=t,this.headers={"Content-Type":"application/json","Access-Control-Allow-Origin":"*",...e?.headers}}}var i=r(92),s=r.n(i);async function a(t,e,r="gpt-4o"){const n=await s()("https://api.red-pill.ai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({messages:[{role:"user",content:t}],model:r})}),o=await n.json();if(o.error)throw new Error(o.error);return o.choices[0].message.content}async function c(t){const e=t.queries,r=function(t){const e=t.secret||{};return"string"==typeof e.apiKey?e.apiKey:"sk-qVBlJkO3e99t81623PsB0zHookSQJxU360gDMooLenN01gv2"}(t),n=e.url?e.url[0]:"",i=e.query?e.query[0]:"",c=!!e.generatePredictions&&"true"===e.generatePredictions[0];if(n)try{const t=await async function(t){const e=await s()(t);return e.headers.get("content-type"),await e.text()}(n);if(c){const e=await async function(t,e){const r=`Based on the following prediction market data, generate 5 new, creative prediction questions that are related to the themes present in the data but not exact duplicates. Each question should be specific, measurable, and have a clear timeframe. Here's the data:\n\n${t}\n\nNew Prediction Questions:`;return(await a(r,e)).split("\n").filter((t=>""!==t.trim())).map((t=>t.replace(/^\d+\.\s*/,"")))}(t,r);return new o(JSON.stringify({predictions:e}))}{const e=await async function(t,e){const r=`Extract key information from the following content. Provide a JSON object with relevant fields such as title, author, date, main points, and any other important details. If the content is not an article, describe what it contains:\n\n${t}`,n=await a(r,e);return JSON.parse(n)}(t,r);return new o(JSON.stringify(e))}}catch(t){return console.error("Error processing content:",t),new o(JSON.stringify({error:"Failed to process content"}))}else{if(!i)return new o(JSON.stringify({error:"Either URL or query parameter is required"}));try{const t=await async function(t,e){const r=`Please answer the following question to the best of your ability: ${t}`;return await a(r,e)}(i,r);return new o(JSON.stringify({answer:t}))}catch(t){return console.error("Error answering question:",t),new o(JSON.stringify({error:"Failed to answer question"}))}}}(async function(t){return await async function(t,e){const r=JSON.parse(e);let i;const s=r.method,a=new n(r);return"GET"==s&&t.GET?i=await t.GET(a):"POST"==s&&t.POST?i=await t.POST(a):"PATCH"==s&&t.PATCH?i=await t.PATCH(a):"PUT"==s&&t.PUT?i=await t.PUT(a):(i=new o("Not Found"),i.status=404),JSON.stringify(i)}({GET:c},t)}).apply(null,globalThis.scriptArgs).then((t=>globalThis.scriptOutput=t)).catch((t=>globalThis.scriptOutput=JSON.stringify({error:t,success:!1})))})();