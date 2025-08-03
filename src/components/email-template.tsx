import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  guests: number;
  paymentOption: string;
  paymentHandle: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  email,
  guests,
  paymentOption,
  paymentHandle,
}) => {
  const totalAttendees = guests + 1;
  
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#2563eb', 
          textAlign: 'center',
          marginBottom: '10px',
          fontSize: '28px'
        }}>
          Electric Lounge ⚡️🛋️ 
        </h1>
        
        <h2 style={{ 
          color: '#666',
          textAlign: 'center',
          marginTop: '0',
          fontSize: '18px',
          fontWeight: 'normal'
        }}>
          August 16, 2025 • North ATX
        </h2>

        <div style={{ 
          textAlign: 'center', 
          margin: '25px 0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <img 
            src="https://gxdygxanaalafstmoieh.supabase.co/storage/v1/object/public/email-images/invite.jpeg"
            alt="Electric Lounge Event Invite" 
            style={{ 
              width: '100%', 
              maxWidth: '500px',
              height: 'auto',
              display: 'block',
              margin: '0 auto'
            }} 
          />
        </div>
        
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '2px solid #0ea5e9',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#0c4a6e', margin: '0 0 10px 0' }}>
            ✅ Payment Confirmed - Your Tickets Are Ready!
          </h3>
          <p style={{ margin: '0', color: '#0c4a6e', fontWeight: 'bold' }}>
            {totalAttendees} ticket{totalAttendees > 1 ? 's' : ''} confirmed for {firstName} {lastName}
          </p>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            Event Schedule
          </h3>
          <div style={{ lineHeight: '1.6', color: '#555' }}>
            <p><strong>7:00 PM</strong> - Doors Open</p>
            <p><strong>8:00 PM</strong> - K'in</p>
            <p><strong>9:00 PM</strong> - Don't Get Lemon</p>
            <p><strong>10:00 PM</strong> - WhoKilledXiX</p>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            Your Ticket Includes
          </h3>
          <ul style={{ lineHeight: '1.6', color: '#555', paddingLeft: '20px' }}>
            <li>Food and drink voucher</li>
            <li>Full evening of performances</li>
          </ul>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            Ticket Details
          </h3>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
            <p style={{ margin: '5px 0' }}><strong>Name:</strong> {firstName} {lastName}</p>
            <p style={{ margin: '5px 0' }}><strong>Email:</strong> {email}</p>
            <p style={{ margin: '5px 0' }}><strong>Total Attendees:</strong> {totalAttendees}</p>
            {guests > 0 && (
              <p style={{ margin: '5px 0' }}><strong>Additional Guests:</strong> {guests}</p>
            )}
            <p style={{ margin: '5px 0' }}><strong>Payment Method:</strong> {paymentOption}</p>
            <p style={{ margin: '5px 0' }}><strong>Payment Handle:</strong> {paymentHandle}</p>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          margin: '25px 0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <img 
            src="https://gxdygxanaalafstmoieh.supabase.co/storage/v1/object/public/email-images/parking.jpeg"
            alt="Parking Information" 
            style={{ 
              width: '100%', 
              maxWidth: '500px',
              height: 'auto',
              display: 'block',
              margin: '0 auto'
            }} 
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
            Questions? Reply to this email or contact us at <br/>
            <a href="mailto:digitalparadisemedia@gmail.com" style={{ color: '#2563eb' }}>
              digitalparadisemedia@gmail.com
            </a>
          </p>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px'
        }}>
          <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
            See you at Electric Lounge! 🎵
          </p>
        </div>
      </div>
    </div>
  );
};