import express from 'express';
import ical from 'node-ical';
import cors from 'cors';
import type { ICalReservation, IResponseData } from './types';
import dataFromDB from './dataFromDB';

/* CONFIGURATION */
const app = express();
app.use(cors({ origin: '*' }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* FUNCTIONS */
const getReservationsAsync = async (
  room: string
): Promise<ICalReservation[] | null> => {
  const reservations: ICalReservation[] = [];
  try {
    const cal = await ical.async.fromURL(
      `https://varia-plus.solenovo.fi:443/integration/dav/${room}`
    );
    const stringReservations = JSON.stringify(cal);
    const jsonReservations = JSON.parse(stringReservations);
    console.log(jsonReservations);

    /* convert object into ICalReservation and insert it into reservations array */
    // eslint-disable-next-line no-restricted-syntax, no-unused-vars
    for (const [key, entry] of Object.entries(jsonReservations)) {
      const e = entry as ICalReservation;
      reservations.push(e);
    }
  } catch (err) {
    console.log('Error:', err);
    return null;
  }
  return reservations;
};

/* Alex fix this */
// const getReservations = () => {
//   let reservations: ICalReservation[] = [];
//   try {
//     // const stringReservations = fs.readFileSync('Reservations.json', 'utf-8');
//     // const stringReservations = await JSON.stringify(cal);
//     const jsonReservations = JSON.parse(JSON.stringify(reservationsFile));
//     console.log(jsonReservations);
//     /*convert object into ICalReservation and insert it into reservations array*/
//     for (let [key, entry] of Object.entries(jsonReservations)) {
//       const e = entry as ICalReservation;
//       reservations.push(e);
//     }
//   } catch (error) {
//     console.log('Error: ' + error)
//   }
// };

/* GET */
app.post('/reservations', async (req, res) => {
  const room: string = req.body.room_id;

  if (!room) {
    return res.status(400).json({ error: 'Room info' });
  }

  const roomName =
    dataFromDB.find((x) => x.roomId === room)?.roomName ??
    'Huoneen nimi puuttu';

  const reservations = await getReservationsAsync(room);

  if (!reservations)
    return res.status(404).json({
      err: 'no data found',
    });

  const responseData: IResponseData = {
    roomId: room,
    roomName,
    reservations: [],
  };
  return res.status(200).json(responseData);
});

app.post('/room', (req, res) => {
  // const roomnumber = req.body.roomnumber

  // if (!roomnumber) {
  //   res.status(400).send("Invalid data")
  // }
  res.send('🚧');
});

/* CONFIGURATION */
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

export default app;
