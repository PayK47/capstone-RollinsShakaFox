import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-background">
     <div className="about-container">
        <section className="about-section">
            <h1>Our Story</h1>
            <p>
            Surfing takes planning&mdash;especially when you’re juggling classes, work, and Florida’s ever‑shifting conditions. As Rollins College seniors, we kept finding ourselves bouncing between Surfline, NOAA charts, and group chats just to decide whether Playalinda or New Smyrna was worth the drive before that 2 p.m. lecture. We knew there had to be a smarter way.
            <br /><br />
            So we created ShakaFox&mdash;a site that condenses real‑time surf data, historical trends, and your own preferences into one clear daily ranking of the best spots in Florida. Think of it as a trusted friend who checks every buoy, weather feed, and Google Maps route for you, then tells you exactly where (and when) to paddle out.
            </p>
        </section>

        <section className="about-section">
            <h1>Mission</h1>
            <p>
            Get every Rollins surfer&mdash;from first‑time longboarders to dawn‑patrol veterans&mdash;into the right lineup faster and safer.
            </p>
            <ul>
            <li><strong>Personalized:</strong> Adjust sliders for wave height, crowd tolerance, wind, tides, safety flags, and more.</li>
            <li><strong>Data‑driven:</strong> We aggregate multiple APIs (e.g., NOAA) plus historical patterns to keep rankings accurate and current.</li>
            <li><strong>Student‑focused:</strong> Optimized for quick mobile checks between classes, with travel times from campus baked in.</li>
            </ul>
        </section>

        <section className="about-section">
            <h1>Why We Chose This Project</h1>
            <p>
            <strong>Real Need on Campus:</strong> Rollins surfers lose precious water time sifting through raw forecast feeds.
            <br /><br />
            <strong>Blend of Passions:</strong> We’re coders and surfers, so a tech‑forward surf tool was a natural fit.
            <br /><br />
            <strong>Stretch Goals:</strong> Building a scalable, API‑heavy web app lets us flex everything we’ve learned in CS—from backend data pipelines to frontend UX.
            <br /><br />
            <strong>Community Impact:</strong> A smarter ranking system can reduce overcrowding, point beginners toward safer beaches, and help locals discover under‑rated breaks.
            </p>
        </section>

        <section className="about-section">
            <h1>Meet the Team</h1>
            <table className="team-table">
            <thead>
                <tr>
                <th>Team Member</th>
                <th>Focus Areas</th>
                <th>Fun Fact</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>Payden Knettles</td>
                <td>Frontend &amp; UI, Web hosting</td>
                <td>Born and raised in Florida</td>
                </tr>
                <tr>
                <td>Tommy Hirsch</td>
                <td>Backend APIs, data caching &amp; scaling</td>
                <td>Has look more NOAA API buoys than he can count</td>
                </tr>
                <tr>
                <td>Jac ReVille</td>
                <td>Ranking algorithm, machine‑learning experiments</td>
                <td>Once first degree sunburn  from being at the beach for too long</td>
                </tr>
                <tr>
                <td>Patrick Lester</td>
                <td>DevOps &amp; image manipulation, map posting</td>
                <td>One three-legged race during 5th grade with Shaka, the Fox </td>
                </tr>
            </tbody>
            </table>
        </section>

        <section className="about-section">
            <h1>How ShakaFox Works</h1>
            <ol>
            <li>
                <strong>Pull:</strong> Real‑time surf, weather, and beach‑safety data stream in every hour.
            </li>
            <li>
                <strong>Process:</strong> Our algorithm weighs each factor (wave height, wind, tide, crowd, distance) according to your slider settings.
            </li>
            <li>
                <strong>Rank:</strong> Spots are scored and ordered on an interactive map so you can see at a glance where to head.
            </li>
            <li>
                <strong>Refine:</strong> User feedback loops and historical performance fine‑tune tomorrow’s rankings.
            </li>
            </ol>
        </section>

        <section className="about-section">
            <h1>Looking Ahead</h1>
            <ul>
            <li>iOS/Android PWA for push “best‑break‑now” alerts</li>
            <li>Community reports to crowd‑source real‑time conditions</li>
            <li>Expanded coverage beyond Florida once we nail the local rollout</li>
            </ul>
        </section>
        </div>
    </div>
  );
};

export default About;