
# Blueprint: Bukit Batok Pickleball Poll

## Overview

A web application to create and manage a weekly poll for booking a Bukit Batok Pickleball court. The poll runs from Sunday to Saturday, and users can indicate if they are coming and if they are bringing a friend.

## Project Outline

### Design and Style

*   **Layout:** A clean, responsive, and visually balanced layout that works on both mobile and web.
*   **Typography:** Expressive and hierarchical typography to improve readability.
*   **Color Palette:** A vibrant and energetic color palette.
*   **Visual Effects:** Multi-layered drop shadows to create a sense of depth and a "lifted" look for interactive elements.
*   **Iconography:** Use of icons to enhance understanding and navigation.
*   **Interactivity:** Interactive elements will have a "glow" effect on hover/focus.

### Features

*   **Weekly Poll:** A poll is generated for the current week, from Sunday to Saturday.
*   **Calendar View:** A calendar-like view to display the poll for each day of the week.
*   **Daily Poll Cards:** Each day has a card with the following:
    *   Date
    *   Editable location (defaults to "2022 Bukit Batok Ave 2")
    *   Editable start and end times (defaults to 17:00 - 20:00)
    *   A list of attendees.
    *   "Coming" and "Bring a Friend" buttons.
*   **User Interaction:**
    *   Users can click "Coming" or "Bring a Friend" to add their name to the poll.
    *   A prompt will ask for the user's name.
*   **Data:** Poll data is stored in memory (no backend yet).

## Current Plan

1.  **HTML (`index.html`):**
    *   Set up the basic HTML structure with a main container, title, and a section for the poll.

2.  **CSS (`style.css`):**
    *   Create a modern and responsive design with a vibrant color scheme, custom fonts, and drop shadows.

3.  **JavaScript (`main.js`):**
    *   Use Web Components to create a `poll-card` element for each day of the week.
    *   Implement the logic to generate the weekly poll.
    *   Handle user interactions (adding attendees, editing location/time).
