import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { checkAuthenticated,login,expiry} from '../actions/auth';
import Loginhome from '../user/Loginhome';

const Layout = ({children,checkAuthenticated,isAuthenticated,user }) => {
    useEffect(() => {
        (async ()=>{
            if(localStorage.token){
                checkAuthenticated()
            }
        })() 
       
    }, [localStorage.token]);

    console.log(isAuthenticated)
   
    return (
        <>  
            {children}
            <Loginhome/>
        </>
        
    );
};
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user
});
export default connect(mapStateToProps,{checkAuthenticated})(Layout);
