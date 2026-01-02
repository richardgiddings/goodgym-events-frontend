import type { Route } from "./+types/home";
import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GoodGym Events" },
    { name: "description", content: "Events in a GoodGym area" },
  ];
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const api_url = import.meta.env.VITE_APP_URL;

  const res = await fetch(api_url+"/events/")
  const event_data = await res.json();

  const events = event_data.events;
  const locations = event_data.locations;

  return {events, locations};
}

function getFormattedDate(input_date: string) {
    const date = new Date(input_date);

    var month = date.getMonth() + 1;
    var day = date.getDate();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;

    return day + "-" + month + "-" + date.getFullYear() + " " + date.toLocaleTimeString("en-GB", {hour: '2-digit', minute:'2-digit'});
}

export default function Home({
  loaderData
}: Route.ComponentProps) {

  const {events, locations} = loaderData;

  // For constructing the url as data doesn't contain correct link
  const base_url = "https://www.goodgym.org/v3/sessions/";
  const start = "happenings/"
  const end = "?";

  // Maps
  const position = {lat: 51.451107, lng: -2.593515}
  const api_key = import.meta.env.VITE_MAPS_API_KEY;
  const map_id = import.meta.env.VITE_MAP_ID

  return (
      <div>
          <h1>GoodGym Events</h1>

          <Card bg="light" text="dark" className="m-4">
            <APIProvider apiKey={api_key}>
              <div style={{height: "50vh"}}>
                <Map defaultZoom={11} center={position} mapId={map_id}>
                  {locations.map((location: any) => (
                    <AdvancedMarker 
                      key={location.name}
                      position={location.position}
                      title={location.name}
                      scale={2}>
                        <Pin background={location.background}></Pin>
                    </AdvancedMarker>
                  ))}
                </Map>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item>Red marker is the start location of group runs.</ListGroup.Item>
                <ListGroup.Item>Orange marker is location of a community mission.</ListGroup.Item>
                <ListGroup.Item>Rollover marker for more details.</ListGroup.Item>
              </ListGroup>
            </APIProvider>
          </Card>

          {events.map((ev: any) => (
            <Card key={ev.id} bg="light" text="dark" className="m-4">
              <Card.Header className="mb-2">
                {ev.data.programme.name}
              </Card.Header>
              <Card.Body>
                <Card.Title className="mb-4">{ev.data.name}</Card.Title>
                <Card.Text>{ev.data.description}</Card.Text>
                <Card.Link href={base_url + ev.data.url.split(start)[1].split(end)[0]} target="_blank">Event Link</Card.Link>
              </Card.Body>
              <Card.Footer>{getFormattedDate(ev.data.startDate)}</Card.Footer>
            </Card>
          ))}
      </div>
  );
}
