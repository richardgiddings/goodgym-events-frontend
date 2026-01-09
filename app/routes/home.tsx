import type { Route } from "./+types/home";
import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
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

    var month_formatted = (month < 10 ? "0" : "") + month;
    var day_formatted = (day < 10 ? "0" : "") + day;

    return day_formatted + "-" + month_formatted + "-" + date.getFullYear() + " " + date.toLocaleTimeString("en-GB", {hour: '2-digit', minute:'2-digit'});
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
  const [open, setOpen] = useState(Array(locations.length).fill(false));

  function handleClick(index: any, value: any) {
    const newValues = locations.map((c: any, i: any) => {
      if (i === index) {
        return value;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setOpen(newValues);
  }

  return (
      <div>
          <h1>GoodGym Events</h1>

          <Card bg="light" text="dark" className="mt-4">
            <APIProvider apiKey={api_key}>
              <div style={{height: "50vh"}}>
                <Map defaultZoom={11} defaultCenter={position} mapId={map_id}>
                  {locations.map((location: any) => (
                    <AdvancedMarker 
                      key={location.name}
                      position={location.position}
                      title={location.name}
                      onClick={() => handleClick(location.number, true)}>
                        <Pin background={location.background} glyphColor="black" scale={2}></Pin>
                        {open[location.number] === true && (
                          <InfoWindow position={location.position} onCloseClick={() => handleClick(location.number, false)}>
                            <p>{location.name}</p>
                          </InfoWindow>
                        )}
                    </AdvancedMarker>
                  ))}
                </Map>
              </div>
            </APIProvider>
            <ListGroup className="mb-4 pt-2" variant="flush">
              <ListGroup.Item className="m-1 group-run">Group Runs</ListGroup.Item>
              <ListGroup.Item className="m-1 community-mission">Community Mission</ListGroup.Item>
              <ListGroup.Item className="m-1 party">Party/Eats</ListGroup.Item>
              <ListGroup.Item className="m-1 race">Race</ListGroup.Item>
              <ListGroup.Item className="m-1 training-session">Training Session</ListGroup.Item>
            </ListGroup>
          </Card>

          {events.map((ev: any) => (
            <Card key={ev.id} bg="light" text="dark" className="mt-4">
              <Card.Header className={ev.data.programme.name.replace(' ', '-').toLowerCase()}>
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
          <p className="mt-4">Created using <a href="https://www.openactive.io/">OpenActive</a> data from <a href="https://github.com/good-gym/opendata">Goodgym</a> under the <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution Licence</a>.</p>
      </div>
  );
}
