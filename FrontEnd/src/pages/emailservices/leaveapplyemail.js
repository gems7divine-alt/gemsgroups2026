import emailjs from "@emailjs/browser";

// EmailJS credentials (same service + public key as the contact email,
// different template: template_5jxadd2 for employee leave applications)
const LEAVE_SERVICE_ID = "service_4z2sdn5";
const LEAVE_TEMPLATE_ID = "template_5jxadd2";
const LEAVE_PUBLIC_KEY = "saNyNUuA0AmZ8aps1";

emailjs.init({ publicKey: LEAVE_PUBLIC_KEY });

/**
 * Collects the leave apply form details and sends them to mail via EmailJS.
 *
 * @param {Object} data   Leave apply form user fields
 * @param {string} data.name     User Name *
 * @param {string} data.email    Email *
 * @param {string} data.message  Message * (reason / details)
 * @returns {Promise<void>}      Resolves when the email is sent
 */
export async function sendLeaveApplyEmail({ name, email, message }) {
  const templateParams = {
    // Primary keys (same naming style that works for the contact form)
    from_name: name,
    from_email: email,
    message,
    // Alias keys so the values render no matter which variable the template uses
    name,
    user_name: name,
    email,
    user_email: email,
    leave_reason: message,
    // Extra values for the email footer
    submitted_at: new Date().toLocaleString(),
  };

  await emailjs.send(LEAVE_SERVICE_ID, LEAVE_TEMPLATE_ID, templateParams, {
    publicKey: LEAVE_PUBLIC_KEY,
  });
}

export default sendLeaveApplyEmail;
