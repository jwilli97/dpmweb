import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, guests, paymentOption, paymentHandle } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || paymentOption === undefined || !paymentHandle) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Electric Lounge <tickets@digitalparadisemedia.com>', // Proper email format with verified domain
      to: [email],
      subject: 'Your Electric Lounge Tickets - Payment Confirmed! 🎵',
      react: React.createElement(EmailTemplate, {
        firstName,
        lastName,
        email,
        guests,
        paymentOption,
        paymentHandle,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}