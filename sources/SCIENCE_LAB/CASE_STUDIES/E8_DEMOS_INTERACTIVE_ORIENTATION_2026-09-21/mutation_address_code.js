(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.NEXAHMutationAddressCode=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const DIGITS='0123456789ABCDEFGHIJ';

  function integer(value,name='value'){
    if(!Number.isInteger(value)||value<0)throw new RangeError(`${name} must be a non-negative integer`);
    return value;
  }
  function toBase(value,base){
    integer(value);
    if(!Number.isInteger(base)||base<2||base>DIGITS.length)throw new RangeError('unsupported base');
    if(value===0)return '0';
    let n=value,out='';
    while(n){out=DIGITS[n%base]+out;n=Math.floor(n/base)}
    return out;
  }
  function directedAddress(from,to){
    integer(from,'from');integer(to,'to');
    if(from>=20||to>=20)throw new RangeError('directed address labels must fit one base-20 digit');
    return {
      from,to,
      word:`${DIGITS[from]}${DIGITS[to]}`,
      value:from*20+to,
      antipodeWord:`${DIGITS[to]}${DIGITS[from]}`,
      antipodeValue:to*20+from
    };
  }
  function sixState(trit,direction){
    if(![-1,0,1].includes(trit))throw new RangeError('trit must be -1, 0 or 1');
    if(direction!==0&&direction!==1)throw new RangeError('direction must be 0 or 1');
    const code=(trit+1)*2+direction;
    return {trit,direction,code,antipodeTrit:-trit,antipodeDirection:1-direction,antipodeCode:5-code};
  }
  function carrier(value){
    integer(value);
    return {decimal:value,vigesimal:toBase(value,20),senary:toBase(value,6)};
  }
  function gate(center){
    integer(center,'center');
    const values=[center-1,center,center+1];
    if(values[0]<0)throw new RangeError('center must be positive');
    return {center,values,mod9:values.map(value=>value%9),views:values.map(carrier)};
  }
  function gcd(a,b){integer(a,'a');integer(b,'b');while(b)[a,b]=[b,a%b];return a}
  function reverseDecimal(value){integer(value);return Number(String(value).split('').reverse().join(''))}
  function isPrime(value){
    integer(value);
    if(value<2)return false;if(value%2===0)return value===2;
    for(let divisor=3;divisor*divisor<=value;divisor+=2)if(value%divisor===0)return false;
    return true;
  }
  function primeIndex(value){
    if(!isPrime(value))return null;
    let index=0;for(let candidate=2;candidate<=value;candidate++)if(isPrime(candidate))index++;
    return index;
  }
  function factorial(value){integer(value);let out=1;for(let n=2;n<=value;n++)out*=n;return out}
  function pyramidLayer(depth){
    integer(depth,'depth');const out=[];
    for(let i=0;i<=depth;i++)for(let j=0;j<=depth-i;j++){const k=depth-i-j;out.push({state:[i,j,k],multiplicity:factorial(depth)/(factorial(i)*factorial(j)*factorial(k))})}
    return out;
  }
  function pyramidAntipode(state){
    if(!Array.isArray(state)||state.length!==4||!state.slice(0,3).every(Number.isInteger)||![-1,1].includes(state[3]))throw new RangeError('state must be [i,j,k,sigma]');
    return [state[2],state[1],state[0],-state[3]];
  }
  function numberHandles(){
    const common=gcd(1078,8701);
    return {
      carry:{from:43,to:1032,quotient:1032/43,localMod9:gate(42).mod9,liftedMod9:gate(1032).mod9},
      reversal:{left:1078,right:8701,exact:reverseDecimal(1078)===8701,common,leftQuotient:1078/common,rightQuotient:8701/common},
      page:{values:[73,79,83,89,97,101],indices:[73,79,83,89,97,101].map(primeIndex),from:97,to:101},
      anchor:{value:3301,index:primeIndex(3301),twin:3299,selector:false}
    };
  }
  return {DIGITS,toBase,directedAddress,sixState,carrier,gate,gcd,reverseDecimal,isPrime,primeIndex,pyramidLayer,pyramidAntipode,numberHandles};
});
