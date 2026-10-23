import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
const args=process.argv.slice(2), root=process.cwd(), cache=new Map();
const port=Number(args[args.indexOf('--port')+1])||4173;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.json':'application/json'};
http.createServer(async(req,res)=>{
 try {
  const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname).replace(/\/$/,'/index.html'));
  if(!path.startsWith(root+sep)){res.writeHead(403).end();return;}
  let body=await readFile(path), type=types[extname(path)]||'application/octet-stream';
  const headers={'Content-Type':type,'Cache-Control':'no-cache','Vary':'Accept-Encoding'};
  if(/text\/|javascript|svg|json/.test(type)&&req.headers['accept-encoding']?.includes('gzip')){
   const info=await stat(path),key=path+info.mtimeMs;
   if(!cache.has(key))cache.set(key,gzipSync(body));
   body=cache.get(key);headers['Content-Encoding']='gzip';
  }
  res.writeHead(200,headers).end(body);
 }catch{res.writeHead(404).end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`langscope preview on http://127.0.0.1:${port}`));
