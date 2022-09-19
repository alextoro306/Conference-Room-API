interface IRoomInfo {
  roomId: string;
  roomName: string;
}

const dataFromDB: IRoomInfo[] = [
  {
    roomId: 'ROOM-1597752870-fi',
    roomName: 'huoneen nimi',
  },
  {
    roomId: 'asd-123',
    roomName: 'asd kek',
  },
];

export default dataFromDB;
