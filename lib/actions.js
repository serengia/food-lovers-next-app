"use server";

import { redirect } from "next/navigation";

import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text.trim() === "";
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: "Invalid input.",
    };
  }

  if (
    meal.image.size > 2097152
    // I set it up for roughly 2MB, 1MB in Bytes is 1,048,576 so
    //  you can multiply it by the limit you need.
  ) {
    return {
      message: "Image too large. Max of 2mb is allowed",
    };
  }

  await saveMeal(meal);
  revalidatePath("/meals");
  redirect("/meals");
}
