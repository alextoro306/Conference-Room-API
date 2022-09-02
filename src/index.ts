import express from 'express';
import ical from 'node-ical';
import cors from 'cors';
import { type } from 'os';
import { read } from 'fs';
import { request } from 'http';

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
  duration: {hours: number, minutes: number};
  summary: string;
  uid: string;
  end: string;
}
/*FUNCTIONS*/
const getReservationsAsync = async () =>{
  let reservations: ICalReservation[] = [];
  try {
    const cal = await ical.async.fromURL('https://varia-plus.solenovo.fi:443/integration/dav/ROOM-1597752881-fi');
    const stringReservations = await JSON.stringify(cal); 
    const jsonReservations = await JSON.parse(stringReservations);
    console.log(jsonReservations);
    /*convert object into ICalReservation and insert it into reservations array*/
    for await (let [key, entry] of Object.entries(jsonReservations)) {
      const e = entry as ICalReservation;
      reservations.push(e);
    }
  }
  catch (err){
    console.log('Error: ' + err);
    return null;
  }
  return await reservations;
};


/*CONFIGURATION*/
const app = express();
app.use(cors({ origin: '*' }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*GET*/
app.get('/reservations', async (req, res) => {
  const token = req.headers['varia_reservations_token'];
  const localToken = 'ani9_5ce_8p5_yfe3_nas1_!#d';
  const reservations = await getReservationsAsync();
  
  if (!token) {
    res.status(400).send("Invalid data")
  }
  if (token === localToken) {
    res.status(200).send(reservations)
  } else {
    res.status(401).send("Incorrect Token")
  }
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


/*CONFIGURATION*/

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

export default app;

