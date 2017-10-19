import React from 'react';

const About = () => (
  <article className="container-med">
    <h1>About Phlashy</h1>
    <p>Phlashy is a free, open source web application for creating, organizing, and studying virtual flash cards. How neat is that?</p>

    <p>In Phlashy, all flash cards are organized into decks. Each card belongs to exactly one deck, while decks may contain many cards (not unlike the way files are organized into folders on your desktop). Tags will be added as an additional organizational system in a future version of Phlashy.</p>

    <p>Once you have created some cards and decks, Phlashy allows you to conveniently study them. Studying involves working through a sequence of cards, one at a time. As you indicate which cards you "know" and which you don't, Phlashy tracks your progress.</p>

    <p>Phlashy was created as an educational project by <a href="http://turiscilipoti.com">Turi Scilipoti</a>. It was built using the following technologies:</p>

    <ul>
      <li>React</li>
      <li>Redux</li>
      <li>Node</li>
      <li>Express</li>
      <li>PostgreSQL</li>
      <li>Webpack</li>
      <li>...Many other smaller libraries!</li>
    </ul>

  </article>
);

export default About;
