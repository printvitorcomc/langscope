/* About-style organic dissolve, adapted to this site's two local views.
   Reference: https://tympanus.net/codrops/2026/04/08/creating-custom-page-transitions-in-astro-with-barba-js-and-gsap/
   Noise reference: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
   The hero renderer and coordinate assets remain independent and unchanged. */
(() => {
  'use strict';
  const canvas=document.createElement('canvas');
  canvas.className='page-transition';
  canvas.id='page-transition';
  canvas.hidden=true;
  canvas.setAttribute('aria-hidden','true');
  canvas.dataset.phase='idle';
  document.body.append(canvas);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const phaseDuration=250;
  const shell=document.querySelector('.shell');
  let renderer=null,progress=1.5,finishFrame=null;

  function makeRenderer(){
    const color=getComputedStyle(document.documentElement).getPropertyValue('--page-transition-color').trim();
    const rgb=(/^#([\da-f]{6})$/i.exec(color)?.[1]||'090909').match(/../g).map(part=>parseInt(part,16));
    let gl;
    try{gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,depth:false,stencil:false});}catch{/* Canvas fallback below. */}
    if(gl){
      const compile=(type,source)=>{
        const shader=gl.createShader(type);
        gl.shaderSource(shader,source);gl.compileShader(shader);
        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw Error('Transition shader compilation failed');}
        return shader;
      };
      const vertex=compile(gl.VERTEX_SHADER,`
        attribute vec2 position;
        varying vec2 uv;
        void main(){uv=(position+1.)*.5;gl_Position=vec4(position,0.,1.);}
      `);
      const fragment=compile(gl.FRAGMENT_SHADER,`
        precision highp float;
        varying vec2 uv;
        uniform float progress;
        uniform vec3 color;
        float randomValue(vec2 p){return fract(sin(dot(p,vec2(12.9898,4.1414)))*43758.5453);}
        float valueNoise(vec2 p){
          vec2 cell=floor(p),blend=fract(p);
          blend=blend*blend*(3.-2.*blend);
          float value=mix(mix(randomValue(cell),randomValue(cell+vec2(1.,0.)),blend.x),
            mix(randomValue(cell+vec2(0.,1.)),randomValue(cell+vec2(1.,1.)),blend.x),blend.y);
          return value*value;
        }
        void main(){
          float field=valueNoise(uv*5.);
          float alpha=1.-smoothstep(1.-progress-.185,1.-progress+.185,field);
          gl_FragColor=vec4(color,alpha);
        }
      `);
      const program=gl.createProgram();
      gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
      gl.deleteShader(vertex);gl.deleteShader(fragment);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Transition shader linking failed');
      gl.useProgram(program);
      const buffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
      const position=gl.getAttribLocation(program,'position');
      gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
      const uniform=gl.getUniformLocation(program,'progress');
      gl.uniform3f(gl.getUniformLocation(program,'color'),...rgb.map(value=>value/255));
      canvas.dataset.renderer='webgl';
      return {
        size(){
          // Match the reference: at most one backing pixel per CSS pixel.
          canvas.width=Math.max(1,innerWidth);canvas.height=Math.max(1,innerHeight);
          gl.viewport(0,0,canvas.width,canvas.height);
        },
        draw(value){gl.uniform1f(uniform,value);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
      };
    }

    // Use the same noise field and smooth edge when WebGL is unavailable.
    const ctx=canvas.getContext('2d');
    if(!ctx)throw Error('No transition renderer available');
    const fract=value=>value-Math.floor(value);
    const random=(x,y)=>fract(Math.sin(x*12.9898+y*4.1414)*43758.5453);
    const mix=(a,b,t)=>a+(b-a)*t;
    let image,field;
    canvas.dataset.renderer='canvas2d';
    return {
      size(){
        const scale=Math.min(1,360/innerWidth,640/innerHeight);
        canvas.width=Math.max(1,Math.round(innerWidth*scale));
        canvas.height=Math.max(1,Math.round(innerHeight*scale));
        image=ctx.createImageData(canvas.width,canvas.height);
        field=new Float32Array(canvas.width*canvas.height);
        for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
          const px=(x+.5)/canvas.width*5,py=(1-(y+.5)/canvas.height)*5;
          const ix=Math.floor(px),iy=Math.floor(py),fx=fract(px),fy=fract(py);
          const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
          const noise=mix(mix(random(ix,iy),random(ix+1,iy),u),mix(random(ix,iy+1),random(ix+1,iy+1),u),v);
          const i=y*canvas.width+x;
          field[i]=noise*noise;
          image.data.set(rgb,i*4);
        }
      },
      draw(value){
        for(let i=0;i<field.length;i++){
          const t=Math.max(0,Math.min(1,(field[i]-(1-value-.185))/.37));
          image.data[i*4+3]=Math.round((1-t*t*(3-2*t))*255);
        }
        ctx.putImageData(image,0,0);
      }
    };
  }

  function draw(value){
    progress=value;
    renderer?.draw(value);
    canvas.dataset.progress=value.toFixed(3);
  }

  function tween(from,to){
    // Keep the reference's quadratic ease-in, with a shorter 250 ms per phase.
    if(reduced.matches||document.hidden){draw(to);return Promise.resolve();}
    return new Promise(resolve=>{
      const started=performance.now();
      let frame;
      const finish=()=>{
        cancelAnimationFrame(frame);
        draw(to);finishFrame=null;resolve();
      };
      finishFrame=finish;
      const tick=now=>{
        if(reduced.matches||document.hidden){finish();return;}
        const t=Math.min(1,(now-started)/phaseDuration);
        draw(from+(to-from)*t*t);
        if(t<1)frame=requestAnimationFrame(tick);else finish();
      };
      frame=requestAnimationFrame(tick);
    });
  }

  async function run(change){
    if(reduced.matches||document.hidden){await change();return;}
    if(!renderer){
      try{renderer=makeRenderer();}catch{
        // Navigation remains available even if the transition cannot initialize.
        canvas.dataset.renderer='unavailable';await change();return;
      }
    }
    const wasInert=shell.inert;
    shell.inert=true;
    document.documentElement.classList.add('is-page-transitioning');
    try{
      renderer.size();draw(1.5);
      canvas.hidden=false;
      canvas.dataset.phase='covering';
      await tween(1.5,-.75);
      canvas.dataset.phase='covered';
      await change();
      canvas.dataset.phase='revealing';
      await tween(-.75,1.5);
    }finally{
      canvas.hidden=true;canvas.dataset.phase='idle';
      document.documentElement.classList.remove('is-page-transitioning');
      shell.inert=wasInert;
    }
  }

  addEventListener('resize',()=>{if(!canvas.hidden){renderer?.size();draw(progress);}},{passive:true});
  const finishIfHidden=()=>{if(document.hidden||reduced.matches)finishFrame?.();};
  document.addEventListener('visibilitychange',finishIfHidden);
  reduced.addEventListener('change',finishIfHidden);
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();renderer=null;finishFrame?.();
  });
  window.LangscopeTransition=Object.freeze({run});
})();
