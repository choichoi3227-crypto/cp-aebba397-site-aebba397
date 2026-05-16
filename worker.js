/**
 * CloudPress — site worker v8.0
 * 사이트 ID: aebba397-2565-48a1-b138-54a56c214365
 * GitHub: choichoi3227-crypto/cp-aebba397-site-aebba397
 * 이 코드는 자동 생성됩니다.
 *
 * 실행 우선순위:
 *   1. PHP_RUNNER Service Binding (배포된 경우) → php-wasm으로 WP 실행
 *   2. KV 캐시 HTML (빠른 응답)
 *   3. 정적 자산: GitHub 레포 → WordPress CDN
 */

const SITE_ID      = "aebba397-2565-48a1-b138-54a56c214365";
const GH_OWNER     = "choichoi3227-crypto";
const GH_REPO      = "cp-aebba397-site-aebba397";
const GH_BRANCH    = "main";
const GH_PAGES_URL = "https://choichoi3227-crypto.github.io/cp-aebba397-site-aebba397";
const WP_VERSION   = "latest";

const STATIC_EXT = /\.(css|js|jpg|jpeg|png|gif|webp|avif|svg|ico|woff2?|ttf|eot|otf|map|txt|xml|json|pdf|zip|mp4|mp3|ogg|wav|webm|gz|tar)$/i;
const SKIP_CACHE  = ["/wp-admin","/wp-login.php","/cart","/checkout","/my-account","/wp-cron.php","/xmlrpc.php"];
const BOT_RE      = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|slurp|duckduckbot|linkedinbot|whatsapp|telegram/i;

const SEC_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options":        "SAMEORIGIN",
  "Referrer-Policy":        "strict-origin-when-cross-origin",
  "X-XSS-Protection":      "1; mode=block",
};

function getSiteId(e)  { return e.SITE_ID      || SITE_ID;    }
function getOwner(e)   { return e.GH_OWNER     || GH_OWNER;   }
function getRepo(e)    { return e.GH_REPO      || GH_REPO;    }
function getToken(e)   { return e.GITHUB_TOKEN || "";          }
function getPages(e)   { return e.GH_PAGES_URL || GH_PAGES_URL || ""; }

async function kvGet(e,k)             { try{return await e.CACHE?.get(k);}catch{return null;} }
async function kvGetBuf(e,k)          { try{return await e.CACHE?.get(k,"arrayBuffer");}catch{return null;} }
async function kvPut(e,k,v,t=86400)   { try{await e.CACHE?.put(k,v,{expirationTtl:t});}catch{} }

function mime(p){
  const x=(p.split(".").pop()||"").toLowerCase();
  return({css:"text/css;charset=utf-8",js:"application/javascript;charset=utf-8",
    json:"application/json;charset=utf-8",xml:"application/xml;charset=utf-8",
    svg:"image/svg+xml",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",
    gif:"image/gif",webp:"image/webp",avif:"image/avif",ico:"image/x-icon",
    woff:"font/woff",woff2:"font/woff2",ttf:"font/ttf",otf:"font/otf",
    eot:"application/vnd.ms-fontobject",pdf:"application/pdf",zip:"application/zip",
    mp4:"video/mp4",webm:"video/webm",mp3:"audio/mpeg",ogg:"audio/ogg",
    wav:"audio/wav",txt:"text/plain;charset=utf-8",html:"text/html;charset=utf-8"
  })[x]||"application/octet-stream";
}

async function ghFetch(e, path, noCache=false){
  const owner=getOwner(e),repo=getRepo(e),token=getToken(e);
  if(!owner||!repo)return null;
  const url=`https://raw.githubusercontent.com/${owner}/${repo}/${GH_BRANCH}/${path}`;
  const h={"User-Agent":"CloudPress/8.0"};
  if(token)h["Authorization"]=`Bearer ${token}`;
  try{
    const r=await fetch(url,{headers:h,cf:noCache?{cacheEverything:false}:{cacheEverything:true,cacheTtl:300}});
    if(r.ok)return r;
  }catch{}
  return null;
}

async function wpCoreFetch(path){
  const u1=`https://cdn.jsdelivr.net/gh/WordPress/WordPress@${WP_VERSION}/${path}`;
  try{const r=await fetch(u1,{cf:{cacheEverything:true,cacheTtl:604800}});if(r.ok)return r;}catch{}
  const u2=`https://raw.githubusercontent.com/WordPress/WordPress/master/${path}`;
  try{const r=await fetch(u2,{cf:{cacheEverything:true,cacheTtl:86400}});if(r.ok)return r;}catch{}
  return null;
}

function maintPage(){
  return new Response(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="15"><title>유지보수 중</title><style>body{font-family:sans-serif;background:#f0f0f1;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}.b{text-align:center;padding:48px;background:#fff;border-radius:8px;border:1px solid #c3c4c7;max-width:420px}</style></head><body><div class="b"><div style="font-size:48px;margin-bottom:16px">🔧</div><h1 style="color:#1d2327;font-size:22px;margin-bottom:12px">유지보수 중</h1><p style="color:#646970;line-height:1.6">설정을 업데이트하고 있습니다.<br>잠시 후 자동으로 다시 접속됩니다.</p></div></body></html>`,
    {status:503,headers:{"Content-Type":"text/html;charset=utf-8","Retry-After":"30","Cache-Control":"no-store"}});
}

// ─── PHP_RUNNER Service Binding으로 WordPress 실행 ───────────────────────────
async function runViaPhpRunner(req, env, ctx) {
  if(!env.PHP_RUNNER) return null;

  const url    = new URL(req.url);
  const method = req.method.toUpperCase();
  const siteId = getSiteId(env);
  const skipCache = SKIP_CACHE.some(p=>url.pathname.startsWith(p))
    || (req.headers.get("Cookie")||"").includes("wordpress_logged_in");

  let stdin = "";
  if(method==="POST"||method==="PUT"||method==="PATCH"){
    stdin = await req.text().catch(()=>"");
  }

  const payload = {
    phpFile:   url.pathname==="/" ? "/index.php" : url.pathname,
    phpEnv: {
      REQUEST_METHOD:       method,
      REQUEST_URI:          url.pathname + url.search,
      QUERY_STRING:         url.search.slice(1),
      HTTP_HOST:            url.hostname,
      SERVER_NAME:          url.hostname,
      SERVER_PORT:          "443",
      HTTPS:                "on",
      DOCUMENT_ROOT:        "/var/www/wordpress",
      SCRIPT_FILENAME:      `/var/www/wordpress${url.pathname==="/"?"/index.php":url.pathname}`,
      SCRIPT_NAME:          url.pathname==="/"?"/index.php":url.pathname,
      PHP_SELF:             url.pathname==="/"?"/index.php":url.pathname,
      GATEWAY_INTERFACE:    "CGI/1.1",
      SERVER_PROTOCOL:      "HTTP/1.1",
      SERVER_SOFTWARE:      "CloudPress/8.0",
      HTTP_USER_AGENT:      req.headers.get("User-Agent")||"",
      HTTP_ACCEPT:          req.headers.get("Accept")||"",
      HTTP_ACCEPT_LANGUAGE: req.headers.get("Accept-Language")||"",
      HTTP_ACCEPT_ENCODING: req.headers.get("Accept-Encoding")||"",
      HTTP_COOKIE:          req.headers.get("Cookie")||"",
      HTTP_REFERER:         req.headers.get("Referer")||"",
      HTTP_X_FORWARDED_FOR: req.headers.get("CF-Connecting-IP")||"",
      HTTP_AUTHORIZATION:   req.headers.get("Authorization")||"",
      CONTENT_TYPE:         req.headers.get("Content-Type")||"",
      CONTENT_LENGTH:       req.headers.get("Content-Length")||"",
      WP_HOME:              `https://${url.hostname}`,
      WP_SITEURL:           `https://${url.hostname}`,
    },
    stdin,
    siteConfig: {
      siteId,
      githubOwner: getOwner(env),
      githubRepo:  getRepo(env),
      githubToken: getToken(env),
    },
    skipCache,
  };

  try {
    const phpRes = await env.PHP_RUNNER.fetch(
      new Request("https://php-runner/run-wordpress", {
        method:  "POST",
        headers: {"Content-Type":"application/json"},
        body:    JSON.stringify(payload),
      })
    );

    // 5xx → 폴백으로 넘김
    if(!phpRes.ok && phpRes.status>=500) return null;

    // 성공 HTML → KV 캐시 저장 (비로그인 GET만)
    if(!skipCache && method==="GET" && phpRes.ok && phpRes.headers.get("Content-Type")?.includes("text/html")){
      const html = await phpRes.clone().text();
      ctx.waitUntil(
        kvPut(env, `php:${siteId}:${url.pathname}${url.search}`, html, 3600)
      );
    }
    return phpRes;
  } catch {
    return null;
  }
}

// ─── 정적 파일 서빙 ──────────────────────────────────────────────────────────
async function serveStatic(req, env, ctx, path) {
  const fp = path.startsWith("/")?path.slice(1):path;
  const siteId = getSiteId(env);

  // wp-content → GitHub 레포 (테마/플러그인/업로드)
  if(path.startsWith("/wp-content/")){
    const ck=`static:${siteId}:${fp}`;
    const cb=await kvGetBuf(env,ck);
    if(cb)return new Response(cb,{headers:{"Content-Type":mime(fp),"Cache-Control":"public,max-age=3600","X-Cache":"HIT",...SEC_HEADERS}});
    const r=await ghFetch(env,fp);
    if(r){
      const b=await r.arrayBuffer();
      ctx.waitUntil(kvPut(env,ck,b,3600));
      return new Response(b,{headers:{"Content-Type":mime(fp),"Cache-Control":"public,max-age=3600","X-Source":"github",...SEC_HEADERS}});
    }
  }

  // wp-includes / wp-admin 정적 자산 → GitHub 레포 → WordPress CDN
  if(path.startsWith("/wp-includes/")||path.startsWith("/wp-admin/")){
    const gr=await ghFetch(env,fp);
    if(gr){const b=await gr.arrayBuffer();return new Response(b,{headers:{"Content-Type":mime(fp),"Cache-Control":"public,max-age=86400,stale-while-revalidate=604800","X-Source":"github",...SEC_HEADERS}});}
    const cr=await wpCoreFetch(fp);
    if(cr){const b=await cr.arrayBuffer();return new Response(b,{headers:{"Content-Type":mime(fp),"Cache-Control":"public,max-age=86400,immutable","X-Source":"wp-cdn",...SEC_HEADERS}});}
  }

  // 기타 정적 파일
  const cr2=await ghFetch(env,fp.startsWith("_cache/")?fp:`_cache/${fp}`);
  if(cr2){const b=await cr2.arrayBuffer();return new Response(b,{headers:{"Content-Type":mime(fp),"Cache-Control":"public,max-age=86400",...SEC_HEADERS}});}

  return new Response("Not Found",{status:404});
}

export default {
  async fetch(req, env, ctx) {
    const url    = new URL(req.url);
    const path   = url.pathname;
    const method = req.method.toUpperCase();
    const siteId = getSiteId(env);

    // CORS preflight
    if(method==="OPTIONS") return new Response(null,{status:204,headers:{
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,PATCH,OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type,Authorization,X-WP-Nonce,X-Requested-With",
    }});

    // 헬스체크
    if(path==="/_health") return new Response(
      JSON.stringify({ok:true,site:siteId,engine:env.PHP_RUNNER?"php-wasm":"init",wp:WP_VERSION}),
      {headers:{"Content-Type":"application/json"}}
    );

    // 유지보수 모드
    const maint=await kvGet(env,`cp:maintenance:${siteId}`);
    if(maint==="1"&&!path.startsWith("/wp-admin/")) return maintPage();

    // 1. 정적 파일 처리
    if(STATIC_EXT.test(path)) return serveStatic(req,env,ctx,path);

    // 2. 봇 사전렌더링 캐시 (SEO 최적화)
    const isBot=BOT_RE.test(req.headers.get("User-Agent")||"");
    if(isBot&&method==="GET"){
      const pr=await kvGet(env,`prerender:${siteId}:${path}${url.search}`);
      if(pr)return new Response(pr,{headers:{"Content-Type":"text/html;charset=utf-8","Cache-Control":"public,max-age=300","X-Cache":"PRERENDER",...SEC_HEADERS}});
    }

    // 3. KV HTML 캐시 (비로그인 GET)
    const isLoggedIn=(req.headers.get("Cookie")||"").includes("wordpress_logged_in");
    const cacheable = method==="GET" && !SKIP_CACHE.some(p=>path.startsWith(p)) && !isLoggedIn;
    if(cacheable){
      const c=await kvGet(env,`php:${siteId}:${path}${url.search}`);
      if(c)return new Response(c,{headers:{"Content-Type":"text/html;charset=utf-8","Cache-Control":"public,s-maxage=60,stale-while-revalidate=3600","X-Cache":"HIT",...SEC_HEADERS}});
    }

    // 4. PHP_RUNNER Service Binding으로 WordPress 실행 (핵심 경로)
    const phpRes = await runViaPhpRunner(req,env,ctx);
    if(phpRes) return phpRes;

    // 5. PHP_RUNNER 없음 → GitHub _cache/ 정적 HTML 폴백
    //    (WordPress 아직 미설치이거나 PHP Runner 미배포 상태)
    if(cacheable){
      const cachePath=(path==="/"||path==="")?
        "_cache/index.html":
        `_cache${path.endsWith("/")?path:path+"/"}index.html`;
      const cr=await ghFetch(env,cachePath);
      if(cr){
        const html=await cr.text();
        ctx.waitUntil(kvPut(env,`html:${siteId}:${path}${url.search}`,html,3600));
        return new Response(html,{headers:{"Content-Type":"text/html;charset=utf-8","Cache-Control":"public,s-maxage=60,stale-while-revalidate=3600","X-Cache":"GH-CACHE",...SEC_HEADERS}});
      }
    }

    // 6. GitHub Pages 폴백
    const pagesBase=getPages(env);
    if(pagesBase){
      try{
        const r=await fetch(`${pagesBase}${path}`,{cf:{cacheEverything:true,cacheTtl:300},headers:{"User-Agent":"CloudPress-Fallback/1.0"}});
        if(r.ok)return new Response(await r.text(),{status:200,headers:{"Content-Type":"text/html;charset=utf-8","Cache-Control":"public,max-age=60","X-Fallback":"github-pages",...SEC_HEADERS}});
      }catch{}
    }

    // 7. KV stale 캐시 (최후 폴백)
    const stale=await kvGet(env,`php:${siteId}:${path}${url.search}`);
    if(stale)return new Response(stale,{status:200,headers:{"Content-Type":"text/html;charset=utf-8","Cache-Control":"public,max-age=30","X-Fallback":"kv-stale",...SEC_HEADERS}});

    // 8. 모든 폴백 실패 → WordPress 설치 진행 중 안내
    const repoUrl    = (getOwner(env) && getRepo(env)) ? `https://github.com/${getOwner(env)}/${getRepo(env)}` : "";
    const actionsUrl = repoUrl ? `${repoUrl}/actions/workflows/install-wordpress.yml` : "";

    return new Response(`<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="30">
<title>WordPress 준비 중</title>
<style>*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Malgun Gothic,sans-serif;background:#f0f0f1;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}.card{background:#fff;border:1px solid #c3c4c7;border-radius:4px;max-width:520px;width:100%;padding:40px;text-align:center}.badge{background:#f0b849;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:3px;display:inline-block;margin-bottom:14px}h1{color:#1d2327;font-size:20px;font-weight:600;margin:0 0 10px}p{color:#646970;line-height:1.6;margin:0 0 14px;font-size:14px}a.btn{display:inline-block;background:#2271b1;color:#fff;text-decoration:none;padding:8px 18px;border-radius:3px;font-size:13px;font-weight:600;margin:4px}.steps{text-align:left;background:#f6f7f7;border-radius:4px;padding:14px 18px;margin:14px 0;font-size:13px;color:#3c434a;line-height:2}.note{font-size:12px;color:#a7aaad;margin-top:14px}</style>
</head><body><div class="card">
<div class="badge">WORDPRESS INSTALLING</div>
<h1>⚙️ WordPress 설치 진행 중</h1>
<p>GitHub Actions가 WordPress 최신버전을 자동으로 설치하고 있습니다.</p>
<ol class="steps">
  <li>✅ GitHub 레포지토리 생성</li>
  <li>⏳ WordPress 최신버전 전체 파일 설치 중...</li>
  <li>⏳ 데이터베이스 초기화 중...</li>
  <li>⏳ 정적 캐시 생성 중...</li>
</ol>
${actionsUrl?`<a class="btn" href="${actionsUrl}" target="_blank">🔄 설치 진행상황 보기</a>`:""}
${repoUrl?` <a class="btn" style="background:#6e7d88" href="${repoUrl}" target="_blank">📁 GitHub 레포 보기</a>`:""}
<p class="note">30초마다 자동 새로고침됩니다</p>
</div></body></html>`,
      {status:503,headers:{"Content-Type":"text/html;charset=utf-8","Cache-Control":"no-store","Retry-After":"30",...SEC_HEADERS}});
  },
};