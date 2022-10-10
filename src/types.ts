// tämä on ical datan tyypitys
export interface ICalReservation {
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

export interface IRoomReservation {
  reservationStart: number; // js time in ms
  reservationEnd: number; // js time in ms
  // sisältää mahdollisesti tiedon opettajan nimestä ja ryhmän tunnuksesta, ehkä myös opetettavan aiheen
  // data on kuitenkin arvaamatonta koska sitä tietoa voi muuttaa moni eri henkilö, omien mieltymyksiensä mukaan.
  summary: string;
}

// tätä dataa lähetetään fronttiin
export interface IResponseData {
  roomId: string;
  roomName: string;
  reservations: IRoomReservation[];
}
