
#define S(a,b,c) smoothstep(a,b,c)
uniform vec2 u_resolution; // This is passed in as a uniform from the sketch.js file
uniform float u_time;
float N21 (vec2 p){
	float d = fract(sin(p.x*110.+(8.21-p.y)*331.)*1218.);
    return d;
}

float Noise2D(vec2 uv){
    vec2 st = fract(uv);
    vec2 id = floor(uv);
    st = st*st*(3.0-2.0*st);
    float c=mix(mix(N21(id),N21(id+vec2(1.0,0.0)),st.x),mix(N21(id+vec2(0.0,1.0)),N21(id+vec2(1.0,1.0)),st.x),st.y);
	return c;
}

float fbm (vec2 uv){
    
    float c=0.;
	c+=Noise2D(uv)/2.;
    c+=Noise2D(2.*uv)/4.;
    c+=Noise2D(4.*uv)/8.;
    c+=Noise2D(8.*uv)/16.;
    return c/(1.-1./16.);
}
vec2 rot(vec2 uv,float a){
	return vec2(uv.x*cos(a)-uv.y*sin(a),uv.y*cos(a)+uv.x*sin(a));
}
float line(vec2 a, vec2 b, vec2 p){
	vec2 ap = p-a;
    vec2 ab = b-a;
    float t = clamp(dot (ap,ab)/dot(ab,ab),0.0,1.0);
    vec2 at = t*ab;
    vec2 pt = at-ap;
    return length(pt);
}
void main() {

  // position of the pixel divided by resolution, to get normalized positions on the canvas
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  uv-=0.5;
  uv*=2.; 
    float l=length(uv);
    vec2 uv_o=uv;

    uv.x-=0.24*sin(6.28*fbm(rot(uv*pow(l,0.5),u_time*0.05)*2.6)+u_time*0.2)*pow(l,sin(u_time*0.2)+2.0);
    uv.y-=0.24*sin(6.28*fbm(rot(uv*pow(l,0.5),u_time*0.05)*2.6)+u_time*0.2)*pow(l,sin(u_time*0.2)+2.0);
    // Time varying pixel color
    
    uv=rot(uv,-u_time*0.02*(pow(l,0.5)-0.5));
    float off=fbm(uv);
    
    float m=fract(length(uv)*40.*pow(l,1.5));
    float n=floor(length(uv)*50.*pow(l,1.5));
    float width=(fract(n*324.543)*2.+0.5)*0.14;
    float brown=S(1.0,1.0-width,m)*S(0.,width,m);
    vec3 color=vec3(0.37,0.32,0.28)+vec3(0.1,0.1,0.1)*floor(n/10.)+vec3(0.2,0.2,0.19)*Noise2D(rot(uv*10.+u_time*0.003,u_time*0.1)*1.2)*0.3;
    color-=(1.0-brown)*vec3(0.8,1.0,1.0)*width*1.7*off*(sin(u_time*0.2)-0.5);
    float lightBrown=S(1.2,0.8,m)*S(0.6,0.9,m);
    color-=lightBrown*vec3(0.15,0.2,0.25)*off*sin(n)*2.;
    color+=vec3(0.9,0.9,0.8)*0.2*fbm(vec2(fract(length(uv*30.))+u_time*0.1,uv.y));
    
    float angle=fract(atan(uv.y,uv.x));
    float crack;
    //crack=S(0.02,0.0,line(vec2(0.,0.),vec2(1.,1.),uv_o));
    vec3 col = color;
    //col=vec3(crack);
    
    // Output to screen

  gl_FragColor = vec4(col,0.9); // R,G,B,A

  // you can only have one gl_FragColor active at a time, but try commenting the others out
  // try the green component

  //gl_FragColor = vec4(0.0,st.x,0.0,1.0); 

  // try both the x position and the y position
  
  //gl_FragColor = vec4(st.x,st.y,0.0,1.0); 
}
