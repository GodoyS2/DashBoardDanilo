import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { territory_id, email } = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get territory data with images
    const { data: territory, error: territoryError } = await supabase
      .from('territories')
      .select(`
        *,
        territory_images (
          id,
          url,
          description
        )
      `)
      .eq('id', territory_id)
      .single();

    if (territoryError) throw territoryError;

    // Create email content
    const emailContent = `
      <h2>Território: ${territory.name}</h2>
      ${territory.description ? `<p>${territory.description}</p>` : ''}
      <h3>Imagens do Território:</h3>
      ${territory.territory_images.map((image: any) => `
        <div style="margin-bottom: 20px;">
          <img src="${image.url}" alt="${territory.name}" style="max-width: 100%; height: auto;" />
          ${image.description ? `<p>${image.description}</p>` : ''}
        </div>
      `).join('')}
    `;

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Territory Manager <noreply@yourdomain.com>',
        to: email,
        subject: `Imagens do Território: ${territory.name}`,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});