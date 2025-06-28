import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import isTokenValid from "../utils/isValidToken";

export const AppContext = createContext();

const AppContextProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [showLogin,setShowLogin] = useState(false);
    const [amount,setAmount] = useState(() => {
        return localStorage.getItem('paymentAmount') ? parseFloat(localStorage.getItem("paymentAmount")) : null
    });
    const [isPayment,setIsPayment] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const stripePublicationKey = import.meta.env.STRIPE_PUBLICATION_KEY;
    const [token,setToken] = useState(localStorage.getItem('token'));
    const [credit,setCredit] = useState(false);
    const navigate = useNavigate();

    const loadCreditsData = async () => {
        if(!isTokenValid()){
            return;
        }
        try {
            const {data} = await axios.post(
                `${backendUrl}/auth/user-credits`,
                {},
                {withCredentials : true}
            );

            if(!data.success){
                console.log(data.message);
                toast.error(data.message);
                return;
            }

            setCredit(data.credits);
            setUser(data.user);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        localStorage.setItem("paymentAmount",amount);
    },[amount]);

    useEffect(() => {
        if(token){
            loadCreditsData();
        }
    },[token]);

    const logout = async () => {
        try {
            const {data} = await axios.post(
                `${backendUrl}/auth/logout`,
                {},
                {withCredentials : true}
            );

            if(data.success === false){
                console.log(data.message);
                toast.error("Logout unsuccessfull");
                return;
            }

            localStorage.removeItem('token');
            setToken('');
            setUser(null);
            toast.success("Logout Successfully");
        } catch (error) {
            console.log("LOGOUT Error:",error.message);
            toast.error("LOGOUT Error:",error.message);
            return;
        }
    } 

    const generateImage = async (prompt) => {
        try {
            const {data} = await axios.post(
                `${backendUrl}/image/generate-image`,
                {prompt},
                {withCredentials : true}
            );

            if(data.success === false){
                console.log("Handling failure case:", data.message);
                toast.error(data.message);
                loadCreditsData();
                if(data.remainingCredits === 0){
                    navigate('/buy');
                }
                return;
            }

            loadCreditsData();
            return data.resultImage;
        } catch (error) {
            console.log("GENERATE IMAGE ERROR : ",error.message);
            toast.error("GENERATE IMAGE ERROR : ",error.message);
        }
    }

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        amount,
        setAmount,
        isPayment,
        setIsPayment,
        loadCreditsData,
        logout,
        generateImage,
        stripePublicationKey
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export const useApp = () => useContext(AppContext);

export default AppContextProvider;