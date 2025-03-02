import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import "../styles/Form.css"
import LoadingIndicator from './LoadingIndicator'


// route: the go-to route for submitting
// method: the action for submitting (login or register)
function Form({ route, method }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === 'login' ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true)
        // Prevent default submission behavior (reload page)
        e.preventDefault()

        try {
            const res = await api.post(route, {username, password})
            if (method === "login") {
                // Save access token and refresh token to localStorage
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)

                navigate('/')
            }
            else {
                // Redirect to login page after registering
                // (registration does not create a token)
                navigate('/login')
            }
        }
        catch (error) {
            alert(error)
        }
        finally {
            setLoading(false)
        }
    }

    return <form className="form-container" onSubmit={handleSubmit}>
        <h1>{name}</h1>
        <input
            className="form-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        {loading && <LoadingIndicator/>}
        <button className="form-button" type="submit">
            {name}
        </button>
    </form>
}


export default Form;