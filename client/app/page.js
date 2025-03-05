"use client"

import React, { useEffect, useState } from 'react'

function page() {
  // message is initially Loading
  // Once data is retrieved
  // message = data.message
  const [message, setMessage] = useState("Loading");

  useEffect(() => {
    fetch("http://localhost:8080/scan-tag")
     .then(response => response.json())
     .then(data => {
        setMessage(data.message);
      }
    );
  }, []);

  return (
    <div>{message}</div>
  )
}

export default page
