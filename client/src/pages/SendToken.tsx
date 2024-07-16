import { useRef } from "react";
import emailjs from "@emailjs/browser";

const SendToken = () => {
    const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    console.log(import.meta.env.VITE_EMAILJS_SERVICE_ID);
    emailjs
      .sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, form.current, {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="to_name" />
      <label>Email</label>
      <input type="email" name="to_email" />
      <label>Link</label>
      <input name="register_link" />
      <input type="submit" value="Send" />
    </form>
  );
};

export default SendToken;