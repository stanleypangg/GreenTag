# GreenTag: AI-Powered Sustainability Platform - Repository

## Overview

This repository houses the codebase for GreenTag, an innovative platform that empowers businesses to optimize their environmental, social, and governance (ESG) performance. GreenTag leverages AI, data analytics, and a modern web stack to transform raw product tag data into actionable sustainability insights.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [AI Pipeline](#ai-pipeline)
- [Data Model](#data-model)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

*   **AI-Powered Tag Analysis:** Extracts material composition, recyclability, and certification information from product tag images using the Gemini AI model.
*   **Sustainability Scoring:** Generates a standardized Sustainability Score for each item, enabling consistent measurement and comparison.
*   **Intelligent Routing:** Recommends optimal routing decisions for returned items (donate, resell, recycle) based on AI analysis and business rules.
*   **ESG Performance Dashboard:** Visualizes key environmental, social, and governance metrics:
    *   Returns Overview (item disposition distribution).
    *   ESG Sustainability Score.
    *   ESG Metric Tracker (recycled products percentage, landfill diversion rate, etc.).
    *   Industry Overview (GreenTag vs. industry benchmarks).
*   **Returns Page:** List of data for current items, with routing
*   **User-Friendly Interface:** Intuitive web interface built with React and Next.js.
*   **RESTful API:** Provides programmatic access to data and functionality.
*   **Scalable Data Storage:** Utilizes Google Cloud Firestore for reliable data persistence.
*   **Responsive Design:** Accessible on various devices and screen sizes.

## Technology Stack

*   **AI:**
    *   [Gemini AI (Google AI models)](https://ai.google.dev/): Powers OCR and data analysis.

*   **Frontend:**
    *   [React](https://reactjs.org/): JavaScript library for building user interfaces.
    *   [Next.js](https://nextjs.org/): React framework for server-side rendering (SSR) and static site generation (SSG).
    *   [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for rapid UI development.
    *   [D3.js](https://d3js.org/): JavaScript library for data visualization.
    *   [React Icons](https://react-icons.github.io/react-icons/): Library of pre-built React icons.

*   **Backend:**
    *   [Flask](https://flask.palletsprojects.com/): Python microframework for building REST APIs.
    *   [Google Cloud Firestore](https://cloud.google.com/firestore): NoSQL document database for storing data.

## AI Pipeline

1.  **Image Upload:** The user uploads an image of a product tag.
2.  **OCR with Gemini AI:** The Gemini AI model performs Optical Character Recognition (OCR) to extract text from the image.
3.  **Data Analysis with Gemini AI LLM:** A Gemini AI Large Language Model (LLM) analyzes the extracted text to identify material composition, recyclability, and certifications.
4.  **Sustainability Scoring:** An algorithm generates a Sustainability Score based on the analyzed data.
5.  **Routing Decision:** The AI suggests an optimal routing decision (donate, resell, recycle).
6.  **Data Storage:** The extracted data, Sustainability Score, and routing decision are stored in Firestore.

## Data Model

Data is stored in Google Cloud Firestore using the following key collections:

*   **`items`:**
    *   Each document represents an item with fields like:
        *   `id` (string): Unique item identifier.
        *   `date` (string): Date of processing (ISO 8601 format).
        *   `status` (string): Routing decision (e.g., "Donate", "Resell", "Recycle").
        *   `score` (number): Sustainability Score.
        *   `composition` (object): Material composition details (e.g., `{"Acrylic": 20, "Mohair": 80}`).

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/): JavaScript runtime environment.
*   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/): Package managers for JavaScript.
*   [Python](https://www.python.org/): Programming language for the backend.
*   [Google Cloud SDK](https://cloud.google.com/sdk): Command-line tool for interacting with Google Cloud services.
*   Firebase tools `npm install -g firebase-tools`

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd GreenTag
    ```

2.  **Install frontend dependencies:**

    ```bash
    cd client
    npm install  # or yarn install
    ```

3.  **Install backend dependencies:**

    ```bash
    cd server
    pip install -r requirements.txt
    ```

## Configuration

1.  **Firebase Project Setup:**
    *   Create a new project in the [Firebase console](https://console.firebase.google.com/).
    *   Enable Firestore Database in your project.
    *   Create a service account and download the service account key JSON file.

2.  **Environment Variables:**
    *   **Frontend (Client):**
        *   Create a `.env.local` file in the `client/` directory (if you need to store client-side environment variables). **Important:** Never store sensitive information (like API keys) in client-side environment variables.
    *   **Backend (Server):**
        *   Set the following environment variables in your server environment (e.g., Heroku, Google Cloud Functions):
            *   `FIRESTORE_CREDENTIALS`: The path to your Firebase service account key JSON file.
            *   `GEMINI_API_KEY`: Your Gemini AI API key (if required).
            *    Other specific env var

3. Configure the APIs so that they match your current infrastructure and versions

## Deployment

Detailed deployment instructions will be included at a later time, however you need to follow how the database is used, and set all of those parameters in that file.

## Contributing

Contributions to the GreenTag ESG Dashboard are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive commit messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## License

This project is licensed under the [MIT License](LICENSE).
