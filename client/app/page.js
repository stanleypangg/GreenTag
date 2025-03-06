"use client"

import React, { useEffect, useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';

function page() {
  // message is initially Loading
  // Once data is retrieved
  // message = data.message
  // const [message, setMessage] = useState("Loading");

  // useEffect(() => {
  //   fetch("http://localhost:8080/")
  //    .then(response => response.json())
  //    .then(data => {
  //       setMessage(data.message);
  //     }
  //   );
  // }, []);

  return (
    <>
      <ChakraProvider>
        <Tooltip showArrow content="gyatt3000">
          <Button>Hover me</Button>
        </Tooltip>
      </ChakraProvider>
    </>
  )
}

export default page
