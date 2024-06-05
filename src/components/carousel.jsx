import React from "react";
import { Carousel } from 'react-bootstrap';
import '../css/carousel.css';

const DirectionCarousel = ({ steps }) => {

    return (
        <Carousel className="carousel-slide" interval={null}>
            {steps.map((s, index) => (
                <Carousel.Item key={index}>
                    <div className="p-4">
                        <h5>Step {index + 1}</h5>
                        <p dangerouslySetInnerHTML={{__html: s.instructions}}></p>
                        <p>Distance: {s.distance.text}</p>
                        <p>Duration: {s.duration.text}</p>
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    )
};

export default  DirectionCarousel;