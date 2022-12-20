import React, { useEffect, useState } from 'react'
import {connect} from 'react-redux'
import {Link,useNavigate} from 'react-router-dom'
import { headers } from '../actions/auth'

import StreamManageForm from './StreamManageForm'


const StreamEdit = ({user, stream, getStream}) => {
    const [message, setMessage] = useState('')
    const navigate=useNavigate()
    useEffect(() => {
        if (user) {
            getStream(user.username)
        }
    }, [user, getStream])

    const onSubmit = (event) => {
        event.preventDefault()
        const formValues = {
            token: cookies.token,
            category: event.target.category.value,
            title: event.target.title.value
        }
        if (!formValues.title) return
        streams.put('mystream/', formValues,headers())
        .then(res => {
            if (res.status === 200 || res.status === 204) {
                setMessage('Redirect')
            }
        })
        .catch(err => {
            console.log(err.response)
            if (err.response) {
                setMessage(err.response.data)
            } else if (err.request) {
                setMessage('We couldn\'t complete your request. Check your network connection and try again.')
            }
        })
    }

    const renderContent = () => {
        if (!cookies.token) {
            navigate('/')
        } 
        if (user) {
            return <StreamManageForm user={user} onSubmit={onSubmit} message={message} initVal={stream} />
        }
    } 

    return (
        <div>
            {renderContent()}
        </div>
    )
}

const mapStateToProps = state => {
    return {user: state.auth.user}
}

export default connect(mapStateToProps)(StreamEdit)