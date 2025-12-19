import type { Route } from "./+types/home";

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

  return {event_data};
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

  const {event_data} = loaderData;

  // For constructing the url as data doesn't contain correct link
  const base_url = "https://www.goodgym.org/v3/sessions/";
  const start = "happenings/"
  const end = "?";

  return (
      <div>
          <h1>GoodGym Events</h1>
          {event_data.events.map((ev: any) => (
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
