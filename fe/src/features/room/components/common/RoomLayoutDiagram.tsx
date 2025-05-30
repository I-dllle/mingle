// features/room/components/common/RoomLayoutDiagram.tsx
import React from "react";

interface RoomLayoutDiagramProps {
  imageUrl: string;
  alt?: string;
}

export function RoomLayoutDiagram({
  imageUrl,
  alt = "방 배치도",
}: RoomLayoutDiagramProps) {
  return (
    <img
      src="https://i.namu.wiki/i/kPP-AgF1PDjxsQxZq2VqDfw51SYDFh_FZPay3ThGtMJm4u7X2sd_mpQLY3dJ47zPga33giJTL2esWEKMvI8GqZYivMBMcYCtUmpTyG-QpidSnac5pg-0dt0MdJD4kWBBE5x5XZVbXRc6SUF41KJMZQ.webp"
      alt={alt}
      className="w-full h-52 object-cover"
    />
  );
}
