/* Langscope particle heroes • dependency-free • coordinate data, never images.
   Public API: LangscopeHero.mount(element, asset, options) / responsive(element, section, options).
   The returned controller owns its listeners, observers, GPU resources and animation clock. */
(() => {
  'use strict';
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const interactive='a,button,input,select,textarea,[role="button"],[contenteditable="true"],[data-hero-ignore]';
  const instances=new Set();
  const scriptBase=document.currentScript?.src||location.href;
  const vertex=`
    precision highp float;
    attribute vec4 aPoint; // x, y, luminance [0..255], kind
    attribute vec4 aDetail; // seed, size, angle, shape
    attribute vec2 aExtra; // depth, reserved
    uniform vec2 uSize,uSource,uOffset,uMotion,uCursor;
    uniform float uScale,uDpr,uTime,uForce,uAnimate;
    uniform mediump float uMode;
    varying mediump float vLight,vShape,vAngle,vSize;
    void main(){
      vec2 p=aPoint.xy;
      float seed=aDetail.x;
      float depth=aExtra.x;
      float light=aPoint.z/255.;
      vec2 m=uMotion;
      float phase=seed*6.283185;
      float f=1.;
      if(uMode<.5){
        float left=(1.-smoothstep(705.,785.,p.x))*smoothstep(305.,415.,p.y);
        float right=smoothstep(990.,1070.,p.x)*smoothstep(205.,290.,p.y);
        float hand=max(left,right);
        float side=1.-2.*step(885.,p.x);
        vec2 pivot=mix(vec2(325.,610.),vec2(1350.,438.),step(885.,p.x));
        float a=(m.x*.021+m.y*.012)*side*hand;
        a+=sin(uTime*.27+side)*.0018*hand*uAnimate;
        vec2 q=p-pivot;
        p=mix(p,pivot+vec2(q.x*cos(a)-q.y*sin(a),q.x*sin(a)+q.y*cos(a)),hand);
        p+=vec2(m.x*30.*side,-m.y*20.)*hand;
        p+=vec2(m.x*(depth-.5)*11.,m.y*(depth-.5)*8.)*hand;
        p+=m*vec2(-4.,3.)*(1.-hand);
        p+=vec2(sin(uTime*.32+phase+p.y*.003),cos(uTime*.26+phase+p.x*.003))
          *(.35+depth*.5)*hand*uAnimate;
        f=.18+.82*hand;
      }else if(uMode<1.5){
        float kind=aPoint.w;
        f=kind<.5?.14:(kind<1.5?.62:1.);
        p+=m*vec2(35.,42.)*f;
        // Coherent, slow breathing keeps the glyphs and orbital silhouette intact.
        p+=vec2(sin(uTime*.21+p.y*.002),cos(uTime*.18+p.x*.002))*(.4+f*.8)*uAnimate;
      }else if(uMode<2.5){
        float structure=smoothstep(320.,560.,abs(p.x-809.5));
        float side=smoothstep(575.,1065.,p.x)*2.-1.;
        f=structure*(.78+.22*depth);
        p+=m*(10.+14.*depth)*f;
        p+=vec2(m.x*side*4.5,-m.y*side*2.5)*structure;
        p+=vec2(sin(uTime*.24+p.y*.003),cos(uTime*.19+p.x*.003))*(.35+.6*depth)*f*uAnimate;
      }else{
        float group=aPoint.w;
        f=group<.5?.35:(group<1.5?.82:1.18);
        p+=m*vec2(43.,48.)*depth*f;
        p+=vec2(sin(uTime*.25+p.x*.003),cos(uTime*.2+p.y*.003))*(.45+depth)*uAnimate;
      }
      vec2 screen=p*uScale+uOffset;
      vec2 rel=screen-uCursor;
      float radius=clamp(min(uSize.x,uSize.y)*.24,75.,210.);
      float field=pow(max(0.,1.-length(rel)/radius),2.)*uForce;
      screen+=rel/max(length(rel),1.)*field*(6.+8.*depth)*f;
      gl_Position=vec4(screen/uSize*vec2(2.,-2.)+vec2(-1.,1.),0.,1.);
      float shimmer=1.+.035*uAnimate*sin(uTime*(.55+seed*.4)+phase*3.);
      vShape=-1.;vAngle=0.;vSize=1.;
      if(uMode<.5){
        vLight=clamp((aPoint.z-12.)/243.*1.0*shimmer,0.,1.);
        gl_PointSize=max(1.,uDpr*mix(1.06,1.83,vLight)*max(.77,uScale));
      }else if(uMode<1.5){
        vLight=clamp(light*1.07*shimmer,0.,.96);
        gl_PointSize=max(1.,(.95+light*.54)*uScale*uDpr);
      }else if(uMode<2.5){
        vLight=max(0.,(aPoint.z-11.)/255.)*shimmer;
        gl_PointSize=max(1.,uScale*uDpr);
      }else{
        vLight=light*shimmer*(aPoint.w<.5?.85:1.);
        vShape=aDetail.w;vAngle=aDetail.z;
        vSize=max(.65,aDetail.y*uScale*.78);
        gl_PointSize=max(1.,vSize*2.5*uDpr);
      }
    }`;
  const fragment=`
    precision mediump float;
    varying mediump float vLight,vShape,vAngle,vSize;
    uniform mediump float uMode;
    void main(){
      vec2 q=gl_PointCoord*2.-1.;
      float alpha=vLight;
      if(uMode<.5){alpha*=1.-smoothstep(.64,1.08,length(q));}
      else if(uMode<1.5){alpha*=1.-smoothstep(.78,1.,max(abs(q.x),abs(q.y)));}
      else if(uMode>2.5){
        // Analytic sprites preserve the circles, slashes and small square glyphs.
        float c=cos(vAngle),s=sin(vAngle);
        vec2 p=vec2(q.x*c-q.y*s,q.x*s+q.y*c);
        float edge=.18/max(1.,vSize);
        if(vShape<.5)alpha*=1.-smoothstep(.44-edge,.49+edge,length(p));
        else if(vShape<1.5){
          float bar=(1.-smoothstep(.7,.8,abs(p.x)))*(1.-smoothstep(.10,.18,abs(p.y)));
          float cross=(1.-smoothstep(.08,.16,abs(p.x)))*(1.-smoothstep(.22,.32,abs(p.y)))*step(.78,vLight);
          alpha*=max(bar,cross);
        }else if(vShape<2.5){
          vec2 d=vec2(max(abs(p.x)-.68,0.),p.y);
          alpha*=1.-smoothstep(.10,.18,length(d));
        }else alpha*=1.-smoothstep(.4-edge,.46+edge,max(abs(p.x),abs(p.y)));
      }
      gl_FragColor=vec4(vec3(1.),clamp(alpha,0.,1.));
    }`;

  function decode(asset){
    const input=atob(asset.data),bytes=new Uint8Array(asset.bytes);
    let i=0,o=0;
    while(i<input.length){
      const tag=input.charCodeAt(i++);
      if(tag<128){for(let j=0;j<tag+1;j++)bytes[o++]=input.charCodeAt(i++);}
      else{
        const d=input.charCodeAt(i++)|(input.charCodeAt(i++)<<8);
        if(!d||d>o)throw Error('Invalid hero coordinate stream');
        for(let j=0;j<(tag&127)+4;j++){bytes[o]=bytes[o-d];o++;}
      }
      if(o>bytes.length)throw Error('Hero coordinate stream overflow');
    }
    if(o!==bytes.length)throw Error('Truncated hero coordinate stream');
    const points=new Float32Array(asset.count*10);
    const data=new DataView(bytes.buffer);
    let pos=0,k=0;
    for(let n=0;n<asset.count;n++){
      const j=n*10;
      if(asset.encoding==='delta-v1'){
        let shift=0,d=0,b;
        do{b=bytes[k++];d|=(b&127)<<shift;shift+=7;}while(b&128);
        pos+=d;
        const x=pos%asset.width,y=Math.floor(pos/asset.width),light=bytes[k++],aux=bytes[k++];
        const seed=((Math.imul(x+1,73856093)^Math.imul(y+1,19349663))>>>0)/4294967295;
        points.set([x,y,light,asset.mode===1?aux:0,asset.mode===0?aux/255:seed,1,0,0,seed,0],j);
      }else if(asset.encoding==='glyph-v1'){
        points.set([data.getUint16(k,true)/65535*asset.width,data.getUint16(k+2,true)/65535*asset.height,
          data.getUint16(k+6,true)/65535*255,bytes[k+11],data.getUint16(k+14,true)/65535,
          data.getUint16(k+4,true)/1024,data.getInt16(k+8,true)/4096,bytes[k+10],data.getUint16(k+12,true)/65535,0],j);
        k+=16;
      }else throw Error('Unsupported hero coordinate encoding');
    }
    if(k!==bytes.length)throw Error('Unexpected hero coordinate data length');
    return points;
  }

  function mount(stage,asset,options={}){
    if(!(stage instanceof Element))throw Error('A hero container is required');
    const abort=new AbortController(),signal=abort.signal;
    const listen=(target,type,fn,extra={})=>target.addEventListener(type,fn,{passive:true,signal,...extra});
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const coarse=matchMedia('(pointer: coarse)');
    const root=document.createElement('div');
    root.style.cssText='position:absolute;inset:0;overflow:hidden;pointer-events:none;background:#090909';
    root.setAttribute('aria-hidden','true');
    const background=document.createElement('canvas');
    let canvas=document.createElement('canvas');
    for(const c of [background,canvas])c.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
    root.append(background,canvas);stage.prepend(root);
    const bc=background.getContext('2d',{alpha:false});
    const points=decode(asset);
    const state={width:1,height:1,scale:1,x:0,y:0,dpr:1,time:0,frames:0,renderer:'initializing',
      visible:false,running:false,sensors:'inactive',quality:1};
    const pointer={x:-9999,y:-9999,tx:0,ty:0,active:false,id:null,hover:0,force:0};
    const motion={x:0,y:0,vx:0,vy:0};
    const sensor={tx:0,ty:0,kx:0,ky:0,base:null,gravity:null,gravityBase:null,last:0,orientationAt:0,motionAt:0,
      asked:false,orientation:false,acceleration:false,orientationAllowed:false,motionAllowed:false};
    let gpu=null,fallback=null,disposed=false,manualPause=false,inView=false,gpuLost=false;
    let raf=0,timer=0,previous=0,resizeRAF=0,cost=0,samples=0;
    let hidden=!document.hidden,wasActive=false;
    const lineCache=document.createElement('canvas');
    lineCache.width=asset.width;lineCache.height=asset.height;
    const lc=lineCache.getContext('2d');
    // Original geometric marks are rendered once, directly from paths.
    if(asset.mode===1){
      lc.strokeStyle='rgba(184,189,190,.20)';lc.lineWidth=.65;
      for(const x of [40,176,331,664,899]){lc.beginPath();lc.moveTo(x,0);lc.lineTo(x,1672);lc.stroke();}
      for(const y of [211,406,1069]){lc.beginPath();lc.moveTo(0,y);lc.lineTo(941,y);lc.stroke();}
      lc.beginPath();lc.moveTo(-85,1355);lc.bezierCurveTo(190,1160,470,1010,1040,802);
      lc.strokeStyle='rgba(184,189,190,.27)';lc.lineWidth=.95;lc.stroke();
      lc.beginPath();lc.moveTo(1006,636);lc.bezierCurveTo(683,692,265,1035,99,1286);
      lc.bezierCurveTo(-42,1505,118,1602,426,1660);lc.bezierCurveTo(575,1696,739,1733,855,1741);
      lc.strokeStyle='rgba(196,200,201,.62)';lc.lineWidth=1.22;lc.stroke();
      for(const [x,y] of [[202,1158],[753,720]]){lc.beginPath();lc.arc(x,y,6,0,Math.PI*2);lc.fillStyle='#959798';lc.fill();}
    }else if(asset.lines){
      const xy=p=>[p[0]*asset.width,p[1]*asset.height];
      lc.lineWidth=.65;lc.strokeStyle='rgba(255,255,255,.36)';
      for(const arc of asset.lines.arcs){lc.beginPath();lc.moveTo(...xy(arc[0]));for(let i=3;i<arc.length;i+=3)lc.bezierCurveTo(...xy(arc[i-2]),...xy(arc[i-1]),...xy(arc[i]));lc.stroke();}
      lc.strokeStyle='rgba(255,255,255,.23)';
      for(const line of asset.lines.lines){lc.beginPath();lc.moveTo(...xy(line[0]));lc.lineTo(...xy(line[1]));lc.stroke();}
      for(const [nx,ny,size] of asset.lines.crosses){const x=nx*asset.width,y=ny*asset.height,r=size*asset.width;lc.beginPath();lc.moveTo(x-r,y);lc.lineTo(x+r,y);lc.moveTo(x,y-r);lc.lineTo(x,y+r);lc.stroke();}
    }
    function makeGPU(){
      const gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,powerPreference:'low-power',premultipliedAlpha:true});
      if(!gl)return false;
      const shaders=[];
      const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);shaders.push(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
      const program=gl.createProgram();
      gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
      shaders.forEach(s=>gl.deleteShader(s));gl.useProgram(program);
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW);
      for(const [name,count,offset] of [['aPoint',4,0],['aDetail',4,16],['aExtra',2,32]]){
        const at=gl.getAttribLocation(program,name);if(at>=0){gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,count,gl.FLOAT,false,40,offset);}
      }
      const u={};for(const name of ['Size','Source','Offset','Motion','Cursor','Scale','Dpr','Time','Force','Animate','Mode'])u[name]=gl.getUniformLocation(program,'u'+name);
      // Store premultiplied color and an independently accumulated alpha channel.
      // Matching the browser's compositor avoids applying particle opacity twice.
      gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,asset.mode===0?gl.ONE_MINUS_SRC_ALPHA:gl.ONE,gl.ONE,asset.mode===0?gl.ONE_MINUS_SRC_ALPHA:gl.ONE);
      gl.disable(gl.DEPTH_TEST);gl.disable(gl.DITHER);
      gpu={gl,program,buffer,u};state.renderer='webgl';return true;
    }
    function makeFallback(){
      // A canvas that has acquired WebGL cannot acquire a 2D context: replace it.
      const replacement=canvas.cloneNode();canvas.replaceWith(replacement);canvas=replacement;
      const ctx=canvas.getContext('2d');
      const layers=Array.from({length:3},()=>{const c=document.createElement('canvas');c.width=asset.width;c.height=asset.height;return c;});
      const contexts=layers.map(c=>c.getContext('2d'));
      if(asset.mode===3){
        for(let i=0;i<points.length;i+=10){
          const [x,y,l,group,seed,size,angle,shape]=points.subarray(i,i+8),c=contexts[group];
          c.save();c.translate(x,y);c.rotate(angle);c.fillStyle=`rgba(255,255,255,${l/255*(group===0?.85:1)})`;
          const base=size*.78;
          if(shape===0){c.beginPath();c.arc(0,0,Math.max(.35,base*.58),0,Math.PI*2);c.fill();}
          else if(shape<3)c.fillRect(-base*(shape===1?.95:1.1),-Math.max(.5,base*.3)/2,base*(shape===1?1.9:2.2),Math.max(.5,base*.3));
          else c.fillRect(-base*.575,-base*.575,base*1.15,base*1.15);
          c.restore();
        }
      }else{
        const images=contexts.map(c=>c.createImageData(asset.width,asset.height));
        for(let i=0;i<points.length;i+=10){
          const x=points[i],y=points[i+1],l=points[i+2];
          const group=asset.mode===1?Math.min(2,points[i+3]):x<asset.width*.43?0:x>asset.width*.62?2:1;
          const j=(y*asset.width+x)*4,a=images[group].data;
          a[j]=a[j+1]=a[j+2]=255;a[j+3]=clamp((l-(asset.mode===1?0:11))*(asset.mode===1?1.07:1),0,255);
        }
        contexts.forEach((c,i)=>c.putImageData(images[i],0,0));
      }
      fallback={ctx,layers};state.renderer='canvas2d';state.quality=.85;
    }
    try{if(!makeGPU())makeFallback();}catch(error){console.warn('Langscope hero: Canvas fallback',error.message);makeFallback();}

    function size(){
      if(disposed)return;
      const rect=stage.getBoundingClientRect();state.width=Math.max(1,rect.width);state.height=Math.max(1,rect.height);
      const contain=Math.min(state.width/asset.width,state.height/asset.height);
      const cover=Math.max(state.width/asset.width,state.height/asset.height);
      // At most 8% enlargement over contain, avoiding destructive crops at 4:3 / ultrawide.
      state.scale=options.fit==='contain'?contain:Math.min(cover,contain*1.08);
      state.x=(state.width-asset.width*state.scale)*.5;state.y=(state.height-asset.height*state.scale)*.5;
      const budget=coarse.matches?1500000:3200000;
      state.dpr=Math.max(.65,Math.min(devicePixelRatio||1,coarse.matches?1.8:2,Math.sqrt(budget/(state.width*state.height)))*state.quality);
      for(const c of [background,canvas]){c.width=Math.max(1,Math.round(state.width*state.dpr));c.height=Math.max(1,Math.round(state.height*state.dpr));}
      if(gpu)gpu.gl.viewport(0,0,canvas.width,canvas.height);
      paint();
    }
    function paint(){
      if(disposed)return;
      bc.setTransform(state.dpr,0,0,state.dpr,0,0);bc.fillStyle='#090909';bc.fillRect(0,0,state.width,state.height);
      bc.save();bc.translate(state.x+motion.x*2,state.y+motion.y*2);bc.scale(state.scale,state.scale);bc.drawImage(lineCache,0,0);bc.restore();
      if(gpu){
        const {gl,u}=gpu;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(u.Size,state.width,state.height);gl.uniform2f(u.Source,asset.width,asset.height);
        gl.uniform2f(u.Offset,state.x,state.y);gl.uniform2f(u.Motion,motion.x,motion.y);
        gl.uniform2f(u.Cursor,pointer.x,pointer.y);gl.uniform1f(u.Scale,state.scale);gl.uniform1f(u.Dpr,state.dpr);
        gl.uniform1f(u.Time,state.time);gl.uniform1f(u.Force,reduced.matches?0:pointer.force);
        gl.uniform1f(u.Animate,reduced.matches?0:1);gl.uniform1f(u.Mode,asset.mode);
        gl.drawArrays(gl.POINTS,0,asset.count);
      }else if(fallback){
        const {ctx,layers}=fallback;ctx.setTransform(state.dpr,0,0,state.dpr,0,0);ctx.clearRect(0,0,state.width,state.height);
        ctx.globalCompositeOperation=asset.mode===0?'source-over':'lighter';
        layers.forEach((layer,i)=>{
          const depth=[.35,.68,1][i],ambient=reduced.matches?0:Math.sin(state.time*.22+i)*.6;
          ctx.globalAlpha=reduced.matches?1:.98+.02*Math.sin(state.time*.4+i);
          ctx.drawImage(layer,state.x+(motion.x*32*depth+ambient)*state.scale,state.y+motion.y*37*depth*state.scale,asset.width*state.scale,asset.height*state.scale);
        });ctx.globalAlpha=1;
      }
      state.frames++;
    }
    function wantsRun(){return !disposed&&!gpuLost&&!manualPause&&hidden&&inView&&!reduced.matches;}
    function stop(){cancelAnimationFrame(raf);clearTimeout(timer);raf=timer=0;previous=0;state.running=false;}
    function queue(delay=0){
      if(!wantsRun()||raf||timer)return;
      state.running=true;
      if(delay>1)timer=setTimeout(()=>{timer=0;if(wantsRun())raf=requestAnimationFrame(frame);},delay);
      else raf=requestAnimationFrame(frame);
    }
    function frame(ts){
      raf=0;if(!wantsRun()){stop();return;}
      const start=performance.now(),dt=previous?clamp((ts-previous)/1000,.001,.05):1/30;previous=ts;
      const stale=performance.now()-sensor.last>900;
      if(stale){sensor.tx*=Math.exp(-dt*4);sensor.ty*=Math.exp(-dt*4);}
      sensor.kx*=Math.exp(-dt*5);sensor.ky*=Math.exp(-dt*5);
      const touchWeight=pointer.active?.7:1;
      const tx=clamp(pointer.tx+(sensor.tx+sensor.kx)*touchWeight,-1,1);
      const ty=clamp(pointer.ty+(sensor.ty+sensor.ky)*touchWeight,-1,1);
      // Stable critically damped spring integrated in short fixed substeps.
      const steps=Math.ceil(dt/.008),step=dt/steps;
      for(let i=0;i<steps;i++){
        motion.vx+=(100*(tx-motion.x)-20*motion.vx)*step;
        motion.vy+=(100*(ty-motion.y)-20*motion.vy)*step;
        motion.x+=motion.vx*step;motion.y+=motion.vy*step;
      }
      if(!pointer.active&&!pointer.hover){pointer.tx*=Math.exp(-dt*5);pointer.ty*=Math.exp(-dt*5);}
      pointer.force+=((pointer.active||pointer.hover?1:0)-pointer.force)*(1-Math.exp(-dt*9));
      state.time+=dt;paint();
      cost+=performance.now()-start;samples++;
      if(samples>=100){
        if(cost/samples>18&&state.quality>.65){state.quality=Math.max(.65,state.quality-.12);size();}
        samples=cost=0;
      }
      const active=pointer.active||pointer.hover||Math.hypot(motion.vx,motion.vy)>.05||Math.abs(sensor.kx)+Math.abs(sensor.ky)>.03;
      const fps=fallback||state.quality<.8?30:active?60:30;
      queue(Math.max(0,1000/fps-(performance.now()-start)-3));
    }
    function reset(){
      pointer.active=false;pointer.id=null;pointer.tx=pointer.ty=pointer.hover=pointer.force=0;
      sensor.tx=sensor.ty=sensor.kx=sensor.ky=0;sensor.base=sensor.gravity=sensor.gravityBase=null;
      sensor.last=sensor.orientationAt=sensor.motionAt=0;
      motion.x=motion.y=motion.vx=motion.vy=0;
    }
    function axes(x,y){
      const angle=((screen.orientation?.angle??window.orientation??0)+360)%360;
      if(angle===90)return [y,-x];if(angle===180)return [-x,-y];if(angle===270)return [-y,x];return [x,y];
    }
    function orientation(e){
      if(!wantsRun()||!Number.isFinite(e.gamma)||!Number.isFinite(e.beta))return;
      sensor.last=sensor.orientationAt=performance.now();
      if(!sensor.base)sensor.base=[e.gamma,e.beta];
      const diff=(a,b)=>((a-b+540)%360)-180;
      const [x,y]=axes(diff(e.gamma,sensor.base[0]),diff(e.beta,sensor.base[1]));
      sensor.tx=clamp(x/22,-1,1);sensor.ty=clamp(y/26,-1,1);state.sensors='orientation';
    }
    function acceleration(e){
      if(!wantsRun())return;
      const now=performance.now(),dt=sensor.motionAt?clamp((now-sensor.motionAt)/1000,.004,.1):.017;
      const g=e.accelerationIncludingGravity,a=e.acceleration;
      sensor.motionAt=now;sensor.last=now;
      let x=0,y=0;
      const gravityValid=g&&Number.isFinite(g.x)&&Number.isFinite(g.y);
      if(gravityValid){
        if(!sensor.gravity)sensor.gravity=[g.x,g.y];
        const f=1-Math.exp(-dt*3);
        sensor.gravity[0]+=(g.x-sensor.gravity[0])*f;sensor.gravity[1]+=(g.y-sensor.gravity[1])*f;
        if(!sensor.orientationAt||now-sensor.orientationAt>700){
          if(!sensor.gravityBase)sensor.gravityBase=sensor.gravity.slice();
          const [gx,gy]=axes(sensor.gravity[0]-sensor.gravityBase[0],sensor.gravity[1]-sensor.gravityBase[1]);
          sensor.tx=clamp(gx/4,-1,1);sensor.ty=clamp(gy/4.5,-1,1);state.sensors='gravity';
        }
      }
      if(a&&Number.isFinite(a.x)&&Number.isFinite(a.y)){x=a.x;y=a.y;}
      else if(gravityValid){x=g.x-sensor.gravity[0];y=g.y-sensor.gravity[1];}
      [x,y]=axes(x,y);
      const dead=v=>Math.abs(v)<.3?0:clamp(v,-10,10);
      sensor.kx=clamp(sensor.kx+dead(x)*dt*.7,-.28,.28);sensor.ky=clamp(sensor.ky+dead(y)*dt*.7,-.28,.28);
    }
    function attachSensors(){
      if(!wantsRun()||!coarse.matches||!isSecureContext)return;
      if(sensor.orientationAllowed&&!sensor.orientation){window.addEventListener('deviceorientation',orientation,{passive:true});sensor.orientation=true;}
      if(sensor.motionAllowed&&!sensor.acceleration){window.addEventListener('devicemotion',acceleration,{passive:true});sensor.acceleration=true;}
    }
    function detachSensors(){
      window.removeEventListener('deviceorientation',orientation);window.removeEventListener('devicemotion',acceleration);
      sensor.orientation=sensor.acceleration=false;
    }
    function initSensorAccess(){
      if(!isSecureContext||!coarse.matches||reduced.matches)return;
      sensor.orientationAllowed=!!window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission!=='function';
      sensor.motionAllowed=!!window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission!=='function';
    }
    function requestSensors(){
      if(disposed||sensor.asked||!isSecureContext||!coarse.matches||reduced.matches)return;
      sensor.asked=true;state.sensors='requested';
      // Both iOS requests start synchronously inside the same real pointer-up gesture.
      for(const [API,key] of [[window.DeviceOrientationEvent,'orientationAllowed'],[window.DeviceMotionEvent,'motionAllowed']]){
        if(!API)continue;
        if(typeof API.requestPermission==='function'){
          try{Promise.resolve(API.requestPermission()).then(result=>{if(disposed)return;sensor[key]=result==='granted';state.sensors=result==='granted'?'ready':'denied';attachSensors();}).catch(()=>{if(!disposed)state.sensors='unavailable';});}catch(_){state.sensors='unavailable';}
        }
      }
      attachSensors();
    }
    function input(e){
      if(reduced.matches||e.isPrimary===false||e.target.closest?.(interactive))return;
      if(e.pointerType!=='mouse'&&!pointer.active)return;
      const r=stage.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;
      pointer.tx=clamp((pointer.x/state.width-.5)*2,-1,1)*(e.pointerType==='mouse'?1:.7);
      pointer.ty=clamp((pointer.y/state.height-.5)*2,-1,1)*(e.pointerType==='mouse'?1:.7);
      if(e.pointerType==='mouse')pointer.hover=1;
      queue();
    }
    listen(stage,'pointermove',input);
    listen(stage,'pointerdown',e=>{
      if(e.target.closest?.(interactive)||e.isPrimary===false||reduced.matches||e.button>0)return;
      pointer.active=true;pointer.id=e.pointerId;input(e);
      // No pointer capture or preventDefault: site scroll, links and zoom stay native.
    });
    const release=e=>{if(pointer.id!==null&&e.pointerId!==pointer.id)return;pointer.active=false;pointer.id=null;if(e.pointerType!=='mouse')pointer.tx=pointer.ty=pointer.hover=0;};
    listen(window,'pointerup',release);listen(window,'pointercancel',release);
    listen(stage,'pointerup',e=>{if(!e.target.closest?.(interactive))requestSensors();});
    listen(stage,'pointerleave',()=>{pointer.hover=0;if(!pointer.active)pointer.tx=pointer.ty=0;});
    listen(window,'blur',()=>{reset();});
    function refresh(){
      state.visible=inView&&hidden&&!manualPause;
      const active=wantsRun();
      if(active&&!wasActive){reset();attachSensors();queue();}
      else if(!active){stop();detachSensors();reset();if(inView&&hidden)paint();}
      wasActive=active;
    }
    listen(document,'visibilitychange',()=>{hidden=!document.hidden;refresh();});
    listen(reduced,'change',()=>{reset();refresh();});
    listen(coarse,'change',()=>{detachSensors();initSensorAccess();attachSensors();});
    const orient=()=>{reset();size();};
    if(screen.orientation)listen(screen.orientation,'change',orient);else listen(window,'orientationchange',orient);
    const ro=new ResizeObserver(()=>{cancelAnimationFrame(resizeRAF);resizeRAF=requestAnimationFrame(()=>{resizeRAF=0;size();});});ro.observe(stage);
    const io=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;refresh();},{threshold:0});io.observe(stage);
    function contextLost(e){e.preventDefault();gpuLost=true;stop();detachSensors();state.renderer='context-lost';}
    function contextRestored(){if(disposed)return;gpuLost=false;gpu=null;try{if(!makeGPU())makeFallback();}catch(_){makeFallback();}size();attachSensors();queue();}
    if(gpu){canvas.addEventListener('webglcontextlost',contextLost,{signal});canvas.addEventListener('webglcontextrestored',contextRestored,{signal});}
    initSensorAccess();size();
    const controller={
      pause(){manualPause=true;refresh();},resume(){manualPause=false;refresh();},
      recalibrate(){reset();},requestSensors,
      getState(){return {...state,profile:asset.id,reducedMotion:reduced.matches};},
      destroy(){
        if(disposed)return;disposed=true;stop();cancelAnimationFrame(resizeRAF);detachSensors();abort.abort();ro.disconnect();io.disconnect();
        if(gpu){gpu.gl.deleteBuffer(gpu.buffer);gpu.gl.deleteProgram(gpu.program);gpu.gl.getExtension('WEBGL_lose_context')?.loseContext();}
        root.remove();lineCache.width=lineCache.height=1;instances.delete(controller);
      }
    };
    instances.add(controller);return controller;
  }

  function responsive(stage,section,options={}){
    if(!['ranking','comparison'].includes(section))throw Error('Use ranking or comparison');
    const mq=matchMedia('(max-width: 767px)');
    const base=new URL(options.assetsBase||'./assets/',scriptBase).href;
    let current=null,request=null,destroyed=false,paused=false,revision=0;
    const loaded=new Map();
    async function update(){
      const id=section+'-'+(mq.matches?'mobile':'desktop'),version=++revision;
      request?.abort();request=new AbortController();
      try{
        let asset=loaded.get(id);
        if(!asset){const response=await fetch(new URL(id+'.json',base),{signal:request.signal});if(!response.ok)throw Error('Hero asset HTTP '+response.status);asset=await response.json();loaded.set(id,asset);}
        if(destroyed||version!==revision)return;
        // Keep the previous artwork until the next asset is ready, then release its GPU context.
        current?.destroy();current=mount(stage,asset,options);if(paused)current.pause();
        stage.dispatchEvent(new CustomEvent('hero:ready',{detail:{id}}));
      }catch(error){if(error.name!=='AbortError')stage.dispatchEvent(new CustomEvent('hero:error',{detail:{message:error.message}}));}
    }
    const io=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){io.disconnect();update();}},{rootMargin:'200px'});io.observe(stage);
    const changed=()=>{if(current)update();};mq.addEventListener('change',changed);
    return {pause(){paused=true;current?.pause();},resume(){paused=false;current?.resume();},getState(){return current?.getState()||{renderer:'loading'};},
      requestSensors(){current?.requestSensors();},recalibrate(){current?.recalibrate();},destroy(){destroyed=true;request?.abort();mq.removeEventListener('change',changed);io.disconnect();current?.destroy();loaded.clear();}};
  }
  const pauseAll=()=>{for(const instance of instances)instance.pause();};
  // BFCache is handled by visibilitychange; do not destroy the document on pagehide.
  window.LangscopeHero=Object.freeze({mount,responsive,decode,pauseAll,version:'1.0.0'});
})();
