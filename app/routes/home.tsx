import type { Route } from "./+types/home";
import { useState } from "react";
import {
	APIProvider,
	Map,
	AdvancedMarker,
	Pin,
	InfoWindow,
} from "@vis.gl/react-google-maps";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
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

	// Filtering 
	const [filter, setFilter] = useState("");
	const filteredLocations = 
		filter === ""
			? locations
			: locations.filter((location: any) => location.event_type.replace(' ', '-').toLowerCase() === filter)
	const filteredEvents =
		filter === ""
			? events
			: events.filter((event: any) => event.data.programme.name.replace(' ', '-').toLowerCase() === filter)

	return (
		<div>
			<h1>GoodGym Events</h1>

			<Card bg="light" text="dark" className="mt-4 mb-4">
				<Card.Body className="p-2">
					<APIProvider apiKey={api_key}>
						<div style={{height: "50vh"}}>
							<Map defaultZoom={11} defaultCenter={position} mapId={map_id} disableDefaultUI={true}>
								{filteredLocations.map((location: any) => (
								<AdvancedMarker 
									key={location.name}
									position={location.position}
									title={location.name}
									onClick={() => handleClick(location.number, true)}>
									<Pin background={location.background} glyphColor="black" scale={1.3}></Pin>
									{open[location.number] === true && (
										<InfoWindow position={location.position} onCloseClick={() => handleClick(location.number, false)}>
										<p className="line-break">{location.name}</p>
										</InfoWindow>
									)}
								</AdvancedMarker>
								))}
							</Map>
						</div>
					</APIProvider>	
					<Container className="pt-2 fw-bold" fluid>
						<Row>
							<Col lg className="p-2 mt-1 group-run" onClick={() => setFilter('group-run')}>Group Runs</Col>
							<Col lg className="p-2 mt-1 community-mission" onClick={() => setFilter('community-mission')}>Community Mission</Col>
							<Col lg className="p-2 mt-1 party" onClick={() => setFilter('party')}>Party/Eats</Col>
							<Col lg className="p-2 mt-1 race" onClick={() => setFilter('race')}>Race</Col>
							<Col lg className="p-2 mt-1 training-session" onClick={() => setFilter('training-session')}>Training Session</Col>							
						</Row>
					</Container>
				</Card.Body>
				<Card.Footer>
					What you can do:
					<ul>
						<li>Zoom in and out and move the map.</li>
						<li>Rollover or select a pin to see the event name(s).</li>
						<li>Select an event type above to show only that type of event.</li> 
						<li>Click <Button className="p-0 links" variant="link" onClick={() => setFilter('')}>here</Button> to show all events again.</li>
					</ul>
					For more details on events see the list below.
				</Card.Footer>
			</Card>

			<hr/>

			{filteredEvents.map((ev: any) => (
			<Card key={ev.id} bg="light" text="dark" className="mt-4">
				<Card.Header className={ev.data.programme.name.replace(' ', '-').toLowerCase()+" fw-bold"}>
					{ev.data.programme.name}
				</Card.Header>
				<Card.Body>
					<Card.Title className="mb-4">{ev.data.name}</Card.Title>
					<Card.Text>{ev.data.description}</Card.Text>
					<Card.Link href={base_url + ev.data.url.split(start)[1].split(end)[0]} className="links" target="_blank">Event Link</Card.Link>
				</Card.Body>
				<Card.Footer>{getFormattedDate(ev.data.startDate)}</Card.Footer>
			</Card>
			))}
			<p className="mt-4">
				Created using <a href="https://www.openactive.io/" className="links">OpenActive</a> data from <a href="https://github.com/good-gym/opendata" className="links">GoodGym</a> under the <a href="https://creativecommons.org/licenses/by/4.0/" className="links">Creative Commons Attribution Licence</a>. The front-end code for this site can be found <a href="https://github.com/richardgiddings/goodgym-events-frontend" className="links">here</a> and the API can be found <a href="https://github.com/richardgiddings/goodgym-events-api" className="links">here</a>.
			</p>
		</div>
	);
}
