import { redirect } from "next/navigation";

export default function MyListsRedirect() {
  redirect("/collections");
}
