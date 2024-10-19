import { FocusCards } from "@/components/ui/focus-cards";

export function FocusCardsDemo() {
  const cards = [
    {
      title: "Forest Adventure",
      src: "",
    },
    {
      title: "Valley of life",
      src: "",
    },
    {
      title: "Sala behta hi jayega",
      src: "",
    },
    {
      title: "Camping is for pros",
      src: "",
    },
    {
      title: "The road not taken",
      src: "",
    },
    {
      title: "The First Rule",
      src: "",
    },
  ];

  return <FocusCards cards={cards} />;
}
