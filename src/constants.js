
export function validatEemail(email)
{
  var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!filter.test(email)) {
      return false;
  }
  return true;
}

export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, {type:mime});
}

const characters ='abcdefghijklmnopqrstuvwxyz0123456789';
export const generateString=(length)=>{
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function hidestring(username){
  let string=''
  for(let m=1;m<username.length-1;m++){
  string+='*'
  }
  return string
}

export const number=(value)=>{
  if(value>=1000000000){
    return (value/1000000000).toFixed(1) +'B'
  }
  if(value>=1000000&&value<1000000000){
    return (value/1000000).toFixed(1) +'M'
  }
  else if(value>=1000 && value<1000000) {
    return (value/1000).toFixed(1) +'K'
  }
  else{
    return value
  }
}

export const arraymove = (arr, fromIndex, toIndex) =>{
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
export const timeformat=(data)=>{
  return  ("0" + new Date(data).getDate()).slice(-2) + "-" + ("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" +
  new Date(data).getFullYear()
}
export const timevalue=(data)=>{
  return new Date(data).getFullYear() + "-" + ("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" + ("0" + new Date(data).getDate()).slice(-2)
}
export const timecreate=(data)=>{
  return ("0" + new Date(data).getDate()).slice(-2) + "-" + ("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" +
  new Date(data).getFullYear() + " " + ("0" + new Date(data).getHours()).slice(-2) + ":" + ("0" + new Date(data).getMinutes()).slice(-2)
}
export const timepromotion=(data)=>{
  return ("0" + new Date(data).getHours()).slice(-2) + ":" + ("0" + new Date(data).getMinutes()).slice(-2)+ " " + ('0'+new Date(data).getDate()).slice(-2) + "-" + ("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" +
  new Date(data).getFullYear()
}

export function validatePassword(value) {
  let  errors = [];
  if(value!=null){
      if (value.length < 6) {
          errors.push("Your password must be at least 8 characters"); 
      }
      if (value.search(/[a-z]/) < 0) {
          errors.push("Your password must contain at least one letter.");
      }
      if (value.search(/[A-Z]/) < 0) {
          errors.push("Your password must contain at least one letter.");
      }
      if (value.search(/[0-9]/) < 0) {
          errors.push("Your password must contain at least one digit."); 
      }
      if(value.match(/[|\\/~^:,;?!&%$@*+]/)){
          errors.push("Your password must contain at least one digit."); 
      }
  }
  else{
      errors.push("Your password must contain at least one digit."); 
  }
  return errors;
}

export const originweb =window.location.origin
export function isVietnamesePhoneNumber(number) {
  return /([\+84 |84 |0|+84|84|(+84)|(+84 )]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(number);
}
export  const onValidUsername = (val) => {
        const usernameRegex = /^[a-z0-9_.]+$/
        return usernameRegex.test(val)
    }
export const Dayformat = (value) => {
  const date=new Date(value)
  const today = new Date()
  let day=`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  if(date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()){
      if(date.getDate() === (today.getDate())-1 ){
        day=`${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)} Yesterday`
      }
      if(date.getDate() === (today.getDate())){
        day=`${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}`
      }
    }
    return day
};

export const checkDay = (value) => {
  const today = new Date()
  const date=new Date(value)
  let day=''
  if(date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()){
      if(date.getDate() === (today.getDate())-1 ){
        day='Yesterday'
      }
      if(date.getDate() === (today.getDate())){
        day='Today'
      }
    }
    return day
};

export function groupBy(data, property) {
  return data.reduce((acc, obj) => {
    const key = obj[property];
   
    if (!acc[key]) {  
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, []);
}

export function matchYoutubeUrl(url) {
  var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if(url.match(p)){
      return url.match(p)[1];
  }
  return false;
}
const now=new Date()
export const timeago=(value)=>{
  const totalseconds=(now.getTime()-new Date(value).getTime())/1000
  let time=Math.round(totalseconds)+'s'
  if(totalseconds>60 && totalseconds<60*60){
    time=Math.round(totalseconds/60) +'m'
  }
  if(totalseconds>=60*60 && totalseconds<60*60*24){
    time=Math.round(totalseconds/3600) +'h'
  }
  else if(totalseconds>=60*60*24 && totalseconds<60*60*24*30){
    time=Math.round(totalseconds/(60*60*24)) +'d'
  }
  else if(totalseconds>=60*60*24*30 && totalseconds<60*60*24*30*12){
    time=Math.round(totalseconds/(60*60*24*30)) +'m'
  }
  else if(totalseconds>=60*60*24*30*12){
    time=Math.round(totalseconds/(60*60*24*30*12)) +'y'
  }
  return time
}
export const formatter = new Intl.NumberFormat('vi-VN', {
  minimumFractionDigits: 0
})
export const listcoins=[{number:70,price:18000},{number:350,price:89000},
  {number:700,price:178000},{number:1400,price:356000},{number:3500,price:89000},
  {number:7000,price:1780000},{number:17500,price:4449000}]
export const listgift=[
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455802/3a1a5f209c9e3a17253c2956ec51ef89_tplv-obj_pwabey.png',
name:"May",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/802a21ae29f9fae5abe3693de9f874bd_tplv-obj_joqqoj.png',
name:"Tiktok",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455645/0e6c7bcc6afb7d9aba4d65f2b05ae55e_tplv-obj_wwhvzm.png',
name:"May",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/09d9b188294ecf9b210c06f4e984a3bd_tplv-obj_a7dlaz.png',
name:"Tennis",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/c043cd9e418f13017793ddf6e0c6ee99_tplv-obj_m08nnn.png',
name:"Football",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/840b3d6e362053e4eb83af0ca7228762_tplv-obj_ekoioz.png',
name:"Minnors",coin:30},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/3f02fa9594bd1495ff4e8aa5ae265eef_tplv-obj_vrmd5m.png',
name:"GG",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/63135affee2016240473cab8376dfe74_tplv-obj_nwjmom.png',
name:"Hand wave",coin:10},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/8ebe28a907bb6237fa3b11a97deffe96_tplv-obj_fnfmub.png',
name:"Game",coin:9},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/728cc7436005cace2791aa7500e4bf95_tplv-obj_uwqjmy.png',
name:"Mini Speaker",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/4e7ad6bdf0a1d860c538f38026d4e812_tplv-obj_b4yoxv.png',
name:"Dounit",coin:30},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/968820bc85e274713c795a6aef3f7c67_tplv-obj_d8cdrz.png',
name:"ICe Cream",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/a99fc8541c7b91305de1cdcf47714d03_tplv-obj_znfpge.png',
name:"Weights",coin:1},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/20b8f61246c7b6032777bb81bf4ee055_tplv-obj_aohh0x.png',
name:"Tiktok",coin:20},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/7d055532898d2060101306de62b89882_tplv-obj_dbctkv.png',
name:"May",coin:10},

{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/eba3a9bb85c33e017f3648eaf88d7189_tplv-obj_suqpsq.png',
name:"Tiktok",coin:1},

{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455646/8d4381b7d2272ffc14227c3705832e24_tplv-obj_iz3cq0.png',
name:"May",coin:5},
{image:'https://res.cloudinary.com/dltj2mkhl/image/upload/v1653455647/a4c4dc437fd3a6632aba149769491f49.png_tplv-obj_xkoytb.png',
name:"Tiktok",coin:5},
]

