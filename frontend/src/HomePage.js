import Header from './Components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';


function HomePage() {

  return (
    <div>
      <Header page={"home"}/>
    </div>
  );
}

export default HomePage;
