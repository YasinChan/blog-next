const V=Object.entries,et=Object.fromEntries,st="ENTRIES",L="KEYS",T="VALUES",_="";class D{set;_type;_path;constructor(t,s){const n=t._tree,o=Array.from(n.keys());this.set=t,this._type=s,this._path=o.length>0?[{node:n,keys:o}]:[]}next(){const t=this.dive();return this.backtrack(),t}dive(){if(this._path.length===0)return{done:!0,value:void 0};const{node:t,keys:s}=E(this._path);if(E(s)===_)return{done:!1,value:this.result()};const n=t.get(E(s));return this._path.push({node:n,keys:Array.from(n.keys())}),this.dive()}backtrack(){if(this._path.length===0)return;const t=E(this._path).keys;t.pop(),!(t.length>0)&&(this._path.pop(),this.backtrack())}key(){return this.set._prefix+this._path.map(({keys:t})=>E(t)).filter(t=>t!==_).join("")}value(){return E(this._path).node.get(_)}result(){switch(this._type){case T:return this.value();case L:return this.key();default:return[this.key(),this.value()]}}[Symbol.iterator](){return this}}const E=e=>e[e.length-1],nt=(e,t,s)=>{const n=new Map;if(t===void 0)return n;const o=t.length+1,u=o+s,i=new Uint8Array(u*o).fill(s+1);for(let r=0;r<o;++r)i[r]=r;for(let r=1;r<u;++r)i[r*o]=r;return R(e,t,s,n,i,1,o,""),n},R=(e,t,s,n,o,u,i,r)=>{const d=u*i;t:for(const c of e.keys())if(c===_){const a=o[d-1];a<=s&&n.set(r,[e.get(c),a])}else{let a=u;for(let h=0;h<c.length;++h,++a){const g=c[h],m=i*a,p=m-i;let l=o[m];const f=Math.max(0,a-s-1),y=Math.min(i-1,a+s);for(let F=f;F<y;++F){const v=g!==t[F],z=o[p+F]+ +v,A=o[p+F+1]+1,w=o[m+F]+1,j=o[m+F+1]=Math.min(z,A,w);j<l&&(l=j)}if(l>s)continue t}R(e.get(c),t,s,n,o,a,i,r+c)}};class C{_tree;_prefix;_size=void 0;constructor(t=new Map,s=""){this._tree=t,this._prefix=s}atPrefix(t){if(!t.startsWith(this._prefix))throw new Error("Mismatched prefix");const[s,n]=x(this._tree,t.slice(this._prefix.length));if(s===void 0){const[o,u]=O(n);for(const i of o.keys())if(i!==_&&i.startsWith(u)){const r=new Map;return r.set(i.slice(u.length),o.get(i)),new C(r,t)}}return new C(s,t)}clear(){this._size=void 0,this._tree.clear()}delete(t){return this._size=void 0,ot(this._tree,t)}entries(){return new D(this,st)}forEach(t){for(const[s,n]of this)t(s,n,this)}fuzzyGet(t,s){return nt(this._tree,t,s)}get(t){const s=k(this._tree,t);return s!==void 0?s.get(_):void 0}has(t){const s=k(this._tree,t);return s!==void 0&&s.has(_)}keys(){return new D(this,L)}set(t,s){if(typeof t!="string")throw new Error("key must be a string");return this._size=void 0,I(this._tree,t).set(_,s),this}get size(){if(this._size)return this._size;this._size=0;const t=this.entries();for(;!t.next().done;)this._size+=1;return this._size}update(t,s){if(typeof t!="string")throw new Error("key must be a string");this._size=void 0;const n=I(this._tree,t);return n.set(_,s(n.get(_))),this}fetch(t,s){if(typeof t!="string")throw new Error("key must be a string");this._size=void 0;const n=I(this._tree,t);let o=n.get(_);return o===void 0&&n.set(_,o=s()),o}values(){return new D(this,T)}[Symbol.iterator](){return this.entries()}static from(t){const s=new C;for(const[n,o]of t)s.set(n,o);return s}static fromObject(t){return C.from(Object.entries(t))}}const x=(e,t,s=[])=>{if(t.length===0||e==null)return[e,s];for(const n of e.keys())if(n!==_&&t.startsWith(n))return s.push([e,n]),x(e.get(n),t.slice(n.length),s);return s.push([e,t]),x(void 0,"",s)},k=(e,t)=>{if(t.length===0||e==null)return e;for(const s of e.keys())if(s!==_&&t.startsWith(s))return k(e.get(s),t.slice(s.length))},I=(e,t)=>{const s=t.length;t:for(let n=0;e&&n<s;){for(const u of e.keys())if(u!==_&&t[n]===u[0]){const i=Math.min(s-n,u.length);let r=1;for(;r<i&&t[n+r]===u[r];)++r;const d=e.get(u);if(r===u.length)e=d;else{const c=new Map;c.set(u.slice(r),d),e.set(t.slice(n,n+r),c),e.delete(u),e=c}n+=r;continue t}const o=new Map;return e.set(t.slice(n),o),o}return e},ot=(e,t)=>{const[s,n]=x(e,t);if(s!==void 0){if(s.delete(_),s.size===0)W(n);else if(s.size===1){const[o,u]=s.entries().next().value;q(n,o,u)}}},W=e=>{if(e.length===0)return;const[t,s]=O(e);if(t.delete(s),t.size===0)W(e.slice(0,-1));else if(t.size===1){const[n,o]=t.entries().next().value;n!==_&&q(e.slice(0,-1),n,o)}},q=(e,t,s)=>{if(e.length===0)return;const[n,o]=O(e);n.set(o+t,s),n.delete(o)},O=e=>e[e.length-1],ut=(e,t)=>{const s=e._idToShortId.get(t);if(s!=null)return e._storedFields.get(s)},it=/[\n\r -#%-*,-/:;?@[-\]_{}\u00A0\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u1680\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2000-\u200A\u2010-\u2029\u202F-\u2043\u2045-\u2051\u2053-\u205F\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u3000-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+/u,M="or",$="and",rt="and_not",ct=(e,t)=>{e.includes(t)||e.push(t)},N=(e,t)=>{for(const s of t)e.includes(s)||e.push(s)},P=({score:e},{score:t})=>t-e,lt=()=>new Map,b=e=>{const t=new Map;for(const s of Object.keys(e))t.set(parseInt(s,10),e[s]);return t},G=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)?e[t]:void 0,ht={[M]:(e,t)=>{for(const s of t.keys()){const n=e.get(s);if(n==null)e.set(s,t.get(s));else{const{score:o,terms:u,match:i}=t.get(s);n.score=n.score+o,n.match=Object.assign(n.match,i),N(n.terms,u)}}return e},[$]:(e,t)=>{const s=new Map;for(const n of t.keys()){const o=e.get(n);if(o==null)continue;const{score:u,terms:i,match:r}=t.get(n);N(o.terms,i),s.set(n,{score:o.score+u,terms:o.terms,match:Object.assign(o.match,r)})}return s},[rt]:(e,t)=>{for(const s of t.keys())e.delete(s);return e}},dt=(e,t,s,n,o,u)=>{const{k:i,b:r,d}=u;return Math.log(1+(s-t+.5)/(t+.5))*(d+e*(i+1)/(e+i*(1-r+r*n/o)))},at=e=>(t,s,n)=>{const o=typeof e.fuzzy=="function"?e.fuzzy(t,s,n):e.fuzzy||!1,u=typeof e.prefix=="function"?e.prefix(t,s,n):e.prefix===!0;return{term:t,fuzzy:o,prefix:u}},H=(e,t,s,n)=>{for(const o of Object.keys(e._fieldIds))if(e._fieldIds[o]===s){e._options.logger("warn",`SlimSearch: document with ID ${e._documentIds.get(t)} has changed before removal: term "${n}" was not present in field "${o}". Removing a document after it has changed can corrupt the index!`,"version_conflict");return}},ft=(e,t,s,n)=>{if(!e._index.has(n)){H(e,s,t,n);return}const o=e._index.fetch(n,lt),u=o.get(t);u==null||u.get(s)==null?H(e,s,t,n):u.get(s)<=1?u.size<=1?o.delete(t):u.delete(s):u.set(s,u.get(s)-1),e._index.get(n).size===0&&e._index.delete(n)},gt={k:1.2,b:.7,d:.5},mt={idField:"id",extractField:(e,t)=>e[t],tokenize:e=>e.split(it),processTerm:e=>e.toLowerCase(),fields:void 0,searchOptions:void 0,storeFields:[],logger:(e,t)=>{typeof console?.[e]=="function"&&console[e](t)},autoVacuum:!0},J={combineWith:M,prefix:!1,fuzzy:!1,maxFuzzy:6,boost:{},weights:{fuzzy:.45,prefix:.375},bm25:gt},pt={combineWith:$,prefix:(e,t,s)=>t===s.length-1},Ft={batchSize:1e3,batchWait:10},U={minDirtFactor:.1,minDirtCount:20},_t={...Ft,...U},K=Symbol("*"),yt=(e,t)=>{const s=new Map,n={...e._options.searchOptions,...t};for(const[o,u]of e._documentIds){const i=n.boostDocument?n.boostDocument(u,"",e._storedFields.get(o)):1;s.set(o,{score:i,terms:[],match:{}})}return s},X=(e,t=M)=>{if(e.length===0)return new Map;const s=t.toLowerCase(),n=ht[s];if(!n)throw new Error(`Invalid combination operator: ${t}`);return e.reduce(n)||new Map},S=(e,t,s,n,o,u,i,r,d=new Map)=>{if(o==null)return d;for(const c of Object.keys(u)){const a=u[c],h=e._fieldIds[c],g=o.get(h);if(g==null)continue;let m=g.size;const p=e._avgFieldLength[h];for(const l of g.keys()){if(!e._documentIds.has(l)){ft(e,h,l,s),m-=1;continue}const f=i?i(e._documentIds.get(l),s,e._storedFields.get(l)):1;if(!f)continue;const y=g.get(l),F=e._fieldLength.get(l)[h],v=dt(y,m,e._documentCount,F,p,r),z=n*a*f*v,A=d.get(l);if(A){A.score+=z,ct(A.terms,t);const w=G(A.match,s);w?w.push(c):A.match[s]=[c]}else d.set(l,{score:z,terms:[t],match:{[s]:[c]}})}}return d},At=(e,t,s)=>{const n={...e._options.searchOptions,...s},o=(n.fields||e._options.fields).reduce((l,f)=>({...l,[f]:G(n.boost,f)||1}),{}),{boostDocument:u,weights:i,maxFuzzy:r,bm25:d}=n,{fuzzy:c,prefix:a}={...J.weights,...i},h=e._index.get(t.term),g=S(e,t.term,t.term,1,h,o,u,d);let m,p;if(t.prefix&&(m=e._index.atPrefix(t.term)),t.fuzzy){const l=t.fuzzy===!0?.2:t.fuzzy,f=l<1?Math.min(r,Math.round(t.term.length*l)):l;f&&(p=e._index.fuzzyGet(t.term,f))}if(m)for(const[l,f]of m){const y=l.length-t.term.length;if(!y)continue;p?.delete(l);const F=a*l.length/(l.length+.3*y);S(e,t.term,l,F,f,o,u,d,g)}if(p)for(const l of p.keys()){const[f,y]=p.get(l);if(!y)continue;const F=c*l.length/(l.length+y);S(e,t.term,l,F,f,o,u,d,g)}return g},Y=(e,t,s={})=>{if(t===K)return yt(e,s);if(typeof t!="string"){const a={...s,...t,queries:void 0},h=t.queries.map(g=>Y(e,g,a));return X(h,a.combineWith)}const{tokenize:n,processTerm:o,searchOptions:u}=e._options,i={tokenize:n,processTerm:o,...u,...s},{tokenize:r,processTerm:d}=i,c=r(t).flatMap(a=>d(a)).filter(a=>!!a).map(at(i)).map(a=>At(e,a,i));return X(c,i.combineWith)},Q=(e,t,s={})=>{const n=Y(e,t,s),o=[];for(const[u,{score:i,terms:r,match:d}]of n){const c=r.length||1,a={id:e._documentIds.get(u),score:i*c,terms:Object.keys(d),queryTerms:r,match:d};Object.assign(a,e._storedFields.get(u)),(s.filter==null||s.filter(a))&&o.push(a)}return t===K&&s.boostDocument==null&&e._options.searchOptions.boostDocument==null||o.sort(P),o},Ct=(e,t,s={})=>{s={...e._options.autoSuggestOptions,...s};const n=new Map;for(const{score:u,terms:i}of Q(e,t,s)){const r=i.join(" "),d=n.get(r);d!=null?(d.score+=u,d.count+=1):n.set(r,{score:u,terms:i,count:1})}const o=[];for(const[u,{score:i,terms:r,count:d}]of n)o.push({suggestion:u,terms:r,score:i/d});return o.sort(P),o};class Et{_options;_index;_documentCount;_documentIds;_idToShortId;_fieldIds;_fieldLength;_avgFieldLength;_nextId;_storedFields;_dirtCount;_currentVacuum;_enqueuedVacuum;_enqueuedVacuumConditions;constructor(t){if(t?.fields==null)throw new Error('SlimSearch: option "fields" must be provided');const s=t.autoVacuum==null||t.autoVacuum===!0?_t:t.autoVacuum;this._options={...mt,...t,autoVacuum:s,searchOptions:{...J,...t.searchOptions||{}},autoSuggestOptions:{...pt,...t.autoSuggestOptions||{}}},this._index=new C,this._documentCount=0,this._documentIds=new Map,this._idToShortId=new Map,this._fieldIds={},this._fieldLength=new Map,this._avgFieldLength=[],this._nextId=0,this._storedFields=new Map,this._dirtCount=0,this._currentVacuum=null,this._enqueuedVacuum=null,this._enqueuedVacuumConditions=U,this.addFields(this._options.fields)}get isVacuuming(){return this._currentVacuum!=null}get dirtCount(){return this._dirtCount}get dirtFactor(){return this._dirtCount/(1+this._documentCount+this._dirtCount)}get documentCount(){return this._documentCount}get termCount(){return this._index.size}toJSON(){const t=[];for(const[s,n]of this._index){const o={};for(const[u,i]of n)o[u]=Object.fromEntries(i);t.push([s,o])}return{documentCount:this._documentCount,nextId:this._nextId,documentIds:Object.fromEntries(this._documentIds),fieldIds:this._fieldIds,fieldLength:Object.fromEntries(this._fieldLength),averageFieldLength:this._avgFieldLength,storedFields:Object.fromEntries(this._storedFields),dirtCount:this._dirtCount,index:t,serializationVersion:2}}addFields(t){for(let s=0;s<t.length;s++)this._fieldIds[t[s]]=s}}const zt=({index:e,documentCount:t,nextId:s,documentIds:n,fieldIds:o,fieldLength:u,averageFieldLength:i,storedFields:r,dirtCount:d,serializationVersion:c},a)=>{if(c!==1&&c!==2)throw new Error("SlimSearch: cannot deserialize an index created with an incompatible version");const h=new Et(a);h._documentCount=t,h._nextId=s,h._documentIds=b(n),h._idToShortId=new Map,h._fieldIds=o,h._fieldLength=b(u),h._avgFieldLength=i,h._storedFields=b(r),h._dirtCount=d||0,h._index=new C;for(const[g,m]of h._documentIds)h._idToShortId.set(m,g);for(const[g,m]of e){const p=new Map;for(const l of Object.keys(m)){let f=m[l];c===1&&(f=f.ds),p.set(parseInt(l,10),b(f))}h._index.set(g,p)}return h},B=(e,t)=>{const s=e.toLowerCase(),n=t.toLowerCase(),o=[];let u=0,i=0;const r=(c,a=!1)=>{let h="";i===0?h=c.length>20?`… ${c.slice(-20)}`:c:a?h=c.length+i>100?`${c.slice(0,100-i)}… `:c:h=c.length>20?`${c.slice(0,20)} … ${c.slice(-20)}`:c,h&&o.push(h),i+=h.length,a||(o.push(["mark",t]),i+=t.length,i>=100&&o.push(" …"))};let d=s.indexOf(n,u);if(d===-1)return null;for(;d>=0;){const c=d+n.length;if(r(e.slice(u,d)),u=c,i>100)break;d=s.indexOf(n,u)}return i<100&&r(e.slice(u),!0),o},wt=(e,t)=>t.contents.reduce((s,[,n])=>s+n,0)-e.contents.reduce((s,[,n])=>s+n,0),xt=(e,t)=>Math.max(...t.contents.map(([,s])=>s))-Math.max(...e.contents.map(([,s])=>s)),Z=(e,t,s={})=>{const n={};return Q(t,e,{boost:{h:2,t:1,c:4},prefix:!0,...s}).forEach(o=>{const{id:u,terms:i,score:r}=o,d=u.includes("@"),c=u.includes("#"),[a,h]=u.split(/[#@]/),g=Number(a),m=i.sort((l,f)=>l.length-f.length).filter((l,f)=>i.slice(f+1).every(y=>!y.includes(l))),{contents:p}=n[g]??={title:"",contents:[]};if(d)p.push([{type:"customField",id:g,index:h,display:m.map(l=>o.c.map(f=>B(f,l))).flat().filter(l=>l!==null)},r]);else{const l=m.map(f=>B(o.h,f)).filter(f=>f!==null);if(l.length&&p.push([{type:c?"heading":"title",id:g,...c&&{anchor:h},display:l},r]),"t"in o)for(const f of o.t){const y=m.map(F=>B(f,F)).filter(F=>F!==null);y.length&&p.push([{type:"text",id:g,...c&&{anchor:h},display:y},r])}}}),V(n).sort(([,o],[,u])=>"max"==="total"?wt(o,u):xt(o,u)).map(([o,{title:u,contents:i}])=>{if(!u){const r=ut(t,o);r&&(u=r.h)}return{title:u,contents:i.map(([r])=>r)}})},tt=(e,t,s={})=>Ct(t,e,{fuzzy:.2,maxFuzzy:3,...s}).map(({suggestion:n})=>n),bt=et(V(JSON.parse("{\"/\":{\"documentCount\":84,\"nextId\":84,\"documentIds\":{\"0\":\"1\",\"1\":\"1#此博客\",\"2\":\"1#todo\",\"3\":\"2\",\"4\":\"2#我\",\"5\":\"2#技术栈\",\"6\":\"2#好玩\",\"7\":\"2#轮子\",\"8\":\"2#友链\",\"9\":\"2#联系我\",\"10\":\"3\",\"11\":\"3#简述\",\"12\":\"3#细节\",\"13\":\"4\",\"14\":\"5\",\"15\":\"6\",\"16\":\"6#场景\",\"17\":\"6#引入子仓库\",\"18\":\"6#更新子仓库\",\"19\":\"6#克隆一个包含子仓库的仓库\",\"20\":\"6#gitmodules\",\"21\":\"7\",\"22\":\"8\",\"23\":\"8#问题\",\"24\":\"8#原因\",\"25\":\"9\",\"26\":\"10\",\"27\":\"11\",\"28\":\"11#切换字体\",\"29\":\"11#link-preload\",\"30\":\"12\",\"31\":\"12#文案渲染\",\"32\":\"12#输入框\",\"33\":\"12#compositionevent-和-beforeinput\",\"34\":\"12#监听输入事件用于记录内容用于错误统计和回放功能\",\"35\":\"12#禁用部分输入和键盘事件-避免干扰\",\"36\":\"12#文案与输入内容绑定\",\"37\":\"12#限时模式、计时模式、自定义模式下的特定逻辑和输入组件的绑定逻辑\",\"38\":\"12#fisher-yates-洗牌算法\",\"39\":\"12#上传文档\",\"40\":\"12#其他个性化功能逻辑\",\"41\":\"12#标点符号和空格的相互转换功能\",\"42\":\"13\",\"43\":\"13#服务端\",\"44\":\"13#初始化\",\"45\":\"13#nginx-配置\",\"46\":\"13#wss-和-ws\",\"47\":\"13#前端\",\"48\":\"13#初始化-1\",\"49\":\"13#发送消息\",\"50\":\"13#前端传参与服务端获取\",\"51\":\"13#场景分析\",\"52\":\"13#关键点整理\",\"53\":\"13#技术要求\",\"54\":\"13#边界情况\",\"55\":\"13#多房间场景下-websocket-解决方案\",\"56\":\"13#实时消息的传输管理\",\"57\":\"13#房间关闭和玩家退出房间\",\"58\":\"13#边界情况-1\",\"59\":\"14\",\"60\":\"14#切换主题\",\"61\":\"14#预设主题\",\"62\":\"14#自定义主题\",\"63\":\"15\",\"64\":\"15#为什么要个人中心\",\"65\":\"15#注册与登录\",\"66\":\"15#密码加密\",\"67\":\"15#重置密码机制\",\"68\":\"15#登录持久化与-jwt\",\"69\":\"15#jwt\",\"70\":\"15#头像生成\",\"71\":\"15#gravatar\",\"72\":\"15#jdenticon\",\"73\":\"15#用户名密码自动填充\",\"74\":\"15#ip2region\",\"75\":\"15#总结\",\"76\":\"16\",\"77\":\"16#简述\",\"78\":\"17\",\"79\":\"17#word-break\",\"80\":\"17#word-wrap\",\"81\":\"17#总结\",\"82\":\"18\",\"83\":\"19\"},\"fieldIds\":{\"h\":0,\"t\":1,\"c\":2},\"fieldLength\":{\"0\":[1],\"1\":[1,1],\"2\":[1,13],\"3\":[1],\"4\":[1,5],\"5\":[1,6],\"6\":[1,6],\"7\":[1,26],\"8\":[1,4],\"9\":[1,4],\"10\":[2],\"11\":[1],\"12\":[1],\"13\":[2],\"14\":[2],\"15\":[2],\"16\":[1],\"17\":[1],\"18\":[1],\"19\":[1],\"20\":[2],\"21\":[3],\"22\":[4],\"23\":[1],\"24\":[1],\"25\":[7],\"26\":[5],\"27\":[5],\"28\":[1],\"29\":[1],\"30\":[3],\"31\":[1],\"32\":[1],\"33\":[1],\"34\":[1],\"35\":[2],\"36\":[1],\"37\":[3],\"38\":[3],\"39\":[1],\"40\":[1],\"41\":[1],\"42\":[5],\"43\":[1],\"44\":[1],\"45\":[2],\"46\":[3],\"47\":[1],\"48\":[1],\"49\":[1],\"50\":[1],\"51\":[1],\"52\":[1],\"53\":[1],\"54\":[1],\"55\":[3],\"56\":[1],\"57\":[1],\"58\":[1],\"59\":[5],\"60\":[1],\"61\":[1],\"62\":[1],\"63\":[3],\"64\":[1],\"65\":[1],\"66\":[1],\"67\":[1],\"68\":[2],\"69\":[1],\"70\":[1],\"71\":[1],\"72\":[1],\"73\":[1],\"74\":[1],\"75\":[1],\"76\":[4],\"77\":[1],\"78\":[6],\"79\":[2],\"80\":[2],\"81\":[1],\"82\":[4],\"83\":[1,3]},\"averageFieldLength\":[1.7142857142857142,6.919444444444444],\"storedFields\":{\"0\":{\"h\":\"\"},\"1\":{\"h\":\"此博客\",\"t\":[\"基于vuepressGithub主题\"]},\"2\":{\"h\":\"TODO\",\"t\":[\"[x] 加入 task lists 的 markdown 写法\",\"[x] 标签分类\",\"[x] 归档分类\",\"[ ] 优化 SEO\",\"[x] footer\"]},\"3\":{\"h\":\"\"},\"4\":{\"h\":\"我\",\"t\":[\"2017.7 毕业并开始从事前端开发工作\",\"目前就职于TapTap。\"]},\"5\":{\"h\":\"技术栈\",\"t\":[\"HTML、CSS、JavaScript\",\"主力 js 框架vue\"]},\"6\":{\"h\":\"好玩\",\"t\":[\"Quick Meet 一个可以快速找到聚会地点的网站！\",\"Typing 打字网站！\"]},\"7\":{\"h\":\"轮子\",\"t\":[\"wechat-scroll-linkage 微信小程序列表左右联动效果\",\"vue-verification-input vue 验证框，一般用于登录时填写短信验证码的方框，也可以自定义样式。demo\",\"vue-simple-lazyload 一个简易的 vue 图片懒加载，支持加载动效。demo\",\"vuepress-theme-inherit 继承于 @vuepress/theme-default的vuepress 博客主题，支持归档和标签功能，可自动将博客按时间进行排序。也正是本博客使用的主题。\"]},\"8\":{\"h\":\"友链\",\"t\":[\"https://solarhell.com/\",\"拉云低代码工具\"]},\"9\":{\"h\":\"联系我\",\"t\":[\"yasinchan2016@gmail.com\",\"Github\"]},\"10\":{\"h\":\"slate 系列\"},\"11\":{\"h\":\"简述\"},\"12\":{\"h\":\"细节\"},\"13\":{\"h\":\"callback hell\"},\"14\":{\"h\":\"git 本地仓库提交到远程操作\"},\"15\":{\"h\":\"git 子仓库管理\"},\"16\":{\"h\":\"场景\"},\"17\":{\"h\":\"引入子仓库\"},\"18\":{\"h\":\"更新子仓库\"},\"19\":{\"h\":\"克隆一个包含子仓库的仓库\"},\"20\":{\"h\":\".gitmodules\"},\"21\":{\"h\":\"slate 系列 - 不同空格的处理\"},\"22\":{\"h\":\"nginx 关于 gzip 压缩的相关配置\"},\"23\":{\"h\":\"问题\"},\"24\":{\"h\":\"原因\"},\"25\":{\"h\":\"正则 test 和 exec 在 global 模式下的工作机制\"},\"26\":{\"h\":\"slate 系列 - 在编辑器中输入 A 发生了什么\"},\"27\":{\"h\":\"Typing 项目技术总结 - 通用模块（字体切换系列）\"},\"28\":{\"h\":\"切换字体\"},\"29\":{\"h\":\"\"},\"30\":{\"h\":\"Typing 项目技术总结 - 字符输入逻辑\"},\"31\":{\"h\":\"文案渲染\"},\"32\":{\"h\":\"输入框\"},\"33\":{\"h\":\"和\"},\"34\":{\"h\":\"监听输入事件用于记录内容用于错误统计和回放功能\"},\"35\":{\"h\":\"禁用部分输入和键盘事件，避免干扰\"},\"36\":{\"h\":\"文案与输入内容绑定\"},\"37\":{\"h\":\"限时模式、计时模式、自定义模式下的特定逻辑和输入组件的绑定逻辑\"},\"38\":{\"h\":\"Fisher-Yates 洗牌算法\"},\"39\":{\"h\":\"上传文档\"},\"40\":{\"h\":\"其他个性化功能逻辑\"},\"41\":{\"h\":\"标点符号和空格的相互转换功能\"},\"42\":{\"h\":\"Typing 项目技术总结 - 比一比功能之 WebSocket 的使用\"},\"43\":{\"h\":\"服务端\"},\"44\":{\"h\":\"初始化\"},\"45\":{\"h\":\"nginx 配置\"},\"46\":{\"h\":\"wss 和 ws\"},\"47\":{\"h\":\"前端\"},\"48\":{\"h\":\"初始化\"},\"49\":{\"h\":\"发送消息\"},\"50\":{\"h\":\"前端传参与服务端获取\"},\"51\":{\"h\":\"场景分析\"},\"52\":{\"h\":\"关键点整理\"},\"53\":{\"h\":\"技术要求\"},\"54\":{\"h\":\"边界情况\"},\"55\":{\"h\":\"多房间场景下 WebSocket 解决方案\"},\"56\":{\"h\":\"实时消息的传输管理\"},\"57\":{\"h\":\"房间关闭和玩家退出房间\"},\"58\":{\"h\":\"边界情况\"},\"59\":{\"h\":\"Typing 项目技术总结 - 通用模块（主题切换系列）\"},\"60\":{\"h\":\"切换主题\"},\"61\":{\"h\":\"预设主题\"},\"62\":{\"h\":\"自定义主题\"},\"63\":{\"h\":\"Typing 项目技术总结 - 用户中心逻辑\"},\"64\":{\"h\":\"为什么要个人中心\"},\"65\":{\"h\":\"注册与登录\"},\"66\":{\"h\":\"密码加密\"},\"67\":{\"h\":\"重置密码机制\"},\"68\":{\"h\":\"登录持久化与 jwt\"},\"69\":{\"h\":\"jwt\"},\"70\":{\"h\":\"头像生成\"},\"71\":{\"h\":\"Gravatar\"},\"72\":{\"h\":\"jdenticon\"},\"73\":{\"h\":\"用户名密码自动填充\"},\"74\":{\"h\":\"ip2region\"},\"75\":{\"h\":\"总结\"},\"76\":{\"h\":\"vue3 在 vscode 中引用报错的问题\"},\"77\":{\"h\":\"简述\"},\"78\":{\"h\":\"word-break 和 word-wrap 中的 break-word 的用法详解\"},\"79\":{\"h\":\"word-break\"},\"80\":{\"h\":\"word-wrap\"},\"81\":{\"h\":\"总结\"},\"82\":{\"h\":\"slate 系列 - 零宽空格在 slate 中的运用\"},\"83\":{\"h\":\"\",\"t\":[\"404 Not Found\"]}},\"dirtCount\":0,\"index\":[[\"not\",{\"1\":{\"83\":1}}],[\"nginx\",{\"0\":{\"22\":1,\"45\":1}}],[\"404\",{\"1\":{\"83\":1}}],[\"零宽空格在\",{\"0\":{\"82\":1}}],[\"中的运用\",{\"0\":{\"82\":1}}],[\"中的\",{\"0\":{\"78\":1}}],[\"中引用报错的问题\",{\"0\":{\"76\":1}}],[\"break\",{\"0\":{\"78\":2,\"79\":1}}],[\"总结\",{\"0\":{\"75\":1,\"81\":1}}],[\"ip2region\",{\"0\":{\"74\":1}}],[\"inherit\",{\"1\":{\"7\":1}}],[\"input\",{\"1\":{\"7\":1}}],[\"用户名密码自动填充\",{\"0\":{\"73\":1}}],[\"用户中心逻辑\",{\"0\":{\"63\":1}}],[\"头像生成\",{\"0\":{\"70\":1}}],[\"登录持久化与\",{\"0\":{\"68\":1}}],[\"重置密码机制\",{\"0\":{\"67\":1}}],[\"密码加密\",{\"0\":{\"66\":1}}],[\"注册与登录\",{\"0\":{\"65\":1}}],[\"为什么要个人中心\",{\"0\":{\"64\":1}}],[\"自定义主题\",{\"0\":{\"62\":1}}],[\"自定义模式下的特定逻辑和输入组件的绑定逻辑\",{\"0\":{\"37\":1}}],[\"预设主题\",{\"0\":{\"61\":1}}],[\"切换主题\",{\"0\":{\"60\":1}}],[\"切换字体\",{\"0\":{\"28\":1}}],[\"主题切换系列\",{\"0\":{\"59\":1}}],[\"主力\",{\"1\":{\"5\":1}}],[\"房间关闭和玩家退出房间\",{\"0\":{\"57\":1}}],[\"实时消息的传输管理\",{\"0\":{\"56\":1}}],[\"解决方案\",{\"0\":{\"55\":1}}],[\"多房间场景下\",{\"0\":{\"55\":1}}],[\"边界情况\",{\"0\":{\"54\":1,\"58\":1}}],[\"技术要求\",{\"0\":{\"53\":1}}],[\"技术栈\",{\"0\":{\"5\":1}}],[\"关键点整理\",{\"0\":{\"52\":1}}],[\"关于\",{\"0\":{\"22\":1}}],[\"发送消息\",{\"0\":{\"49\":1}}],[\"发生了什么\",{\"0\":{\"26\":1}}],[\"前端传参与服务端获取\",{\"0\":{\"50\":1}}],[\"前端\",{\"0\":{\"47\":1}}],[\"wrap\",{\"0\":{\"78\":1,\"80\":1}}],[\"word\",{\"0\":{\"78\":3,\"79\":1,\"80\":1}}],[\"ws\",{\"0\":{\"46\":1}}],[\"wss\",{\"0\":{\"46\":1}}],[\"websocket\",{\"0\":{\"42\":1,\"55\":1}}],[\"wechat\",{\"1\":{\"7\":1}}],[\"配置\",{\"0\":{\"45\":1}}],[\"初始化\",{\"0\":{\"44\":1,\"48\":1}}],[\"服务端\",{\"0\":{\"43\":1}}],[\"比一比功能之\",{\"0\":{\"42\":1}}],[\"标点符号和空格的相互转换功能\",{\"0\":{\"41\":1}}],[\"标签分类\",{\"1\":{\"2\":1}}],[\"其他个性化功能逻辑\",{\"0\":{\"40\":1}}],[\"上传文档\",{\"0\":{\"39\":1}}],[\"洗牌算法\",{\"0\":{\"38\":1}}],[\"yates\",{\"0\":{\"38\":1}}],[\"yasinchan2016\",{\"1\":{\"9\":1}}],[\"found\",{\"1\":{\"83\":1}}],[\"footer\",{\"1\":{\"2\":1}}],[\"fisher\",{\"0\":{\"38\":1}}],[\"计时模式\",{\"0\":{\"37\":1}}],[\"限时模式\",{\"0\":{\"37\":1}}],[\"文案与输入内容绑定\",{\"0\":{\"36\":1}}],[\"文案渲染\",{\"0\":{\"31\":1}}],[\"避免干扰\",{\"0\":{\"35\":1}}],[\"禁用部分输入和键盘事件\",{\"0\":{\"35\":1}}],[\"监听输入事件用于记录内容用于错误统计和回放功能\",{\"0\":{\"34\":1}}],[\"输入框\",{\"0\":{\"32\":1}}],[\"字符输入逻辑\",{\"0\":{\"30\":1}}],[\"字体切换系列\",{\"0\":{\"27\":1}}],[\"通用模块\",{\"0\":{\"27\":1,\"59\":1}}],[\"项目技术总结\",{\"0\":{\"27\":1,\"30\":1,\"42\":1,\"59\":1,\"63\":1}}],[\"a\",{\"0\":{\"26\":1}}],[\"模式下的工作机制\",{\"0\":{\"25\":1}}],[\"在编辑器中输入\",{\"0\":{\"26\":1}}],[\"在\",{\"0\":{\"25\":1,\"76\":1}}],[\"exec\",{\"0\":{\"25\":1}}],[\"和\",{\"0\":{\"25\":1,\"33\":1,\"46\":1,\"78\":1}}],[\"正则\",{\"0\":{\"25\":1}}],[\"原因\",{\"0\":{\"24\":1}}],[\"问题\",{\"0\":{\"23\":1}}],[\"压缩的相关配置\",{\"0\":{\"22\":1}}],[\"不同空格的处理\",{\"0\":{\"21\":1}}],[\"克隆一个包含子仓库的仓库\",{\"0\":{\"19\":1}}],[\"更新子仓库\",{\"0\":{\"18\":1}}],[\"引入子仓库\",{\"0\":{\"17\":1}}],[\"场景分析\",{\"0\":{\"51\":1}}],[\"场景\",{\"0\":{\"16\":1}}],[\"子仓库管理\",{\"0\":{\"15\":1}}],[\"本地仓库提交到远程操作\",{\"0\":{\"14\":1}}],[\"hell\",{\"0\":{\"13\":1}}],[\"https\",{\"1\":{\"8\":1}}],[\"html\",{\"1\":{\"5\":1}}],[\"细节\",{\"0\":{\"12\":1}}],[\"简述\",{\"0\":{\"11\":1,\"77\":1}}],[\"系列\",{\"0\":{\"10\":1,\"21\":1,\"26\":1,\"82\":1}}],[\"gravatar\",{\"0\":{\"71\":1}}],[\"global\",{\"0\":{\"25\":1}}],[\"gzip\",{\"0\":{\"22\":1}}],[\"gitmodules\",{\"0\":{\"20\":1}}],[\"git\",{\"0\":{\"14\":1,\"15\":1}}],[\"github\",{\"1\":{\"9\":1}}],[\"gmail\",{\"1\":{\"9\":1}}],[\"联系我\",{\"0\":{\"9\":1}}],[\"拉云低代码工具\",{\"1\":{\"8\":1}}],[\"callback\",{\"0\":{\"13\":1}}],[\"com\",{\"1\":{\"8\":1,\"9\":1}}],[\"css\",{\"1\":{\"5\":1}}],[\"友链\",{\"0\":{\"8\":1}}],[\"也正是本博客使用的主题\",{\"1\":{\"7\":1}}],[\"也可以自定义样式\",{\"1\":{\"7\":1}}],[\"可自动将博客按时间进行排序\",{\"1\":{\"7\":1}}],[\"支持归档和标签功能\",{\"1\":{\"7\":1}}],[\"支持加载动效\",{\"1\":{\"7\":1}}],[\"博客主题\",{\"1\":{\"7\":1}}],[\"default的vuepress\",{\"1\":{\"7\":1}}],[\"demo\",{\"1\":{\"7\":2}}],[\"继承于\",{\"1\":{\"7\":1}}],[\"图片懒加载\",{\"1\":{\"7\":1}}],[\"lazyload\",{\"1\":{\"7\":1}}],[\"linkage\",{\"1\":{\"7\":1}}],[\"lists\",{\"1\":{\"2\":1}}],[\"一个简易的\",{\"1\":{\"7\":1}}],[\"一个可以快速找到聚会地点的网站\",{\"1\":{\"6\":1}}],[\"一般用于登录时填写短信验证码的方框\",{\"1\":{\"7\":1}}],[\"验证框\",{\"1\":{\"7\":1}}],[\"vscode\",{\"0\":{\"76\":1}}],[\"verification\",{\"1\":{\"7\":1}}],[\"vue3\",{\"0\":{\"76\":1}}],[\"vuepress\",{\"1\":{\"7\":2}}],[\"vue\",{\"1\":{\"7\":4}}],[\"微信小程序列表左右联动效果\",{\"1\":{\"7\":1}}],[\"slate\",{\"0\":{\"10\":1,\"21\":1,\"26\":1,\"82\":2}}],[\"solarhell\",{\"1\":{\"8\":1}}],[\"simple\",{\"1\":{\"7\":1}}],[\"scroll\",{\"1\":{\"7\":1}}],[\"seo\",{\"1\":{\"2\":1}}],[\"轮子\",{\"0\":{\"7\":1}}],[\"打字网站\",{\"1\":{\"6\":1}}],[\"meet\",{\"1\":{\"6\":1}}],[\"markdown\",{\"1\":{\"2\":1}}],[\"quick\",{\"1\":{\"6\":1}}],[\"好玩\",{\"0\":{\"6\":1}}],[\"框架vue\",{\"1\":{\"5\":1}}],[\"jdenticon\",{\"0\":{\"72\":1}}],[\"jwt\",{\"0\":{\"68\":1,\"69\":1}}],[\"js\",{\"1\":{\"5\":1}}],[\"javascript\",{\"1\":{\"5\":1}}],[\"目前就职于taptap\",{\"1\":{\"4\":1}}],[\"毕业并开始从事前端开发工作\",{\"1\":{\"4\":1}}],[\"7\",{\"1\":{\"4\":1}}],[\"2017\",{\"1\":{\"4\":1}}],[\"我\",{\"0\":{\"4\":1}}],[\"优化\",{\"1\":{\"2\":1}}],[\"归档分类\",{\"1\":{\"2\":1}}],[\"写法\",{\"1\":{\"2\":1}}],[\"的用法详解\",{\"0\":{\"78\":1}}],[\"的使用\",{\"0\":{\"42\":1}}],[\"的\",{\"1\":{\"2\":1}}],[\"test\",{\"0\":{\"25\":1}}],[\"theme\",{\"1\":{\"7\":2}}],[\"typing\",{\"0\":{\"27\":1,\"30\":1,\"42\":1,\"59\":1,\"63\":1},\"1\":{\"6\":1}}],[\"task\",{\"1\":{\"2\":1}}],[\"todo\",{\"0\":{\"2\":1}}],[\"加入\",{\"1\":{\"2\":1}}],[\"x\",{\"1\":{\"2\":4}}],[\"基于vuepressgithub主题\",{\"1\":{\"1\":1}}],[\"此博客\",{\"0\":{\"1\":1}}]],\"serializationVersion\":2}}")).map(([e,t])=>[e,zt(t,{fields:["h","t","c"],storeFields:["h","t","c"]})]));self.onmessage=({data:{type:e="all",query:t,locale:s,options:n,id:o}})=>{const u=bt[s];e==="suggest"?self.postMessage([e,o,tt(t,u,n)]):e==="search"?self.postMessage([e,o,Z(t,u,n)]):self.postMessage({suggestions:[e,o,tt(t,u,n)],results:[e,o,Z(t,u,n)]})};
//# sourceMappingURL=index.js.map
