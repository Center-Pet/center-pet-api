module.exports = function (adopterName, petName, adoptionLink) {
    return `
  <body style="background:#FEF2F4; margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF2F4; padding:0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:16px; margin:2rem 0; box-shadow:0 8px 32px rgba(209,77,114,0.08);">
            <tr>
              <td align="center" style="padding:2rem 1.5rem 0 1.5rem;">
                <img src="https://i.imgur.com/WanR0b3.png" alt="Logo Center Pet" width="90" style="border-radius:18px; margin-bottom:1.2rem;"/>
                <h1 style="color:#d14d72; font-size:2rem; margin-bottom:0.5rem;">Novo Pedido de Adoção!</h1>
                <p style="color:#222; font-size:1.1rem; margin-bottom:1.5rem;">
                  Olá!<br/>
                  O adotante <b>${adopterName}</b> demonstrou interesse em adotar o pet <b>${petName}</b>.
                </p>
                <p style="color:#555; font-size:1rem; margin-bottom:1.5rem;">
                  Agora é só acessar sua conta na <b>Center Pet</b> para ver os detalhes do pedido, conversar com o adotante e dar andamento ao processo de adoção.
                </p>
                <ul style="color:#d14d72; font-size:1rem; text-align:left; margin:0 auto 1.5rem auto; max-width:340px; padding-left:1.2rem;">
                  <li>🐾 Veja o perfil do adotante</li>
                  <li>💬 Converse e tire dúvidas</li>
                  <li>📄 Analise o pedido e prossiga com a adoção</li>
                </ul>
                <a href="${adoptionLink}" style="display:inline-block; background:#d14d72; color:#fff; padding:0.9rem 2.2rem; border-radius:8px; font-weight:bold; text-decoration:none; font-size:1.08rem; margin-bottom:1.5rem;">
                  Ver detalhes da adoção
                </a>
                <p style="color:#666; font-size:0.97rem; margin-top:1.5rem;">
                  Dúvidas? Fale conosco pelo site ou pelo Instagram.<br/>
                  <b>Juntos, somos a diferença!</b>
                </p>
                <p style="margin-top:1.2rem;">
                  <a href="https://www.instagram.com/centerpet_oficial/" target="_blank" style="text-decoration:none;">
                    <img src="https://img.icons8.com/ios-filled/30/d14d72/instagram-new.png" alt="Instagram" width="28" height="28" style="vertical-align:middle; margin-right:8px;" />
                    <span style="color:#d14d72; font-size:1rem; vertical-align:middle;">@centerpet_oficial</span>
                  </a>
                </p>
                <p style="color:#d14d72; font-size:1.1rem; margin-top:2rem;">
                  🐶❤️ Equipe Center Pet
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