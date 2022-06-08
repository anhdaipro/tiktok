import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { headers } from '../actions/auth'
import { actioncommentURL, actionvideoURL } from '../urls'
const Reportvideo=({video,setvideochoice,setcomment,type})=>{
    const [state, setState] = useState({listreport:[{name:'Misleading information',show_text:false,id:1,text:["Misinformation that could cause harm to an individual's health or wider public safety","Content distributed by disinformation campaigns","Hoaxes, phishing attempts, or manipulated content meant to cause harm","Content distributed to misleads community members about elections or other civic processes"]},{name:'Dangerous organizations and individuals',show_text:false,id:2,text:["Misinformation that could cause harm to an individual's health or wider public safety","Content distributed by disinformation campaigns","Hoaxes, phishing attempts, or manipulated content meant to cause harm","Content distributed to misleads community members about elections or other civic processes"]},
    {name:'Illegal activities and regulated goods',show_text:false,id:3,text:["Misinformation that could cause harm to an individual's health or wider public safety","Content distributed by disinformation campaigns","Hoaxes, phishing attempts, or manipulated content meant to cause harm","Content distributed to misleads community members about elections or other civic processes"]},
    {name:'Frauds and scams',show_text:false,id:4,text:["Misinformation that could cause harm to an individual's health or wider public safety","Content distributed by disinformation campaigns","Hoaxes, phishing attempts, or manipulated content meant to cause harm","Content distributed to misleads community members about elections or other civic processes"]},
    {name:'Violent and graphic content',show_text:false,id:5,text:["Misinformation that could cause harm to an individual's health or wider public safety","Content distributed by disinformation campaigns","Hoaxes, phishing attempts, or manipulated content meant to cause harm","Content distributed to misleads community members about elections or other civic processes"]},
    {name:'Animal cruelty',show_text:false,id:6,text:["Misinformation that could cause harm to an individual's health or wider public safety","Content distributed by disinformation campaigns","Hoaxes, phishing attempts, or manipulated content meant to cause harm","Content distributed to misleads community members about elections or other civic processes"]},
    {name:'Suicide, self-harm, and dangerous acts',show_text:false,id:7,text:["Misinformation that could cause harm to an individual's health or wider public safety","Content distributed by disinformation campaigns","Hoaxes, phishing attempts, or manipulated content meant to cause harm","Content distributed to misleads community members about elections or other civic processes"]},
    {name:'Hate Speech',show_text:false,id:8,text:["Misinformation that could cause harm to an individual's health or wider public safety","Content distributed by disinformation campaigns","Hoaxes, phishing attempts, or manipulated content meant to cause harm","Content distributed to misleads community members about elections or other civic processes"]},{name:'Harassment or Bullying',show_text:false,id:9,text:["Misinformation that could cause harm to an individual's health or wider public safety","Content distributed by disinformation campaigns","Hoaxes, phishing attempts, or manipulated content meant to cause harm","Content distributed to misleads community members about elections or other civic processes"]}]})
    const listtext=state.listreport.find(item=>item.show_text)
    const setshowtext=(itemchoice,value)=>{
        const listreport =state.listreport.map(item=>{
            if(item.id==itemchoice.id){
                return({...item,show_text:value})
            }
            return({...item})
        })
        setState({...state,listreport:listreport})
    }
    const submitreport=(e)=>{
        
        ( async ()=>{
            try{
                e.preventDefault()
                let form=new FormData()
                form.append('reason',listtext.name)
                const res =await axios.post(`${type=='video'?actionvideoURL:actioncommentURL}/${video.id}`,form,headers)
                type=='video'?setvideochoice(e,video,'reported',true,'success_report',true):setvideochoice(e,video,'reported',true,'success_report',true)
            }
            catch{

            }
        })()
    }
    return(
        <div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">
            {!video.success_report?
            <form className="tiktok-si5yni-FormReport ex8pc610">
                <div className="tiktok-i17c8h-DivFormHeader ex8pc612">
                    {state.listreport.some(item=>item.show_text)?
                    <div onClick={()=>setshowtext(listtext,false)} class="tiktok-naag6-DivBackButton ex8pc613">
                        <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.58579 22.5858L20.8787 6.29289C21.2692 5.90237 21.9024 5.90237 22.2929 6.29289L23.7071 7.70711C24.0976 8.09763 24.0976 8.7308 23.7071 9.12132L8.82843 24L23.7071 38.8787C24.0976 39.2692 24.0976 39.9024 23.7071 40.2929L22.2929 41.7071C21.9024 42.0976 21.2692 42.0976 20.8787 41.7071L4.58579 25.4142C3.80474 24.6332 3.80474 23.3668 4.58579 22.5858Z"></path></svg>
                    </div>:''}
                    <h4 data-e2e="report-card-title" class="tiktok-f8vded-H4FormTitle ex8pc615">Report</h4>
                    <div onClick={(e)=>type=='video'?setvideochoice(e,video,'show_report',false):setcomment(e,video,'show_report',false)} data-e2e="report-card-cancel" class="tiktok-78z7l6-DivCloseButton ex8pc614">
                        <svg width="14" height="14" viewBox="0 0 9 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.35299 0.792837L4.49961 3.93944L7.64545 0.792566C7.8407 0.597249 8.15733 0.597223 8.35262 0.792508L8.70669 1.14658C8.90195 1.34184 8.90195 1.65842 8.70669 1.85368L5.56027 5.0001L8.70672 8.14655C8.90198 8.34181 8.90198 8.65839 8.70672 8.85366L8.35316 9.20721C8.1579 9.40247 7.84132 9.40247 7.64606 9.20721L4.49961 6.06076L1.35319 9.20719C1.15793 9.40245 0.841345 9.40245 0.646083 9.20719L0.292629 8.85373C0.0973708 8.65847 0.0973653 8.3419 0.292617 8.14664L3.43895 5.0001L0.292432 1.85357C0.0972034 1.65834 0.0971656 1.34182 0.292347 1.14655L0.645801 0.792924C0.841049 0.597582 1.1577 0.597543 1.35299 0.792837Z"></path></svg>
                    </div>
                    
                </div>
                <div className="tiktok-1n0ni8r-DivRadioWrapper ex8pc616">
                    {state.listreport.some(item=>item.show_text)?
                    <>
                    <div class="tiktok-ctsutf-DivTitle ex8pc6111">{listtext.name}</div>
                    <div class="tiktok-j8chqt-DivSubTitle ex8pc6112">We prohibit:</div>
                    <ul style={{margin: '0px', paddingInlineStart: '26px'}}>
                    {listtext.text.map(item=>
                    <li class="tiktok-1lnyyn-LiItem ex8pc6113">
                        <span>{item}</span>
                    </li>
                    )}
                    </ul>
                    
                    <div class="tiktok-1o1t8el-DivFooter ex8pc6114">
                        <button onClick={(e)=>submitreport(e)} class="tiktok-1y4ccoi-ButtonSubmit ex8pc6115">Submit</button>
                    </div>
                    </>
                    :<>
                    <div class="tiktok-15zvsaa-DivSelectText ex8pc617">Please select a scenario</div>
                    {state.listreport.map(item=>
                    <label onClick={()=>setshowtext(item,true)} data-e2e="report-card-reason" class="tiktok-17p5eny-LabelRadio ex8pc619">
                        <div class="tiktok-1xxqteo-DivReasonText ex8pc618">{item.name}</div>
                        <svg  width="20" height="20" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{color: 'rgba(22, 24, 35, 0.5)'}}><path fillRule="evenodd" clipRule="evenodd" d="M43.4142 22.5858L27.1213 6.29289C26.7308 5.90237 26.0976 5.90237 25.7071 6.29289L24.2929 7.70711C23.9024 8.09763 23.9024 8.7308 24.2929 9.12132L39.1716 24L24.2929 38.8787C23.9024 39.2692 23.9024 39.9024 24.2929 40.2929L25.7071 41.7071C26.0976 42.0976 26.7308 42.0976 27.1213 41.7071L43.4142 25.4142C44.1953 24.6332 44.1953 23.3668 43.4142 22.5858Z"></path></svg>
                    </label>
                    )}</>
                    }
                </div>
            </form>:
            <div class="tiktok-1p5movk-DivFormBox ex8pc611"><div>
                <div class="tiktok-1e0mn96-DivIconRoundBg ex8pc6116">
                    <svg width="32" height="22" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{color: 'rgb(11, 224, 155)'}}><path fillRule="evenodd" clipRule="evenodd" d="M13.9637 0.370662C14.1617 0.168152 14.4882 0.170371 14.6834 0.375552L15.6676 1.40986C15.8531 1.60483 15.851 1.91164 15.6629 2.10407L6.33538 11.644C5.86141 12.1288 5.09629 12.1169 4.6365 11.6177L0.326723 6.93829C0.144403 6.74033 0.151478 6.43358 0.342731 6.24424L1.35546 5.24162C1.55673 5.04237 1.88315 5.0499 2.07502 5.25822L5.5238 9.0028L13.9637 0.370662Z"></path></svg>
                </div>
                <div class="tiktok-pu7sdd-DivFinishTitle ex8pc6117">Thanks for reporting</div>
                <div class="tiktok-1ihqoma-DivFinishContent ex8pc6118">We’ll review your report and if there is a violation of our Community Guidelines, we’ll take appropriate action.</div>
                    <button onClick={(e)=>type=='video'?setvideochoice(e,video,'show_report',false,'hidden_video',true):setcomment(e,video,'show_report',false,'hidden_video',true)} class="tiktok-83r0jx-ButtonFinish ex8pc6119">Done</button>
                </div>
            </div>}
        </div>
    )
}
export default Reportvideo