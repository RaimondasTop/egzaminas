import React from "react";
import AdminBooks from "./AdminBooks";
import AdminCategories from "./AdminCategories";
import AdminUsers from "./AdminUsers";

export default function AdminBody() {
  return (
    <main className="py-8 px-4 w-full">
      <AdminBooks />
      <AdminCategories />
      <AdminUsers />
    </main>
  );
}