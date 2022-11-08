import React,{useState,useEffect} from 'react'
import {useNavigate,Link} from "react-router-dom"
import { connect } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import { loginURL } from "../urls"
import axios from 'axios';
import { gapi } from "gapi-script";
import { headers,googleLogin,login } from "../actions/auth"
const LoginGoogle=(props)=>{
    const {googleLogin,login}=props
    useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: "874868987927-hudvamdogth0ei4hctcp5gja538tggkf.apps.googleusercontent.com",
            scope: 'email',
          });
        }
    
        gapi.load('client:auth2', start);
      }, []);
    const responseGoogle = async (res) => {
        
            try{
                console.log(res)
                await googleLogin(res.accessToken);
                let form=new FormData()
                form.append('token',localStorage.access_token)
                const res1 = await axios.post(loginURL,form, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                const token = res1.data.access;
                localStorage.setItem('token',token);
                const search = window.location.search;
                const params = new URLSearchParams(search);
                if(params.get('next')!=null){
                    window.location.href=params.get('next')
                }
                else{
                    window.location.href='/'
                } 
            }
            catch(e){
                console.log(e)
            }
       
    }
    return(
        <GoogleLogin
            clientId="874868987927-hudvamdogth0ei4hctcp5gja538tggkf.apps.googleusercontent.com"
            buttonText="Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            render={renderProps => (
                <div onClick={renderProps.onClick} disabled={renderProps.disabled} class="tiktok-xbg2z9-DivBoxContainer e1cgu1qo0">
                    <div class="tiktok-biy4dj-DivIconContainer e1cgu1qo1">
                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M43 24.4313C43 23.084 42.8767 21.7885 42.6475 20.5449H24.3877V27.8945H34.8219C34.3724 30.2695 33.0065 32.2818 30.9532 33.6291V38.3964H37.2189C40.885 35.0886 43 30.2177 43 24.4313Z" fill="#4285F4"></path><path fillRule="evenodd" clipRule="evenodd" d="M24.3872 43.001C29.6219 43.001 34.0107 41.2996 37.2184 38.3978L30.9527 33.6305C29.2165 34.7705 26.9958 35.4441 24.3872 35.4441C19.3375 35.4441 15.0633 32.1018 13.5388 27.6108H7.06152V32.5337C10.2517 38.7433 16.8082 43.001 24.3872 43.001Z" fill="#34A853"></path><path fillRule="evenodd" clipRule="evenodd" d="M13.5395 27.6094C13.1516 26.4695 12.9313 25.2517 12.9313 23.9994C12.9313 22.7472 13.1516 21.5295 13.5395 20.3894V15.4668H7.06217C5.74911 18.0318 5 20.9336 5 23.9994C5 27.0654 5.74911 29.9673 7.06217 32.5323L13.5395 27.6094Z" fill="#FBBC04"></path><path fillRule="evenodd" clipRule="evenodd" d="M24.3872 12.5568C27.2336 12.5568 29.7894 13.5155 31.7987 15.3982L37.3595 9.94866C34.0018 6.88281 29.6131 5 24.3872 5C16.8082 5 10.2517 9.25777 7.06152 15.4674L13.5388 20.39C15.0633 15.8991 19.3375 12.5568 24.3872 12.5568Z" fill="#EA4335"></path></svg>
                    </div>Continue with Google
                </div>
            )}
        />
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated
});
export default connect(mapStateToProps, { login,googleLogin })(LoginGoogle);
