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

  return (
      <div>
          {event_data.events.map((ev: any) => (
            <Card key={ev.id} bg="light" text="dark" className="m-4">
              <Card.Body>
                <Card.Title>{ev.data.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{ev.data.programme.name}</Card.Subtitle>
                <Card.Text>{ev.data.description}</Card.Text>
                <Card.Link href={ev.data.url}>Event Link</Card.Link>
              </Card.Body>
              <Card.Footer>{getFormattedDate(ev.data.startDate)}</Card.Footer>
            </Card>
          ))}
      </div>
  );
}
