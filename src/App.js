import React from 'react'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import HomePage from "./containers/Home"
import "./css/base.css"
import Layout from "./hocs/Layout"
import { Provider } from 'react-redux'
import store  from "./store"
import Uploadvideo from './user/Uploadvideo'
import Profile from "./user/Profile"
import Coins from "./user/Coin"
import Message from "./containers/Chat"
import Searchitem from "./containers/Searchitem"
import Showcomment from './containers/Videodetail';
import Livestream from "./stream/Livestream"
import Hashtag from "./containers/Tag"
import Following from "./containers/Following"
import Recommend from "./containers/Recommend"
import  MainRecorder from "./stream/StreamShow"
import Signup from './user/Signup'
import Login from './user/Login'
import LoginPhoneorEmail from './user/LoginPhoneorEmail'
import SignupEmailorPhone from './user/SignupEmailorPhone'
import ResetPassword from "./user/Resetpassword"
import Room from './stream/Room'
import "./css/login.css"
import "./css/fotter.css"
import "./css/signup.css"
import "./css/music.css"
const Appstore=()=>{ 
return(
        <Provider store={store}>
                <BrowserRouter>
                        <Layout>
                                <Routes>
                                        <Route exact path="/signup" element={<Signup/>}/>
                                        <Route exact path="/login" element={<Login/>}/>
                                        <Route exact path="/login/forget-password" element={<ResetPassword/>}/>
                                        <Route exact path="/login/phone-or-email" element={<LoginPhoneorEmail/>}/>
                                        <Route exact path="/signup/phone-or-email" element={<SignupEmailorPhone/>}/>
                                        <Route exact path="/" element={<HomePage/>}/>
                                        <Route path="/room/:roomID" element={<Room/>} />
                                        <Route exact path="/en" element={<Recommend/>}/>
                                        <Route exact path="/live" element={<MainRecorder/>}/>
                                        
                                        <Route exact path="/following" element={<Following/>}/>
                                        <Route exact path="/tag/:name" element={<Hashtag/>}/>   
                                        <Route exact path="/upload" element={<Uploadvideo/>}/>
                                        <Route exact path="/:user/video/:id" element={<Showcomment/>}/>
                                        <Route exact path="/:userprofile" element={< Profile />}/>  
                                        <Route exact path="/coin" element={<Coins/>}/>
                                        <Route exact path="/messages" element={< Message />}/> 
                                        <Route exact path="/search" element={< Searchitem />}/> 
                                        <Route exact path="/:name/live" element={< Livestream />}/>   
                                </Routes>
                        </Layout>
                </BrowserRouter>
        </Provider>
        )
}
export default Appstore
  