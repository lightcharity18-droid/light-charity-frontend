'use client';

import React from "react";

export default function FundraisingPage() {
  return (
    <section className="p-6">
      
      <div className="bg-white shadow-md rounded-lg p-4">
        <div >
          <iframe
            title="Donation form powered by Zeffy"
            src="https://www.zeffy.com/en-CA/donation-form/light-charity"
            style={{position: "absolute", border: 0, top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%"}}
            allow="payment"
           
          />
        </div>
      </div>
    </section>
  );
}