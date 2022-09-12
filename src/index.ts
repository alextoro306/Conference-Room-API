import express from 'express';
import ical from 'node-ical';
import cors from 'cors';
import stringReservations from './Reservations.json'

/***
 * example link https://varia-plus.solenovo.fi:443/integration/dav/ROOM-1597752870-fi
 * room info: ROOM-1597752870-fi
 * link base: https://varia-plus.solenovo.fi:443/integration/dav/
 */


/*INTERFACES | TYPES*/
interface ICalReservation {
  type: string;
  params: [];
  dtstamp: string;
  start: string;
  datetype: string;
  duration: string;
  summary: string;
  uid: string;
  end: string;
}
interface Reservation {
  type: string;
  params: [];
  dtstamp: string;
  start: string;
  datetype: string;
  duration: { hours: number, minutes: number };
  summary: string;
  uid: string;
  end: string;
}
/*FUNCTIONS*/
const getReservationsAsync = async (room:string) : Promise<ICalReservation[] | null> => {
  let reservations: ICalReservation[] = [];
  try {
    const cal = await ical.async.fromURL('https://varia-plus.solenovo.fi:443/integration/dav/' + room);
    const stringReservations = await JSON.stringify(cal);
    const jsonReservations = await JSON.parse(stringReservations);
    console.log(jsonReservations);
    /*convert object into ICalReservation and insert it into reservations array*/
    for await (let [key, entry] of Object.entries(jsonReservations)) {
      const e = entry as ICalReservation;
      reservations.push(e);
    }
  }
  catch (err) {
    console.log('Error: ' + err);
    return null;
  }
  return await reservations;
};
/*Alex fix this*/
const getReservations = () => {
  let reservations: ICalReservation[] = [];
  try {
    // const stringReservations = fs.readFileSync('Reservations.json', 'utf-8');
    // const stringReservations = await JSON.stringify(cal);
    const jsonReservations = JSON.parse(JSON.stringify(stringReservations));
    console.log(jsonReservations);
    /*convert object into ICalReservation and insert it into reservations array*/
    for (let [key, entry] of Object.entries(jsonReservations)) {
      const e = entry as ICalReservation;
      reservations.push(e);
    }
  } catch (error) {
    console.log('Error: ' + error)
  }
};


/*CONFIGURATION*/
const app = express();
app.use(cors({ origin: '*' }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


/*GET*/
app.post('/reservations', async (req, res) => {
  const room: string = req.body.room_id;

  if (!room) {
    res.status(400).json({error: 'Room info'})
  }

  const reservations = await getReservationsAsync(room);
  res.status(200).send(reservations);
});

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.get('/moi', (req, res) => {
  res.send('Hei Kaikki!');
})


/*POST*/
app.post('/kakka', (req, res) => {
  const password = "kakka";
  const data: string = req.body.password;
  if (!data) {
    res.status(400).send("Invalid data")
  }
  if (data === password) {
    res.status(200).send("tervetuloa")
  } else {
    res.status(401).send("mee vessaan")
  }
})

app.post('/room', (req, res) => {
  const roomnumber = req.body.roomnumber

  if (!roomnumber) {
    res.status(400).send("Invalid data")
  }


})


/*ON START*/
console.log(getReservations());


/*CONFIGURATION*/
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

export default app;

