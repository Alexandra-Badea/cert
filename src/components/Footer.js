import React from 'react';
import '../styles/Footer.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

function Footer() {
  return (
    <footer>
      <p>Voluntar cu <span>CERT</span>itudine!</p>
      <div>
        <a href="https://www.facebook.com/centruleducationalderesursesitraining"><FacebookIcon /></a>
        <a href='https://www.instagram.com/c.e.r.t_dolj/'><InstagramIcon /></a>
        <a href='https://www.youtube.com/@c.e.r.tvideo7602'><YouTubeIcon /></a>
      </div>
    </footer>
  )
}

export default Footer;