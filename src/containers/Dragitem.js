import Navbar from "./Navbar"
import React,{useState,useEffect,useRef,useCallback} from 'react'

import { v4 as uuidv4 } from 'uuid';
const listitem=['b','à','n','g', 'n','o','n']
const Dragitem=()=>{
    const [drag,setDrag]=useState({add:false,change:false})
    const [keyword,setkeyword]=useState(()=>listitem.map(item=>{return {id:null,value:null}}))
    const [items,setItems]=useState(()=>listitem.map(item=>{
        return {id:uuidv4(),value:item}
    }))
    const setdrag=(e,indexchoice)=>{
        const itemcurrent=e.dataTransfer.getData('item')
        if(itemcurrent){
            if(drag.add){
                setkeyword(current=>current.map((item,index)=>{
                    if(index==indexchoice){
                        return {id:itemcurrent,value:items.find(item=>item.id===itemcurrent).value} 
                    }
                    return item
                }))
                setItems(current=>current.filter(item=>item.id!==itemcurrent))
            }
            else{
                setkeyword(current=>current.map((item,index)=>{
                    if(index==indexchoice){
                        return {id:itemcurrent,value:keyword.find(item=>item.id===itemcurrent).value} 
                    }
                    else if(item.id==itemcurrent){
                        return {id:current[indexchoice].id,value:current[indexchoice].value} 
                    }
                    return item
                }))
            }
        }
        
    }
    const setdragturn=(e)=>{
        const itemcurrent=e.dataTransfer.getData('item')
        console.log(itemcurrent)
        if(itemcurrent && drag.change){
        setItems(current=>[...current,{id:itemcurrent,value:keyword.find(item=>item.id===itemcurrent).value} ])
        setkeyword(current=>current.map((item,index)=>{
            if(item.id==itemcurrent){
                return {id:null,value:null} 
            }
            return item
        }))
    }
    }
   return (
       <div>
           <Navbar/>
           <div className="tiktok-19fglm-DivBodyContainer eg65pf90">
                <div className="tiktok-r0hg2a-DivSideNavContainer eg65pf91">
                   <div className="item-center">
                       {keyword.map((item,index)=>
                            <div className="item-centers" key={index} style={{borderRadius:'6px',height:'32px',width:'32px',backgroundColor:`${item.id?'#ee4d2d':'#27bd9c'}`,margin:'8px',color:"#fff"}} 
                                onDrop={(e)=>{
                                setdrag(e,index)
                                
                                }} onDragOver={e=>e.preventDefault()}>
                                {item.id &&(<div className="item-centers" style={{borderRadius:'6px',height:'24px',width:'24px',textAlign:'center',cursor:'pointer'}} onDragStart={(e)=>{
                                    e.dataTransfer.setData('item',item.id)
                                    setDrag({...drag,change:true,add:false})
                                    }} draggable>{item.value}</div>)}
                            </div>
                        )}
                   </div>
                   <div style={{height:'64px',padding:'6px',border:'1px solid'}} onDragOver={e=>e.preventDefault()} onDrop={(e)=>setdragturn(e)} className="item-center">
                       {items.map((item,index)=>
                       <div draggable key={index} onDragEnd={e=>{
                        e.currentTarget.classList.remove('active')
                       }} className="item-centers" style={{height:'24px',width:'24px',backgroundColor:"#333",margin:'8px',color:"#fff",cursor:'pointer',borderRadius:'6px'}} onDragStart={(e)=>{
                           e.dataTransfer.setData('item',item.id)
                           e.currentTarget.classList.add('active')
                           setDrag({...drag,change:false,add:true})
                        }}>{item.value}</div>
                       )}
                   </div>
                   <div>
                       <button disabled={keyword.find(item=>!item.id)?true:false}>Submit</button>
                   </div>
               </div>
           </div>
       </div>
   )
}
export default Dragitem