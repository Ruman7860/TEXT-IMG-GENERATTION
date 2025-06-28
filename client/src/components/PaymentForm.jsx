import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useApp } from '../context/AppContent';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    console.error('Stripe public key is missing. Please add it to your .env file.');
}
// Replace with your own Stripe public key (find this in your Stripe dashboard)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = () => {
    const {amount,backendUrl,loadCreditsData} = useApp();
    const [amt, setAmt] = useState(amount * 100);

    const [errorMessage, setErrorMessage] = useState('');
    const [processing, setProcessing] = useState(false);
    const [credits,setCredits] = useState(0);
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if(amount === 10){
            setCredits(100);
        }
        else if(amount === 50){
            setCredits(500);
        }
        else if(amount === 250){
            setCredits(5000);
        }
        else{
            return;
        }
    },[amount]);
  
    const handleSubmit = async (event) => {

        event.preventDefault();
        setProcessing(true);
        setErrorMessage('');
        const cardElement = elements.getElement(CardElement);

        if (!cardElement || !cardElement._complete) {
            setErrorMessage("Please fill your card details.");
            toast.error("Please fill  your card details.");
            setProcessing(false);
            return;
        }

        if (!amt || amt <= 0) {
            toast.error("Invalid payment amount.");
            setProcessing(false);
            return;
        }

      try {
        const { token, tokenError } = await stripe.createToken(cardElement);
        console.log(token);
        if (tokenError) {
            setErrorMessage(tokenError.message);
            toast.error(tokenError.message);
            setProcessing(false);
            return;
        }

        const {data} = await axios.post(
            `${backendUrl}/auth/create-payment-intent`,
            {amount : amt,credits,token: token?.id},
            {withCredentials : true}
        );
    
        if(data.success === false){
          console.log("PAYMENT ERROR : ",data.message);
          toast.error(data.message);
          return;
        }

        await loadCreditsData();
        
        const clientSecret = data.clientSecret;
    
        // Confirm the payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });
    
        if (error) {
          setErrorMessage(error.message);
        } else if (paymentIntent.status === 'succeeded') {
          console.log(data.message);
          toast.success(data.message);
          navigate('/');
        }
        setProcessing(false);
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
        setProcessing(false);
      }
    };
  
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="p-8 bg-gradient-to-br from-teal-200 to-orange-200 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Payment</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Amount Input (Optional) */}
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-600">Amount ($)</label>
              <input
                type="number"
                id="amount"
                value={amt / 100}
                disabled
                className="mt-2 w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
  
            {/* Card Element */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600">Card Details</label>
              <div className="mt-2">
                <CardElement
                  options={{
                    style: {
                      base: {
                        color: '#32325d',
                        fontSize: '16px',
                        fontSmoothing: 'antialiased',
                        '::placeholder': {
                          color: 'black',
                        },
                      },
                      invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a',
                      },
                    },
                  }}
                />
              </div>
            </div>
  
            {/* Error Message */}
            {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}
  
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!stripe || processing}
              className={`w-full py-2 px-4 text-white font-semibold rounded-md ${processing ? 'bg-gray-400' : 'bg-black hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'}`}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  const StripeContainer = () => (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
  
  export default StripeContainer;