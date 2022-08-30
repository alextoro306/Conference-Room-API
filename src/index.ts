import express from 'express';
import ical from 'node-ical';
import cors from 'cors';
import { type } from 'os';

/***
 * example link https://varia-plus.solenovo.fi:443/integration/dav/ROOM-1597752870-fi
 * room info: ROOM-1597752870-fi
 * link base: https://varia-plus.solenovo.fi:443/integration/dav/
 */


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

 ical.async.fromURL('https://varia-plus.solenovo.fi:443/integration/dav/ROOM-1597752881-fi', {}, (err, data) => { 
  const d = JSON.stringify(data)
  const dd = JSON.parse(d) as {};
  const myData: ICalReservation[] = [];

  for (let [key, entry] of Object.entries(dd)) {
    const e = entry as ICalReservation;
    myData.push(e);
  }

  console.log(myData)
  myData.map(x => console.log(x.uid))
});

const app = express();
app.use(cors({ origin: '*' }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.get('/moi', (req, res ) => {
  res.send('Hei Kaikki!');
})

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

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

export default app;
