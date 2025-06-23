import React, { useState } from "react";
import BookList from "./BookList";
import UserReservations from "./UserReservations";

export default function UserBody({ user }) {
  const [refresh, setRefresh] = useState(0);
  return (
    <main className="py-8 px-4 w-full">
      <UserReservations refresh={refresh} setRefresh={setRefresh} />
      <BookList user={user} refresh={refresh} setRefresh={setRefresh} />
    </main>
  );
}