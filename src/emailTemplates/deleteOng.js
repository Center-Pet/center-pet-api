module.exports = function (name) {
  return `
  <body style="background:#FEF2F4; margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF2F4; padding:0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:16px; margin:2rem 0; box-shadow:0 8px 32px rgba(209,77,114,0.08);">
            <tr>
              <td align="center" style="padding:2rem 1.5rem 0 1.5rem;">
                <img src="https://i.imgur.com/v3xZGs3.png" alt="Logo Center Pet" width="90" style="border-radius:18px; margin-bottom:1.2rem;"/>
                <h1 style="color:#d14d72; font-size:2rem; margin-bottom:0.5rem;">Sua parceria fará falta...</h1>
                <p style="color:#222; font-size:1.1rem; margin-bottom:1.5rem;">
                  Olá, <b>${name}</b>!<br/>
                  Confirmamos que a conta da sua organização foi excluída do sistema Center Pet conforme solicitado.
                </p>
                <p style="color:#555; font-size:1rem; margin-bottom:1.5rem;">
                  Todos os dados relacionados à sua organização e aos pets cadastrados foram removidos de nossa plataforma. Nosso time está sentindo muito sua partida - parceiros como vocês são fundamentais na nossa missão de transformar vidas através da adoção.
                </p>
                <p style="color:#222; font-size:1rem; margin-bottom:1.5rem;">
                  Se a exclusão foi solicitada por engano ou se um dia desejarem retornar (o que esperamos de coração), as portas da Center Pet estarão sempre abertas para recebê-los de braços abertos. Cada ONG parceira fortalece nossa rede de proteção animal.
                </p>
                <p style="color:#555; font-size:1rem; margin-bottom:1.5rem;">
                  Sua organização fez a diferença na vida de muitos animais, e essa marca permanecerá mesmo após sua saída. Continuaremos torcendo pelo sucesso do trabalho incrível que vocês realizam, mesmo que agora por caminhos separados.
                </p>
                <div style="margin:1.5rem 0;">
                  <img src="https://i.imgur.com/UCzHAFj.png" width="120" alt="Cat and Dog illustration" style="opacity:0.8;" />
                </div>
                <a href="https://centerpet.netlify.app/" style="display:inline-block; background:#d14d72; color:#fff; padding:0.9rem 2.2rem; border-radius:8px; font-weight:bold; text-decoration:none; font-size:1.08rem; margin-bottom:1.5rem;">
                  Visitar Center Pet
                </a>
                <p style="color:#666; font-size:0.97rem; margin-top:1.5rem;">
                  Gostaríamos muito de ouvir seu feedback para melhorarmos nossa plataforma:<br/>
                  <a href="mailto:centterpett@gmail.com" style="color:#d14d72;">centterpett@gmail.com</a>
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