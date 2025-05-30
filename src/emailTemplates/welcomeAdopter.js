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
                <h1 style="color:#d14d72; font-size:2rem; margin-bottom:0.5rem;">Bem-vindo à Center Pet!</h1>
                <p style="color:#222; font-size:1.1rem; margin-bottom:1.5rem;">
                  Olá, <b>${name}</b>!<br/>
                  Parabéns por dar o primeiro passo para transformar uma vida. Você agora faz parte de uma comunidade apaixonada por pets e pela adoção responsável!
                </p>
                <p style="color:#555; font-size:1rem; margin-bottom:1.5rem;">
                  Aqui na <b>Center Pet</b>, conectamos pessoas como você a ONGs e protetores dedicados. Nossa missão é facilitar o processo de adoção, tornando-o mais acessível, transparente e cheio de carinho.
                </p>
                <ul style="color:#d14d72; font-size:1rem; text-align:left; margin:0 auto 1.5rem auto; max-width:340px; padding-left:1.2rem;">
                  <li>🐾 Navegue por pets disponíveis e encontre seu novo amigo</li>
                  <li>💬 Converse diretamente com ONGs e protetores</li>
                  <li>❤️ Salve favoritos e acompanhe o processo de adoção</li>
                  <li>🏆 Faça parte de uma rede que transforma vidas!</li>
                </ul>
                <p style="color:#222; font-size:1rem; margin-bottom:1.5rem;">
                  Acesse sua conta, complete seu perfil e descubra pets esperando por um lar cheio de amor.
                </p>
                <a href="https://centerpet.netlify.app/" style="display:inline-block; background:#d14d72; color:#fff; padding:0.9rem 2.2rem; border-radius:8px; font-weight:bold; text-decoration:none; font-size:1.08rem; margin-bottom:1.5rem;">
                  Acessar Center Pet
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