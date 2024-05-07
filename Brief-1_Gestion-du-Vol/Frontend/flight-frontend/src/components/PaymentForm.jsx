import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from './BookingContext';

function PaymentForm() {
  const location = useLocation();
  const { bookingDetails } = useBooking();
  const {totalAmount} = bookingDetails;
  const navigate = useNavigate();

  const handlePaymentMethodChange = (event) => {
    const selectedPaymentMethod = event.target.value;
    // Show/hide payment option based on selected payment method
    document.querySelectorAll('.payment-option').forEach((option) => {
      if (option.id === selectedPaymentMethod + 'Payment') {
        option.style.display = 'block';
      } else {
        option.style.display = 'none';
      }
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make reservation API call
      const reservationResponse = await fetch('http://localhost:3000/api/reservation', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date_reservation: new Date().toISOString().split('T')[0], // Current date
          nombre_places: bookingDetails.passengers,
          statut: "confirmed",
          vol_id: bookingDetails.selectedFlight,
          user_id: parseInt(localStorage.getItem("userId"))
        })
      });
  
      if (!reservationResponse.ok) {
        const errorData = await reservationResponse.json();
        console.error('Error from server:', errorData);
        throw new Error('Server responded with an error: ' + errorData.message);
      }
  
      const reservationData = await reservationResponse.json();
      console.log('Success:', reservationData);
  
      // Make payment API call
      const paymentResponse = await fetch('http://localhost:3000/api/paiement', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reservation_id: reservationData.reservation_id, // Assuming the API returns an ID
          montant: bookingDetails.totalAmount,
          date_paiement: new Date().toISOString().split('T')[0],
          statut_paiement: "paid"
        })
      });
  
      if (!paymentResponse.ok) {
        throw new Error('Payment processing failed.');
      }
  
      navigate('/thank-you'); // Redirect to thank you page
  
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };
  
  


  return (
    <div className="container mt-5">
      <h1>Payment</h1>
      <p>Please choose your payment method and complete the payment to confirm your booking:</p>

      {/* Payment method selection */}
      <div className="form-group">
        <label htmlFor="paymentMethod">Payment Method</label>
        <select className="form-control" id="paymentMethod" onChange={handlePaymentMethodChange}>
          <option value="creditCard">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bankTransfer">Bank Transfer</option>
        </select>
      </div>

      {/* Total amount */}
      <div>
        <p>Total Amount: ${totalAmount}</p>
      </div>

      {/* Credit card payment form */}
      <div id="creditCardPayment" className="payment-option">
        <h4>Credit Card Payment</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input type="text" className="form-control" id="cardNumber" placeholder="Enter card number" />
          </div>
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input type="text" className="form-control" id="expiryDate" placeholder="MM/YY" />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input type="text" className="form-control" id="cvv" placeholder="CVV" />
          </div>
          <button type="submit" className="btn btn-primary">Submit Payment</button>
        </form>
      </div>

      {/* PayPal payment form */}
      <div id="paypalPayment" className="payment-option" style={{ display: 'none' }}>
        <h4>PayPal Payment</h4>
        <p>Please complete the payment through PayPal.</p>
        <a href="#" className="btn btn-primary">Proceed to PayPal</a>
      </div>

      {/* Bank transfer payment instructions */}
      <div id="bankTransferPayment" className="payment-option" style={{ display: 'none' }}>
        <h4>Bank Transfer Payment</h4>
        <p>Please transfer the total amount to the following bank account:</p>
        <p>Bank Name: XYZ Bank</p>
        <p>Account Number: 1234567890</p>
        <p>Account Holder: Your Name</p>
        <p>Amount: ${totalAmount}</p> {/* Display total amount here */}
        <button type="submit" className="btn btn-primary">Payment Completed</button>
      </div>
    </div>
  );
}

export default PaymentForm;
