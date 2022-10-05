import ical, { async } from 'node-ical';
import { ICalReservation } from './types';

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

const getByDate = async (dayParam: string, roomId: string): Promise<ICalReservation[]> => {
    // function body
    // 1. Selvitetään tilan kaikki varaukset: tarvitaan tilan id
    const allReservations = await getReservationsAsync(roomId)
    // 2. Suodatetaan tiedot tietyn päivän perusteella: tarvitaan tietty päivämäärä
    let filtered: ICalReservation[] = []
    if (allReservations !== null){
        filtered = allReservations.filter(x => x.start === dayParam)
    }
    // 3. Tietojen palautus listana halutuista tiedoista:
    return filtered
}
export default getByDate