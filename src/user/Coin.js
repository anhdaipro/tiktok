
import { listcoins,formatter } from "../constants"
import Navbar from "../containers/Navbar"
import Payment from "./Payment"
import React,{useEffect,useState} from "react"
import "../css/coins.css"
import {connect} from "react-redux"
import {Link} from "react-router-dom"
import {coinuserURL} from "../urls"
import axios from 'axios';
import { expiry, headers } from "../actions/auth"
const Coins=(props)=>{
    const {user,isAuthenticated}=props
    const [state,setState]=useState({coins:0,amounts:0,coingive:0,totalcoins:0})

    const [loading,setLoading]=useState(false)
    const setstate=(name,value)=>{
        setState({...state,[name]:value})
    }
    useEffect(()=>{
        (async()=>{
            try{
                if(!localStorage.token && expiry<0){
                    window.location="/"
                }
                else{
                await isAuthenticated
                const res=await axios.get(coinuserURL,headers)
                setState({...state,coingive:res.data.totalcoins,totalcoins:res.data.coins})
                }
            }
            catch{

            }
        })()
    },[])
return(
        <div id="main" style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'flex-start'}}>
            <div className="tiktok-t31vku-MainLiveLayoutContainer">
                <Navbar/>
                <div className="tiktok-l6q0uj-DivMainContainer epp882f1">
                    <button className="tiktok-vmyka6-ButtonQuestionContainer epp882f4">
                        <svg className="tiktok-ze008l-StyledQnMarkIcon epp882f3" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6ZM2 24C2 11.8497 11.8497 2 24 2C36.1503 2 46 11.8497 46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24ZM24.0909 15C22.172 15 20.3433 16.2292 19.2617 18.61C19.0332 19.1128 18.4726 19.4 17.9487 19.2253L16.0513 18.5929C15.5274 18.4182 15.2406 17.8497 15.4542 17.3405C16.9801 13.7031 20.0581 11 24.0909 11C28.459 11 32 14.541 32 18.9091C32 21.2138 30.7884 23.4606 29.2167 25.074C27.8157 26.5121 25.5807 27.702 22.9988 27.9518C22.4491 28.0049 22.0001 27.5523 22.0001 27V25C22.0001 24.4477 22.4504 24.0057 22.9955 23.9167C24.2296 23.7153 25.5034 23.1533 26.3515 22.2828C27.4389 21.1666 28 19.8679 28 18.9091C28 16.7502 26.2498 15 24.0909 15ZM24 36C22.3431 36 21 34.6569 21 33C21 31.3431 22.3431 30 24 30C25.6569 30 27 31.3431 27 33C27 34.6569 25.6569 36 24 36Z"></path></svg>
                    </button>
                    <div className="tiktok-6d315m-DivContentContainer epp882f2">
                        <div className="tiktok-suegnd-DivContentWrapper epp882f0">
                            <section className="tiktok-18xp9s9-SectionContentWrapper e3wel1u0">
                                <div className="tiktok-hb30h9-DivTitleInfoContainer e3wel1u1">
                                    <span className="tiktok-awsfqx-SpanTitleInfoCoin e3wel1u2">Get coins</span>
                                    <Link to="/coin/transaction-history">
                                        <span className="tiktok-1an7149-SpanTitleInfoTrans e3wel1u3">View transaction history</span>
                                    </Link>
                                </div>
                                <div className="tiktok-1m4xkpg-DivProfileInfo e3wel1u7">
                                    <div data-e2e="profile-icon" className="tiktok-1igqi6u-DivProfileContainer efubjyv0" style={{backgroundImage: 'url(&quot;https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7096685911001268230~c5_720x720.jpeg?x-expires=1653627600&amp;x-signature=QE5RKqogc8c%2BMaz9Xz4mm84ygvI%3D&quot;)', height: '44px', minWidth: '44px', marginLeft: '0px'}}></div>
                                    <div className="tiktok-9l16e2-DivNameCoinInfo e3wel1u8">
                                        <span className="tiktok-mpc56k-SpanNameInfo e3wel1u10">{user!=null?user.name:''}</span>
                                        <div className="tiktok-6vx15k-DivCoinInfo e3wel1u9">
                                            <svg className="tiktok-1xbcpkv-StyledCoinIcon e3wel1u5" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#FFEC9B"></circle><circle cx="24" cy="24" r="17" fill="#FACE15"></circle><path fillRule="evenodd" clipRule="evenodd" d="M40.9347 25.5C40.9779 25.0058 41 24.5055 41 24C41 14.6112 33.3888 7 24 7C14.6112 7 7 14.6112 7 24C7 24.5055 7.02206 25.0058 7.06527 25.5C7.82466 16.8137 15.1166 10 24 10C32.8834 10 40.1753 16.8137 40.9347 25.5Z" fill="#FABC15"></path><path d="M33 19C30.2041 19 27.9375 16.7614 27.9375 14H24.5625V27.6111C24.5625 29.2986 23.1774 30.6667 21.4688 30.6667C19.7601 30.6667 18.375 29.2986 18.375 27.6111C18.375 25.9236 19.7601 24.5556 21.4688 24.5556C21.722 24.5556 21.9659 24.5853 22.1981 24.6406C22.2365 24.6497 22.2747 24.6596 22.3125 24.6701V21.2763C22.0358 21.2406 21.7541 21.2222 21.4688 21.2222C17.8962 21.2222 15 24.0826 15 27.6111C15 31.1396 17.8962 34 21.4688 34C25.0413 34 27.9375 31.1396 27.9375 27.6111V20.6673C29.3477 21.7134 31.1005 22.3333 33 22.3333V19Z" fill="#FEF5CD"></path></svg>
                                            <span className="tiktok-1baexgc-SpanCoinNum e3wel1u4">{state.totalcoins}</span>
                                        </div>
                                    </div>
                                    <div className="tiktok-47xdqp-DivExchangeContainer enjbgo71">
                                        <div className="tiktok-zyqofd-DivExchangeTitle enjbgo72">From LIVE gifts: ${(state.coingive/80).toFixed(2)} ( 
                                            <svg className="tiktok-17y05l1-StyledCoinIcon enjbgo74" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#FFEC9B"></circle><circle cx="24" cy="24" r="17" fill="#FACE15"></circle><path fillRule="evenodd" clipRule="evenodd" d="M40.9347 25.5C40.9779 25.0058 41 24.5055 41 24C41 14.6112 33.3888 7 24 7C14.6112 7 7 14.6112 7 24C7 24.5055 7.02206 25.0058 7.06527 25.5C7.82466 16.8137 15.1166 10 24 10C32.8834 10 40.1753 16.8137 40.9347 25.5Z" fill="#FABC15"></path><path d="M33 19C30.2041 19 27.9375 16.7614 27.9375 14H24.5625V27.6111C24.5625 29.2986 23.1774 30.6667 21.4688 30.6667C19.7601 30.6667 18.375 29.2986 18.375 27.6111C18.375 25.9236 19.7601 24.5556 21.4688 24.5556C21.722 24.5556 21.9659 24.5853 22.1981 24.6406C22.2365 24.6497 22.2747 24.6596 22.3125 24.6701V21.2763C22.0358 21.2406 21.7541 21.2222 21.4688 21.2222C17.8962 21.2222 15 24.0826 15 27.6111C15 31.1396 17.8962 34 21.4688 34C25.0413 34 27.9375 31.1396 27.9375 27.6111V20.6673C29.3477 21.7134 31.1005 22.3333 33 22.3333V19Z" fill="#FEF5CD"></path></svg>
                                            {state.coingive} )
                                        </div>
                                        <div className="tiktok-4lst93-DivExchangeSubtitle enjbgo73">Exchange earnings to coins 
                                            <svg className="tiktok-15pxexj-StyledChevronRightIcon enjbgo75" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M43.4142 22.5858L27.1213 6.29289C26.7308 5.90237 26.0976 5.90237 25.7071 6.29289L24.2929 7.70711C23.9024 8.09763 23.9024 8.7308 24.2929 9.12132L39.1716 24L24.2929 38.8787C23.9024 39.2692 23.9024 39.9024 24.2929 40.2929L25.7071 41.7071C26.0976 42.0976 26.7308 42.0976 27.1213 41.7071L43.4142 25.4142C44.1953 24.6332 44.1953 23.3668 43.4142 22.5858Z"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <p className="tiktok-zo9rrd-PRechargeCoins euc79ku0">Buy coins</p>
                            <div className="tiktok-nl863b-DivCoinsBkgContainer euc79ku1">
                                <div className="tiktok-zociij-DivOfferInfo euc79ku2">
                                    <h2 className="tiktok-1s4au06-H2OfferTitle euc79ku3">Enjoy this web-exclusive offer!</h2>
                                    <ul className="tiktok-1lfbhdu-UlRechargeBenefitList euc79ku4">
                                        <li className="tiktok-ipkxxb-LiRechargeBenefitListItem euc79ku5">
                                                <svg className="tiktok-2lnv5w-StyledTick euc79ku6" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.1444 4.15512L5.77315 9.5299C5.29957 10.0037 5.29957 10.7784 5.77315 11.2511C6.24612 11.7249 7.01979 11.7249 7.49336 11.2511L12.8652 5.87627C13.3382 5.40304 13.3382 4.62895 12.8652 4.15512C12.6284 3.91881 12.3168 3.80005 12.0051 3.80005C11.6928 3.80005 11.3812 3.91881 11.1444 4.15512Z" fill="#FF0040"></path><path fillRule="evenodd" clipRule="evenodd" d="M5.77315 9.5299C5.29957 10.0037 5.29957 10.7784 5.77315 11.2511C6.24612 11.7249 7.01979 11.7249 7.49336 11.2511L12.8652 5.87627C13.3382 5.40304 13.3382 4.62895 12.8652 4.15512C12.6284 3.91881 12.3168 3.80005 12.0051 3.80005C11.6928 3.80005 11.3812 3.91881 11.1444 4.15512L5.77315 9.5299Z" fill="#FF0040"></path><path fillRule="evenodd" clipRule="evenodd" d="M9.2136 9.5304C8.74064 10.0036 7.96636 10.0036 7.49339 9.5304L6.63329 8.66983L4.06758 6.10272C3.59461 5.6295 2.81973 5.6295 2.34737 6.10272C1.87379 6.57595 1.87379 7.35065 2.34737 7.82387L5.77318 11.2516C6.24615 11.7254 7.01982 11.7254 7.49339 11.2516L9.2136 9.5304Z" fill="#FF0040"></path></svg>
                                                <span className="tiktok-1q00quu-SpanRechargeBenefit euc79ku7">No in-app service fees</span>
                                        </li>
                                        <li className="tiktok-ipkxxb-LiRechargeBenefitListItem euc79ku5">
                                                <svg className="tiktok-2lnv5w-StyledTick euc79ku6" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.1444 4.15512L5.77315 9.5299C5.29957 10.0037 5.29957 10.7784 5.77315 11.2511C6.24612 11.7249 7.01979 11.7249 7.49336 11.2511L12.8652 5.87627C13.3382 5.40304 13.3382 4.62895 12.8652 4.15512C12.6284 3.91881 12.3168 3.80005 12.0051 3.80005C11.6928 3.80005 11.3812 3.91881 11.1444 4.15512Z" fill="#FF0040"></path><path fillRule="evenodd" clipRule="evenodd" d="M5.77315 9.5299C5.29957 10.0037 5.29957 10.7784 5.77315 11.2511C6.24612 11.7249 7.01979 11.7249 7.49336 11.2511L12.8652 5.87627C13.3382 5.40304 13.3382 4.62895 12.8652 4.15512C12.6284 3.91881 12.3168 3.80005 12.0051 3.80005C11.6928 3.80005 11.3812 3.91881 11.1444 4.15512L5.77315 9.5299Z" fill="#FF0040"></path><path fillRule="evenodd" clipRule="evenodd" d="M9.2136 9.5304C8.74064 10.0036 7.96636 10.0036 7.49339 9.5304L6.63329 8.66983L4.06758 6.10272C3.59461 5.6295 2.81973 5.6295 2.34737 6.10272C1.87379 6.57595 1.87379 7.35065 2.34737 7.82387L5.77318 11.2516C6.24615 11.7254 7.01982 11.7254 7.49339 11.2516L9.2136 9.5304Z" fill="#FF0040"></path></svg>
                                                <span className="tiktok-1q00quu-SpanRechargeBenefit euc79ku7">Custom amounts</span>
                                        </li>
                                        <li className="tiktok-ipkxxb-LiRechargeBenefitListItem euc79ku5">
                                                <svg className="tiktok-2lnv5w-StyledTick euc79ku6" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.1444 4.15512L5.77315 9.5299C5.29957 10.0037 5.29957 10.7784 5.77315 11.2511C6.24612 11.7249 7.01979 11.7249 7.49336 11.2511L12.8652 5.87627C13.3382 5.40304 13.3382 4.62895 12.8652 4.15512C12.6284 3.91881 12.3168 3.80005 12.0051 3.80005C11.6928 3.80005 11.3812 3.91881 11.1444 4.15512Z" fill="#FF0040"></path><path fillRule="evenodd" clipRule="evenodd" d="M5.77315 9.5299C5.29957 10.0037 5.29957 10.7784 5.77315 11.2511C6.24612 11.7249 7.01979 11.7249 7.49336 11.2511L12.8652 5.87627C13.3382 5.40304 13.3382 4.62895 12.8652 4.15512C12.6284 3.91881 12.3168 3.80005 12.0051 3.80005C11.6928 3.80005 11.3812 3.91881 11.1444 4.15512L5.77315 9.5299Z" fill="#FF0040"></path><path fillRule="evenodd" clipRule="evenodd" d="M9.2136 9.5304C8.74064 10.0036 7.96636 10.0036 7.49339 9.5304L6.63329 8.66983L4.06758 6.10272C3.59461 5.6295 2.81973 5.6295 2.34737 6.10272C1.87379 6.57595 1.87379 7.35065 2.34737 7.82387L5.77318 11.2516C6.24615 11.7254 7.01982 11.7254 7.49339 11.2516L9.2136 9.5304Z" fill="#FF0040"></path></svg>
                                                <span className="tiktok-1q00quu-SpanRechargeBenefit euc79ku7">More payment methods</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="tiktok-1envxde-DivCoinsListContainer euc79ku8">
                                    {listcoins.map(item=>
                                    <div onClick={()=>setState({...state,coins:item.number,amounts:item.price})} className={`${state.coins==item.number?'tiktok-1b6ocwr-DivContainer':'tiktok-u1imyl-DivContainer'}  ey03fe50`}>
                                        <div className="tiktok-16jd2dh-DivNumContainer ey03fe51">
                                            <span className="tiktok-240y52-SpanNumIcon ey03fe52">
                                                <svg className="tiktok-a0xu6c-StyledCoinIcon ey03fe511" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#FFEC9B"></circle><circle cx="24" cy="24" r="17" fill="#FACE15"></circle><path fillRule="evenodd" clipRule="evenodd" d="M40.9347 25.5C40.9779 25.0058 41 24.5055 41 24C41 14.6112 33.3888 7 24 7C14.6112 7 7 14.6112 7 24C7 24.5055 7.02206 25.0058 7.06527 25.5C7.82466 16.8137 15.1166 10 24 10C32.8834 10 40.1753 16.8137 40.9347 25.5Z" fill="#FABC15"></path><path d="M33 19C30.2041 19 27.9375 16.7614 27.9375 14H24.5625V27.6111C24.5625 29.2986 23.1774 30.6667 21.4688 30.6667C19.7601 30.6667 18.375 29.2986 18.375 27.6111C18.375 25.9236 19.7601 24.5556 21.4688 24.5556C21.722 24.5556 21.9659 24.5853 22.1981 24.6406C22.2365 24.6497 22.2747 24.6596 22.3125 24.6701V21.2763C22.0358 21.2406 21.7541 21.2222 21.4688 21.2222C17.8962 21.2222 15 24.0826 15 27.6111C15 31.1396 17.8962 34 21.4688 34C25.0413 34 27.9375 31.1396 27.9375 27.6111V20.6673C29.3477 21.7134 31.1005 22.3333 33 22.3333V19Z" fill="#FEF5CD"></path></svg>
                                            </span>
                                            <span className="tiktok-pwum7e-SpanNumDisplay ey03fe53">{formatter.format(item.number).replace(/[.]/g,',')}</span>
                                        </div>
                                        <div className="tiktok-1uetk1w-DivTextContainer ey03fe54">
                                            <span className="tiktok-jgx73x-SpanTextNow ey03fe56">₫ {formatter.format(item.price).replace(/[.]/g,',')}</span>
                                        </div>
                                    </div>
                                    )}
                                    <div className="tiktok-u1imyl-DivContainer ey03fe50">
                                        <div className="tiktok-16jd2dh-DivNumContainer ey03fe51">
                                            <span className="tiktok-240y52-SpanNumIcon ey03fe52">
                                                <svg className="tiktok-a0xu6c-StyledCoinIcon ey03fe511" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#FFEC9B"></circle><circle cx="24" cy="24" r="17" fill="#FACE15"></circle><path fillRule="evenodd" clipRule="evenodd" d="M40.9347 25.5C40.9779 25.0058 41 24.5055 41 24C41 14.6112 33.3888 7 24 7C14.6112 7 7 14.6112 7 24C7 24.5055 7.02206 25.0058 7.06527 25.5C7.82466 16.8137 15.1166 10 24 10C32.8834 10 40.1753 16.8137 40.9347 25.5Z" fill="#FABC15"></path><path d="M33 19C30.2041 19 27.9375 16.7614 27.9375 14H24.5625V27.6111C24.5625 29.2986 23.1774 30.6667 21.4688 30.6667C19.7601 30.6667 18.375 29.2986 18.375 27.6111C18.375 25.9236 19.7601 24.5556 21.4688 24.5556C21.722 24.5556 21.9659 24.5853 22.1981 24.6406C22.2365 24.6497 22.2747 24.6596 22.3125 24.6701V21.2763C22.0358 21.2406 21.7541 21.2222 21.4688 21.2222C17.8962 21.2222 15 24.0826 15 27.6111C15 31.1396 17.8962 34 21.4688 34C25.0413 34 27.9375 31.1396 27.9375 27.6111V20.6673C29.3477 21.7134 31.1005 22.3333 33 22.3333V19Z" fill="#FEF5CD"></path></svg>
                                            </span>
                                            <span className="tiktok-pwum7e-SpanNumDisplay ey03fe53">Custom</span>
                                        </div>
                                        <div className="tiktok-1uetk1w-DivTextContainer ey03fe54">
                                            <span className="tiktok-jgx73x-SpanTextNow ey03fe56">Large amount supported</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tiktok-11ddo6h-DivTotalContainer e4p02ab0">
                                <div className="tiktok-amfpe8-DivPaymentMethodsContainer e4p02ab1">
                                    <span className="tiktok-cjnixv-SpanTotalText e4p02ab2">Payment method</span>
                                    <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/visa_light_c558fb.svg" className="tiktok-omf4am-ImgPaymentIcon e4p02ab5"/>
                                    <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/mastercard_light_0883be.svg" className="tiktok-omf4am-ImgPaymentIcon e4p02ab5"/>
                                    <img src="https://lf16-co.g-p-static.com/obj/pipo-sg/sky/maestro_188b29.svg" className="tiktok-omf4am-ImgPaymentIcon e4p02ab5"/>
                                    <img src="https://lf16-co.g-p-static.com/obj/pipo-sg/sky/diners_a3de24.svg" className="tiktok-omf4am-ImgPaymentIcon e4p02ab5"/>
                                    <img src="https://lf16-co.g-p-static.com/obj/pipo-sg/sky/discover_5ec158.svg" className="tiktok-omf4am-ImgPaymentIcon e4p02ab5"/>
                                    <img src="https://lf16-co.g-p-static.com/obj/pipo-sg/sky/card_american_express_v1_429e0f.svg" className="tiktok-omf4am-ImgPaymentIcon e4p02ab5"/>
                                    <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/2c2p-border_2ec2d6.png" className="tiktok-omf4am-ImgPaymentIcon e4p02ab5"/>
                                    <img src="https://lf16-co.g-p-static.com/obj/pipo-sgcompliance/sky/zalopay-icon_e8534b.svg" className="tiktok-omf4am-ImgPaymentIcon e4p02ab5"/>
                                </div>
                            </div>
                            <div className="tiktok-11ddo6h-DivTotalContainer e1pwuvjp0">
                                <span className="tiktok-cjnixv-SpanTotalText e1pwuvjp2">Total</span>
                                <span className="tiktok-idre77-SpanTotalMount e1pwuvjp3">₫  {formatter.format(state.amounts).replace(/[.]/g,',')}</span>
                            </div>
                            <div className="tiktok-vr1v8s-DivButtonContainer e1pwuvjp4">
                                <button onClick={()=>setState({...state,show_payment:true})} type="button" disabled={state.amounts>0?false:true} className={`e1pwuvjp6 tiktok-14az9j-Button-StyledBuyButton ehk74z00`}>Buy now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {state.show_payment?<Payment
            state={state}
            user={user}
            setstate={(name,value)=>setstate(name,value)}
            />:''}
        </div>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user
});
export default connect(mapStateToProps)(Coins);
