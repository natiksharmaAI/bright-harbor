# 🦷 Bright Harbor Dental

A modern, responsive web application and digital presence for **Bright Harbor Dental**, a coastal dental clinic located in Port Alder, CA. Built with vanilla HTML/CSS/JavaScript, an Express/Node.js serving layer, and integrated directly with a **Supabase** backend for managing patient inquiries and appointments.

---

## 🌊 Key Features

- **Coastal Luxury Aesthetic**: Custom typography, warm coastal palette (Pacific navy, seafoam mint, warm sand, and coral accents), and micro-animations.
- **Interactive Before & After Gallery**: Real dental transformation cases (Porcelain Veneers, Clear Aligners, Professional Whitening, Dental Implants, Composite Bonding, and Full Smile Makeovers) featuring smooth split-screen comparison sliders with touch and drag support.
- **Comprehensive Service Catalog**: Interactive service cards with pricing transparency, modal details, and direct booking actions.
- **Provider Profiles**: Detailed doctor and staff bios with qualifications, specialties, and chairside philosophy.
- **Dual Booking Systems**:
  - **Quick Hero Consultation**: Fast 3-field inquiry form directly in the hero banner.
  - **Comprehensive Appointment Booking**: Full scheduling form with provider selection, treatment category, date preferences, and notes.
- **Supabase Cloud Backend**:
  - Form data is dispatched directly to Supabase (`quick_inquiries` and `appointments` tables).
  - Configured with Row Level Security (RLS) to ensure secure anonymous submissions from web visitors.
  - Server fallback proxy on Node.js to ensure 100% submission reliability across restrictive network environments.
- **Interactive Facility Gallery**: Lightbox image viewer showcasing operatory suites, 3D CT imaging, sterilization lounge, and harbor views.
- **Patient Testimonials & Reviews**: Real patient stories with coastal badge verification and Google review rating summaries.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom design system with CSS custom properties), Modern Vanilla JavaScript (ES6+).
- **Backend**: Node.js HTTP/Express static server & proxy layer.
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL with PostgREST and Row Level Security).
- **Asset Processing**: Sharp (for image optimization and transformation cropping).

---

## 📁 Repository Structure

```
├── index.html            # Main semantic webpage with all sections and forms
├── styles.css            # Complete design system, layouts, responsive rules, animations
├── script.js             # Client interactivity (sliders, modals, filters, mobile menu)
├── supabase-client.js    # Client-side Supabase API service with fallback proxy
├── server.js             # Node.js backend server with Supabase API proxy endpoints
├── package.json          # Project metadata and dependencies
├── images/               # High-resolution clinic photography and case transformation assets
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0.0 or later)
- Git

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/natiksharmaAI/bright-harbor.git
   cd bright-harbor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🗄️ Database Architecture (Supabase)

The project connects to Supabase project `bright-harbor-dental`:

### 1. `appointments` Table
Stores full appointment requests from `#appointmentForm`.
- `id` (UUID, Primary Key)
- `created_at` (TIMESTAMPTZ)
- `patient_name` (TEXT)
- `patient_phone` (TEXT)
- `patient_email` (TEXT)
- `preferred_date` (DATE)
- `service` (TEXT)
- `preferred_doctor` (TEXT)
- `notes` (TEXT)
- `status` (TEXT, default: 'pending')

### 2. `quick_inquiries` Table
Stores quick hero inquiries from `#quickBookingForm`.
- `id` (UUID, Primary Key)
- `created_at` (TIMESTAMPTZ)
- `full_name` (TEXT)
- `phone` (TEXT)
- `service` (TEXT)
- `source` (TEXT, default: 'hero_quick_booking')
- `status` (TEXT, default: 'new')

Both tables have **Row Level Security (RLS)** enabled with public insert permissions (`FOR INSERT TO anon WITH CHECK (true)`).

---

## 🏥 Clinic Information (Demo Site)

- **Practice**: Bright Harbor Dental
- **Address**: 452 Pacific Coast Highway, Suite 200, Port Alder, CA 94946
- **Phone**: (415) 555-0199
- **Email**: hello@brightharbordental.com
- **Lead Dentist**: Dr. Maya Lindqvist, DDS
