import React, { useState } from 'react';
import Header from '../components/Header';
import '../styles/Home.css';
import Footer from '../components/Footer';

function Home() {
  const images = [
    '/images/group1.jpg', '/images/group2.jpg', '/images/group3.jpg', '/images/group4.jpg', '/images/group5.jpg'
  ];

  const [slideShow, setSlideShow] = useState(0);

  const displayImage = (i) => {
    setSlideShow(i);
  }

  const nextSlide = () => {
    setSlideShow((slideShow + 1) % images.length);
  }

  const previousSlide = () => {
    setSlideShow((slideShow - 1 + images.length) % images.length);
  }

  return (
    <>
      <Header />
      <main>
        <div className='slideshow-container'>
          <div>
            <img src={images[slideShow]} alt='group' />
          </div>

          <span onClick={previousSlide} className='arrow left'>❮</span>
          <span onClick={nextSlide} className='arrow right'>❯</span>

          <div className='container-dots'>
            {images.map((dot, i) => (
              <span key={i} onClick={() => displayImage(i)} className={`dot ${i === slideShow ? 'active-dot' : ''}`}></span>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Home;