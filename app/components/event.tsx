import Card from 'react-bootstrap/Card';
import MarkdownView from 'react-showdown';

function getFormattedDate(input_date: string) {

	const date = new Date(input_date);

	const timeFormat: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: false, day: 'numeric' };
	let formatted_date: string = date.toLocaleDateString("en-GB", timeFormat);

	return formatted_date;
}

export default function Event(props: any) {

    const ev = props.ev;

    // For constructing the url as data doesn't contain correct link
	const base_url: string = "https://www.goodgym.org/v3/sessions/";
	const end: string = "?";

    return (
        <div>
            <Card key={ev.id} bg="light" text="dark" className="mt-4">
                <Card.Header className={ev.data.programme.name.replace(' ', '-').toLowerCase() + "-card barlow-condensed-semibold"}>
                    {ev.data.programme.name}
                </Card.Header>
                <Card.Body>
                    <Card.Title className="mb-2">{ev.data.name}</Card.Title>
                    <Card.Subtitle className="mb-4 text-muted">{ev.data.disambiguatingDescription}</Card.Subtitle>
                    <MarkdownView markdown={ev.data["beta:formattedDescription"]} />
                    <Card.Link href={base_url + ev.data.url.substring(ev.data.url.lastIndexOf('/') + 1).split(end)[0]} className="links" target="_blank">Event Link</Card.Link>
                </Card.Body>
                <Card.Footer>{getFormattedDate(ev.data.startDate)}</Card.Footer>
            </Card>
        </div>
    );
}