import { useState } from "react";
import Modal from "./Modal";

export default function RightBuildingPlan({ svgPath, roomPrefix }) {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleClick = (roomNumber) => {
    const room = `${roomPrefix}-${roomNumber}`;
    console.log(`Вы нажали на кабинет: ${room}`);
    setSelectedRoom(room);
  };

  const rooms = [
    { x: 80, y: 120, number: 406 },
    { x: 120, y: 120, number: 407 },
    { x: 290, y: 120, number: 408 },
    { x: 340, y: 120, number: 409 },
    { x: 530, y: 120, number: 410 },
    { x: 575, y: 120, number: 411 },
    { x: 810, y: 120, number: 412 },
    { x: 80, y: 195, number: 306 },
    { x: 120, y: 195, number: 307 },
    { x: 260, y: 195, number: 308 },
    { x: 305, y: 195, number: 309 },
    { x: 445, y: 195, number: 310 },
    { x: 490, y: 195, number: 311 },
    { x: 760, y: 195, number: 312 },
    { x: 130, y: 270, number: 206 },
    { x: 360, y: 270, number: 208 },
    { x: 605, y: 270, number: 209 },
    { x: 770, y: 270, number: 210 },
    { x: 880, y: 270, number: 211 },
    { x: 495, y: 345, number: 107 },
    { x: 795, y: 345, number: 108 }
  ];

  return (
    <>
      <svg viewBox="0 0 1000 500" width="100%" height="100%">
        <image href={svgPath} width="100%" height="100%" />
        {rooms.map(({ x, y, number }) => (
          <rect
            key={number}
            x={x}
            y={y}
            width="20"
            height="40"
            fill="transparent"
            onClick={() => handleClick(number)}
          />
        ))}
      </svg>
      {selectedRoom && <Modal room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
    </>
  );
}



