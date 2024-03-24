import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/About.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

function About() {
  return (
    <>
      <Header />
      <main>
        <div className='container-about'>
          <h1><span>C</span>entrul <span>E</span>ducational de <span>R</span>esurse si <span>T</span>raining</h1>
          <h2>Profile</h2>

          <h4><em>Type of Organisation:</em></h4>

          <p>Is the partner organisation a non-profit? <strong>yes</strong></p>

          <h3>Accreditation Type: EARSMUS+ ACREDITATION</h3>

          <h3>Background and Experience</h3>

          <p><span>CERT</span> is structured in 4 main departments:</p>
          <ol>
            <li>
              <dl>
                <dt>Projects & Networking</dt>
                <dd>In charge of local, national and international cooperation and partnership building, strategic planning and projects, quality management, writing financial reports, projects, grant requests.</dd>
              </dl>
            </li>

            <li>
              <dl>
                <dt>Visibility and Publicity</dt>
                <dd>Responsible of  developing of CERT's marketing strategy , designing of educational materials, logos, info-packs, presentations, sharing results and Publicity/ Transparency.</dd>
              </dl>
            </li>

            <li>
              <dl>
                <dt>Resources and Training</dt>
                <dd>Dealing with Quality leaning activities- creating, planning, innovating , running, monitoring , evaluating and recognition of the learning outcomes , logistics, data bases of learning e-tools, staff's professional development and integration of results of the activities in the organization , research and innovation of learning procedures.</dd>
              </dl>
            </li>

            <li>
              <dl>
                <dt>Financial department</dt>
                <dd>Dealing with fundraising, sponsorships, partnerships, financial reports, supporters, bank and national agency relationships, etc.</dd>
              </dl>
            </li>
          </ol>

          <p><em>Our association aims to :</em></p>
          <ul>
            <li>empowering young people from the rural area as active citizens in social, educational, economical and cultural context of the community,</li>
            <li>supporting young people with fewer opportunities , especially NEETs providing inclusive personalized programs and tools </li>
            <li>implement national and European partnerships in the fields of inclusion, rural development, health/sport and wellbeing, environment protection and awareness , participation of young people, (un)employment.</li>
            <li>provide social assistance and inclusive programs in the rural area, including with the support of international volunteering programs;</li>
            <li>generate innovative and creative learning tools , including digital ones, to raise the quality of the learning outcomes and integration of the new competences in the social, economical and personal lives of our beneficiaries.</li>
          </ul>

          <p><em>Our main activities are:</em></p>
          <ul>
            <li>sportive and environmental protection programs;</li>
            <li>local and European volunteering in social - educational programs in rural area;</li>
            <li>employment programs such as social enterprises, trainings, mentorship, coaching and internships, especially tailored for the needs of rural community;</li>
            <li>design educational materials and programs, including digital tools as complementary to physical activities for empowering rural communities. </li>
            <li>organize national and international training courses, seminars, conferences, public debates, social/cultural/sportive events and awareness campaigns;</li>
          </ul>

          <p><em>Our team</em></p>
          <div className='team'>
            <div className='card'>
              <div className='image-card'>
                <img src='/images/adina.jpg' alt='Adina Enache' />
              </div>
              <h2>Adina Enache</h2>
              <h3 className='role'>Trainer</h3>
              <div className='social-media'>
                <a href='https://www.facebook.com/enache.adina.9'><FacebookIcon /></a>
                <a href='https://www.instagram.com/adina_enache2003/'><InstagramIcon /></a>
              </div>
            </div>

            <div className='card'>
              <div className='image-card'>
                <img src='/images/ale.jpg' alt='Alexandra Badea' />
              </div>
              <h2>Alexandra Badea</h2>
              <h3 className='role'>Youth Worker</h3>
              <div className='social-media'>
                <a href='https://www.facebook.com/BadeaAlinaAlexandra/'><FacebookIcon /></a>
                <a href='https://www.instagram.com/a.r.t_elier/'><InstagramIcon /></a>
              </div>
            </div>

            <div className='card'>
              <div className='image-card'>
                <img src='/images/david.jpg' alt='Adina Enache' />
              </div>
              <h2>David Enache</h2>
              <h3 className='role'>Digital Expert</h3>
              <div className='social-media'>
                <a href='https://www.facebook.com/DavidM4A1'><FacebookIcon /></a>
                <a href='https://www.instagram.com/david_enache13/'><InstagramIcon /></a>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default About;