(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{7285:function(e,o,r){Promise.resolve().then(r.t.bind(r,3385,23)),Promise.resolve().then(r.t.bind(r,9646,23)),Promise.resolve().then(r.bind(r,9276)),Promise.resolve().then(r.bind(r,5006))},9276:function(e,o,r){"use strict";r.r(o),r.d(o,{ServiceWorkerRegistration:function(){return n}});var t=r(4090);function n(){return(0,t.useEffect)(()=>{"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(e){console.error("ServiceWorker registration failed:",e)})})},[]),null}},5006:function(e,o,r){"use strict";r.r(o),r.d(o,{StoreHydration:function(){return i}});var t=r(4090),n=r(216);function i(){let e=(0,n.y)(e=>e.setHydrated);return(0,t.useEffect)(()=>{n.y.persist.rehydrate(),e()},[e]),null}},216:function(e,o,r){"use strict";let t,n;r.d(o,{y:function(){return p}});var i=r(2020),a=r(5249),l=r(6142),c=r(8121),s=r(2529);let{publicRuntimeConfig:d}=r.n(s)()()||{},f={apiKey:"AIzaSyAFDt7q24P_T3TgYkpkxCrVrVblwVE3CEI",authDomain:"pokemon-card-tracker-87d04.firebaseapp.com",projectId:"pokemon-card-tracker-87d04",storageBucket:"pokemon-card-tracker-87d04.firebasestorage.app",messagingSenderId:"824609169487",appId:"1:824609169487:web:2e3301ef05186d85d80a3a"};console.log("[Firebase] Configuration:",{hasConfig:{apiKey:!!f.apiKey,authDomain:!!f.authDomain,projectId:!!f.projectId,storageBucket:!!f.storageBucket,messagingSenderId:!!f.messagingSenderId,appId:!!f.appId},buildInfo:{environment:"production",buildTime:new Date().toISOString()}});try{if(!f.apiKey||!f.projectId)throw Error("Missing required Firebase configuration");t=(0,l.ZF)(f),console.log("[Firebase] Initialized successfully"),n=(0,c.ad)(t),console.log("[Firebase] Firestore initialized")}catch(e){throw console.error("[Firebase] Initialization error:",e),e}async function g(e){try{if(!n)throw Error("Firestore not initialized");console.log("[Firebase] Getting collection for profile:",e);let o=(0,c.JU)(n,"collections",e);console.log("[Firebase] Document reference created for:",o.path);let r=await (0,c.QT)(o);if(r.exists()){let e=r.data();return console.log("[Firebase] Found collection:",{profileName:e.profileName,cardCount:Object.keys(e.collection).length,lastUpdated:new Date(e.lastUpdated).toISOString()}),e}return console.log("[Firebase] No collection found for profile:",e),null}catch(o){throw console.error("[Firebase] Error getting collection:",{error:o,profileName:e,errorMessage:o instanceof Error?o.message:"Unknown error",stack:o instanceof Error?o.stack:void 0}),o}}async function u(e,o){try{if(!n)throw Error("Firestore not initialized");console.log("[Firebase] Saving collection:",{profileName:e,cardCount:Object.keys(o.collection).length,lastUpdated:new Date(o.lastUpdated).toISOString()});let r=(0,c.JU)(n,"collections",e);console.log("[Firebase] Document reference created for:",r.path),await (0,c.pl)(r,o),console.log("[Firebase] Collection saved successfully")}catch(o){throw console.error("[Firebase] Save error:",{error:o,profileName:e,errorMessage:o instanceof Error?o.message:"Unknown error",stack:o instanceof Error?o.stack:void 0}),o}}let p=(0,i.Ue)()((0,a.tJ)((e,o)=>({profileName:null,collection:{},hydrated:!1,error:null,setHydrated:()=>e({hydrated:!0}),setProfileName:async r=>{console.log("Setting profile name:",r),e({profileName:r});try{let t=await g(r);t?(console.log("Found existing collection:",t),e({collection:t.collection})):(console.log("No existing collection found, starting fresh"),e({collection:{}})),await o().syncWithFirebase()}catch(o){console.error("Error loading collection:",o),e({error:"Failed to load collection. Please try again."})}},addCard:async r=>{console.log("Adding card:",r),e(e=>({collection:{...e.collection,[r]:!0}})),await o().syncWithFirebase()},removeCard:async r=>{console.log("Removing card:",r),e(e=>{let{[r]:o,...t}=e.collection;return{collection:t}}),await o().syncWithFirebase()},hasCard:e=>o().collection[e]||!1,setError:o=>e({error:o}),syncWithFirebase:async()=>{let{profileName:r,collection:t}=o();if(!r){console.log("No profile name set, skipping sync");return}try{console.log("Starting Firebase sync for profile:",r),console.log("Collection to sync:",t),await u(r,{profileName:r,collection:t,lastUpdated:Date.now()});let o=await g(r);if(console.log("Verified saved data:",o),!o)throw Error("Failed to verify saved data");e({error:null}),console.log("Firebase sync completed successfully")}catch(o){throw console.error("Error syncing with Firebase:",o),e({error:"Failed to save your collection. Please try again."}),o}}}),{name:"pokemon-collection",partialize:e=>({profileName:e.profileName,collection:e.collection}),onRehydrateStorage:()=>async e=>{if(e){try{if(console.log("Rehydrating storage with state:",e),e.profileName){console.log("Loading collection for profile:",e.profileName);let o=await g(e.profileName);o?(console.log("Found Firebase data:",o),p.setState({collection:o.collection})):console.log("No Firebase data found for profile:",e.profileName)}}catch(o){console.error("Error initializing store:",o),e.setError("Failed to initialize. Please refresh the page.")}e.setHydrated()}}}))},3385:function(){},9646:function(e){e.exports={style:{fontFamily:"'__Inter_c20822', '__Inter_Fallback_c20822'",fontStyle:"normal"},className:"__className_c20822"}}},function(e){e.O(0,[358,783,971,69,744],function(){return e(e.s=7285)}),_N_E=e.O()}]);