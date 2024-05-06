import React, { useEffect, useState } from 'react';
import { useBooking } from '../components/BookingContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

function ThankYouPage() {
  const { bookingDetails } = useBooking();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:3000/api/users/${userId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => response.json())
        .then(data => setUserInfo(data))
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Define colors
    const primaryColor = '#7AB730';  // Green color
    const darkColor = '#000000';  // Dark color for text

    // make the background of doc a gray color
    doc.setDrawColor(300); // Grey background
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
    doc.setFillColor(300); // Grey background
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

    // Add a rectangle with a primary color background
  
    // Add the custom styled logo text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(darkColor);
    doc.text('Maroc', 15, 18); // Position carefully chosen to fit within the rectangle
    doc.setTextColor(primaryColor);
    doc.text('Voyage', 35, 18); // Adjust positions as needed
    

    // Reset styles for the rest of the document
    doc.setTextColor(primaryColor);
    doc.setFontSize(16);
    doc.text('Flight Information', 10, 35);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    // Now add your other document elements...
    doc.text(`Flight Number: ${bookingDetails?.selectedFlight}`, 10, 45);
    doc.text(`From: ${bookingDetails?.from}`, 10, 55);
    doc.text(`To: ${bookingDetails?.destination}`, 10, 65);
    doc.text(`Departure Time: ${bookingDetails?.departDate}`, 10, 75);
    doc.text(`Arrival Time: ${bookingDetails?.returnDate}`, 10, 85);
    doc.text(`Price: $${bookingDetails?.totalAmount}`, 10, 95);

    doc.setDrawColor(100); // Grey line
    doc.line(10, 100, 200, 100); // Draw a line

    doc.setTextColor(primaryColor);
    doc.setFontSize(16);
    doc.text('User Information', 10, 110);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${userInfo?.nom} ${userInfo?.prenom}`, 10, 120);
    doc.text(`Telephone: ${userInfo?.telephone}`, 10, 130);
    doc.text(`Email: ${userInfo?.email}`, 10, 140);
    // Continue with user details...

    doc.save('BookingDetails.pdf');
};


  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1>Thank You for Your Booking!</h1>
        <p className="lead">Please check your email for further instructions and booking details.</p>
        <div className="card mt-4 mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h5 className="card-title">Flight Information</h5>
          <p className="card-text"><strong>Flight Number:</strong> {bookingDetails?.selectedFlight}</p>
          <p className="card-text"><strong>From:</strong> {bookingDetails?.from}</p>
          <p className="card-text"><strong>To:</strong> {bookingDetails?.destination}</p>
          <p className="card-text"><strong>Departure Time:</strong> {bookingDetails?.departDate}</p>
          <p className="card-text"><strong>Arrival Time:</strong> {bookingDetails?.returnDate}</p>
          <p className="card-text"><strong>Price:</strong> ${bookingDetails?.totalAmount}</p>
        </div>
        </div>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Return to home page</button>
        <button className="btn btn-success ml-2 mt-4" onClick={generatePDF}>Generate PDF</button>
      </div>
    </div>
  );
}

export default ThankYouPage;
