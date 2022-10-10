import express from 'express';
import ical from 'node-ical';
import cors from 'cors';
import type { ICalReservation, IResponseData, IRoomReservation } from './types';
import dataFromDB from './dataFromDB';
import moment from 'moment'

/* CONFIGURATION */
const app = express();
app.use(cors({ origin: '*' }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* FUNCTIONS */
const getReservationsAsync = async (
  room: string,
  date: number | null
): Promise<IRoomReservation[] | null> => {
  const iCalReservations: ICalReservation[] = [];
  const reservations: IRoomReservation[] = [];
  try {
    const cal = await ical.async.fromURL(
      `https://varia-plus.solenovo.fi:443/integration/dav/${room}`
    );
    const jsonReservations = JSON.parse(JSON.stringify(cal));

    /* convert object into ICalReservation and insert it into reservations array */
    // eslint-disable-next-line no-restricted-syntax, no-unused-vars
    for (const [key, entry] of Object.entries(jsonReservations)) {
      const e = entry as ICalReservation;
      iCalReservations.push(e);
    }
  } catch (err) {
    console.log('Error:', err);
    return null;
  }

  iCalReservations.filter(r => r.summary != null).forEach(r=>
    reservations.push({
      reservationStart: dateStringToMs(r.start),
      reservationEnd:DateTimePlusDurationToMs(r.end, r.duration),
      summary: r.summary,
    })
  )
  
  if(!date)
    return reservations;
  
  return reservations.filter(r => new Date(r.reservationStart).toDateString() === new Date(date).toDateString())
};

const DateTimePlusDurationToMs = (date: string | number, duration: string): number => new Date(date).getTime() + moment.duration(duration).asMilliseconds();

const dateStringToMs = (date: string): number => new Date(date).getTime();

/* GET */
app.post('/reservations', async (req, res) => {
  const room: string = req.body.room_id;
  const date: number = req.body.date;

  if (!room) {
    return res.status(400).json({ error: 'Room info' });
  }


  const roomName =
    dataFromDB.find((x) => x.roomId === room)?.roomName ??
    'Huoneen nimi puuttu';

  const reservations = await getReservationsAsync(room, date);

  if (!reservations)
    return res.status(404).json({
      err: 'no data found',
    });

  const responseData: IResponseData = {
    roomId: room,
    roomName,
    reservations
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
