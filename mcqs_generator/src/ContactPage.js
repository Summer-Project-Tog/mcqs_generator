import React from "react";
import facebookLogo from "./assets/images/facebook_logo.png";
import twitterLogo from "./assets/images/twitter_logo.png";
import instagramLogo from "./assets/images/instagram_logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Col, Row, Image } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "./ContactPage.css";

const contactDetails = [
    {
        id: 1,
        title: 'Michael',
        image: ('https://media.licdn.com/dms/image/D5603AQHlhTEQ8s6sig/profile-displayphoto-shrink_200_200/0/1688372593305?e=2147483647&v=beta&t=MEu6DyeEOysIxqYaEQyF4QbkTdtBUeJ2oWZ_bbd8ys4'),
        description: '',
        linkedin: 'https://www.linkedin.com/in/michael-santoso-b2a758226',
        github: 'https://github.com/Michael-Santoso'
    },
    {
        id: 2,
        title: 'Jun Yu',
        image: ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'),
        description: '',
        linkedin: 'https://www.linkedin.com/in/ng-jun-yu-208725262',
        github: 'https://github.com/Eskimofishes'
    },
    {
        id: 3,
        title: 'Mustafa',
        image: ('https://media.licdn.com/dms/image/C5603AQGbV8MIFKmqOA/profile-displayphoto-shrink_200_200/0/1598539403302?e=2147483647&v=beta&t=uRKJ2G3MQOMTC7svVEE4UDr-FG4C7WTOcnXWij-KKas'),
        description: '',
        linkedin: 'https://www.linkedin.com/in/mustafa-jabir-poonawala',
        github: 'https://github.com/MustafaJP'
    },
    {
        id: 4,
        title: 'Emily',
        image: ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'),
        description: '',
        linkedin: 'https://www.linkedin.com/in/emilylimxq/',
        github: 'https://github.com/emily7lim'
    },
]

function AboutPage() {

    return (
        <div className="contact-page">
            <header className="App-header">
                <div className="nav-bar">
                    <div className="logo">MCQ Gen</div>
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                    </nav>
                </div>
                <div id="contacts">
                    <Container fluid>
                        <div className="title-holder">
                            <h2>Contact us</h2>
                        </div>
                        <Row xs={1} md={2} className="g-4">
                            {
                                contactDetails.map((contacts) => {
                                    return (
                                        <Col key={contacts.id}>
                                            <div className="holder">
                                                <Card border="info" className="cardstyle">
                                                    <Image variant="top" src={contacts.image} roundedCircle fluid className="image"/>
                                                    <Card.Body>
                                                        <Card.Title>{contacts.title}</Card.Title>
                                                        <Card.Text>
                                                            {contacts.description}
                                                        </Card.Text>
                                                        <Row sm={2}>
                                                            <a href={contacts.linkedin} target="_blank" rel="noreferrer">Linkedin</a>

                                                            <a href={contacts.github} target="_blank" rel="noreferrer">Github</a>
                                                        </Row>

                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </Col>
                                    )
                                })
                            }

                        </Row>
                    </Container>
                    <br></br>
                </div>
            </header>
            <footer className="App-footer">
                <p>MCQ Gen</p>
                <div className="social-icons">
                    <a href="#facebook">
                        <img
                            src={facebookLogo}
                            alt="Facebook"
                            className="social-media-logo"
                        />
                    </a>
                    <a href="#twitter">
                        <img
                            src={twitterLogo}
                            alt="Twitter"
                            className="social-media-logo"
                        />
                    </a>
                    <a href="#instagram">
                        <img
                            src={instagramLogo}
                            alt="Instagram"
                            className="social-media-logo"
                        />
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default AboutPage;
