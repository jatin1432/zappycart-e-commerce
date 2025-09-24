// src/components/ContactForm.jsx
import React from "react";

const ContactForm = () => {
  return (
    <section id="contact" className="bg-white py-12 px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">
          Contact <span className="text-red-500">Us</span>
        </h1>
      </div>
      <form
        action="https://api.web3forms.com/submit"
        method="POST"
        className="max-w-xl mx-auto bg-gray-50 p-6 rounded shadow space-y-4"
      >
        <input type="hidden" name="access_key" value="35de4c0d-499a-457c-adf2-b34f487013d5" />

        <input
          type="text"
          name="name"
          placeholder="Enter Your Name"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="message"
          placeholder="Enter Your Message"
          required
          className="w-full p-2 border rounded h-32"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
