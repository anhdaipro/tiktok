import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    FACEBOOK_AUTH_SUCCESS,
    FACEBOOK_AUTH_FAIL,
    LOGOUT,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    GET_THREAD_SUCCESS,
    CREATE_THREAD_FAIL,
    CREATE_THREAD_SUCCESS,
    GET_THREAD_FAIL,
    UPDATE_NOTIFI_SUCCESS
} from './types';

import axios from 'axios';
import { listThreadlURL, loginURL,registerURL,userinfoURL,userprofileURL} from '../urls';
import { isVietnamesePhoneNumber,validatEemail } from '../constants';



export const googleAuthenticate = (state, code) => async dispatch => {
    if (state && code) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const details = {
            'state': state,
            'code': code
        };

        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        try {
            const res = await axios.post(`https://anhdai.herokuapp.com/auth/o/google-oauth2/?${formBody}`, config);
            dispatch({
                type: GOOGLE_AUTH_SUCCESS,
                payload: res.data
            });

        } catch (err) {
            dispatch({
                type: GOOGLE_AUTH_FAIL
            });
        }
    }
};

export const googleLogin = (accessToken) => async dispatch => {
    try {
        const res=await axios.post('https://daiviet.herokuapp.com/api-auth/convert-token', {
			token: accessToken,
            backend: "google-oauth2",
            grant_type: "convert_token",
            client_id: "kVDYxFXPZ8KRIusXjnjAk44fgKEHptuWtDI98yke",
            client_secret: "WlMOdXQKc3XALyVaIXOaEsVAjh1FTa2IrmxcbUARUHLIFLiL02RvEAEu2sJl4LpFO2P0cNvZnbF2W39VjVdEhsqcPK7vRyFwpYl1JCGgh2fu5jmTs6ip529SJN17u0CZ",
		})
        dispatch({
            type: GOOGLE_AUTH_SUCCESS,
            payload: res.data
        });
        localStorage.setItem('access_token', res.data.access_token);
		localStorage.setItem('refresh_token', res.data.refresh_token);
    }
    catch (err) {
        dispatch({
            type: GOOGLE_AUTH_FAIL
        });
    }
};

export const facebookLogin = (accessToken) => async dispatch =>{
    try {
    const res=await axios.post('https://daiviet.herokuapp.com/api-auth/convert-token', {
        token: accessToken,
        backend: "facebook",
        grant_type: "convert_token",
        client_id: "kVDYxFXPZ8KRIusXjnjAk44fgKEHptuWtDI98yke",
        client_secret: "WlMOdXQKc3XALyVaIXOaEsVAjh1FTa2IrmxcbUARUHLIFLiL02RvEAEu2sJl4LpFO2P0cNvZnbF2W39VjVdEhsqcPK7vRyFwpYl1JCGgh2fu5jmTs6ip529SJN17u0CZ",
        })
        dispatch({
            type: FACEBOOK_AUTH_SUCCESS,
            payload: res.data
        });
        localStorage.setItem('access_token',res.data.access_token);
    }
    catch (err) {
        dispatch({
            type: FACEBOOK_AUTH_FAIL
        });
    }
};

export const loginotp = (user_id) => async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let form=new FormData()
    form.append('user_id',user_id)
    
    try {
        const res = await axios.post('https://anhdai.herokuapp.com/api/v4/login', form, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
            
        });
        const expirationDate = new Date().getTime() + 1800 * 1000
        localStorage.setItem("expirationDate", expirationDate);
        const token = res.data.access;
        localStorage.setItem('token',token);
       
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        })
    }
}
export const facebookAuthenticate = (state, code) => async dispatch => {
    if (state && code && !localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const details = {
            'state': state,
            'code': code
        };

        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        try {
            const res = await axios.post(`https://anhdai.herokuapp.com/auth/o/facebook/?${formBody}`, config);

            dispatch({
                type: FACEBOOK_AUTH_SUCCESS,
                payload: res.data
            });

        } catch (err) {
            dispatch({
                type: FACEBOOK_AUTH_FAIL
            });
        }
    }
};

export const login = (username, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let form=new FormData()
    if(validatEemail(username)){
    form.append('email',username)
    }
    else{
        form.append('username',username)
    }
    form.append('password',password)
    
    try {
        const res = await axios.post(loginURL, form, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
            
        });
        localStorage.setItem("expirationDate", res.data.access_expires);
        const token = res.data.access;
        localStorage.setItem('token',token);
       
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        })
    }
};

export const checkAuthenticated = () => async dispatch => {
    console.log(localStorage.token)
            try {
                const res = await axios.get(userinfoURL,{ 'headers': { Authorization:`JWT ${localStorage.token}` }})
                dispatch({
                    payload: res.data,
                        type: AUTHENTICATED_SUCCESS
                });
                
            } catch (err) {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
}
export const signup = (username, email, password,profile) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ username, email, password, profile});
   
    try {
        const res = await axios.post(`https://daiviet.herokuapp.com/api/v3/register`, body, config);

        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: SIGNUP_FAIL
        })
    }
};

export const reset_password = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        await axios.post(`https://anhdai.herokuapp.com/api/v4/reset/password/`, body, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        });
    }
};

export const reset_password_confirm = (uidb64, token, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uidb64, token,password});

    try {
        const res =await axios.post(`https://anhdai.herokuapp.com/api/v4/password-reset/${uidb64}/${token}/`, body, config);

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        });
    }
};
const expirationDate = localStorage.getItem("expirationDate")
console.log(new Date(expirationDate))
console.log(new Date())
export const expiry=new Date(expirationDate).getTime() - new Date().getTime()
console.log(expiry)
export const headers={'headers': localStorage.token!='null' && expiry>0?{ Authorization:`JWT ${localStorage.token}`,'Content-Type': 'application/json' }:{'Content-Type': 'application/json'}}
export const logout = () => dispatch => {
    localStorage.token=null
    
    dispatch({
        type: LOGOUT
    });
};
export const updateprofile =(username,name,file,profile_info,picture) =>async dispatch=>{
    let form=new FormData()
    form.append('username',username)
    form.append('name',name)
    form.append('file',file)
    form.append('profile_info',profile_info)
    try {
        await axios.post(`https://daiviet.herokuapp.com/api/v3/${username}/profile`, form,headers);

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload:{username,name,profile_info,picture}
        });
    } catch (err) {
        dispatch({
            type: UPDATE_PROFILE_FAIL
        });
    }
}
 export const create_thread =(user_id,profile_id)=> async dispatch=>{
    try {
        let form=new FormData()
        form.append('participants',user_id)
        form.append('participants',profile_id)
        const res =await axios.post(`${listThreadlURL}`, form,headers);

        dispatch({
            type: CREATE_THREAD_SUCCESS,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type: CREATE_THREAD_FAIL
        });
    }
}
export const  get_thread=(getlist,seen,thread_id)=> async dispatch=>{
    try{
        let url=new URL(listThreadlURL)
        let search_params=url.searchParams
        search_params.append('list_thread',getlist)
        search_params.append('seen',seen)
        search_params.append('thread_id',thread_id)
        url.search = search_params.toString();
        let new_url = url.toString();
        const res =await axios.get(new_url,headers)
        dispatch({
            type: GET_THREAD_SUCCESS,
            payload:res.data
        });
    }
    catch(err){
        dispatch({
            type: GET_THREAD_FAIL
        });
    }
}
export const updatenotify=(data,action)=>async dispatch=>{
    dispatch({
        type: UPDATE_NOTIFI_SUCCESS,
        payload:data
    });
}

export const getStreams = (category) => async dispatch => {
    if (!category) category = ''
    const response = await axios.get(`streams?category=${category}`)
    dispatch({
        type: 'GET_STREAMS',
        payload: response.data
    })
}

export const getStream = (userName) => async dispatch => {
    try {
        var response = await axios.get(`streams?user=${userName}`)
    } catch(e) {
        
    } finally {
        if (!response) {
            dispatch({
                type: 'GET_STREAM',
                payload: [{error: 'This channel does not exist'}]
            })
        } else {
            if (response.status === 200 && !response.data[0]) {
                dispatch({
                    type: 'GET_STREAM',
                    payload: [{error: 'This Channel is not streaming right now', errorName: userName}]
                })
            } else {
                dispatch({
                    type: 'GET_STREAM',
                    payload: response.data
                })
            }
        }
        
    }
    
}

export const getCategories = () => async dispatch => {
    const response = await axios.get('categories/')
    dispatch({
        type: 'GET_CATEGORIES',
        payload: response.data
    })
} 
