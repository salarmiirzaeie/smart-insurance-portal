# Dynamic React Form with Dependent Select Fields

## Overview

This project implements a dynamic form in React that supports multiple input types, including:

- Text inputs
- Number inputs
- Date pickers
- Textareas
- Select dropdowns (including dependent selects)
- Checkboxes
- Radio buttons

A key feature is **dynamic option fetching** for select fields that depend on other fields’ values. For example, the **state** select options are fetched dynamically based on the selected **country**.

---

## Features

- Dynamic rendering of form fields based on a configuration object
- Support for dependent select fields with dynamic options fetched from an API endpoint
- Disables dependent selects until their dependencies have valid values
- Handles API fetch errors gracefully by clearing options and disabling the field
- Simple and extensible architecture to add new fields or dependencies easily

---

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```
