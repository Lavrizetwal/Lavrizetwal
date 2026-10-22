/* Générateur de QR intégré (qrcode-generator, MIT) — aucune dépendance externe */
var qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw"code length overflow. ("+o.getLengthInBits()+">"+8*u+")";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||"Byte"){case"Numeric":e=M(t);break;case"Alphanumeric":e=x(t);break;case"Byte":e=m(t);break;case"Kanji":e=L(t);break;default:throw"mode:"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+","+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<f.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<f.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=f.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},f.createSvgTag=function(t,r,e,n){var o={};"object"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e="string"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||"qrcode-description":null,(n="string"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||"qrcode-title":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l="";for(c="l"+t+",0 0,"+t+" -"+t+",0 0,-"+t+"z ",l+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',l+=o.scalable?"":' width="'+g+'px" height="'+g+'px"',l+=' viewBox="0 0 '+g+" "+g+'" ',l+=' preserveAspectRatio="xMinYMin meet"',l+=n.text||e.text?' role="img" aria-labelledby="'+y([n.id,e.id].join(" ").trim())+'"':"",l+=">",l+=n.text?'<title id="'+y(n.id)+'">'+y(n.text)+"</title>":"",l+=e.text?'<description id="'+y(e.id)+'">'+y(e.text)+"</description>":"",l+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',l+='<path d="',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+="M"+(i*t+r)+","+u+c);return l+='" stroke="transparent" fill="black"/>',l+="</svg>"},f.createDataURL=function(t,r){t=t||2,r=void 0===r?4*t:r;var e=f.getModuleCount()*t+2*r,n=r,o=e-r;return I(e,e,function(r,e){if(n<=r&&r<o&&n<=e&&e<o){var i=Math.floor((r-n)/t),a=Math.floor((e-n)/t);return f.isDark(a,i)?0:1}return 1})},f.createImgTag=function(t,r,e){t=t||2,r=void 0===r?4*t:r;var n=f.getModuleCount()*t+2*r,o="";return o+="<img",o+=' src="',o+=f.createDataURL(t,r),o+='"',o+=' width="',o+=n,o+='"',o+=' height="',o+=n,o+='"',e&&(o+=' alt="',o+=y(e),o+='"'),o+="/>"};var y=function(t){for(var r="",e=0;e<t.length;e+=1){var n=t.charAt(e);switch(n){case"<":r+="&lt;";break;case">":r+="&gt;";break;case"&":r+="&amp;";break;case'"':r+="&quot;";break;default:r+=n}}return r};return f.createASCII=function(t,r){if((t=t||1)<2)return function(t){t=void 0===t?2:t;var r,e,n,o,i,a=1*f.getModuleCount()+2*t,u=t,c=a-t,g={"██":"█","█ ":"▀"," █":"▄","  ":" "},l={"██":"▀","█ ":"▀"," █":" ","  ":" "},h="";for(r=0;r<a;r+=2){for(n=Math.floor((r-u)/1),o=Math.floor((r+1-u)/1),e=0;e<a;e+=1)i="█",u<=e&&e<c&&u<=r&&r<c&&f.isDark(n,Math.floor((e-u)/1))&&(i=" "),u<=e&&e<c&&u<=r+1&&r+1<c&&f.isDark(o,Math.floor((e-u)/1))?i+=" ":i+="█",h+=t<1&&r+1>=c?l[i]:g[i];h+="\n"}return a%2&&t>0?h.substring(0,h.length-a-1)+Array(a+1).join("▀"):h.substring(0,h.length-1)}(r);t-=1,r=void 0===r?2*t:r;var e,n,o,i,a=f.getModuleCount()*t+2*r,u=r,c=a-r,g=Array(t+1).join("██"),l=Array(t+1).join("  "),h="",s="";for(e=0;e<a;e+=1){for(o=Math.floor((e-u)/t),s="",n=0;n<a;n+=1)i=1,u<=n&&n<c&&u<=e&&e<c&&f.isDark(o,Math.floor((n-u)/t))&&(i=0),s+=i?g:l;for(o=0;o<t;o+=1)h+=s+"\n"}return h.substring(0,h.length-1)},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?"black":"white",t.fillRect(n*r,o*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default,t.createStringToBytes=function(t,r){var e=function(){for(var e=S(t),n=function(){var t=e.read();if(-1==t)throw"eof";return t},o=0,i={};;){var a=e.read();if(-1==a)break;var u=n(),f=n()<<8|n();i[String.fromCharCode(a<<8|u)]=f,o+=1}if(o!=r)throw o+" != "+r;return i}(),n="?".charCodeAt(0);return function(t){for(var r=[],o=0;o<t.length;o+=1){var i=t.charCodeAt(o);if(i<128)r.push(i);else{var a=e[t.charAt(o)];"number"==typeof a?(255&a)==a?r.push(a):(r.push(a>>>8),r.push(255&a)):r.push(n)}}return r}};var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw"bad maskPattern:"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw"mode:"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw"mode:"+t}else{if(!(r<41))throw"type:"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw"mode:"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw"glog("+t+")";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+"/"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);if("A"<=t&&t<="Z")return t.charCodeAt(0)-"A".charCodeAt(0)+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw"sjis not supported.";!function(){var t=n("友");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw"sjis not supported."}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw"illegal char at "+(e+1)+"/"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw"illegal char at "+(e+1)}};return i},D=function(){var t=[],r={writeByte:function(r){t.push(255&r)},writeShort:function(t){r.writeByte(t),r.writeByte(t>>>8)},writeBytes:function(t,e,n){e=e||0,n=n||t.length;for(var o=0;o<n;o+=1)r.writeByte(t[o+e])},writeString:function(t){for(var e=0;e<t.length;e+=1)r.writeByte(t.charCodeAt(e))},toByteArray:function(){return t},toString:function(){var r="";r+="[";for(var e=0;e<t.length;e+=1)e>0&&(r+=","),r+=t[e];return r+="]"}};return r},S=function(t){var r=t,e=0,n=0,o=0,i={read:function(){for(;o<8;){if(e>=r.length){if(0==o)return-1;throw"unexpected end of file./"+o}var t=r.charAt(e);if(e+=1,"="==t)return o=0,-1;t.match(/^\s$/)||(n=n<<6|a(t.charCodeAt(0)),o+=6)}var i=n>>>o-8&255;return o-=8,i}},a=function(t){if(65<=t&&t<=90)return t-65;if(97<=t&&t<=122)return t-97+26;if(48<=t&&t<=57)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw"c:"+t};return i},I=function(t,r,e){for(var n=function(t,r){var e=t,n=r,o=new Array(t*r),i={setPixel:function(t,r,n){o[r*e+t]=n},write:function(t){t.writeString("GIF87a"),t.writeShort(e),t.writeShort(n),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(e),t.writeShort(n),t.writeByte(0);var r=a(2);t.writeByte(2);for(var o=0;r.length-o>255;)t.writeByte(255),t.writeBytes(r,o,255),o+=255;t.writeByte(r.length-o),t.writeBytes(r,o,r.length-o),t.writeByte(0),t.writeString(";")}},a=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,i=u(),a=0;a<r;a+=1)i.add(String.fromCharCode(a));i.add(String.fromCharCode(r)),i.add(String.fromCharCode(e));var f,c,g,l=D(),h=(f=l,c=0,g=0,{write:function(t,r){if(t>>>r!=0)throw"length over";for(;c+r>=8;)f.writeByte(255&(t<<c|g)),r-=8-c,t>>>=8-c,g=0,c=0;g|=t<<c,c+=r},flush:function(){c>0&&f.writeByte(g)}});h.write(r,n);var s=0,v=String.fromCharCode(o[s]);for(s+=1;s<o.length;){var d=String.fromCharCode(o[s]);s+=1,i.contains(v+d)?v+=d:(h.write(i.indexOf(v),n),i.size()<4095&&(i.size()==1<<n&&(n+=1),i.add(v+d)),v=d)}return h.write(i.indexOf(v),n),h.write(e,n),h.flush(),l.toByteArray()},u=function(){var t={},r=0,e={add:function(n){if(e.contains(n))throw"dup key:"+n;t[n]=r,r+=1},size:function(){return r},indexOf:function(r){return t[r]},contains:function(r){return void 0!==t[r]}};return e};return i}(t,r),o=0;o<r;o+=1)for(var i=0;i<t;i+=1)n.setPixel(i,o,e(i,o));var a=D();n.write(a);for(var u=function(){var t=0,r=0,e=0,n="",o={},i=function(t){n+=String.fromCharCode(a(63&t))},a=function(t){if(t<0);else{if(t<26)return 65+t;if(t<52)return t-26+97;if(t<62)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw"n:"+t};return o.writeByte=function(n){for(t=t<<8|255&n,r+=8,e+=1;r>=6;)i(t>>>r-6),r-=6},o.flush=function(){if(r>0&&(i(t<<6-r),t=0,r=0),e%3!=0)for(var o=3-e%3,a=0;a<o;a+=1)n+="="},o.toString=function(){return n},o}(),f=a.toByteArray(),c=0;c<f.length;c+=1)u.writeByte(f[c]);return u.flush(),"data:image/gif;base64,"+u};return t}();qrcode.stringToBytesFuncs["UTF-8"]=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);n<128?r.push(n):n<2048?r.push(192|n>>6,128|63&n):n<55296||n>=57344?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)},function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}(function(){return qrcode});
window.zQR=window.zQR||function(text){
  try{ var q=qrcode(0,'M'); q.addData(text); q.make(); return q.createSvgTag({cellSize:4,margin:0,scalable:true}); }
  catch(e){ return ''; }
};

/* ════════════════════════════════════════════════════════════════
   ZETWAL — Pwofil pataje ant tout paj sit la
   ────────────────────────────────────────────────────────────────
   Yon sèl fichye, mete nan chak paj (akèy, lavri, shop, jwèt) jis
   anvan </body> : <script src="zetwal-profile.js"></script>

   Li itilize sa paj la deja genyen — CONFIG, sb (Supabase), auth ak
   fs (Firebase) — pa gen dezyèm koneksyon pou fè. Li pran bouton
   #who-btn (non + pwen, anwo adwat) e li fè l louvri pwofil la
   dirèkteman, olye de ti meni kout ki te la anvan an.
   ════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* Menm baz Supabase ak Firebase ke tout lòt paj sit la itilize.
     Nou pa konte sou CONFIG/sb/auth/fs paj la — yo fèmen anndan yon
     IIFE prive, script deyò a pa ka wè yo. Nou kreye pwòp koneksyon
     nou, ak menm valè yo — kle piblik la, li deja nan 6 paj HTML. */
  var SUPABASE_URL = 'https://mzwibzvdcwapqrtbhxox.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16d2lienZkY3dhcHFydGJoeG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzcxNTIsImV4cCI6MjA5MTc1MzE1Mn0.utazGnMswFOiArB66kfok7n2ds1Zr2wyVBRYVOFRT6c';
  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyAjCnmtvu0tqlsNDEtKraKBG79y12qYeCQ",
    authDomain: "lavrizetwal.firebaseapp.com",
    projectId: "lavrizetwal",
    storageBucket: "lavrizetwal.firebasestorage.app",
    messagingSenderId: "291921316186",
    appId: "1:291921316186:web:f55e8b34526960df394b63"
  };

  var ADMIN_EMAILS = ['mikenestorlive@gmail.com', 'schnaydernaderice1@gmail.com'];
  var sb = null, auth = null, fs = null;
  var bootTries = 0;

  function showBootError(reason){
    if(document.getElementById('zp-bootfail')) return;
    var box = document.createElement('div');
    box.id = 'zp-bootfail';
    box.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;max-width:320px;'
      + 'background:#3a1414;border:1px solid #a33;color:#ffd6d6;padding:10px 13px;border-radius:8px;'
      + 'font:12px/1.5 sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.5)';
    box.innerHTML = '<b>Pwofil pa chaje</b><br>' + reason
      + '<br><span style="opacity:.75">Verifye si zetwal-profile.js mete sou sèvè a, bò kot paj sa a.</span>'
      + '<span style="float:right;cursor:pointer;margin-left:8px;opacity:.7" onclick="this.parentNode.remove()">✕</span>';
    document.body.appendChild(box);
    console.warn('[ZetwalProfile] Pa reyisi lanse:', reason);
  }

  function boot(){
    bootTries++;
    if(!window.supabase || !window.firebase){
      if(bootTries > 40){ showBootError('Supabase oswa Firebase pa chaje apre 10s (script CDN ka bloke).'); return; }
      setTimeout(boot, 250); return;
    }
    try{ sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); }
    catch(e){ if(bootTries > 40){ showBootError('Koneksyon Supabase echwe : ' + e.message); return; } setTimeout(boot, 400); return; }
    try{
      /* firebase.apps se yon rejis global — si paj la deja lanse Firebase,
         nou repran menm app lan olye de kreye yon dezyèm san rezon. */
      if(firebase.apps && firebase.apps.length === 0) firebase.initializeApp(FIREBASE_CONFIG);
      auth = firebase.auth(); fs = firebase.firestore();
    }catch(e){ if(bootTries > 40){ showBootError('Koneksyon Firebase echwe : ' + e.message); return; } setTimeout(boot, 400); return; }
    if(!window.$){ window.$ = function(s){ return document.querySelector(s); }; }
    if(!window.$$){ window.$$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }; }
    if(!document.getElementById('who-btn')){
      if(bootTries > 40){ showBootError('Pa jwenn #who-btn nan paj sa a (meni kont lan).'); return; }
      setTimeout(boot, 250); return;
    }
    console.log('[ZetwalProfile] Chaje ak siksè.');
    init();
  }

  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function initial(s){ return (s||'Z').trim().charAt(0).toUpperCase() || 'Z'; }
  function fmt(n){ return Math.round(n||0).toLocaleString('fr-FR'); }
  function toast(t){
    var el = $('#toast');
    if(!el){ el = document.createElement('div'); el.className='toast'; el.id='toast'; document.body.appendChild(el); }
    el.textContent = t; el.classList.add('show');
    clearTimeout(el._h); el._h = setTimeout(function(){ el.classList.remove('show'); }, 3200);
  }

  var CSS = ""
  + ".zp-panel{position:fixed;top:0;right:0;bottom:0;width:430px;max-width:96vw;z-index:1012;display:flex;"
  + "  flex-direction:column;background:rgba(8,8,8,.98);backdrop-filter:blur(24px);"
  + "  border-left:1px solid var(--line);box-shadow:-30px 0 70px rgba(0,0,0,.6);"
  + "  transform:translateX(102%);transition:transform .35s cubic-bezier(.4,0,.2,1)}"
  + ".zp-panel.open{transform:none}"
  + ".zp-h{display:flex;align-items:center;gap:12px;padding:20px 22px 16px;border-bottom:1px solid var(--line)}"
  + ".zp-t{font-family:var(--serif);font-size:1.2rem;font-weight:600;letter-spacing:.5px}"
  + ".zp-s{font-size:.56rem;letter-spacing:1.6px;text-transform:uppercase;color:var(--ink-4)}"
  + ".zp-x{margin-left:auto;width:30px;height:30px;border-radius:50%;border:1px solid var(--line);background:none;"
  + "  color:var(--ink-3);cursor:pointer;display:grid;place-items:center;flex-shrink:0}"
  + ".zp-x:hover{color:var(--gold);border-color:var(--g-24)}"
  + ".zp-x svg{width:14px;height:14px;stroke:currentColor;stroke-width:1.7;fill:none}"
  + ".zp-b{flex:1;overflow-y:auto;padding:18px 22px}"
  + ".zp-b::-webkit-scrollbar{width:3px}.zp-b::-webkit-scrollbar-thumb{background:var(--g-24);border-radius:2px}"
  + ".zpcard{padding:16px 17px;border-radius:11px;border:1px solid var(--line);"
  + "  background:rgba(255,255,255,.028);margin-bottom:14px}"
  + ".zpcard .k{font-size:.55rem;letter-spacing:1.7px;text-transform:uppercase;color:var(--ink-4);margin-bottom:6px}"
  + ".zpcard .v{font-family:var(--serif);font-size:1.9rem;font-weight:700;color:var(--gold)}"
  + ".zpcard .v s{font-family:var(--sans);font-size:.65rem;font-weight:600;color:var(--ink-3);text-decoration:none;margin-left:7px}"
  + ".zprole{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:99px;"
  + "  border:1px solid var(--g-24);background:var(--g-08);color:var(--gold);font-size:.62rem;"
  + "  font-weight:700;letter-spacing:.6px;margin:4px 6px 0 0}"
  + ".zptabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;border-bottom:1px solid var(--line);padding-bottom:14px}"
  + ".zptabs button{padding:7px 13px;border-radius:99px;border:1px solid var(--line);background:none;"
  + "  color:var(--ink-3);font-family:var(--sans);font-size:.62rem;font-weight:600;letter-spacing:.3px;cursor:pointer}"
  + ".zptabs button.on{background:var(--gold);border-color:var(--gold);color:#0A0A0A}"
  + ".zptx{display:flex;align-items:flex-start;gap:12px;padding:12px 13px;border-radius:9px;margin-bottom:9px;"
  + "  border-left:3px solid var(--line);background:rgba(255,255,255,.025)}"
  + ".zptx.in{border-left-color:var(--ok,#0e8)}.zptx.out{border-left-color:var(--gold)}"
  + ".zptx .ic{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;background:rgba(255,255,255,.05)}"
  + ".zptx .ic svg{width:14px;height:14px;stroke:currentColor;stroke-width:1.8;fill:none}"
  + ".zptx.in .ic{color:var(--ok,#0e8)}.zptx.out .ic{color:var(--gold)}"
  + ".zptx .bd{flex:1;min-width:0}.zptx .bd b{display:block;font-size:.8rem}"
  + ".zptx .bd span{display:block;font-size:.66rem;color:var(--ink-4);margin-top:2px}"
  + ".zptx .am{font-family:var(--serif);font-weight:700;font-size:.95rem;white-space:nowrap}"
  + ".zptx.in .am{color:var(--ok,#0e8)}.zptx.out .am{color:var(--gold)}"
  + ".zp-fld{margin-bottom:14px}"
  + ".zp-fld label{display:block;font-size:.58rem;letter-spacing:1.4px;text-transform:uppercase;color:var(--ink-4);margin-bottom:7px}"
  + ".zp-fld input,.zp-fld textarea{width:100%;padding:11px 13px;border-radius:8px;border:1px solid var(--line);"
  + "  background:rgba(255,255,255,.03);color:var(--ink-1);font-family:var(--sans);font-size:.8rem}"
  + ".zp-fld textarea{min-height:74px;resize:vertical}"
  + ".zp-av-row{display:flex;align-items:center;gap:16px;margin-bottom:18px}"
  + ".zp-av-big{width:64px;height:64px;border-radius:50%;flex-shrink:0;overflow:hidden;background:var(--g-08);"
  + "  border:1px solid var(--g-24);color:var(--gold);font-family:var(--serif);font-size:1.5rem;font-weight:700;display:grid;place-items:center}"
  + ".zp-av-big img{width:100%;height:100%;object-fit:cover}"
  + ".zp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 18px;border-radius:8px;"
  + "  border:1px solid var(--g-24);background:none;color:var(--ink-1);font-family:var(--sans);font-size:.68rem;"
  + "  font-weight:700;letter-spacing:.4px;cursor:pointer;text-decoration:none}"
  + ".zp-btn:hover{border-color:var(--gold);color:var(--gold)}"
  + ".zp-btn.go{background:var(--gold);border-color:var(--gold);color:#0A0A0A;width:100%}"
  + ".zp-btn.go:hover{color:#0A0A0A;opacity:.9}"
  + ".zp-hint{font-size:.63rem;color:var(--ink-4);line-height:1.6;margin-top:10px}"
  + ".zp-empty{text-align:center;padding:40px 16px;color:var(--ink-4);font-size:.76rem}"
  + ".zp-rc{padding:13px 14px;border-radius:9px;border:1px solid var(--line);background:rgba(255,255,255,.025);margin-bottom:10px}"
  + ".msdot{display:inline-block;width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-bottom:3px}"
  + ".msdot.grey{background:#8a8a8a}.msdot.yellow{background:#FFB84D}.msdot.blue{background:#4DA6FF}"
  + ".zp-rc-h{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:6px}"
  + ".zp-rc-n{font-size:.8rem;font-weight:600}"
  + ".zp-rc-b{font-size:.56rem;font-weight:700;letter-spacing:.5px;padding:3px 9px;border-radius:99px;white-space:nowrap}"
  + ".zp-rc-v{font-size:.72rem;color:var(--ink-3)}"
  + ".zq-ov{position:fixed;inset:0;z-index:1100;background:rgba(0,0,0,.72);backdrop-filter:blur(6px);display:grid;place-items:center;"
  + "  padding:18px;opacity:0;transition:opacity .2s cubic-bezier(.23,1,.32,1)}"
  + ".zq-ov.on{opacity:1}"
  + ".zq-sh{width:min(420px,100%);max-height:92vh;overflow-y:auto;border-radius:14px;border:1px solid var(--g-24,rgba(212,175,55,.24));"
  + "  background:#0b0b0b;padding:20px 20px 22px;box-shadow:0 30px 80px rgba(0,0,0,.65);color:#fff;font-family:var(--sans,system-ui)}"
  + ".zq-sh-h{display:flex;align-items:center;gap:10px;margin-bottom:16px}"
  + ".zq-sh-h b{font-family:var(--serif,Georgia,serif);font-size:1.25rem;font-weight:600}"
  + ".zq-who{display:flex;align-items:center;gap:12px;padding:12px 13px;border-radius:10px;border:1px solid var(--line,rgba(255,255,255,.08));"
  + "  background:rgba(255,255,255,.03);margin-bottom:14px}"
  + ".zq-who b{display:block;font-size:.86rem}.zq-who small{display:block;font-size:.66rem;color:var(--ink-3,rgba(255,255,255,.4));word-break:break-all}"
  + ".zq-av{width:38px;height:38px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;background:var(--g-08,rgba(212,175,55,.08));"
  + "  border:1px solid var(--g-24,rgba(212,175,55,.24));color:var(--gold,#D4AF37);font-family:var(--serif,Georgia,serif);font-weight:700}"
  + ".zq-bal{font-size:.7rem;color:var(--ink-3,rgba(255,255,255,.5));margin-bottom:12px}.zq-bal b{color:var(--gold,#D4AF37)}"
  + ".zq-chips{display:flex;gap:7px;flex-wrap:wrap;margin:-4px 0 14px}"
  + ".zq-chips button{padding:7px 14px;border-radius:99px;border:1px solid var(--g-24,rgba(212,175,55,.24));background:none;color:var(--gold,#D4AF37);"
  + "  font-family:inherit;font-size:.68rem;font-weight:700;cursor:pointer;touch-action:manipulation;transition:transform .12s cubic-bezier(.23,1,.32,1)}"
  + ".zq-chips button:active{transform:scale(.95)}"
  + ".zq-sum{font-size:.72rem;line-height:1.6;color:var(--ink-2,rgba(255,255,255,.7));margin:0 0 12px;min-height:1.2em}.zq-sum b{color:var(--gold,#D4AF37)}"
  + ".zq-box{display:flex;flex-direction:column;align-items:center;gap:12px}"
  + ".zq-qr{width:min(250px,72vw);aspect-ratio:1;background:#fff;border-radius:14px;padding:14px;display:grid;place-items:center;"
  + "  box-shadow:0 0 0 1px var(--g-24,rgba(212,175,55,.24)),0 18px 50px rgba(0,0,0,.45)}"
  + ".zq-qr svg{width:100%;height:100%;display:block}"
  + ".zq-load{color:#333;font-size:.74rem;text-align:center;line-height:1.5}.zq-load small{color:#777;font-size:.62rem}"
  + ".zq-cd{font-size:.62rem;letter-spacing:1px;color:var(--ink-4,rgba(255,255,255,.3));text-transform:uppercase;min-height:1em}"
  + ".zq-scanbox{width:min(460px,100%)}"
  + ".zq-vid{position:relative;border-radius:12px;overflow:hidden;background:#000;aspect-ratio:1;margin-bottom:12px}"
  + ".zq-vid video{width:100%;height:100%;object-fit:cover;display:block}"
  + ".zq-frame{position:absolute;inset:16%;border:2px solid var(--gold,#D4AF37);border-radius:16px;box-shadow:0 0 0 999px rgba(0,0,0,.38);pointer-events:none}"
  + ".zq-hint{font-size:.7rem;color:var(--ink-3,rgba(255,255,255,.55));text-align:center;margin-bottom:12px;line-height:1.5}"
  + ".zq-man{font-size:.66rem;color:var(--ink-3,rgba(255,255,255,.5))}.zq-man summary{cursor:pointer}"
  + ".zq-guest{text-align:center;padding:30px 16px;color:var(--ink-2,rgba(255,255,255,.65));font-size:.84rem;line-height:1.7}"
  + ".zq-guest .zp-btn{margin:14px auto 0}"
  + ".zq-grid{display:grid;grid-template-columns:minmax(0,340px) minmax(0,1fr);gap:34px;align-items:center}"
  + ".zq-main{padding:26px 22px;border-radius:16px;border:1px solid var(--line,rgba(255,255,255,.08));background:rgba(255,255,255,.025)}"
  + ".zq-k{font-size:.56rem;letter-spacing:2.4px;text-transform:uppercase;color:var(--gold,#D4AF37);margin-bottom:16px;text-align:center}"
  + ".zq-side .zq-k{text-align:left}"
  + ".zq-steps{list-style:none;margin:0 0 22px;padding:0;display:grid;gap:14px}"
  + ".zq-steps li{padding-left:16px;border-left:2px solid var(--g-24,rgba(212,175,55,.24));font-size:.78rem;line-height:1.6;color:var(--ink-2,rgba(255,255,255,.62))}"
  + ".zq-steps b{display:block;color:#fff;font-size:.84rem;margin-bottom:2px}"
  + ".zq-side .zp-btn{width:100%}"
  + "@media(max-width:760px){.zq-grid{grid-template-columns:1fr;gap:24px}.zq-main{padding:22px 14px}}"
  + "@media (prefers-reduced-motion:reduce){.zq-ov{transition:none}}";

  var STATUS_LABEL = {
    requested:'Ap tann', accepted:'Aksepte', on_way:'Sou wout', arrived:'Chofè rive',
    picked:'Kòmanse', done:'Fini', cancelled:'Anile', pending:'Ap tann'
  };
  var STATUS_STYLE = {
    requested:'color:#FFB84D;border-color:rgba(255,184,77,.3);background:rgba(255,184,77,.08)',
    pending:'color:#FFB84D;border-color:rgba(255,184,77,.3);background:rgba(255,184,77,.08)',
    accepted:'color:#0e8;border-color:rgba(0,224,138,.3);background:rgba(0,224,138,.08)',
    on_way:'color:#0e8;border-color:rgba(0,224,138,.3);background:rgba(0,224,138,.08)',
    arrived:'color:#0e8;border-color:rgba(0,224,138,.3);background:rgba(0,224,138,.08)',
    picked:'color:#0e8;border-color:rgba(0,224,138,.3);background:rgba(0,224,138,.08)',
    done:'color:var(--gold);border-color:var(--g-24);background:var(--g-08)',
    cancelled:'color:#FF6B6B;border-color:rgba(255,107,107,.3);background:rgba(255,107,107,.08)'
  };

  function init(){
    if(document.getElementById('zp-panel')) return;   /* deja poze */
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<aside class="zp-panel" id="zp-panel" aria-hidden="true">'
      + '<div class="zp-h"><div><div class="zp-t" id="zp-t">Pwofil mwen</div><div class="zp-s" id="zp-s">—</div></div>'
      + '<button class="zp-x" id="zp-x" type="button" aria-label="Fèmen"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>'
      + '<div class="zp-b" id="zp-b"></div></aside>';
    document.body.appendChild(wrap.firstElementChild);

    var panel = $('#zp-panel'), veil = $('#veil'), whoBtn = $('#who-btn'), acct = $('#acct');

    /* Retire tout sa #who-btn te gen deja kòm klik (ti meni kout la),
       pou pwofil la louvri touswit — jan itilizatè a mande l la. */
    if(whoBtn){
      var fresh = whoBtn.cloneNode(true);
      whoBtn.parentNode.replaceChild(fresh, whoBtn);
      whoBtn = fresh;
      whoBtn.addEventListener('click', function(e){
        e.stopPropagation();
        if(acct) acct.classList.remove('open');
        open();
      });
    }

    function open(){
      panel.classList.add('open'); panel.setAttribute('aria-hidden','false');
      if(veil) veil.classList.add('open');
      render();
    }
    function close(){
      panel.classList.remove('open'); panel.setAttribute('aria-hidden','true');
      if(veil) veil.classList.remove('open');
    }
    $('#zp-x').addEventListener('click', close);
    if(veil) veil.addEventListener('click', close);
    addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
    window.ZetwalProfile = { open:open, close:close, scan:startScan, refreshQR:refreshQR };

    /* Pwòp swiv itilizatè pa nou — nou pa depann de window._me, kèk
       paj (akèy, lavri) pa menm ekspoze l. Yon lòt «onAuthStateChanged»
       anplis pa gen danje, Firebase kite plizyè koute anmenmtan. */
    var currentUser = window._me || null;
    if(currentUser) claimPending(currentUser);
    auth.onAuthStateChanged(function(user){
      var switched = currentUser && user && currentUser.uid !== user.uid;
      currentUser = user || null;
      if(!user || switched){
        /* Chanje itilizatè (oswa dekonekte) nan menm paj la — jete kach
           ansyen an, li pa dwe rete sou kont ki fèk konekte a. */
        histCache = null; transferCache = null; convCache = null;
      }
      if(panel.classList.contains('open')) render();
      if(user) claimPending(user);
      watchPoints(currentUser);
      renderHome();
      if(user && pendingZq){ var zt = pendingZq; pendingZq = null; setTimeout(function(){ handleToken(zt); }, 500); }
    });

    /* Pwen ak mesaj ki te voye pou nou pandan nou pa t ko konekte —
       yo tann nan Supabase, nou reklame yo tousuit isit la. Sa pa
       depann de Firestore ditou, imel la soti nan sesyon Firebase la
       menm, kidonk pa gen kous ak korije imel paj la ap fè apa. */
    async function claimPending(user){
      if(!sb || !fs || !user || !user.email) return;
      var mail = user.email.toLowerCase();
      var zc = window.ZB ? await ZB.pts('claim') : null;
      if(zc !== null){
        if(zc.ok && zc.count) toast(zc.count > 1
          ? zc.count + ' anvwa pwen te ap tann ou — yo antre sou kont ou'
          : 'Yon anvwa pwen te ap tann ou — li antre sou kont ou');
      } else try{
        var pts = await sb.from('pending_points').select('*').eq('to_email', mail).eq('claimed', false);
        var rows = pts.data || [];
        for(var i=0;i<rows.length;i++){
          var r = rows[i];
          try{
            await fs.collection('users').doc(user.uid).set(
              { points: firebase.firestore.FieldValue.increment(Number(r.amount)) }, { merge:true });
            await sb.from('pending_points').update({ claimed:true, claimed_at:new Date().toISOString() }).eq('id', r.id);
          }catch(e){}
        }
        if(rows.length) toast(rows.length > 1
          ? rows.length + ' anvwa pwen te ap tann ou — yo antre sou kont ou'
          : 'Yon anvwa pwen te ap tann ou — li antre sou kont ou');
      }catch(e){}
      try{
        var msgs = await sb.from('pending_messages').select('*').eq('to_email', mail).eq('claimed', false);
        var mrows = msgs.data || [];
        for(var j=0;j<mrows.length;j++){
          var m = mrows[j];
          try{
            var cid = convId(user.uid, m.from_uid);
            var ref = fs.collection('conversations').doc(cid);
            var seed = { participants:[user.uid, m.from_uid], participantNames:{}, participantEmails:{} };
            seed.participantNames[user.uid] = user.displayName || user.email;
            seed.participantNames[m.from_uid] = m.from_name || m.from_email || 'Itilizatè';
            seed.participantEmails[user.uid] = user.email || '';
            seed.participantEmails[m.from_uid] = m.from_email || '';
            await ref.set(seed, { merge:true });
            await ref.collection('messages').add({
              from:m.from_uid, text:m.text_||'', link:m.link||null, created_at:m.created_at
            });
            var upd = { lastMessage:m.text_||('🔗 '+m.link), lastAt:m.created_at };
            upd['unread.' + user.uid] = firebase.firestore.FieldValue.increment(1);
            await ref.set(upd, { merge:true });
            await sb.from('pending_messages').update({ claimed:true, claimed_at:new Date().toISOString() }).eq('id', m.id);
          }catch(e){}
        }
      }catch(e){}
    }

    var tab = 'info';
    var role = { driver:null, partners:[] };
    var histCache = null, transferCache = null;

    function fsUser(){ return fs.collection('users').doc(currentUser.uid); }

    async function loadRole(){
      role = { driver:null, partners:[] };
      if(!sb || !currentUser || !currentUser.email) return;
      var mail = currentUser.email.toLowerCase(), uid = currentUser.uid;
      try{
        var d = await sb.from('drivers').select('*').eq('active', true).limit(50);
        role.driver = (d.data||[]).filter(function(x){
          return (x.user_uid && x.user_uid === uid) || (x.email && x.email.toLowerCase() === mail);
        })[0] || null;
      }catch(e){}
      try{
        var p = await sb.from('partners').select('*').eq('active', true).limit(100);
        role.partners = (p.data||[]).filter(function(x){
          return (x.owner_uid && x.owner_uid === uid) || (x.owner_email && x.owner_email.toLowerCase() === mail);
        });
      }catch(e){}
    }

    async function loadHistory(){
      var mail = currentUser && currentUser.email;
      if(!sb || !mail) return [];
      var out = [];
      try{
        var a = await sb.from('rides').select('*').eq('client_email', mail).order('created_at',{ascending:false}).limit(25);
        (a.data||[]).forEach(function(r){ out.push(Object.assign({_kind:'Kòmand', _t:'ride'}, r,
          { _title:(r.ride_mode==='object'?'Objè':r.ride_mode==='child'?'Timoun':'Kous') + ' · ' + (r.from_addr||'—').split(',')[0],
            _price:r.price_estimated, _track:['requested','accepted','on_way','arrived','picked'].indexOf(r.status)!==-1 })); });
      }catch(e){}
      try{
        var b = await sb.from('move_orders').select('*').eq('client_email', mail).order('created_at',{ascending:false}).limit(25);
        (b.data||[]).forEach(function(r){ out.push(Object.assign({_kind:'Kòmand', _t:'order'}, r,
          { _title:(r.kind==='manje'?'Manje':r.kind==='shop'?'Acha Shop':'Pake') + ' · ' + (r.partner_name||''),
            _price:r.total, _track:['requested','accepted','on_way','arrived','picked'].indexOf(r.status)!==-1 })); });
      }catch(e){}
      try{
        var c = await sb.from('orders').select('*').eq('client_email', mail).order('created_at',{ascending:false}).limit(25);
        (c.data||[]).forEach(function(r){ out.push(Object.assign({_kind:'Shop'}, r,
          { status:r.status||'pending', _title:'Shop · ' + (r.product_name||''), _price:r.total_estimated })); });
      }catch(e){}
      try{
        var t = await loadTransfers();
        var uid = currentUser.uid;
        t.forEach(function(r){
          var out_ = r.from_uid === uid;
          out.push(Object.assign({_kind:'Pwen', _t:'transfer'}, r, {
            status: out_ ? (r.to_uid ? 'done' : 'pending') : 'done',
            updated_at: r.created_at,
            _title: r.kind === 'store_sale' ? 'Pwen achte nan boutik la'
                  : r.kind === 'shop_payment' ? 'Peman kòmand Shop ak pwen'
                  : out_ ? 'Pwen voye bay ' + (r.to_name||r.to_email||'') : 'Pwen resevwa nan men ' + (r.from_name||r.from_email||''),
            _price: r.amount, _out: out_
          }));
        });
      }catch(e){}
      out.sort(function(x,y){ return new Date(y.created_at||0) - new Date(x.created_at||0); });
      return out;
    }

    async function loadTransfers(){
      if(!sb || !currentUser) return [];
      try{
        var uid = currentUser.uid;
        var r = await sb.from('point_transfers').select('*')
          .or('from_uid.eq.' + uid + ',to_uid.eq.' + uid)
          .order('created_at',{ascending:false}).limit(20);
        return r.data || [];
      }catch(e){ return []; }
    }

    async function currentPoints(){
      try{ var s = await fsUser().get(); return Number(s.exists ? (s.data().points||0) : 0) || 0; }
      catch(e){ return 0; }
    }
    async function currentProfileDoc(){
      try{ var s = await fsUser().get(); return s.exists ? s.data() : {}; }catch(e){ return {}; }
    }

    async function chargePoints(amount){
      if(!currentUser || amount <= 0) return false;
      if(window.ZB){ var z = await ZB.spend(amount, 'profil'); if(z !== null) return z; }
      try{
        return await fs.runTransaction(async function(tx){
          var ref = fsUser();
          var snap = await tx.get(ref);
          var cur = Number((snap.exists ? snap.data().points : 0) || 0);
          if(cur < amount) return false;
          tx.update(ref, { points: firebase.firestore.FieldValue.increment(-amount) });
          return true;
        });
      }catch(e){ return false; }
    }

    async function render(){
      var box = $('#zp-b');
      var u = currentUser;
      if(!u){
        $('#zp-t').textContent = 'Pwofil mwen'; $('#zp-s').textContent = '';
        box.innerHTML = '<div class="zp-empty">Konekte pou w wè pwofil ou.</div>';
        return;
      }
      $('#zp-t').textContent = u.displayName || u.email || 'Pwofil mwen';
      $('#zp-s').textContent = u.email || '';
      box.innerHTML = '<div class="zp-empty">K ap chaje…</div>';

      var pts = await currentPoints();
      await loadRole();

      var roles = [];
      if(await checkStaff()) roles.push('Anplwaye');
      if(role.driver) roles.push('Chofè');
      if(role.partners.length) roles.push(role.partners.length > 1 ? 'Patnè (' + role.partners.length + ')' : 'Patnè');

      var isAdmin = u.email && ADMIN_EMAILS.indexOf(u.email.toLowerCase()) !== -1;
      var head = '<div class="zpcard"><div class="k">Solid pwen ou</div>'
        + '<div class="v">' + pts.toFixed(1) + '<s>pwen</s></div></div>'
        + (roles.length ? '<div style="margin-bottom:14px">' + roles.map(function(r){ return '<span class="zprole">'+r+'</span>'; }).join('') + '</div>' : '')
        + (isAdmin ? '<a class="zp-btn go" href="admin.html" style="width:100%;margin-bottom:10px">Aksè Administrasyon</a>' : '')
        + '<button class="zp-btn" id="zp-share" style="width:100%;margin-bottom:16px">Pataje pwofil mwen</button>';

      var tabs = '<div class="zptabs">'
        + ['info','msg','hist','notif','qr','send','ask'].map(function(k){
            var lab = {info:'Enfo',msg:'Mesaj',hist:'Istwa',notif:'Notifikasyon',qr:'Kòd QR',send:'Voye pwen',ask:'Mande pwen'}[k];
            return '<button class="' + (tab===k?'on':'') + '" data-t="' + k + '">' + lab + '</button>';
          }).join('') + '</div>';

      box.innerHTML = head + tabs + '<div id="zp-in"></div>';
      $('#zp-share').addEventListener('click', function(){ shareProfile(u); });
      $$('#zp-b .zptabs button').forEach(function(b){
        b.addEventListener('click', function(){ tab = b.getAttribute('data-t'); render(); });
      });

      if(tab === 'info') renderInfo();
      else if(tab === 'msg') renderMsgList();
      else if(tab === 'hist') renderHist();
      else if(tab === 'notif') renderNotif();
      else if(tab === 'ask') renderAsk();
      else if(tab === 'qr') renderQRTab();
      else renderSend();
    }

    function shareProfile(u){
      var url = location.origin + location.pathname.replace(/[^/]*$/, '') + 'taxi.html?moun=' + encodeURIComponent(u.uid);
      if(navigator.share){ navigator.share({ title:'Pwofil mwen sou Zetwal', url:url }).catch(function(){}); return; }
      if(navigator.clipboard){ navigator.clipboard.writeText(url).then(function(){ toast('Lyen pwofil la kopye'); }); }
      else toast(url);
    }

    async function renderInfo(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML = '<div class="zp-empty">K ap chaje…</div>';
      var prof = await currentProfileDoc();
      var u = currentUser;
      box.innerHTML =
          '<div class="zp-av-row"><div class="zp-av-big" id="zp-av-big">'
            + (prof.photo_url ? '<img src="' + esc(prof.photo_url) + '" alt="">' : initial(u.displayName||u.email))
          + '</div><label class="zp-btn" style="cursor:pointer">Chanje foto<input type="file" id="zp-photo" accept="image/*" style="display:none"></label></div>'
        + '<div class="zp-fld"><label for="zp-name">Non</label><input type="text" id="zp-name" value="' + esc(u.displayName||'') + '"></div>'
        + '<div class="zp-fld"><label for="zp-bday">Dat nesans</label><input type="date" id="zp-bday" value="' + esc(prof.birthdate||'') + '"></div>'
        + '<div class="zp-fld"><label for="zp-bio">Byografi</label><textarea id="zp-bio" placeholder="Kèk mo sou ou…">' + esc(prof.bio||'') + '</textarea></div>'
        + '<button class="zp-btn go" id="zp-save">Anrejistre chanjman yo</button>'
        + '<p class="zp-hint">Enfo sa yo parèt lè w pataje pwofil ou ak yon zanmi.</p>';
      $('#zp-photo').addEventListener('change', async function(e){
        var f = e.target.files && e.target.files[0]; if(!f) return;
        var av = $('#zp-av-big'); if(av) av.innerHTML = '<span style="font-size:.6rem">…</span>';
        try{
          var path = currentUser.uid + '/' + Date.now() + '.' + (f.name.split('.').pop()||'jpg');
          var up = await sb.storage.from('avatars').upload(path, f, { upsert:true });
          if(up.error) throw up.error;
          var url = sb.storage.from('avatars').getPublicUrl(path).data.publicUrl;
          await fsUser().set({ photo_url:url }, { merge:true });
          toast('Foto mete ajou');
        }catch(err){ toast('Nou pa ka voye foto a kounye a'); }
        renderInfo();
      });
      $('#zp-save').addEventListener('click', async function(){
        var btn = this; btn.disabled = true; btn.textContent = 'K ap anrejistre…';
        try{
          await fsUser().set({ birthdate:$('#zp-bday').value||null, bio:($('#zp-bio').value||'').trim() }, { merge:true });
          var name = ($('#zp-name').value||'').trim();
          if(name && auth.currentUser) await auth.currentUser.updateProfile({ displayName:name });
          toast('Pwofil ou anrejistre');
        }catch(e){ toast('Nou pa ka anrejistre kounye a'); }
        btn.disabled = false; btn.textContent = 'Anrejistre chanjman yo';
      });
    }

    async function renderHist(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML = '<div class="zp-empty">K ap chaje…</div>';
      histCache = histCache || await loadHistory();
      if(!histCache.length){ box.innerHTML = '<div class="zp-empty">Ou poko gen istwa sou Zetwal.</div>'; return; }
      box.innerHTML = histCache.map(function(o){
        var lab = STATUS_LABEL[o.status] || o.status;
        var sty = STATUS_STYLE[o.status] || STATUS_STYLE.requested;
        var track = o._track ? '<a class="zp-btn" style="margin-top:10px;padding:7px 13px;font-size:.6rem" '
          + 'href="taxi.html?swiv=' + esc(o.id) + '&t=' + (o._t==='ride'?'ride':'order') + '" target="_blank">Swiv →</a>' : '';
        var amt = o._t === 'transfer' ? (o._out?'−':'+') + Number(o._price).toFixed(1) + ' pwen' : fmt(o._price) + ' HTG';
        return '<div class="zp-rc"><div class="zp-rc-h"><div class="zp-rc-n">' + esc(o._title) + '</div>'
          + '<span class="zp-rc-b" style="' + sty + '">' + esc(lab) + '</span></div>'
          + '<div class="zp-rc-v">' + amt + ' · ' + (o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '—') + '</div>' + track + '</div>';
      }).join('');
    }

    async function renderNotif(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML = '<div class="zp-empty">K ap chaje…</div>';
      histCache = histCache || await loadHistory();
      var news = histCache.filter(function(o){ return o.status && o.status !== 'requested' && o.status !== 'pending'; });
      if(!news.length){ box.innerHTML = '<div class="zp-empty">Pa gen nouvo mizajou.</div>'; return; }
      box.innerHTML = news.map(function(o){
        var lab = STATUS_LABEL[o.status] || o.status;
        var isTransfer = o._t === 'transfer';
        var cls = isTransfer ? (o._out ? 'out' : 'in') : 'in';
        var tail = isTransfer ? ' (' + (o._out?'−':'+') + Number(o._price).toFixed(1) + ' pwen)' : ' — ' + esc(lab);
        return '<div class="zptx ' + cls + '"><div class="ic"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></div>'
          + '<div class="bd"><b>' + esc(o._title) + tail + '</b>'
          + '<span>' + (o.updated_at||o.created_at ? new Date(o.updated_at||o.created_at).toLocaleString('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '') + '</span></div></div>';
      }).join('');
    }

    async function findUserByEmail(mail){
      mail = (mail||'').toLowerCase().trim();
      if(!mail) return null;
      var r = await fs.collection('users').where('email','==',mail).limit(1).get();
      if(r.empty) return null;
      var d = r.docs[0];
      return { uid:d.id, email:mail, name:(d.data()||{}).name || mail };
    }

    function renderSend(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML =
          '<button class="zp-btn go" type="button" id="zs-scan" style="margin-bottom:16px">Voye pa skane kòd QR yon moun</button>'
        + '<div class="zp-fld"><label for="zs-mail">Oswa imel moun w ap voye a (Gmail oswa lòt)</label>'
          + '<input type="email" id="zs-mail" placeholder="egzanp@imel.com"></div>'
        + '<div class="zp-fld"><label for="zs-amt">Konbe pwen</label><input type="number" id="zs-amt" min="1" step="0.1" placeholder="10"></div>'
        + '<div class="zp-fld"><label for="zs-note">Yon ti mo (fakiltatif)</label><input type="text" id="zs-note" placeholder="Pou bòdwo lekòl la…"></div>'
        + '<button class="zp-btn go" id="zs-go">Voye pwen yo</button>'
        + '<p class="zp-hint">Pwen yo soti sou kont ou tousuit, epi yo antre sou kont moun nan. Administratè a wè tout tranzaksyon.</p>'
        + '<div style="font-size:.58rem;letter-spacing:1.4px;text-transform:uppercase;color:var(--ink-4);margin:20px 0 10px">Dènye anvwa ou yo</div>'
        + '<div id="zs-hist"><div class="zp-empty">K ap chaje…</div></div>';
      $('#zs-scan').addEventListener('click', function(){ startScan('send'); });
      $('#zs-go').addEventListener('click', async function(){
        var mail = ($('#zs-mail').value||'').trim().toLowerCase();
        var amt = parseFloat($('#zs-amt').value) || 0;
        var note = ($('#zs-note').value||'').trim();
        if(!mail){ toast('Ekri imel moun nan'); return; }
        if(amt <= 0){ toast('Konbe pwen ou vle voye ?'); return; }
        if(mail === (currentUser.email||'').toLowerCase()){ toast('Ou pa ka voye pwen pou tèt ou'); return; }
        var btn = this; btn.disabled = true; btn.textContent = 'K ap voye…';
        try{
          var zt = window.ZB ? await ZB.pts('transfer_email', { to_email:mail, amount:amt, note:note }) : null;
          if(zt !== null){
            if(!zt.ok){
              toast(zt.error === 'insufficient' ? 'Ou pa gen ase pwen' : (zt.error === 'self' ? 'Ou pa ka voye pwen pou tèt ou' : 'Nou pa ka voye pwen yo kounye a'));
              btn.disabled=false; btn.textContent='Voye pwen yo'; return;
            }
            toast(zt.delivered ? ('Pwen voye bay ' + (zt.name||mail)) : ('Pwen voye — y ap antre sou kont ' + mail + ' lè l konekte'));
            $('#zs-mail').value=''; $('#zs-amt').value=''; $('#zs-note').value='';
            transferCache = null; loadSendHistory();
            btn.disabled = false; btn.textContent = 'Voye pwen yo'; return;
          }
          var ok = await chargePoints(amt);
          if(!ok){ toast('Ou pa gen ase pwen'); btn.disabled=false; btn.textContent='Voye pwen yo'; return; }
          var dest = await findUserByEmail(mail);
          if(dest){
            /* Nou jwenn kont lan tousuit — antre pwen yo dirèkteman. */
            await fs.collection('users').doc(dest.uid).set(
              { points: firebase.firestore.FieldValue.increment(amt) }, { merge:true });
            if(sb){ try{ await sb.from('point_transfers').insert({
              from_uid:currentUser.uid, from_name:currentUser.displayName||currentUser.email, from_email:currentUser.email||null,
              to_uid:dest.uid, to_name:dest.name, to_email:dest.email, amount:amt, note:note||null
            }); }catch(e){} }
            toast('Pwen voye bay ' + (dest.name||dest.email));
          } else {
            /* Nou pa jwenn kont lan kounye a — nou pa bloke pou sa.
               Pwen yo mete la, y ap antre otomatikman lè imel sa konekte. */
            if(sb){
              try{ await sb.from('pending_points').insert({
                to_email:mail, amount:amt, from_uid:currentUser.uid,
                from_name:currentUser.displayName||currentUser.email, from_email:currentUser.email||null, note:note||null
              }); }catch(e){}
              try{ await sb.from('point_transfers').insert({
                from_uid:currentUser.uid, from_name:currentUser.displayName||currentUser.email, from_email:currentUser.email||null,
                to_uid:null, to_name:null, to_email:mail, amount:amt, note:note||null
              }); }catch(e){}
            }
            toast('Pwen voye — y ap antre sou kont ' + mail + ' lè l konekte');
          }
          $('#zs-mail').value=''; $('#zs-amt').value=''; $('#zs-note').value='';
          transferCache = null; loadSendHistory();
        }catch(e){ toast('Nou pa ka voye pwen yo kounye a'); }
        btn.disabled = false; btn.textContent = 'Voye pwen yo';
      });
      loadSendHistory();
    }
    async function loadSendHistory(){
      var box = $('#zs-hist'); if(!box) return;
      transferCache = transferCache || await loadTransfers();
      var uid = currentUser.uid;
      box.innerHTML = transferCache.length ? transferCache.map(function(t){
        var out = t.from_uid === uid;
        var waiting = out && !t.to_uid;
        return '<div class="zptx ' + (out?'out':'in') + '"><div class="ic"><svg viewBox="0 0 24 24">'
          + (out ? '<path d="M5 12h14M13 6l6 6-6 6"/>' : '<path d="M19 12H5M11 6l-6 6 6 6"/>') + '</svg></div>'
          + '<div class="bd"><b>' + (t.kind === 'store_sale' ? 'Pwen achte nan boutik la'
              : t.kind === 'shop_payment' ? 'Peman kòmand Shop'
              : out ? 'Voye bay ' + esc(t.to_name||t.to_email||'') : 'Resevwa nan men ' + esc(t.from_name||t.from_email||'')) + '</b>'
          + '<span>' + new Date(t.created_at).toLocaleString('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
          + (t.note ? ' · ' + esc(t.note) : '') + (waiting ? ' · ap tann ' + esc(t.to_email) + ' konekte' : '') + '</span></div><div class="am">' + (out?'−':'+') + Number(t.amount).toFixed(1) + '</div></div>';
      }).join('') : '<div class="zp-empty">Ou poko voye ni resevwa pwen.</div>';
    }

    function renderAsk(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML =
          '<div class="zp-fld"><label for="za-amt">Konbe pwen ou ta renmen</label><input type="number" id="za-amt" min="1" step="0.1" placeholder="20"></div>'
        + '<div class="zp-fld"><label for="za-why">Poukisa</label><textarea id="za-why" placeholder="Yon ti mo pou administratè a konprann demann lan…"></textarea></div>'
        + '<button class="zp-btn go" id="za-go">Voye demann lan</button>'
        + '<p class="zp-hint">Yon administratè ap gade demann lan epi deside.</p>';
      $('#za-go').addEventListener('click', async function(){
        var amt = parseFloat($('#za-amt').value)||0, why = ($('#za-why').value||'').trim();
        if(amt <= 0){ toast('Konbe pwen ou ta renmen?'); return; }
        var btn = this; btn.disabled = true;
        try{
          await sb.from('point_asks').insert({
            uid:currentUser.uid, name:currentUser.displayName||currentUser.email, email:currentUser.email,
            amount:amt, reason:why||null
          });
          toast('Demann voye — n ap gade l'); $('#za-amt').value=''; $('#za-why').value='';
        }catch(e){ toast('Nou pa ka voye demann lan kounye a'); }
        btn.disabled = false;
      });
    }

    /* ════════════════════════════════════════════════════════════
       KÒD QR PWEN — resevwa pwen, voye pa skane, vann pwen (anplwaye)
       ────────────────────────────────────────────────────────────
       · Kliyan an montre yon QR ki chanje chak fwa (jeton 5 minit,
         yon sèl itilizasyon — wè zetwal-paiement.sql).
       · Moun k ap voye a skane l, ekri kantite a, epi li voye.
       · Yon anplwaye / admin ki gen dwa a ka skane QR kliyan an epi
         ajoute pwen li achte nan boutik la (vant pwen).
       · Tout tranzaksyon yo ekri nan point_transfers pou admin.html.
       ════════════════════════════════════════════════════════════ */
    var QR_REFRESH_AT = 45;           /* segonn anvan ekspirasyon — nouvo kòd otomatik */
    var staffCache = { at:0, v:false, uid:null };
    var pendingZq = null;
    var mounts = [];                  /* kat « resevwa » ki sou ekran kounye a */
    var htgRate = null;

    function siteBase(){
      return /^https?:$/.test(location.protocol) ? location.origin + '/' : 'https://zetwal.org/';
    }
    function qrPayload(token){ return siteBase() + '?zq=' + token; }
    function parseToken(text){
      text = String(text||'').trim();
      var m = text.match(/[?&#]zq=([A-Za-z0-9]{8,64})/);
      if(m) return m[1];
      m = text.match(/^ZQ:([A-Za-z0-9]{8,64})$/i);
      if(m) return m[1];
      if(/^[A-Za-z0-9]{16,40}$/.test(text)) return text;
      return null;
    }
    function firstRow(d){ return Array.isArray(d) ? d[0] : d; }
    function round2(n){ return Math.round((Number(n)||0) * 100) / 100; }
    function loginPrompt(){
      var b = document.getElementById('login-btn');
      if(b) b.click(); else if(typeof window.openAuth === 'function') window.openAuth();
    }
    function loadScript(src){
      return new Promise(function(res, rej){
        var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }

    /* Anplwaye = administratè OSWA yon aksè tanporè aktif ki gen « sellpts » */
    async function checkStaff(){
      if(!currentUser || !currentUser.email) return false;
      var mail = currentUser.email.toLowerCase();
      if(ADMIN_EMAILS.indexOf(mail) !== -1) return true;
      if(staffCache.uid === currentUser.uid && Date.now() - staffCache.at < 60000) return staffCache.v;
      var ok = false;
      try{
        var r = await sb.from('temp_access').select('permissions,expires_at,status').eq('email', mail).eq('status','active');
        ok = (r.data||[]).some(function(a){
          var p = a.permissions;
          if(typeof p === 'string'){ try{ p = JSON.parse(p); }catch(e){ p = []; } }
          return new Date(a.expires_at) > new Date() && (p||[]).indexOf('sellpts') !== -1;
        });
      }catch(e){}
      staffCache = { at:Date.now(), v:ok, uid:currentUser.uid };
      return ok;
    }
    async function pointRate(){
      if(htgRate) return htgRate;
      htgRate = 1;
      try{
        var r = await sb.from('site_settings').select('key,value').eq('key','move_points_rate');
        var v = parseFloat(((r.data||[])[0]||{}).value);
        if(v > 0) htgRate = v;
      }catch(e){}
      return htgRate;
    }

    /* ── Jeton QR ─────────────────────────────────────────────── */
    async function qrIssue(){
      var r = await sb.rpc('qr_issue', {
        p_uid:currentUser.uid, p_email:currentUser.email||'',
        p_name:currentUser.displayName||currentUser.email||'', p_ttl_sec:300
      });
      if(r.error) throw r.error;
      var row = firstRow(r.data);
      if(!row || !row.token) throw new Error('jeton vid');
      return row;
    }

    /* Kat « Kòd mwen » — li rejenere tèt li anvan l ekspire, epi li
       sispann yon fwa l pa sou paj la ankò. */
    function mountReceive(el){
      if(!el) return;
      var st = { el:el, token:null, exp:0, busy:false, failedAt:0 };
      mounts = mounts.filter(function(m){ return document.body.contains(m.el); });
      mounts.push(st);
      el.innerHTML =
          '<div class="zq-box"><div class="zq-qr" data-r="qr"><div class="zq-load">K ap prepare kòd la…</div></div>'
        + '<div class="zq-cd" data-r="cd"></div>'
        + '<button class="zp-btn" type="button" data-r="new">Nouvo kòd</button></div>';
      var q = el.querySelector('[data-r="qr"]'), cd = el.querySelector('[data-r="cd"]');
      async function gen(){
        if(st.busy || !currentUser) return;
        st.busy = true;
        try{
          var row = await qrIssue();
          st.token = row.token; st.exp = new Date(row.expires_at).getTime(); st.failedAt = 0;
          var svg = window.zQR ? window.zQR(qrPayload(row.token)) : '';
          q.innerHTML = svg || '<div class="zq-load">QR pa disponib</div>';
          q.setAttribute('data-token', row.token);
        }catch(e){
          st.failedAt = Date.now(); st.exp = 0;
          q.innerHTML = '<div class="zq-load">Kòd QR poko aktive.<br><small>Administratè a dwe egzekite zetwal-paiement.sql nan Supabase.</small></div>';
        }
        st.busy = false; paint();
      }
      function paint(){
        if(!st.exp){ cd.textContent = ''; return; }
        var s = Math.max(0, Math.round((st.exp - Date.now()) / 1000));
        cd.textContent = 'Chanje otomatikman nan ' + Math.floor(s/60) + ':' + ('0' + (s%60)).slice(-2);
      }
      var tick = setInterval(function(){
        if(!document.body.contains(el)){ clearInterval(tick); return; }
        paint();
        if(document.hidden || st.busy) return;
        var left = st.exp - Date.now();
        if(st.exp && left <= QR_REFRESH_AT * 1000) gen();
        else if(!st.exp && st.failedAt && Date.now() - st.failedAt > 30000) gen();
      }, 1000);
      el.querySelector('[data-r="new"]').addEventListener('click', function(){ st.failedAt = 0; gen(); });
      st.gen = gen;
      gen();
    }
    function refreshQR(){
      mounts = mounts.filter(function(m){ return document.body.contains(m.el); });
      mounts.forEach(function(m){ if(m.gen) m.gen(); });
    }

    /* Kliyan an resevwa pwen → toast + nouvo kòd (ansyen an ka deja itilize) */
    var ptsUnsub = null, lastPts = null;
    function watchPoints(user){
      if(ptsUnsub){ try{ ptsUnsub(); }catch(e){} ptsUnsub = null; }
      lastPts = null;
      if(!user || !fs) return;
      try{
        ptsUnsub = fs.collection('users').doc(user.uid).onSnapshot(function(s){
          var p = Number((s.exists ? s.data().points : 0) || 0) || 0;
          if(lastPts !== null && p > lastPts + 0.0001){
            histCache = null; transferCache = null;
            mounts = mounts.filter(function(m){ return document.body.contains(m.el); });
            if(mounts.length){ toast('Ou resevwa ' + (p - lastPts).toFixed(1) + ' pwen !'); refreshQR(); }
          }
          lastPts = p;
        }, function(){});
      }catch(e){}
    }

    /* ── Fenèt (sheet) jenerik ───────────────────────────────── */
    function closeSheet(){ var m = document.getElementById('zq-sheet'); if(m) m.remove(); }
    function sheet(html){
      closeSheet();
      var m = document.createElement('div'); m.className = 'zq-ov'; m.id = 'zq-sheet';
      m.innerHTML = '<div class="zq-sh" role="dialog" aria-modal="true">' + html + '</div>';
      document.body.appendChild(m);
      m.addEventListener('click', function(e){ if(e.target === m) closeSheet(); });
      requestAnimationFrame(function(){ m.classList.add('on'); });
      var x = m.querySelector('[data-r="x"]'); if(x) x.addEventListener('click', closeSheet);
      return m;
    }
    function whoHtml(info){
      var nm = info.owner_name || info.owner_email || 'Kliyan';
      return '<div class="zq-who"><span class="zq-av">' + esc(initial(nm)) + '</span><div><b>' + esc(nm) + '</b>'
        + '<small>' + esc(info.owner_email || '') + '</small></div></div>';
    }
    function sheetHead(title){
      return '<div class="zq-sh-h"><b>' + esc(title) + '</b>'
        + '<button class="zp-x" type="button" data-r="x" aria-label="Fèmen"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';
    }
    function afterMoney(){
      histCache = null; transferCache = null;
      if(panel.classList.contains('open')) render();
    }

    /* ── Eskanè kamera ───────────────────────────────────────── */
    var scanState = { stream:null, timer:0 };
    function stopScan(){
      if(scanState.timer){ clearTimeout(scanState.timer); scanState.timer = 0; }
      if(scanState.stream){ scanState.stream.getTracks().forEach(function(t){ try{ t.stop(); }catch(e){} }); scanState.stream = null; }
      var ov = document.getElementById('zq-scan'); if(ov) ov.remove();
    }
    function openScanner(opts){
      stopScan();
      var ov = document.createElement('div'); ov.className = 'zq-ov on'; ov.id = 'zq-scan';
      ov.innerHTML = '<div class="zq-sh zq-scanbox">' + sheetHead(opts.title)
        + '<div class="zq-vid"><video playsinline muted autoplay></video><div class="zq-frame"></div></div>'
        + '<div class="zq-hint" data-r="hint">Mete kamera a sou kòd QR la.</div>'
        + '<details class="zq-man" data-r="man"><summary>Kamera pa mache ? Antre kòd la alamen</summary>'
        + '<div class="zp-fld" style="margin-top:10px"><input type="text" data-r="mi" placeholder="Kole lyen an oswa kòd la" autocomplete="off"></div>'
        + '<button class="zp-btn" type="button" data-r="mok">Kontinye</button></details></div>';
      document.body.appendChild(ov);
      var hint = ov.querySelector('[data-r="hint"]'), video = ov.querySelector('video');
      var done = false, lastBad = 0;
      ov.querySelector('[data-r="x"]').addEventListener('click', stopScan);
      ov.addEventListener('click', function(e){ if(e.target === ov) stopScan(); });
      function finish(text){
        if(done) return;
        var t = parseToken(text);
        if(!t){
          if(Date.now() - lastBad > 2500){ lastBad = Date.now(); hint.textContent = 'Kòd sa a pa yon kòd Zetwal. Eseye ankò.'; }
          return;
        }
        done = true; stopScan(); opts.onToken(t);
      }
      ov.querySelector('[data-r="mok"]').addEventListener('click', function(){
        var v = ov.querySelector('[data-r="mi"]').value;
        if(!parseToken(v)){ hint.textContent = 'Kòd la pa valid.'; return; }
        finish(v);
      });
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        hint.textContent = 'Kamera pa disponib sou aparèy sa a — antre kòd la alamen.';
        ov.querySelector('[data-r="man"]').open = true; return;
      }
      (async function(){
        var detector = null;
        try{
          if('BarcodeDetector' in window){
            var fm = await BarcodeDetector.getSupportedFormats();
            if(fm.indexOf('qr_code') !== -1) detector = new BarcodeDetector({ formats:['qr_code'] });
          }
        }catch(e){ detector = null; }
        if(!detector && !window.jsQR){
          hint.textContent = 'K ap chaje eskanè a…';
          try{ await loadScript('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'); }
          catch(e){ hint.textContent = 'Eskanè a pa chaje — antre kòd la alamen.'; ov.querySelector('[data-r="man"]').open = true; return; }
        }
        try{
          scanState.stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:{ ideal:'environment' } }, audio:false });
        }catch(e){
          hint.textContent = 'Nou pa jwenn aksè nan kamera a — otorize l, oswa antre kòd la alamen.';
          ov.querySelector('[data-r="man"]').open = true; return;
        }
        if(done || !document.getElementById('zq-scan')){ stopScan(); return; }
        video.srcObject = scanState.stream;
        try{ await video.play(); }catch(e){}
        hint.textContent = 'Mete kamera a sou kòd QR la.';
        var cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently:true });
        (async function loop(){
          if(done || !document.getElementById('zq-scan')) return;
          try{
            if(video.readyState >= 2 && video.videoWidth){
              if(detector){
                var r = await detector.detect(video);
                if(r && r[0] && r[0].rawValue) finish(r[0].rawValue);
              } else if(window.jsQR){
                var w = Math.min(520, video.videoWidth), h = Math.round(video.videoHeight * w / video.videoWidth);
                cv.width = w; cv.height = h; cx.drawImage(video, 0, 0, w, h);
                var img = cx.getImageData(0, 0, w, h);
                var res = window.jsQR(img.data, w, h, { inversionAttempts:'attemptBoth' });
                if(res && res.data) finish(res.data);
              }
            }
          }catch(e){
            /* Détecteur natif en panne → on bascule sur jsQR */
            if(detector){
              detector = null;
              if(!window.jsQR){ try{ await loadScript('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'); }catch(e2){} }
            }
          }
          if(!done) scanState.timer = setTimeout(loop, 160);
        })();
      })();
    }

    /* ── Apre yon skanè oswa yon lyen ?zq=… ─────────────────── */
    async function handleToken(tok, mode){
      if(!currentUser){ pendingZq = tok; toast('Konekte pou w kontinye'); loginPrompt(); return; }
      var info = null;
      try{
        var r = await sb.rpc('qr_peek', { p_token:tok });
        if(r.error) throw r.error;
        info = firstRow(r.data);
      }catch(e){ toast('Sèvis QR la poko disponib'); return; }
      if(!info){ toast('Kòd sa a pa valid ankò — mande moun nan yon nouvo kòd'); return; }
      if(info.owner_uid === currentUser.uid){ toast('Sa se kòd pa w — se lòt moun nan ki dwe skane l'); return; }
      var staff = await checkStaff();
      if(mode === 'sell' && !staff){ toast('Fonksyon sa a se pou anplwaye yo'); return; }
      if(!mode) mode = staff ? 'choose' : 'send';
      if(mode === 'choose') chooseSheet(tok, info);
      else if(mode === 'sell') sellSheet(tok, info);
      else sendSheet(tok, info);
    }
    function startScan(mode){
      if(!currentUser){ toast('Konekte anvan'); loginPrompt(); return; }
      openScanner({
        title: mode === 'sell' ? 'Skane kòd kliyan an' : 'Skane kòd moun nan',
        onToken: function(t){ handleToken(t, mode); }
      });
    }

    function chooseSheet(tok, info){
      var m = sheet(sheetHead('Kisa w vle fè ?') + whoHtml(info)
        + '<button class="zp-btn go" type="button" data-r="s" style="margin-bottom:10px">Voye pwen ba moun sa</button>'
        + '<button class="zp-btn" type="button" data-r="v" style="width:100%">Vann pwen (kliyan peye kach)</button>');
      m.querySelector('[data-r="s"]').addEventListener('click', function(){ sendSheet(tok, info); });
      m.querySelector('[data-r="v"]').addEventListener('click', function(){ sellSheet(tok, info); });
    }

    async function sendSheet(tok, info){
      var bal = await currentPoints();
      var m = sheet(sheetHead('Voye pwen') + whoHtml(info)
        + '<div class="zq-bal">Solid ou : <b>' + bal.toFixed(1) + '</b> pwen</div>'
        + '<div class="zp-fld"><label for="zq-amt">Konbe pwen</label>'
        + '<input type="number" id="zq-amt" min="1" step="0.1" inputmode="decimal" placeholder="10"></div>'
        + '<div class="zq-chips">' + [10, 50, 100, 500].map(function(v){ return '<button type="button" data-v="' + v + '">' + v + '</button>'; }).join('') + '</div>'
        + '<div class="zp-fld"><label for="zq-note">Yon ti mo (fakiltatif)</label><input type="text" id="zq-note" placeholder="Pou…"></div>'
        + '<button class="zp-btn go" type="button" id="zq-go">Voye pwen yo</button>'
        + '<p class="zp-hint">Pwen yo soti sou kont ou tousuit epi yo antre sou kont ' + esc(info.owner_name || info.owner_email || 'moun nan') + '.</p>');
      var amtEl = m.querySelector('#zq-amt');
      m.querySelectorAll('.zq-chips button').forEach(function(b){
        b.addEventListener('click', function(){ amtEl.value = b.getAttribute('data-v'); });
      });
      amtEl.focus();
      m.querySelector('#zq-go').addEventListener('click', async function(){
        var btn = this, amt = round2(amtEl.value), note = (m.querySelector('#zq-note').value || '').trim();
        if(!(amt > 0)){ toast('Konbe pwen ou vle voye ?'); return; }
        if(amt > bal + 0.0001){ toast('Ou pa gen ase pwen'); return; }
        btn.disabled = true; btn.textContent = 'K ap voye…';
        var res = await doQrSend(tok, amt, note);
        if(res.ok){
          closeSheet(); toast('Pwen voye bay ' + (res.name || 'moun nan'));
          afterMoney();
        } else { toast(res.msg); btn.disabled = false; btn.textContent = 'Voye pwen yo'; }
      });
    }

    /* Moun k ap voye a : debite → konsome jeton → kredite → ekri rejis la.
       Si yon etap echwe apre debit la, nou renmèt pwen yo. */
    async function doQrSend(tok, amt, note){
      var zq = window.ZB ? await ZB.pts('transfer_qr', { token:tok, amount:amt, note:note }) : null;
      if(zq !== null){
        if(zq.ok) return { ok:true, name:zq.name };
        if(zq.error === 'insufficient') return { ok:false, msg:'Ou pa gen ase pwen' };
        if(zq.error === 'invalid_token') return { ok:false, msg:'Kòd la pa valid ankò — mande yon nouvo kòd' };
        return { ok:false, msg:'Nou pa ka voye pwen yo kounye a — verifye solid ou anvan ou eseye ankò' };
      }
      var debited = await chargePoints(amt);
      if(!debited) return { ok:false, msg:'Ou pa gen ase pwen' };
      async function refund(){
        try{ await fsUser().set({ points: firebase.firestore.FieldValue.increment(amt) }, { merge:true }); }catch(e){}
      }
      var owner = null;
      try{
        var c = await sb.rpc('qr_consume', { p_token:tok, p_by_uid:currentUser.uid, p_by_email:currentUser.email||'', p_kind:'transfer' });
        if(c.error) throw c.error;
        owner = firstRow(c.data);
      }catch(e){ await refund(); return { ok:false, msg:'Sèvis QR la pa reponn — pwen yo pa soti' }; }
      if(!owner){ await refund(); return { ok:false, msg:'Kòd la pa valid ankò — mande yon nouvo kòd' }; }
      try{
        await fs.collection('users').doc(owner.owner_uid).set(
          { points: firebase.firestore.FieldValue.increment(amt) }, { merge:true });
      }catch(e){ await refund(); return { ok:false, msg:'Nou pa ka kredite kont lan — pwen yo retounen sou kont ou' }; }
      try{
        var ins = await sb.from('point_transfers').insert({
          kind:'qr_transfer',
          from_uid:currentUser.uid, from_name:currentUser.displayName||currentUser.email, from_email:currentUser.email||null,
          to_uid:owner.owner_uid, to_name:owner.owner_name||owner.owner_email, to_email:owner.owner_email||null,
          amount:amt, note:note||null
        });
        if(ins.error) console.warn('[ZetwalProfile] rejis pa anrejistre:', ins.error.message);
      }catch(e){}
      return { ok:true, name:owner.owner_name || owner.owner_email };
    }

    async function sellSheet(tok, info){
      var rate = await pointRate();
      var m = sheet(sheetHead('Vann pwen') + whoHtml(info)
        + '<div class="zp-fld"><label for="zq-amt">Konbe pwen kliyan an achte</label>'
        + '<input type="number" id="zq-amt" min="1" step="0.1" inputmode="decimal" placeholder="100"></div>'
        + '<div class="zq-chips">' + [50, 100, 500, 1000].map(function(v){ return '<button type="button" data-v="' + v + '">' + v + '</button>'; }).join('') + '</div>'
        + '<div class="zp-fld"><label for="zq-htg">Lajan kach ou resevwa (HTG) — 1 pwen = ' + rate + ' HTG</label>'
        + '<input type="number" id="zq-htg" min="0" step="1" inputmode="decimal" placeholder="0"></div>'
        + '<div class="zp-fld"><label for="zq-note">Nòt (fakiltatif)</label><input type="text" id="zq-note"></div>'
        + '<div class="zq-sum" id="zq-sum"></div>'
        + '<button class="zp-btn go" type="button" id="zq-go">Konfime — mwen resevwa lajan an</button>'
        + '<p class="zp-hint">Pwen yo antre sou kont kliyan an. Tranzaksyon an anrejistre ak kont ou (' + esc(currentUser.email || '') + ') pou administratè a.</p>');
      var amtEl = m.querySelector('#zq-amt'), htgEl = m.querySelector('#zq-htg'), sum = m.querySelector('#zq-sum');
      var htgTouched = false;
      function paint(){
        var a = round2(amtEl.value);
        if(!htgTouched) htgEl.value = a > 0 ? String(round2(a * rate)) : '';
        sum.innerHTML = a > 0
          ? 'Ajoute <b>' + a.toFixed(1) + ' pwen</b> sou kont <b>' + esc(info.owner_name || info.owner_email || '') + '</b> · resevwa <b>' + fmt(Number(htgEl.value) || 0) + ' HTG</b> kach'
          : '';
      }
      amtEl.addEventListener('input', paint);
      htgEl.addEventListener('input', function(){ htgTouched = true; paint(); });
      m.querySelectorAll('.zq-chips button').forEach(function(b){
        b.addEventListener('click', function(){ amtEl.value = b.getAttribute('data-v'); paint(); });
      });
      amtEl.focus();
      m.querySelector('#zq-go').addEventListener('click', async function(){
        var btn = this, amt = round2(amtEl.value), htg = round2(htgEl.value), note = (m.querySelector('#zq-note').value || '').trim();
        if(!(amt > 0)){ toast('Konbe pwen kliyan an achte ?'); return; }
        btn.disabled = true; btn.textContent = 'K ap anrejistre…';
        var res = await doStoreSale(tok, amt, htg, note);
        if(res.ok){
          closeSheet(); toast(amt.toFixed(1) + ' pwen ajoute sou kont ' + (res.name || 'kliyan an'));
          afterMoney();
        } else { toast(res.msg); btn.disabled = false; btn.textContent = 'Konfime — mwen resevwa lajan an'; }
      });
    }

    async function doStoreSale(tok, amt, htg, note){
      if(!(await checkStaff())) return { ok:false, msg:'Fonksyon sa a se pou anplwaye yo' };
      var zs = window.ZB ? await ZB.pts('sale', { token:tok, amount:amt, note:note }) : null;
      if(zs !== null){
        if(zs.ok) return { ok:true, name:zs.name };
        if(zs.error === 'invalid_token') return { ok:false, msg:'Kòd la pa valid ankò — mande kliyan an yon nouvo kòd' };
        if(zs.status === 403) return { ok:false, msg:'Fonksyon sa a se pou anplwaye yo' };
        return { ok:false, msg:'Nou pa ka anrejistre vant lan kounye a — anyen pa fèt, eseye ankò' };
      }
      var owner = null;
      try{
        var c = await sb.rpc('qr_consume', { p_token:tok, p_by_uid:currentUser.uid, p_by_email:currentUser.email||'', p_kind:'store_sale' });
        if(c.error) throw c.error;
        owner = firstRow(c.data);
      }catch(e){ return { ok:false, msg:'Sèvis QR la pa reponn — anyen pa fèt' }; }
      if(!owner) return { ok:false, msg:'Kòd la pa valid ankò — mande kliyan an yon nouvo kòd' };
      try{
        await fs.collection('users').doc(owner.owner_uid).set(
          { points: firebase.firestore.FieldValue.increment(amt) }, { merge:true });
      }catch(e){ return { ok:false, msg:'Nou pa ka kredite kont kliyan an — mande l yon nouvo kòd' }; }
      try{
        var ins = await sb.from('point_transfers').insert({
          kind:'store_sale',
          from_uid:'', from_name:'Boutik Zetwal', from_email:null,
          to_uid:owner.owner_uid, to_name:owner.owner_name||owner.owner_email, to_email:owner.owner_email||null,
          amount:amt, htg_amount:htg, note:note||null,
          operator_uid:currentUser.uid, operator_email:currentUser.email||null,
          operator_name:currentUser.displayName||currentUser.email||null
        });
        if(ins.error){ console.warn('[ZetwalProfile] rejis pa anrejistre:', ins.error.message);
          toast('Pwen yo antre, men rejis la pa anrejistre — enfòme administratè a'); }
      }catch(e){}
      return { ok:true, name:owner.owner_name || owner.owner_email };
    }

    /* ── Afichaj : tab « Kòd QR » nan pwofil + seksyon paj akèy ── */
    async function qrButtonsHtml(){
      var staff = await checkStaff();
      return '<button class="zp-btn go" type="button" data-r="scan">Skane yon kòd pou voye pwen</button>'
        + (staff ? '<button class="zp-btn" type="button" data-r="sell" style="width:100%;margin-top:10px">Vann pwen — skane kòd kliyan an</button>' : '');
    }
    function wireQrButtons(root){
      var s = root.querySelector('[data-r="scan"]'); if(s) s.addEventListener('click', function(){ startScan('send'); });
      var v = root.querySelector('[data-r="sell"]'); if(v) v.addEventListener('click', function(){ startScan('sell'); });
    }
    async function renderQRTab(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML = '<div class="zq-tab"><div id="zq-panel-rcv"></div>'
        + '<p class="zp-hint" style="text-align:center">Montre kòd sa a bay moun k ap voye w pwen yo — li chanje chak fwa.</p>'
        + '<div id="zq-panel-btn" style="margin-top:14px"></div></div>';
      mountReceive($('#zq-panel-rcv'));
      var b = $('#zq-panel-btn'); b.innerHTML = await qrButtonsHtml(); wireQrButtons(b);
    }
    async function renderHome(){
      var el = document.getElementById('zq-home'); if(!el) return;
      if(!currentUser){
        el.innerHTML = '<div class="zq-guest"><p>Konekte pou w wè kòd QR ou, resevwa pwen, epi voye pwen bay zanmi w.</p>'
          + '<button class="zp-btn go" type="button" id="zq-login" style="max-width:260px">Konekte</button></div>';
        var lg = document.getElementById('zq-login'); if(lg) lg.addEventListener('click', loginPrompt);
        return;
      }
      el.innerHTML = '<div class="zq-grid"><div class="zq-main"><div class="zq-k">Kòd QR mwen</div><div id="zq-home-rcv"></div></div>'
        + '<div class="zq-side"><div class="zq-k">Sa w ka fè</div>'
        + '<ul class="zq-steps"><li><b>Resevwa pwen</b>Montre kòd la bay moun k ap voye w yo. Li chanje chak fwa.</li>'
        + '<li><b>Voye pwen</b>Skane kòd yon moun, ekri kantite a, epi voye.</li>'
        + '<li><b>Achte pwen nan boutik la</b>Montre kòd ou bay yon anplwaye — li ajoute pwen yo sou kont ou.</li></ul>'
        + '<div id="zq-home-btn"></div></div></div>';
      mountReceive(document.getElementById('zq-home-rcv'));
      var hb = document.getElementById('zq-home-btn'); hb.innerHTML = await qrButtonsHtml(); wireQrButtons(hb);
    }

    /* ════════════════════════════════════════════════════════════
       MESAJ — konvèsasyon prive ant de itilizatè, stoke nan Firestore.
       Id konvèsasyon an se de uid triye + kole (menm rezilta pou
       de moun yo, kèlkeswa kilès ki kòmanse l).
       ════════════════════════════════════════════════════════════ */
    function convId(uidA, uidB){ return [uidA, uidB].sort().join('_'); }
    var msgUnsub = null, msgOpenId = null, convCache = null;

    async function loadConversations(){
      if(!fs || !currentUser) return [];
      try{
        /* San .orderBy() apre .where('participants','array-contains',...) —
           konbinezon sa mande yon endèks konpoze espesyal nan Firestore.
           Nou triye rezilta a nan navigatè a pito, pou nou pa depann de
           yon endèks moun ta dwe kreye alamen nan console Firebase la. */
        var r = await fs.collection('conversations')
          .where('participants', 'array-contains', currentUser.uid).limit(50).get();
        var rows = r.docs.map(function(d){ return Object.assign({ id:d.id }, d.data()); });
        rows.sort(function(a,b){ return toMillis(b.lastAt) - toMillis(a.lastAt); });
        return rows;
      }catch(e){ return []; }
    }
    function otherOf(conv){
      var uid = (conv.participants||[]).filter(function(x){ return x !== currentUser.uid; })[0];
      var names = conv.participantNames || {}, emails = conv.participantEmails || {};
      return { uid:uid, name:names[uid] || emails[uid] || 'Itilizatè', email:emails[uid] || '' };
    }
    async function renderMsgList(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML =
          '<div class="zp-fld"><label for="mg-mail">Kòmanse yon nouvo konvèsasyon (imel)</label>'
          + '<div style="display:flex;gap:8px"><input type="email" id="mg-mail" placeholder="zanmi@imel.com" style="flex:1">'
          + '<button class="zp-btn" id="mg-start">Kòmanse</button></div></div>'
        + '<div style="font-size:.58rem;letter-spacing:1.4px;text-transform:uppercase;color:var(--ink-4);margin:18px 0 10px">Konvèsasyon ou yo</div>'
        + '<div id="mg-list" class="zp-empty">K ap chaje…</div>';
      $('#mg-start').addEventListener('click', async function(){
        var mail = ($('#mg-mail').value||'').trim().toLowerCase();
        if(!mail){ toast('Ekri imel zanmi w lan'); return; }
        if(mail === (currentUser.email||'').toLowerCase()){ toast('Ou pa ka voye tèt ou mesaj'); return; }
        var dest = await findUserByEmail(mail);
        if(dest) await openThread(dest.uid, dest.name, dest.email);
        else await openThread(null, mail, mail);   /* pa jwenn kont — nou kòmanse yon fil k ap tann */
      });
      var convs = await loadConversations();
      convCache = convs;
      /* Mesaj mwen te voye bay yon moun ki poko gen kont — yo pa nan
         Firestore ankò, yo nan kès datant lan. Nou montre yo tou, pou
         yo pa disparèt nan lis la. */
      var pendingByEmail = {};
      if(sb && currentUser){
        try{
          var pp = await sb.from('pending_messages').select('*').eq('from_uid', currentUser.uid).eq('claimed', false);
          (pp.data||[]).forEach(function(r){
            var k = r.to_email;
            if(!pendingByEmail[k]) pendingByEmail[k] = { email:k, lastMessage:r.text_||('🔗 '+r.link), lastAt:r.created_at };
            else if(new Date(r.created_at) > new Date(pendingByEmail[k].lastAt)){ pendingByEmail[k].lastMessage = r.text_||('🔗 '+r.link); pendingByEmail[k].lastAt = r.created_at; }
          });
        }catch(e){}
      }
      var list = $('#mg-list'); if(!list) return;
      var items = convs.map(function(c){
        var o = otherOf(c);
        var unread = (c.unread && c.unread[currentUser.uid]) || 0;
        return { key:o.uid, html: '<div class="zptx' + (unread?' out':'') + '" style="cursor:pointer" data-conv="' + esc(o.uid) + '|' + esc(o.name) + '|' + esc(o.email) + '">'
          + '<div class="ic"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>'
          + '<div class="bd"><b>' + esc(o.name) + (unread ? ' · ' + unread + ' nouvo' : '') + '</b>'
          + '<span>' + esc(c.lastMessage||'') + '</span></div></div>' };
      });
      Object.keys(pendingByEmail).forEach(function(k){
        var p = pendingByEmail[k];
        items.push({ key:k, html: '<div class="zptx" style="cursor:pointer" data-conv="|' + esc(k) + '|' + esc(k) + '">'
          + '<div class="ic"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>'
          + '<div class="bd"><b>' + esc(k) + '</b><span><span class="msdot grey" style="margin-right:5px"></span>' + esc(p.lastMessage) + '</span></div></div>' });
      });
      list.innerHTML = items.length ? items.map(function(x){ return x.html; }).join('')
        : '<div class="zp-empty">Ou poko gen konvèsasyon. Ekri yon imel anwo pou kòmanse.</div>';
      $$('#mg-list [data-conv]').forEach(function(el){
        el.addEventListener('click', function(){
          var p = el.getAttribute('data-conv').split('|');
          openThread(p[0]||null, p[1], p[2]);
        });
      });
    }
    var convUnsub2 = null, threadRows = [], threadReadUpTo = {};
    function stopThreadListeners(){
      if(msgUnsub){ msgUnsub(); msgUnsub = null; }
      if(convUnsub2){ convUnsub2(); convUnsub2 = null; }
    }
    async function openThread(otherUid, otherName, otherEmail){
      stopThreadListeners();
      msgOpenId = otherUid ? convId(currentUser.uid, otherUid) : null;
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML =
          '<button class="trk-back" id="mg-back" type="button" style="border:0;background:none;color:var(--ink-3);'
          + 'cursor:pointer;font-family:var(--sans);font-size:.68rem;padding:0 0 14px">← Tounen nan lis la</button>'
        + '<div style="font-weight:600;font-size:.9rem;margin-bottom:12px">' + esc(otherName) + '</div>'
        + (otherUid ? '' : '<p class="zp-hint" style="margin-bottom:12px">' + esc(otherEmail) + ' poko gen kont sou Zetwal. Mesaj ou yo ap tann li konekte pou yo rive.</p>')
        + '<div id="mg-thread" style="max-height:360px;overflow-y:auto;margin-bottom:14px"></div>'
        + '<div style="display:flex;gap:8px"><input type="text" id="mg-input" placeholder="Ekri yon mesaj…" style="flex:1;padding:11px 13px;'
          + 'border-radius:8px;border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--ink-1);font-family:var(--sans);font-size:.8rem">'
        + '<button class="zp-btn go" id="mg-send" style="width:auto;padding:11px 16px">Voye</button></div>';
      $('#mg-back').addEventListener('click', function(){ stopThreadListeners(); msgOpenId=null; renderMsgList(); });
      $('#mg-send').addEventListener('click', function(){ sendMessage(otherUid, otherName, otherEmail); });
      $('#mg-input').addEventListener('keydown', function(e){ if(e.key==='Enter') sendMessage(otherUid, otherName, otherEmail); });

      if(!otherUid){ renderPendingThread(otherEmail); return; }

      var ref = fs.collection('conversations').doc(msgOpenId);
      var seed = { participants:[currentUser.uid, otherUid], participantNames:{}, participantEmails:{} };
      seed.participantNames[currentUser.uid] = currentUser.displayName || currentUser.email;
      seed.participantNames[otherUid] = otherName;
      seed.participantEmails[currentUser.uid] = currentUser.email || '';
      seed.participantEmails[otherUid] = otherEmail || '';
      try{ await ref.set(seed, { merge:true }); }catch(e){}
      try{
        var u = {}; u[currentUser.uid] = 0;
        var ru = {}; ru[currentUser.uid] = firebase.firestore.FieldValue.serverTimestamp();
        await ref.set({ unread:u, readUpTo:ru }, { merge:true });
      }catch(e){}

      threadRows = []; threadReadUpTo = {};
      convUnsub2 = ref.onSnapshot(function(doc){
        threadReadUpTo = (doc.exists && doc.data().readUpTo) || {};
        paintThread(otherUid);
      });
      msgUnsub = ref.collection('messages').orderBy('created_at', 'asc').limit(200)
        .onSnapshot(function(snap){
          threadRows = []; snap.forEach(function(d){ threadRows.push(d.data()); });
          paintThread(otherUid);
          /* Chak fwa mesaj nouvo rive pandan fil la ouvri, yo li tousuit */
          var ru2 = {}; ru2[currentUser.uid] = firebase.firestore.FieldValue.serverTimestamp();
          ref.set({ readUpTo:ru2 }, { merge:true }).catch(function(){});
        }, function(){});
    }
    function toMillis(t){
      if(!t) return 0;
      if(t.toMillis) return t.toMillis();
      if(t.seconds) return t.seconds*1000;
      return new Date(t).getTime() || 0;
    }
    function paintThread(otherUid){
      var thread = $('#mg-thread'); if(!thread) return;
      var otherRead = toMillis(threadReadUpTo[otherUid]);
      thread.innerHTML = threadRows.length ? threadRows.map(function(m){
        var mine = m.from === currentUser.uid;
        var dot = '';
        if(mine){
          var mt = toMillis(m.created_at);
          var cls = (otherRead && otherRead >= mt) ? 'blue' : 'yellow';
          var lbl = cls === 'blue' ? 'Li li' : 'Resevwa';
          dot = '<span class="msdot ' + cls + '" title="' + lbl + '"></span>';
        }
        return '<div style="display:flex;justify-content:' + (mine?'flex-end':'flex-start') + ';margin-bottom:8px;align-items:flex-end;gap:5px">'
          + (mine ? dot : '')
          + '<div style="max-width:78%;padding:9px 12px;border-radius:10px;font-size:.78rem;'
          + (mine ? 'background:var(--gold);color:#0A0A0A' : 'background:rgba(255,255,255,.06);color:var(--ink-1)') + '">'
          + (m.link ? '<a href="' + esc(m.link) + '" target="_blank" style="color:inherit;text-decoration:underline;display:block;margin-bottom:4px">' + esc(m.text||m.link) + '</a>' : esc(m.text||''))
          + '</div></div>';
      }).join('') : '<div class="zp-empty">Ekri premye mesaj la.</div>';
      thread.scrollTop = thread.scrollHeight;
    }
    async function renderPendingThread(otherEmail){
      var thread = $('#mg-thread'); if(!thread) return;
      thread.innerHTML = '<div class="zp-empty">K ap chaje…</div>';
      var rows = [];
      if(sb && currentUser){
        try{
          var r = await sb.from('pending_messages').select('*')
            .eq('from_uid', currentUser.uid).eq('to_email', otherEmail).order('created_at',{ascending:true});
          rows = r.data || [];
        }catch(e){}
      }
      thread.innerHTML = rows.length ? rows.map(function(m){
        return '<div style="display:flex;justify-content:flex-end;margin-bottom:8px;align-items:flex-end;gap:5px">'
          + '<span class="msdot grey" title="Ap tann li konekte"></span>'
          + '<div style="max-width:78%;padding:9px 12px;border-radius:10px;font-size:.78rem;background:var(--gold);color:#0A0A0A">'
          + (m.link ? '<a href="' + esc(m.link) + '" target="_blank" style="color:inherit;text-decoration:underline;display:block;margin-bottom:4px">' + esc(m.text_||m.link) + '</a>' : esc(m.text_||''))
          + '</div></div>';
      }).join('') : '<div class="zp-empty">Ekri premye mesaj la — l ap tann ' + esc(otherEmail) + ' konekte.</div>';
      thread.scrollTop = thread.scrollHeight;
    }
    async function deliverMessage(otherUid, otherEmail, text, link){
      if(!otherUid){
        if(sb){
          try{ await sb.from('pending_messages').insert({
            to_email: otherEmail, from_uid:currentUser.uid,
            from_name:currentUser.displayName||currentUser.email, from_email:currentUser.email||null,
            text_: text||null, link: link||null
          }); }catch(e){}
        }
        return;
      }
      var cid = convId(currentUser.uid, otherUid);
      var ref = fs.collection('conversations').doc(cid);
      await ref.collection('messages').add({ from:currentUser.uid, text:text||null, link:link||null, created_at: firebase.firestore.FieldValue.serverTimestamp() });
      var upd = { lastMessage: link ? '🔗 ' + (text||link) : text, lastAt: firebase.firestore.FieldValue.serverTimestamp() };
      upd['unread.' + otherUid] = firebase.firestore.FieldValue.increment(1);
      await ref.set(upd, { merge:true });
    }
    async function sendMessage(otherUid, otherName, otherEmail){
      var inp = $('#mg-input'); var text = (inp.value||'').trim();
      if(!text) return;
      inp.value = '';
      try{ await deliverMessage(otherUid, otherEmail, text, null); }
      catch(e){ toast('Mesaj la pa pase — eseye ankò'); }
      if(!otherUid) renderPendingThread(otherEmail);
    }
    /* API piblik pou lòt paj yo (shop.html, move.html) pataje yon atik
       dirèkteman nan yon mesaj — sèvi ak lyen an sèlman, san mete non yon
       moun deja, itilizatè a chwazi zanmi an nan panno a. */
    window.ZetwalProfile.shareLink = function(url, label){
      open(); tab = 'msg'; render();
      setTimeout(function(){
        var mail = prompt('Imel zanmi ou vle pataje ' + (label||'sa') + ' la avè l :');
        if(!mail) return;
        mail = mail.trim().toLowerCase();
        findUserByEmail(mail).then(function(dest){
          var uid = dest ? dest.uid : null;
          var name = dest ? dest.name : mail;
          var em = dest ? dest.email : mail;
          openThread(uid, name, em).then(function(){
            deliverMessage(uid, em, label||url, url).then(function(){
              if(!uid) renderPendingThread(em);
            });
          });
        });
      }, 400);
    };

    /* Yon lyen pataje (?moun=uid) — envite moun nan konekte pou l wè l */
    var qs = new URLSearchParams(location.search);
    if(qs.get('zq')){
      pendingZq = parseToken(qs.get('zq'));
      try{ var u0 = new URL(location.href); u0.searchParams.delete('zq'); history.replaceState(null, '', u0.pathname + (u0.search || '') + u0.hash); }catch(e){}
      if(pendingZq && currentUser){ var zt0 = pendingZq; pendingZq = null; setTimeout(function(){ handleToken(zt0); }, 800); }
      else if(pendingZq){ setTimeout(function(){ if(pendingZq) toast('Konekte pou w kontinye ak kòd QR la'); }, 1200); }
    }
    if(qs.get('moun') && !currentUser){
      setTimeout(function(){ toast('Yon pwofil pataje avè w — konekte pou wè l'); }, 700);
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
