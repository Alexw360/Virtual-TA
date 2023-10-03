import Header from './Components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';


function DashboardPage() {

  return (
    <div>
      <Header page={"dashboard"}/>
    </div>
  );
}

export default DashboardPage;
