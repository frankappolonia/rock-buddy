import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import noImg from '../../img/notFound.jpg'
import Nav from 'react-bootstrap/Nav';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

const EventCard = (props) =>{
    /**
     * Card for events
     */
    let data = props.eventsData;
    if (!data) return;
    
    let card = null

     function buildEventCard(item,count){
         //dates
         let startDate = item.dates.start && item.dates.start.localDate || "Unknown Date";
         let startTime = item.dates.start && item.dates.start.localTime || "Unknown Time"
         let city = item._embedded.venues && item._embedded.venues[0].city.name || null
         let country = item._embedded.venues && item._embedded.venues[0].country.name || null
        let location = "Unknown"
        if(city && country){
            location = city + ", " + country
        }
 
         return (
             <div key={count}>
            <Card  style={{ width: '60%',
            align: 'center',
            marginLeft: 'auto',
            marginRight: 'auto'}}>
                <Row>
                <Col>
                    <Card.Header>{item.name}</Card.Header>
                </Col>
                </Row>

                <Row>
                <Col>
                    <Card.Img style={{width: "200px"}} variant="left" src={item.images[0] && item.images[0].url || noImg} alt="event image"/>        
                </Col>
                <Col>
                <ListGroup variant="flush">
                    <ListGroup.Item>Event Start: {startDate + " at " + startTime}</ListGroup.Item>
                    <ListGroup.Item>Location: {location}</ListGroup.Item>
                    <Button href={item.url}>See On Ticketmaster</Button>
                 </ListGroup>
                </Col>
                </Row>
                 
                 </Card>
                 </div>
         )


     }



    card = data.map((item,count) =>{
        return buildEventCard(item,count)
    });
     

    return(
        card
    )
};

export default EventCard;