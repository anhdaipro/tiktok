import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { checkAuthenticated,login,expiry} from '../actions/auth';

const Layout = ({children,checkAuthenticated,isAuthenticated,user }) => {
    useEffect(() => {
        (async ()=>{
            if(localStorage.token!='null' && expiry>0 && user==null){
                checkAuthenticated()
            }
            else if(isAuthenticated && user==null){
                checkAuthenticated()
            }
        })() 
       
    }, [isAuthenticated]);

    console.log(isAuthenticated)
   
    return (
        <>  
            {children}
            
        </>
        
    );
};
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user
});
export default connect(mapStateToProps,{checkAuthenticated})(Layout);
