export const sendBookingConfirmation = (email, booking) => {
  console.log(`Email sent to ${email}: Booking confirmed (Ref: ${booking.booking_reference})`);
  // In production: Integrate SendGrid or SMTP here
};