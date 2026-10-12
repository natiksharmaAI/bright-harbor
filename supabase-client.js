/**
 * Bright Harbor Dental - Supabase Client Integration
 * Handles direct, secure client-to-Supabase submissions with fallback support.
 */

const SUPABASE_CONFIG = {
  url: 'https://cxlufuxtijcyftcdhldf.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bHVmdXh0aWpjeWZ0Y2RobGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODg0NTQsImV4cCI6MjEwNzM2NDQ1NH0.zlP54Vx-sT9sUrJA5yILmspOaewdiXVClLeRUR1Jn8o'
};

const SupabaseAPI = {
  /**
   * Insert a quick inquiry into Supabase
   * @param {Object} data { full_name, phone, service, source }
   */
  async saveQuickInquiry(data) {
    const payload = {
      full_name: data.full_name,
      phone: data.phone,
      service: data.service || 'General Dentistry',
      source: data.source || 'hero_quick_booking',
      status: 'new'
    };

    try {
      const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/quick_inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase error ${response.status}: ${errorText}`);
      }

      console.log('✅ Quick inquiry saved to Supabase successfully:', payload.full_name);
      return { success: true };
    } catch (err) {
      console.error('❌ Failed to save quick inquiry to Supabase:', err);
      // Attempt proxy via local server if available
      try {
        const proxyRes = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (proxyRes.ok) return { success: true };
      } catch (e) {
        // Fallback silently
      }
      return { success: false, error: err.message };
    }
  },

  /**
   * Insert a full appointment request into Supabase
   * @param {Object} data { patient_name, patient_phone, patient_email, preferred_date, service, preferred_doctor, notes }
   */
  async saveAppointment(data) {
    const payload = {
      patient_name: data.patient_name,
      patient_phone: data.patient_phone,
      patient_email: data.patient_email,
      preferred_date: data.preferred_date || null,
      service: data.service,
      preferred_doctor: data.preferred_doctor || 'First Available',
      notes: data.notes || '',
      status: 'pending'
    };

    try {
      const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase error ${response.status}: ${errorText}`);
      }

      console.log('✅ Appointment saved to Supabase successfully:', payload.patient_name);
      return { success: true };
    } catch (err) {
      console.error('❌ Failed to save appointment to Supabase:', err);
      try {
        const proxyRes = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (proxyRes.ok) return { success: true };
      } catch (e) {}
      return { success: false, error: err.message };
    }
  }
};

window.SupabaseAPI = SupabaseAPI;
