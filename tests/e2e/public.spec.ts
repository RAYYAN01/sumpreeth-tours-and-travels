import { test, expect } from "@playwright/test";

test("home page shows hero and the 5 nav items", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const label of ["Home", "Fleet", "Destination", "About", "Contact"]) {
    await expect(page.getByRole("link", { name: label, exact: true }).first()).toBeVisible();
  }
});

test("fleet page lists vehicles and can filter", async ({ page }) => {
  await page.goto("/fleet");
  await expect(page.getByRole("heading", { name: /fleet/i }).first()).toBeVisible();
  await page.getByRole("tab", { name: "Tempo Traveller" }).click();
  await expect(page.getByText(/Tempo Traveller/).first()).toBeVisible();
});

test("destination page filters by category", async ({ page }) => {
  await page.goto("/destination");
  await page.getByRole("tab", { name: "Hill Stations" }).click();
  await expect(page.getByRole("link", { name: /Plan This Trip/i }).first()).toBeVisible();
});

test("contact form validates required fields", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /Book Now on WhatsApp/i }).click();
  await expect(page.getByText("Please enter your name")).toBeVisible();
});

test("admin area redirects to login when signed out", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: "Staff login" })).toBeVisible();
});
