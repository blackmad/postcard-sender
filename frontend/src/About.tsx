import React from 'react';

import Container from "react-bootstrap/Container";


const About = () => {
    return (
        <Container className="p-3">
            <h1>About this site</h1>

            This is a project by David Blackman (<a href="http://blackmad.com">blackmad.com</a>)
            <p/>
            It is inspired by <a href="http://defund12.org">defund12.org</a> and aims to be a complement to it.
            <p/>
            If you would like to get involved, please email me at <a href="mailto:david@blackmad.com">david@blackmad.com</a>.
            <p/>
            <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        </Container>

    );
};

export default About;
