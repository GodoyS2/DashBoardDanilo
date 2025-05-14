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

    if (!territory_id || !email) {
      throw new Error('Territory ID and email are required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const resendKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !supabaseKey || !resendKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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
    if (!territory) throw new Error('Territory not found');

    // Create email content with better styling
    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Território: ${territory.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #f3f4f6;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .territory-name {
              color: #1f2937;
              font-size: 24px;
              margin: 0;
            }
            .territory-description {
              color: #6b7280;
              margin-top: 10px;
            }
            .images-container {
              margin-top: 30px;
            }
            .image-card {
              margin-bottom: 30px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            .image-card img {
              width: 100%;
              height: auto;
              display: block;
            }
            .image-description {
              padding: 15px;
              background: #f9fafb;
              color: #4b5563;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="territory-name">${territory.name}</h1>
            ${territory.description ? `
              <p class="territory-description">${territory.description}</p>
            ` : ''}
          </div>
          
          <div class="images-container">
            ${territory.territory_images?.length ? 
              territory.territory_images.map((image: any) => `
                <div class="image-card">
                  <img src="${image.url}" alt="${territory.name}" />
                  ${image.description ? `
                    <div class="image-description">
                      <p>${image.description}</p>
                    </div>
                  ` : ''}
                </div>
              `).join('') : 
              '<p>Nenhuma imagem disponível para este território.</p>'
            }
          </div>
        </body>
      </html>
    `;

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Territory Manager <no-reply@resend.dev>',
        to: email,
        subject: `Imagens do Território: ${territory.name}`,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
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
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while sending the email'
      }),
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