import React from "react";
import { CFooter } from '@coreui/react'
import GitHubIcon from '@mui/icons-material/GitHub';
function Footer() {
  const year = new Date().getFullYear();
  return (
     <footer>
         <p>Made with ♥ by Haseeb Khan</p>
     <a href="https://github.com/haseebkhan9081/Pacman" style={{ color: 'inherit', textDecoration: 'none' }}>
     <GitHubIcon style={{ fontSize: 24, verticalAlign: 'middle', color: 'currentColor' }}/></a> 
     </footer>
     
     
      
  );
}

export default Footer;
