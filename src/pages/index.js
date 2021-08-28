import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { addUser }from '../redux/userReducer'

import {
    BrowserRouter as Router,
    Route,
} from "react-router-dom";

import List from './list';

const Webpages = () => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const userBody = { "username": "sarah", "password": "connor" }
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchMyAPI() {
            const user = await axios.post("http://localhost:8081/auth", userBody)
            if(user) {
                setIsLoaded(true);
                dispatch(addUser(user.data))
            } else {
                setIsLoaded(true);
                setError(user);
            } 
        }

      fetchMyAPI()
   
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading User...</div>;
    } else {
        return (
            <Router>
                <Route exact path="/" component={List} />
            </Router>
        );
    }
};
export default Webpages;