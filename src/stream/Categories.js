import axios from 'axios'
import React, { useEffect} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import { headers } from '../actions/auth'
import { listcategoriesURL } from '../urls'

const Categories = () => {
    const [categories,setCategories]
    useEffect(() => {
        (async ()=>{
            try{
                const res=axios.get(listcategoriesURL,headers())
                setCategories(res.data)
            }
            catch{

            }
        })
    },[])

    const renderCategories = () => {
        return categories.map(category => {
            return (
                <Link to={`/categories/${category.name}`} key={category.id} className="item">

                    <div className="content" style={{fontSize:'20px', cursor: "pointer"}}>
                        {/* <br/>
                        <i className="big middle aligned icon lock" /> */}
                        <div className="content" >
                            <p style={{fontSize: '22px'}}>{category.name}</p>
                        </div>    
                    </div>
                    <br />
                </Link>
            )
        })
    }

    return (
        <div>
            <h2>Categories</h2>
            <div className="ui celled list">
                {renderCategories()}
            </div>
        </div>
        
    )
}

export default Categories