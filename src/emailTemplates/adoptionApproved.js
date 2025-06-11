module.exports = function (adopterName, petName, ongContact) {
    return `
  <body style="background:#FEF2F4; margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF2F4; padding:0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:16px; margin:2rem 0; box-shadow:0 8px 32px rgba(209,77,114,0.08);">
            <tr>
              <td align="center" style="padding:2rem 1.5rem 0 1.5rem;">
                <img src="https://i.imgur.com/WanR0b3.png" alt="Logo Center Pet" width="90" style="border-radius:18px; margin-bottom:1.2rem;"/>
                <h1 style="color:#d14d72; font-size:2rem; margin-bottom:0.5rem;">Adoção Aprovada!</h1>
                <p style="color:#222; font-size:1.1rem; margin-bottom:1.5rem;">
                  Olá, <b>${adopterName}</b>!<br/>
                  Ótimas notícias! Seu pedido de adoção do pet <b>${petName}</b> foi aprovado!
                </p>
                <p style="color:#555; font-size:1rem; margin-bottom:1.5rem;">
                  Entre em contato com a ONG responsável para combinar os detalhes da adoção:
                </p>
                <div style="background:#f8f8f8; border-radius:8px; padding:1.5rem; margin-bottom:1.5rem; text-align:left;">
                  <p style="color:#222; font-size:1rem; margin:0 0 0.5rem 0;">
                    <b>Nome da ONG:</b> ${ongContact.name}<br/>
                    <b>E-mail:</b> ${ongContact.email}<br/>
                    <b>Telefone:</b> ${ongContact.phone}
                  </p>
                </div>
                <p style="color:#555; font-size:1rem; margin-bottom:1.5rem;">
                  Estamos muito felizes em fazer parte dessa história de amor! 🐾❤️
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 1.5rem 2rem 1.5rem;">
                <p style="color:#888; font-size:0.9rem; margin:0;">
                  Este é um e-mail automático, por favor não responda.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
    `;
}; 