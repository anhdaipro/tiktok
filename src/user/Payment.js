import {
    PayPalScriptProvider,
    PayPalHostedFieldsProvider,
    PayPalHostedField,
    usePayPalHostedFields,
    PayPalButtons,
    BraintreePayPalButtons,
} from "@paypal/react-paypal-js";
import {paymentURL} from "../urls"
import axios from 'axios';
import { headers} from '../actions/auth';
import {formatter} from "../constants"
import React, {useState, useEffect,useCallback} from 'react'
const SubmitPayment = () => {
    // Here declare the variable containing the hostedField instance
    const hostedFields = usePayPalHostedFields();
    const submitHandler = () => {
        if (!typeof hostedFields.submit !== "function") return; // validate that `submit()` exists before using it
        hostedFields
            .submit({
                // The full name as shown in the card and billing address
                cardholderName: "John Wick",
            })
            .then((order) => {
                fetch(
                    "/your-server-side-integration-endpoint/capture-payment-info"
                )
                    .then((response) => response.json())
                    .then((data) => {
                        // Inside the data you can find all the information related to the payment
                    })
                    .catch((err) => {
                        // Handle any error
                    });
            });
    };

    return <button onClick={submitHandler}>Pay</button>;
};

export default function Payment(props) {
    const {user,state,setstate}=props
    
    
    return (  
        <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
            <div className="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div>
            <div className="tiktok-hf5azb-DivContentContainer e1gjoq3k2">
                <div className="tiktok-1kgqhs7-DivCashierContainer emd2iv51">
                    <header class="tiktok-5syodm-HeaderOrderSummaryTitle ecqjyae0">Order summary</header>
                    <div class="tiktok-197anyc-DivProfileRow ecqjyae2">
                        <span class="tiktok-j5b5pg-SpanProfileDescription ecqjyae3">Account</span>
                        <div class="tiktok-1vchfa7-DivProfileInfo ecqjyae4">
                            <div data-e2e="profile-icon" class="tiktok-1igqi6u-DivProfileContainer efubjyv0" style={{backgroundImage: `url(${user.picture})`, height: '32px', minWidth: '32px'}}></div>
                            <span class="tiktok-1sdalgk-SpanProfileUsername ecqjyae5">{user.username}</span>
                        </div>
                    </div>
                    <div class="tiktok-q8zfnj-DivOrderDetails ecqjyae6">
                        <div class="tiktok-ex9szf-DivOrderSummaryContent ecqjyae1">
                            <span>{formatter.format(state.coins).replace(/[.]/g,',')} coins</span>
                            <span>₫{formatter.format(state.amounts).replace(/[.]/g,',')}</span>
                        </div>
                        <div class="tiktok-1b0bgzw-DivOrderSummaryContent ecqjyae1">
                            <span>Total</span>
                            <span>₫{formatter.format(state.amounts).replace(/[.]/g,',')}</span>
                        </div>
                    </div>
                    <div className="_8Cs56x UeFxZG">
                        <div className="item-centers">    
                            <div id="paypal-button-container">
                                <PayPalScriptProvider
                                    options={{
                                        "client-id": "AY2deOMPkfo32qrQ_fKeXYeJkJlAGPh5N-9pdDFXISyUydAwgRKRPRGhiQF6aBnG68V6czG5JsulM2mX",
                                        
                                    }}
                                >
                                <PayPalButtons
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: state.amounts,
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={(data, actions) =>{
                                        return actions.order.capture().then(function (details) {
                                            let form=new FormData()
                                            form.append('payID',details.purchase_units[0].payments.captures[0].id)
                                            form.append('coins',state.coins)
                                            form.append('amounts',state.amounts)
                                            axios.post(paymentURL,form,headers)
                                            .then(res=>{
                                                setstate('totalcoins',state.coins+state.totalcoins)
                                            })
                                            .catch(function(err){
                                                alert('Error: ', err)
                                            })
                                        });
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>
                    </div>
                    <div onClick={()=>setstate('show_payment',false)} data-e2e="modal-close-inner-button" class="tiktok-1bah7od-DivCloseWrapper e1gjoq3k4" style={{marginTop: '5px', zIndex: 100}}>
                        <svg class="tiktok-1anes8e-StyledIcon e1gjoq3k3" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.1718 23.9999L10.2931 13.1212C9.90261 12.7307 9.90261 12.0975 10.2931 11.707L11.7074 10.2928C12.0979 9.90228 12.731 9.90228 13.1216 10.2928L24.0002 21.1715L34.8789 10.2928C35.2694 9.90228 35.9026 9.90228 36.2931 10.2928L37.7073 11.707C38.0979 12.0975 38.0979 12.7307 37.7073 13.1212L26.8287 23.9999L37.7073 34.8786C38.0979 35.2691 38.0979 35.9023 37.7073 36.2928L36.2931 37.707C35.9026 38.0975 35.2694 38.0975 34.8789 37.707L24.0002 26.8283L13.1216 37.707C12.731 38.0975 12.0979 38.0975 11.7074 37.707L10.2931 36.2928C9.90261 35.9023 9.90261 35.2691 10.2931 34.8786L21.1718 23.9999Z"></path></svg>
                    </div>
                </div>
            </div>    
        </div>
        </div>
    );
}
