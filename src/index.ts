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

/*ON START*/
 ical.async.fromURL('https://varia-plus.solenovo.fi:443/integration/dav/ROOM-1597752881-fi', {}, (err, data) => { 
  const d = JSON.stringify(data)
  const dd = JSON.parse(d) as {};
  console.log(dd);
  const myData: ICalReservation[] = [];

  for (let [key, entry] of Object.entries(dd)) {
    const e = entry as ICalReservation;
    myData.push(e);
  }
});
/*FUNCTIONS*/
const getReservations = () : ICalReservation | null =>{
  ical.async.fromURL('https://varia-plus.solenovo.fi:443/integration/dav/ROOM-1597752881-fi', {}, (err, data) =>{
    const stringData = JSON.stringify(data);
    const jsonData = JSON.parse(stringData) as {};
    const reservations : ICalReservation[] = [];

    for (let [key, entry] of Object.entries(jsonData)){
      const reservtion = entry as ICalReservation;
      reservations.push(reservtion);
    }
    return reservations;
  });
  return null;
}



/*CONFIGURATION*/
const app = express();
app.use(cors({ origin: '*' }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*GET*/
app.get('/Reservations', (req, res) => {
  const header = req.headers['password'];
  console.log(header);
  const  reservations = JSON.stringify(getReservations());
  console.log(header);


  res.send(reservations);
});
app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.get('/moi', (req, res ) => {
  res.send('Hei Kaikki!');
})
/*POST*/
app.post('/kakka', (req, res) => {
  const password = "kakka";
  const data:string = req.body.password;
  if (!data) {
    res.status(400).send("Invalid data")
  }
  if (data === password) {
    res.status(200).send("tervetuloa")
  }else{
    res.status(401).send("mee vessaan")
  }
})

app.post('/room', (req, res) => {
  const roomnumber = req.body.roomnumber

  if (!roomnumber) {
    res.status(400).send("Invalid data")
  }


})
/*CONFIGURATION*/
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

export default app;
