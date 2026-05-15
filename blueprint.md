
# Blueprint: Bukit Batok Pickleball Poll

## Overview

A web application to create and manage a weekly poll for booking a Bukit Batok Pickleball court. The poll runs from Sunday to Saturday, and users can indicate if they are coming and if they are bringing a friend. It supports user roles for administration and custom location tracking.

## Project Outline

### Design and Style

*   **Layout:** A clean, responsive, and visually balanced layout that works on both mobile and web.
*   **Typography:** Expressive and hierarchical typography to improve readability.
*   **Color Palette:** A vibrant and energetic color palette with a dark theme background and neon accents.
*   **Visual Effects:** Multi-layered drop shadows and glow effects on interactive elements to create depth.
*   **Modals:** Custom designed modals for Login and Adding Attendees, replacing standard browser prompts.
*   **Iconography:** Use of icons to enhance understanding and navigation.

### Features

*   **User Roles:** 
    *   **Admin:** Can change the overall date range, global location, and edit individual card locations/times.
    *   **User:** Can view polls and join them (login required).
*   **Weekly Poll:** A poll is generated for a specified date range (defaults to the current week).
*   **Location Management:** Supports multiple locations and allows the admin to set a custom location for the entire poll or individual days.
*   **Daily Poll Cards:** Each day has a card displaying:
    *   Date and Day of the week.
    *   Editable location (admin only).
    *   Editable start and end times (admin only).
    *   A list of attendees including their names and DUPR ratings.
    *   "Coming" and "+1 Friend" buttons (requires login).
*   **User Interaction:**
    *   Users must log in to join a poll.
    *   A custom modal allows users to enter their name and DUPR rating.
*   **Disqus Integration:** A comment thread is provided below the poll for community discussion.
*   **Data Persistence:** Current implementation uses in-memory state; future versions may integrate Firebase.

## Development History

1.  **Initial Implementation:** Weekly poll generation with basic card components and `prompt` for attendee names.
2.  **Date Range Picker:** Added ability to dynamically generate polls based on a selected start and end date.
3.  **Disqus Integration:** Integrated Disqus for comments.
4.  **Advanced UI & Roles (Current):**
    *   Refactored `poll-card` to use standard data-binding patterns.
    *   Implemented Login system with Admin/User distinctions.
    *   Added custom modals for a more polished UX.
    *   Added DUPR rating field for attendees.
    *   Added location/address management.
