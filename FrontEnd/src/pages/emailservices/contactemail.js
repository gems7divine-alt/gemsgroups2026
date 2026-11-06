import emailjs from "@emailjs/browser";

// EmailJS credentials
const EMAILJS_SERVICE_ID = "service_4z2sdn5";
const EMAILJS_TEMPLATE_ID = "template_7jtcaf9";
const EMAILJS_PUBLIC_KEY = "saNyNUuA0AmZ8aps1";

// Initialize EmailJS once so emailjs.send works across the app.
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/**
 * Collects the contact form details and sends them to mail via EmailJS.
 *
 * @param {Object} data   Contact form user fields
 * @param {string} data.name       Your Name *
 * @param {string} data.email      Your Email *
 * @param {string} data.phone      Phone Number *
 * @param {string} data.company    Company Name
 * @param {string} data.service    Select Service
 * @param {string} data.message    Your Message *
 * @returns {Promise<void>}        Resolves when the email is sent
 */
export async function sendContactEmail({ name, email, phone, company, service, message }) {
  const templateParams = {
    from_name: name,
    from_email: email,
    // Phone is sent under every common template variable name so it renders
    // no matter which one the EmailJS template uses.
    phone,
    phone_number: phone,
    user_phone: phone,
    to_phone: phone,
    company_name: company || "Not provided",
    service: service || "General Enquiry",
    message,
    // Extra values for the email footer
    submitted_at: new Date().toLocaleString(),
  };

  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
    publicKey: EMAILJS_PUBLIC_KEY,
  });
}

export default sendContactEmail;
